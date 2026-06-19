/**
 * Stripe webhook endpoint.
 *
 * URL: POST /api/webhooks/stripe
 *
 * Register it in the Stripe Dashboard (Developers, Webhooks) for the
 * `checkout.session.completed` event, and put the signing secret in
 * STRIPE_WEBHOOK_SECRET. Stripe signs each request; we verify that signature
 * against the raw body before trusting it.
 */
import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { requireStripe, isStripeEnabled } from "@/lib/stripe";
import { sendOrderEmails, type OrderLine } from "@/lib/resend";

// Stripe needs the raw, unparsed body to verify the signature, so this route
// must run on the Node.js runtime and never be statically cached.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!isStripeEnabled) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET not set" },
      { status: 500 },
    );
  }

  const stripe = requireStripe();
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    try {
      await handleCompletedCheckout(stripe, session);
    } catch (err) {
      // Log and 500 so Stripe retries; do not swallow delivery failures.
      console.error("Failed to process checkout.session.completed:", err);
      return NextResponse.json({ error: "Processing failed" }, { status: 500 });
    }
  }

  // Acknowledge all other events so Stripe stops retrying them.
  return NextResponse.json({ received: true });
}

async function handleCompletedCheckout(
  stripe: Stripe,
  session: Stripe.Checkout.Session,
) {
  // Pull the line items with product names for the confirmation email.
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    limit: 100,
  });

  const lines: OrderLine[] = lineItems.data.map((item) => ({
    name: item.description ?? "Badge",
    quantity: item.quantity ?? 1,
    amount: item.amount_total ?? 0,
  }));

  const address = session.customer_details?.address;
  const shippingAddress = address
    ? [
        session.customer_details?.name,
        address.line1,
        address.line2,
        address.city,
        address.postal_code,
        address.country,
      ]
        .filter(Boolean)
        .join(", ")
    : null;

  await sendOrderEmails({
    customerEmail: session.customer_details?.email ?? null,
    reference: session.id.slice(-8).toUpperCase(),
    lines,
    total: session.amount_total ?? 0,
    shippingAddress,
  });
}
