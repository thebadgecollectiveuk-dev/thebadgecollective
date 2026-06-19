/**
 * Stripe client.
 *
 * The shop runs in one of two modes, decided purely by whether
 * STRIPE_SECRET_KEY is present:
 *
 * - Mock mode (no key): `stripe` is null and `isStripeEnabled` is false. The
 *   data layer serves the starter catalogue and checkout redirects to the
 *   "coming soon" page. The site builds and runs with no Stripe account.
 * - Live mode (key set): `stripe` is a real client. Products, checkout and the
 *   webhook all talk to Stripe.
 *
 * Server-only. Never import this from a client component.
 */
import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

/** True once a Stripe secret key is configured. */
export const isStripeEnabled = Boolean(secretKey);

/**
 * The Stripe client, or null in mock mode. Pin no explicit apiVersion so the
 * SDK uses the version bundled with the installed `stripe` package.
 */
export const stripe = secretKey
  ? new Stripe(secretKey, { typescript: true })
  : null;

/**
 * Return the Stripe client, throwing if it is not configured. Use this in code
 * paths that have already checked `isStripeEnabled` (webhook, live checkout).
 */
export function requireStripe(): Stripe {
  if (!stripe) {
    throw new Error("Stripe is not configured (STRIPE_SECRET_KEY is missing).");
  }
  return stripe;
}
