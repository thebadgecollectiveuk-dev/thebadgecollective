"use server";

import { redirect } from "next/navigation";

import type { CartItem } from "./cart-store";
import { stripe } from "./stripe";
import { shippingFor } from "./format";

/**
 * Create a checkout session for the cart.
 *
 * Live mode (Stripe key set): builds a real Stripe Checkout Session and
 * redirects to Stripe's hosted payment page.
 * Mock mode (no key): logs the cart and redirects to the "coming soon" page,
 * so the call site in the cart never has to change.
 */
export async function createCheckoutSession(items: CartItem[]) {
  if (items.length === 0) return;

  if (!stripe) {
    console.log("Cart submitted (mock mode):", JSON.stringify(items, null, 2));
    redirect("/checkout/coming-soon");
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // Free UK shipping once the order subtotal reaches the threshold, else flat rate.
  const subtotal = items.reduce(
    (sum, item) => sum + item.unitAmount * item.quantity,
    0,
  );
  const shippingAmount = shippingFor(subtotal);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: items.map((item) => ({
      price: item.priceId,
      quantity: item.quantity,
    })),
    shipping_address_collection: { allowed_countries: ["GB"] },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: shippingAmount, currency: "gbp" },
          display_name:
            shippingAmount === 0 ? "Free UK Shipping" : "UK Standard Shipping",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 2 },
            maximum: { unit: "business_day", value: 5 },
          },
        },
      },
    ],
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cart`,
    automatic_tax: { enabled: false },
  });

  // redirect() throws internally, so this must sit outside any try/catch.
  redirect(session.url!);
}
