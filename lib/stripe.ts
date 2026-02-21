import { env } from "@lib/env";
import Stripe from "stripe";

function getStripeClient(): Stripe | null {
  const key = env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2026-01-28.clover" });
}

/**
 * Stripe client instance. Null when STRIPE_SECRET_KEY is not configured.
 * Check for null before using to gracefully disable shop features.
 */
export const stripe = getStripeClient();
