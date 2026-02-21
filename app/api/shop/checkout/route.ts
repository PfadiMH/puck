import { dbService } from "@lib/db/db";
import { env } from "@lib/env";
import type { CartItem } from "@lib/shop/types";
import { stripe } from "@lib/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const items: unknown = body?.items;

    // Runtime validation of request body
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Warenkorb ist leer" },
        { status: 400 }
      );
    }

    // Cap cart size to prevent abuse
    if (items.length > 50) {
      return NextResponse.json(
        { error: "Zu viele Artikel im Warenkorb" },
        { status: 400 }
      );
    }

    // Validate each item has required fields
    for (const item of items) {
      if (
        !item ||
        typeof item !== "object" ||
        typeof (item as CartItem).productId !== "string" ||
        typeof (item as CartItem).variantIndex !== "number" ||
        typeof (item as CartItem).quantity !== "number" ||
        (item as CartItem).quantity <= 0
      ) {
        return NextResponse.json(
          { error: "Ungültiger Artikel im Warenkorb" },
          { status: 400 }
        );
      }
    }

    const cartItems = items as CartItem[];

    // Validate items against DB (prevent price tampering)
    const lineItems: {
      price_data: {
        currency: string;
        product_data: {
          name: string;
          description?: string;
          images?: string[];
        };
        unit_amount: number;
      };
      quantity: number;
    }[] = [];

    // Compact metadata: store items as JSON array instead of per-item keys
    // Format: [[productId, variantIndex, quantity], ...]
    // This avoids the 50-key Stripe metadata limit
    const itemsCompact: [string, number, number][] = [];

    for (const cartItem of cartItems) {
      const product = await dbService.getProduct(cartItem.productId);

      if (!product || !product.active) {
        return NextResponse.json(
          {
            error: `Produkt "${cartItem.name}" ist nicht mehr verfügbar`,
          },
          { status: 400 }
        );
      }

      const variant = product.variants[cartItem.variantIndex];
      if (!variant) {
        return NextResponse.json(
          { error: `Variante für "${cartItem.name}" nicht gefunden` },
          { status: 400 }
        );
      }

      if (variant.stock < cartItem.quantity) {
        return NextResponse.json(
          {
            error: `"${cartItem.name}" hat nur noch ${variant.stock} Stück auf Lager`,
          },
          { status: 400 }
        );
      }

      // Use DB price, not client price. ?? preserves legitimate 0 prices.
      const price = variant.price ?? product.price;
      const optionsStr = Object.values(cartItem.selectedOptions).join(" / ");

      lineItems.push({
        price_data: {
          currency: "chf",
          product_data: {
            name: product.name + (optionsStr ? ` (${optionsStr})` : ""),
            ...(product.description && {
              description: product.description,
            }),
            ...(product.images.length > 0 && {
              images: [product.images[0]],
            }),
          },
          unit_amount: price,
        },
        quantity: cartItem.quantity,
      });

      itemsCompact.push([
        cartItem.productId,
        cartItem.variantIndex,
        cartItem.quantity,
      ]);
    }

    // Store items in metadata as compact JSON.
    // Stripe limits: 50 keys, 500 chars per value.
    // Chunk if needed to stay under 500 chars per value.
    const metadata: Record<string, string> = {};
    const fullJson = JSON.stringify(itemsCompact);

    if (fullJson.length <= 500) {
      metadata["items"] = fullJson;
    } else {
      // Split into chunks of ≤ 500 chars
      let chunkIdx = 0;
      for (let i = 0; i < fullJson.length; i += 500) {
        metadata[`items_${chunkIdx}`] = fullJson.slice(i, i + 500);
        chunkIdx++;
      }
      metadata["items_chunks"] = String(chunkIdx);
    }

    // Resolve origin for success/cancel URLs.
    // Fall back to configured base URL if headers are missing (e.g. server-side proxy).
    const headersList = await headers();
    const origin =
      headersList.get("origin") ||
      headersList.get("referer")?.replace(/\/[^/]*$/, "") ||
      env.INTERNAL_API_BASE_URL;

    if (!origin) {
      return NextResponse.json(
        { error: "Konnte keine Rücksprung-URL ermitteln" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["CH", "DE", "AT", "LI", "FR", "IT"],
      },
      success_url: `${origin}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}`,
      metadata,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Fehler beim Erstellen der Bestellung" },
      { status: 500 }
    );
  }
}
