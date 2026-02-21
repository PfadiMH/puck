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
      env.STRIPE_WEBHOOK_SECRET || ""
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
      await handleCheckoutCompleted(session);
    } catch (error) {
      console.error("Error handling checkout completion:", error);
      // Still return 200 to Stripe so it doesn't retry
    }
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const metadata = session.metadata || {};
  const itemCount = parseInt(metadata["item_count"] || "0");

  if (itemCount === 0) {
    console.warn("Webhook: No items in session metadata");
    return;
  }

  // Parse items from metadata
  const items: {
    productId: string;
    variantIndex: number;
    quantity: number;
    name: string;
    price: number;
    options: Record<string, string>;
  }[] = [];

  for (let i = 0; i < itemCount; i++) {
    items.push({
      productId: metadata[`item_${i}_productId`],
      variantIndex: parseInt(metadata[`item_${i}_variantIndex`]),
      quantity: parseInt(metadata[`item_${i}_quantity`]),
      name: metadata[`item_${i}_name`],
      price: parseInt(metadata[`item_${i}_price`]),
      options: JSON.parse(metadata[`item_${i}_options`] || "{}"),
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

  // shipping_details is available on the expanded session object
  const sessionAny = session as unknown as Record<string, unknown>;
  const shipping = sessionAny.shipping_details as {
    name?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      postal_code?: string;
      country?: string;
    };
  } | null;

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

  // Send emails
  const shopSettings = await dbService.getShopSettings();

  if (shopSettings.fulfillmentEmail) {
    await sendFulfillmentEmail(shopSettings.fulfillmentEmail, orderDetails);
  } else {
    console.warn("No fulfillment email configured — order email not sent");
  }

  if (orderDetails.customerEmail !== "unknown") {
    await sendConfirmationEmail(orderDetails);
  }
}
