# The Badge Collective: setup and handoff

The website is built and ready. This guide switches on card payments and shows
how to run the shop. You do not need to edit any code, only add a few keys and
products in your Stripe and host dashboards.

There are two modes:

- **Mock mode** (no Stripe key): the site shows the starter catalogue and the
  checkout says "coming soon". This is how it behaves until you add a key.
- **Live mode** (Stripe key added): the shop shows your real Stripe products and
  the checkout takes card payments.

---

## 1. Get your Stripe keys

In the Stripe Dashboard, go to **Developers, API keys**.

- Use the **Test mode** toggle to rehearse safely first.
- Copy your **Secret key** (`sk_test_...` or `sk_live_...`) and **Publishable
  key** (`pk_test_...` or `pk_live_...`).

## 2. Add your products to Stripe

The shop reads its catalogue from Stripe in live mode, so your badges need to
exist there. Two ways:

**Option A, run the seed script (recommended).** This creates the eight starter
badges with prices and stock, so you have a working catalogue to edit.

1. Put your test secret key in `.env.local`:
   ```
   STRIPE_SECRET_KEY=sk_test_xxx
   ```
2. From the project folder, run:
   ```
   pnpm seed:stripe
   ```
   Re-running updates the same products, it never duplicates them. For a live
   account, run `node --env-file=.env.local scripts/seed-stripe.mjs --confirm-live`.

**Option B, add them by hand.** In **Products**, create one product per badge
with a single GBP price, a metadata field `stock` set to the quantity, and an
image.

Products are created without photos. Add real photography to each product in the
Stripe Dashboard when you have it.

## 3. Set up the webhook

In **Developers, Webhooks, Add endpoint**:

- URL: `https://YOURDOMAIN/api/webhooks/stripe`
- Event: `checkout.session.completed`
- Copy the **signing secret** (`whsec_...`).

## 4. Order emails (optional)

To send automatic confirmation emails, create a [Resend](https://resend.com)
account, verify your sending domain, and copy the API key. Update the `from`
address in `src/lib/resend.ts` to your verified domain.

## 5. Environment variables

Add these in `.env.local` for local testing, and in your host's environment
variables for the live site. After changing any `NEXT_PUBLIC_` value, redeploy.

```
NEXT_PUBLIC_SITE_URL=https://thebadgecollective.com
NEXT_PUBLIC_WHATSAPP_NUMBER=447490209038
STRIPE_SECRET_KEY=sk_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_xxx
RESEND_API_KEY=re_xxx
ORDER_NOTIFICATION_EMAIL=thebadgecollectiveuk@gmail.com
```

## 6. Test it (test mode)

Add a badge to the bag and check out. Pay with Stripe's test card:

- Card `4242 4242 4242 4242`, any future expiry, any CVC, any postcode.

You should land on the confirmation page with your order summary, and receive
both emails if Resend is set up.

## 7. Go live

1. Swap the test keys for live keys in your host's environment variables.
2. Make sure your products exist in **live** mode (seed with `--confirm-live`,
   or add them by hand).
3. Point the webhook at your live domain.
4. Set `NEXT_PUBLIC_SITE_URL` to the live URL.

---

## Running the shop day to day

Everything is managed in Stripe. The site updates automatically:

- Add, edit or remove products, and change prices, in **Products**.
- Update the `stock` metadata number to track availability. Set it to `0` to
  show a badge as sold out, which turns its button into a "Notify via WhatsApp"
  prompt.
- Swap a product's photo in Stripe to change it on the site.

The WhatsApp number, contact email and the flat £3.99 UK shipping rate are
already configured.

## Quick reference

| Task | Command |
| --- | --- |
| Install | `pnpm install` |
| Develop | `pnpm dev` (http://localhost:3000) |
| Build | `pnpm build` then `pnpm start` |
| Seed Stripe | `pnpm seed:stripe` |

Full developer notes are in `README.md`.
