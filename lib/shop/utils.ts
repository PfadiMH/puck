/** Format a price in Rappen as a CHF string (e.g. 1250 → "CHF 12.50"). */
export function formatPrice(rappen: number): string {
  return `CHF ${(rappen / 100).toFixed(2)}`;
}
