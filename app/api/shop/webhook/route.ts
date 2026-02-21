import { dbService } from "@lib/db/db";
import { env } from "@lib/env";
import {
  sendConfirmationEmail,
  sendFulfillmentEmail,
} from "@lib/shop/fulfillment-email";
import { stripe } from "@lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 503 }
    );
  }

  // Fail fast if webhook secret is not configured
  if (!env.STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 503 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Idempotency: skip if this session was already processed
      const alreadyProcessed = await dbService.isSessionProcessed(session.id);
      if (alreadyProcessed) {
        console.log(
          `Webhook: session ${session.id} already processed — skipping`
        );
        return NextResponse.json({ received: true });
      }

      // Mark as processed before acting to prevent concurrent double-processing
      await dbService.markSessionProcessed(session.id);

      await handleCheckoutCompleted(session);
    } catch (error) {
      console.error("Error handling checkout completion:", error);
      // Still return 200 to Stripe so it doesn't retry
    }
  }

  return NextResponse.json({ received: true });
}

/** Parse compact items array from session metadata, handling chunked data. */
function parseItemsFromMetadata(
  metadata: Record<string, string>
): [string, number, number][] {
  try {
    // Single-key format
    if (metadata["items"]) {
      const parsed: unknown = JSON.parse(metadata["items"]);
      if (!Array.isArray(parsed)) {
        console.error("Parsed items metadata is not an array");
        return [];
      }
      return parsed;
    }

    // Chunked format
    const chunkCount = parseInt(metadata["items_chunks"] || "0");
    if (chunkCount > 0) {
      let fullJson = "";
      for (let i = 0; i < chunkCount; i++) {
        fullJson += metadata[`items_${i}`] || "";
      }
      const parsed: unknown = JSON.parse(fullJson);
      if (!Array.isArray(parsed)) {
        console.error("Parsed chunked items metadata is not an array");
        return [];
      }
      return parsed;
    }

    // Legacy per-key format (for sessions created before this update)
    const legacyCount = parseInt(metadata["item_count"] || "0");
    if (legacyCount > 0) {
      const items: [string, number, number][] = [];
      for (let i = 0; i < legacyCount; i++) {
        const productId = metadata[`item_${i}_productId`];
        const variantIndex = parseInt(metadata[`item_${i}_variantIndex`] || "0");
        const quantity = parseInt(metadata[`item_${i}_quantity`] || "0");
        if (productId && !isNaN(variantIndex) && !isNaN(quantity) && quantity > 0) {
          items.push([productId, variantIndex, quantity]);
        } else {
          console.warn(`Webhook: Skipping invalid legacy item at index ${i}`);
        }
      }
      return items;
    }
  } catch (error) {
    console.error("Failed to parse items from metadata:", error);
  }

  return [];
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const metadata = session.metadata || {};
  const rawItems = parseItemsFromMetadata(metadata);

  if (rawItems.length === 0) {
    console.warn("Webhook: No items in session metadata");
    return;
  }

  // Resolve items from DB for up-to-date name/price/options
  const items: {
    productId: string;
    variantIndex: number;
    quantity: number;
    name: string;
    price: number;
    options: Record<string, string>;
  }[] = [];

  for (const [productId, variantIndex, quantity] of rawItems) {
    if (!productId || !Number.isFinite(variantIndex) || !Number.isFinite(quantity) || quantity <= 0) {
      console.warn(`Webhook: Skipping invalid item [${productId}, ${variantIndex}, ${quantity}]`);
      continue;
    }

    const product = await dbService.getProduct(productId);
    if (!product) {
      console.warn(`Webhook: Product ${productId} not found — skipping`);
      continue;
    }

    const variant = product.variants[variantIndex];
    if (!variant) {
      console.warn(
        `Webhook: Variant ${variantIndex} not found for product ${productId} — skipping`
      );
      continue;
    }

    items.push({
      productId,
      variantIndex,
      quantity,
      name: product.name,
      price: variant.price ?? product.price,
      options: variant.options,
    });
  }

  // Decrement stock
  for (const item of items) {
    const success = await dbService.decrementStock(
      item.productId,
      item.variantIndex,
      item.quantity
    );
    if (!success) {
      console.warn(
        `Failed to decrement stock for product ${item.productId} variant ${item.variantIndex}`
      );
    }
  }

  // Build order details
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // shipping_details moved to collected_information in Stripe SDK v20
  const shipping = session.collected_information?.shipping_details ?? null;

  const orderDetails = {
    items: items.map((i) => ({
      name: i.name,
      options: i.options,
      quantity: i.quantity,
      price: i.price,
    })),
    total,
    customerEmail: session.customer_details?.email || "unknown",
    shippingAddress: shipping?.address
      ? {
          name: shipping.name || "",
          line1: shipping.address.line1 || "",
          line2: shipping.address.line2 || undefined,
          city: shipping.address.city || "",
          postalCode: shipping.address.postal_code || "",
          country: shipping.address.country || "",
        }
      : undefined,
    stripeSessionId: session.id,
  };

  // Send emails and log failures
  const shopSettings = await dbService.getShopSettings();

  if (shopSettings.fulfillmentEmail) {
    const sent = await sendFulfillmentEmail(
      shopSettings.fulfillmentEmail,
      orderDetails
    );
    if (!sent) {
      console.error(
        `Failed to send fulfillment email for session ${session.id}`
      );
    }
  } else {
    console.warn("No fulfillment email configured — order email not sent");
  }

  if (orderDetails.customerEmail !== "unknown") {
    const sent = await sendConfirmationEmail(orderDetails);
    if (!sent) {
      console.error(
        `Failed to send confirmation email for session ${session.id}`
      );
    }
  }
}
