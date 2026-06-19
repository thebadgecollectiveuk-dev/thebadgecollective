/**
 * Seed Stripe with the starter badge catalogue.
 *
 *   pnpm seed:stripe                 # test mode (sk_test_...)
 *   node --env-file=.env.local scripts/seed-stripe.mjs --confirm-live
 *
 * Idempotent: products use their slug as the Stripe product id, so re-running
 * updates the same products and prices instead of duplicating them. Run it
 * after adding STRIPE_SECRET_KEY to .env.local. Photos are not uploaded — add
 * them by hand in the Stripe Dashboard.
 */
import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error("STRIPE_SECRET_KEY is not set. Add it to .env.local.");
  process.exit(1);
}

const isLive = key.startsWith("sk_live_");
const confirmedLive = process.argv.includes("--confirm-live");
if (isLive && !confirmedLive) {
  console.error(
    "Refusing to seed a LIVE account without --confirm-live. Re-run with that flag if you are sure.",
  );
  process.exit(1);
}

const stripe = new Stripe(key, { typescript: false });

// Mirror of the starter catalogue in src/lib/products.ts.
const PRODUCTS = [
  { id: "bmw-roundel-82mm", name: "BMW Roundel, 82mm", description: "The 82mm roundel for bonnet and boot, finished in deep enamel blue and white beneath a polished chrome ring. A clean fit for a wide range of BMW models from the 1990s onward.", unitAmount: 2499, stock: 7 },
  { id: "mercedes-bonnet-star", name: "Mercedes-Benz Bonnet Star", description: "The upright three-pointed star for the bonnet, spring-mounted and weighted as the factory intended. Hand-polished to a mirror finish and ready to fit.", unitAmount: 3499, stock: 4 },
  { id: "audi-rings-gloss-black", name: "Audi Rings, Gloss Black", description: "Four interlocking rings refinished in gloss black for a quieter, modern grille. Supplied with fresh adhesive backing for a precise install.", unitAmount: 2999, stock: 0 },
  { id: "vw-grille-roundel", name: "Volkswagen Grille Roundel", description: "The VW roundel for the front grille, restored from an original casting and re-chromed by hand. A faithful fit for Golf and Polo grilles.", unitAmount: 1999, stock: 12 },
  { id: "porsche-bonnet-crest", name: "Porsche Bonnet Crest", description: "The Stuttgart crest in full enamel colour, raised and lacquered over a gold-tone base. A centrepiece for the bonnet, or refinished for wheel centres.", unitAmount: 5499, stock: 3 },
  { id: "ford-classic-oval", name: "Ford Classic Blue Oval", description: "The classic Ford oval in deep blue enamel, re-lacquered and polished to a period correct standard. Suits Escort, Capri and Cortina restorations.", unitAmount: 1799, stock: 9 },
  { id: "bmw-m-emblem", name: "BMW M Emblem", description: "The M motorsport emblem in its three stripe colours, set behind a slim chrome surround. A small mark that says a great deal.", unitAmount: 2299, stock: 6 },
  { id: "mercedes-amg-badge", name: "Mercedes AMG Wing Badge", description: "The AMG wing badge for boot or grille, with crisp lettering on a brushed metal field. Restored from an original and ready to fit.", unitAmount: 3999, stock: 5 },
];

/** Ensure a product exists with the right details and a GBP price set as default. */
async function upsertProduct(p) {
  // Create or update the product (id is the slug, so this is idempotent).
  let product;
  try {
    product = await stripe.products.retrieve(p.id);
    product = await stripe.products.update(p.id, {
      name: p.name,
      description: p.description,
      active: true,
      metadata: { stock: String(p.stock) },
    });
  } catch {
    product = await stripe.products.create({
      id: p.id,
      name: p.name,
      description: p.description,
      metadata: { stock: String(p.stock) },
    });
  }

  // Reuse an existing GBP price with the same amount, else create one.
  const prices = await stripe.prices.list({ product: p.id, active: true, limit: 100 });
  let price = prices.data.find(
    (pr) => pr.currency === "gbp" && pr.unit_amount === p.unitAmount,
  );
  if (!price) {
    price = await stripe.prices.create({
      product: p.id,
      currency: "gbp",
      unit_amount: p.unitAmount,
    });
  }

  if (product.default_price !== price.id) {
    await stripe.products.update(p.id, { default_price: price.id });
  }

  return { name: p.name, priceId: price.id };
}

console.log(`Seeding ${PRODUCTS.length} products into Stripe (${isLive ? "LIVE" : "test"} mode)...`);
for (const p of PRODUCTS) {
  const result = await upsertProduct(p);
  console.log(`  ✓ ${result.name} (${result.priceId})`);
}
console.log("Done. Add product photos in the Stripe Dashboard when ready.");
