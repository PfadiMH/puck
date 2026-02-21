import { dbService } from "@lib/db/db";
import type { CartItem } from "@lib/shop/types";
import { stripe } from "@lib/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface CheckoutRequest {
  items: CartItem[];
}

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 503 }
    );
  }

  try {
    const { items } = (await request.json()) as CheckoutRequest;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Warenkorb ist leer" },
        { status: 400 }
      );
    }

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

    const metadata: Record<string, string> = {};

    for (let i = 0; i < items.length; i++) {
      const cartItem = items[i];
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

      // Use the DB price, not the client price
      const price = variant.price || product.price;
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

      // Store item info in metadata for the webhook
      metadata[`item_${i}_productId`] = cartItem.productId;
      metadata[`item_${i}_variantIndex`] = String(cartItem.variantIndex);
      metadata[`item_${i}_quantity`] = String(cartItem.quantity);
      metadata[`item_${i}_name`] = product.name;
      metadata[`item_${i}_price`] = String(price);
      metadata[`item_${i}_options`] = JSON.stringify(
        cartItem.selectedOptions
      );
    }

    metadata["item_count"] = String(items.length);

    const headersList = await headers();
    const origin =
      headersList.get("origin") || headersList.get("referer") || "";

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
