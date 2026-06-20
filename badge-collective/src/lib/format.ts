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

/** Flat UK shipping rate, in pence (when the order is below the free threshold). */
export const SHIPPING_PENCE = 399;

/** Order subtotal (in pence) at or above which UK shipping is free. */
export const FREE_SHIPPING_THRESHOLD_PENCE = 2500;

/** UK shipping cost in pence for a subtotal — free at or above the threshold. */
export function shippingFor(subtotalPence: number): number {
  return subtotalPence >= FREE_SHIPPING_THRESHOLD_PENCE ? 0 : SHIPPING_PENCE;
}

/** Sum line items (unitAmount in pence * quantity). */
export function sumItems(items: { unitAmount: number; quantity: number }[]): number {
  return items.reduce((total, item) => total + item.unitAmount * item.quantity, 0);
}
