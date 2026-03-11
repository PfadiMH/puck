/** Format a price in Rappen as a CHF string (e.g. 1250 → "CHF 12.50"). */
export function formatPrice(rappen: number): string {
  return `CHF ${(rappen / 100).toFixed(2)}`;
}

/**
 * Resolve the effective price for a variant.
 * Handles both the new priceAdjustment model and legacy absolute price data.
 * - New data: basePrice + variant.priceAdjustment
 * - Legacy data: variant.price (absolute, from before the offset migration)
 * - Fallback: basePrice (if neither field is set)
 */
export function getVariantPrice(
  basePrice: number,
  variant: { priceAdjustment?: number; price?: number }
): number {
  if (variant.priceAdjustment !== undefined) {
    return basePrice + variant.priceAdjustment;
  }
  // Legacy: absolute price from old data
  if (variant.price !== undefined) {
    return variant.price;
  }
  return basePrice;
}
