/**
 * Currency + formatting helpers.
 * Prices are stored in pence (integer) to match Stripe's `unit_amount`.
 */

const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Format an amount in pence as GBP, e.g. 2499 -> "£24.99". */
export function formatGBP(pence: number): string {
  return gbp.format(pence / 100);
}

/** Flat UK shipping rate, in pence. */
export const SHIPPING_PENCE = 399;

/** Sum line items (unitAmount in pence * quantity). */
export function sumItems(items: { unitAmount: number; quantity: number }[]): number {
  return items.reduce((total, item) => total + item.unitAmount * item.quantity, 0);
}
