# The Badge Collective

Premium e-commerce storefront for a UK car badge business. Dark, metallic and
restrained, built so Stripe payments and Resend email can be added later without
restructuring.

## Tech stack

- **Next.js 16** (App Router, TypeScript, Server Components by default)
- **Tailwind CSS v4** (theme tokens live in `src/app/globals.css`)
- **shadcn/ui style** primitives built on **Radix UI** (`Button`, `Input`, `Sheet`, `Tooltip`)
- **Zustand** for the cart (persisted to `localStorage`)
- **Lucide** icons
- **Stripe** and **Resend** are installed but dormant, ready to wire in
- Targets **Vercel** for deployment

## Requirements

- Node 18.18+ (developed on Node 24)
- pnpm 9+ (`corepack enable` or `npm i -g pnpm`)

## Local development

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

Other scripts:

```bash
pnpm build      # production build
pnpm start      # serve the production build
pnpm lint       # eslint
```

### Note on pnpm build scripts

pnpm gates native build scripts. `sharp` (image optimisation) and
`unrs-resolver` are pre-approved in `pnpm-workspace.yaml` under `allowBuilds`, so
`pnpm install` runs cleanly. If pnpm ever asks again, set those entries to `true`.

### Placeholder product images

The badges in `/public/products/*.jpg` are generated, on-brand placeholders.
Regenerate them with:

```bash
node scripts/gen-placeholders.mjs
```

Replace them with real product photography when ready. Keep the same filenames,
or update the `image` paths in `src/lib/products.ts`.

## Environment variables

Copy `.env.example` to `.env.local`. Only two are needed today:

```bash
NEXT_PUBLIC_SITE_URL=https://thebadgecollective.com
NEXT_PUBLIC_WHATSAPP_NUMBER=
```

- `NEXT_PUBLIC_WHATSAPP_NUMBER` takes an international number, digits only (for
  example `447123456789`). While it is blank, every "Message us on WhatsApp"
  button is disabled and shows a "Coming soon" tooltip. Add the number and the
  buttons activate automatically.

The future Stripe and Resend keys are listed, commented out, in `.env.example`.

## Current status: mock data, Stripe-ready

Everything works today against mock data with a stubbed checkout:

- **Products** come from `src/lib/products.ts`. `getProducts()` and
  `getProduct(id)` return a hardcoded array. This is the single swap point for
  Stripe; the return shape and signatures stay the same.
- **Checkout** is `createCheckoutSession()` in `src/lib/checkout.ts`. It logs the
  cart server-side and redirects to `/checkout/coming-soon`.
- `src/lib/stripe.ts` and `src/lib/resend.ts` are empty scaffolds with the
  initialisation commented out.

## How to add Stripe later

1. **Create a Stripe account** and add your products in the Dashboard.
2. **Add env vars** (below).
3. **Swap `getProducts()` / `getProduct()`** internals for a Stripe call.
4. **Swap `createCheckoutSession()`** for a real Checkout Session.
5. **Add a webhook** at `/api/webhooks/stripe` for `checkout.session.completed`.
6. **Wire Resend** for confirmation emails.

### 1. Stripe Dashboard setup

- In **Products**, create one product per badge with a single price in GBP.
- On each product, add a **metadata** field named `stock` with the quantity
  available. The data layer reads this to grey out sold-out items.
- In **Developers, API keys**, copy the publishable and secret keys.
- In **Developers, Webhooks**, add an endpoint:
  - URL: `https://yourdomain.com/api/webhooks/stripe`
  - Event: `checkout.session.completed`
  - Copy the **signing secret** into `STRIPE_WEBHOOK_SECRET`.

### 2. Environment variables

```bash
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
RESEND_API_KEY=
ORDER_NOTIFICATION_EMAIL=thebadgecollectiveuk@gmail.com
```

### 3. Product data layer

Enable the client in `src/lib/stripe.ts`, then replace the internals of
`getProducts()` / `getProduct()` in `src/lib/products.ts`:

```ts
const res = await stripe.products.list({
  expand: ["data.default_price"],
  active: true,
});

return res.data.map((p) => {
  const price = p.default_price as Stripe.Price;
  return {
    id: p.id,
    priceId: price.id,
    name: p.name,
    description: p.description ?? "",
    image: p.images[0] ?? "/products/placeholder.jpg",
    unitAmount: price.unit_amount ?? 0,
    currency: "gbp",
    stock: Number(p.metadata.stock ?? 0),
  };
});
```

### 4. Real Checkout Session

Replace the body of `createCheckoutSession()` in `src/lib/checkout.ts`:

```ts
const origin = process.env.NEXT_PUBLIC_SITE_URL!;
const session = await stripe.checkout.sessions.create({
  mode: "payment",
  line_items: items.map((item) => ({ price: item.priceId, quantity: item.quantity })),
  shipping_address_collection: { allowed_countries: ["GB"] },
  shipping_options: [
    {
      shipping_rate_data: {
        type: "fixed_amount",
        fixed_amount: { amount: 399, currency: "gbp" },
        display_name: "UK Standard Shipping",
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

redirect(session.url!);
```

The success page (`/checkout/success`) already reads `session_id`. Expand it to
fetch the session and render the order summary (see the `TODO` in that file).

### 5. Webhook and 6. Resend

Add `src/app/api/webhooks/stripe/route.ts` to verify the signature and handle
`checkout.session.completed`. From the handler, send a customer confirmation and
an internal notification with Resend (`src/lib/resend.ts`), using
`ORDER_NOTIFICATION_EMAIL`.

## Deploying to Vercel

1. Push the repo to GitHub.
2. In Vercel, **Add New, Project** and import the repo. Vercel detects Next.js;
   the defaults (build `next build`, output `.next`) are correct.
3. Add the environment variables under **Settings, Environment Variables**. At
   minimum set `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_WHATSAPP_NUMBER`.
4. Deploy. Vercel provides `sharp` for image optimisation automatically.
5. After adding your domain, update `NEXT_PUBLIC_SITE_URL` to the live URL and
   point the Stripe webhook at `https://yourdomain.com/api/webhooks/stripe`.

## Project structure

```
src/
  app/                  # routes: home, shop, shop/[id], cart, checkout/*, contact, about, legal
  components/
    layout/             # Header, Footer, CartDrawer
    product/            # ProductCard, ProductGrid, AddToBag
    cart/               # CartLineItem, QuantityStepper, CheckoutButton
    site/               # Logo, Container, section + legal helpers, WhatsApp button
    ui/                 # Radix-based primitives (button, input, sheet, tooltip)
  lib/                  # products, cart-store, checkout, stripe, resend, format, site
  hooks/                # useHydrated
public/
  logo/                 # supplied brand assets
  products/             # placeholder product images
```
