"use server";

import { redirect } from "next/navigation";
import type { CartItem } from "./cart-store";

/**
 * Stubbed checkout.
 *
 * Today: logs the cart server-side and redirects to a "coming soon" page.
 * Later: this becomes a real Stripe Checkout Session. The reference shape is
 * documented in the README ("How to add Stripe later"). The signature stays
 * the same, so the call site in the cart does not change.
 */
export async function createCheckoutSession(items: CartItem[]) {
  // TODO: replace with Stripe Checkout Session creation when keys are added.
  console.log("Cart submitted:", JSON.stringify(items, null, 2));

  redirect("/checkout/coming-soon");
}
