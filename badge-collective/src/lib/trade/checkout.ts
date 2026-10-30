"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { stripe } from "@/lib/stripe";
import { getProduct } from "@/lib/products";
import { shippingFor } from "@/lib/format";
import { isValidTradeToken } from "./access";
import { tradeInfoFor } from "./pricing";
import { TIERS, type TradeTier } from "./config";

export type TradeCheckoutLine = { productId: string; quantity: number };
export type TradeCheckoutResult = { error: string };

/**
 * Create a Stripe Checkout session for a trade order.
 *
 * Everything is recomputed from Stripe server-side — the browser's prices are
 * never trusted. Enforces the per-tier minimum (summed across designs in a
 * tier) and returns a clear message if it isn't met. On success it redirects to
 * Stripe's hosted payment page (so it never returns).
 */
export async function createTradeCheckout(
  token: string,
  items: TradeCheckoutLine[],
): Promise<TradeCheckoutResult> {
  if (!isValidTradeToken(token)) redirect("/");
  if (!stripe) return { error: "Checkout isn't available right now. Please message us on WhatsApp." };
  if (!items || items.length === 0) return { error: "Your trade bag is empty." };

  const lines: {
    name: string;
    image: string | null;
    unit: number;
    qty: number;
    tier: TradeTier;
  }[] = [];
  const tierQty: Partial<Record<TradeTier, number>> = {};

  for (const item of items) {
    const product = await getProduct(item.productId);
    if (!product) return { error: "A product in your bag is no longer available. Please remove it and try again." };

    const info = tradeInfoFor(product);
    if (!info.eligible || !info.tradePricePence || !info.tier) {
      return { error: `${product.name} isn't available for trade anymore.` };
    }
    if (product.stock <= 0) {
      return { error: `${product.name} is out of stock. Message us on WhatsApp to pre-order it.` };
    }

    const qty = Math.max(1, Math.min(product.stock, Math.round(item.quantity)));
    lines.push({
      name: product.name,
      image: product.image && product.image.startsWith("http") ? product.image : null,
      unit: info.tradePricePence,
      qty,
      tier: info.tier,
    });
    tierQty[info.tier] = (tierQty[info.tier] ?? 0) + qty;
  }

  // Per-tier minimum (summed across designs in the tier).
  for (const tier of Object.keys(tierQty) as TradeTier[]) {
    const have = tierQty[tier] ?? 0;
    const min = TIERS[tier].minSets;
    if (have < min) {
      const short = min - have;
      return {
        error: `The ${TIERS[tier].label} tier needs at least ${min} sets — you have ${have}. Add ${short} more ${TIERS[tier].label}-tier set${short === 1 ? "" : "s"} (any designs in that tier count together).`,
      };
    }
  }

  const subtotal = lines.reduce((sum, l) => sum + l.unit * l.qty, 0);
  const shippingAmount = shippingFor(subtotal);

  // Return to the same site the customer checked out from (preview or live),
  // so the success/cancel pages aren't sent to a hardcoded domain.
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  const origin = host
    ? `${proto}://${host}`
    : process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lines.map((l) => ({
      quantity: l.qty,
      price_data: {
        currency: "gbp",
        unit_amount: l.unit,
        product_data: l.image ? { name: l.name, images: [l.image] } : { name: l.name },
      },
    })),
    shipping_address_collection: { allowed_countries: ["GB"] },
    phone_number_collection: { enabled: true },
    custom_fields: [
      {
        key: "businessname",
        label: { type: "custom", custom: "Business name" },
        type: "text",
      },
    ],
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: shippingAmount, currency: "gbp" },
          display_name:
            shippingAmount === 0 ? "Free UK Shipping" : "Royal Mail Postage & Packaging",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 2 },
            maximum: { unit: "business_day", value: 3 },
          },
        },
      },
    ],
    success_url: `${origin}/trade/${token}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/trade/${token}/cart`,
    automatic_tax: { enabled: false },
    metadata: { trade: "true" },
    payment_method_options: {
      card: { restrictions: { brands_blocked: ["american_express"] } },
    },
  });

  // redirect() throws internally, so it must sit outside any try/catch.
  redirect(session.url!);
}
