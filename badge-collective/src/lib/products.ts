/**
 * Product data layer.
 *
 * Single swap point for Stripe. In live mode (Stripe key set) the catalogue is
 * read from Stripe; in mock mode it falls back to the hardcoded starter array
 * below. The exported function signatures and the Product shape never change.
 */
import type Stripe from "stripe";

import { stripe } from "./stripe";

export type Product = {
  id: string; // slug today, Stripe product id later e.g. "prod_..."
  priceId: string; // placeholder today, Stripe price id later e.g. "price_..."
  name: string;
  description: string;
  image: string; // path under /public/products/
  unitAmount: number; // in pence, e.g. 2499 = £24.99
  currency: "gbp";
  stock: number; // 0 = out of stock
};

const PRODUCTS: Product[] = [
  {
    id: "bmw-roundel-82mm",
    priceId: "price_mock_bmw_roundel",
    name: "BMW Roundel, 82mm",
    description:
      "The 82mm roundel for bonnet and boot, finished in deep enamel blue and white beneath a polished chrome ring. A clean fit for a wide range of BMW models from the 1990s onward.",
    image: "/products/bmw-roundel-82mm.jpg",
    unitAmount: 2499,
    currency: "gbp",
    stock: 7,
  },
  {
    id: "mercedes-bonnet-star",
    priceId: "price_mock_mercedes_star",
    name: "Mercedes-Benz Bonnet Star",
    description:
      "The upright three-pointed star for the bonnet, spring-mounted and weighted as the factory intended. Hand-polished to a mirror finish and ready to fit.",
    image: "/products/mercedes-bonnet-star.jpg",
    unitAmount: 3499,
    currency: "gbp",
    stock: 4,
  },
  {
    id: "audi-rings-gloss-black",
    priceId: "price_mock_audi_rings",
    name: "Audi Rings, Gloss Black",
    description:
      "Four interlocking rings refinished in gloss black for a quieter, modern grille. Supplied with fresh adhesive backing for a precise install.",
    image: "/products/audi-rings-gloss-black.jpg",
    unitAmount: 2999,
    currency: "gbp",
    stock: 0,
  },
  {
    id: "vw-grille-roundel",
    priceId: "price_mock_vw_roundel",
    name: "Volkswagen Grille Roundel",
    description:
      "The VW roundel for the front grille, restored from an original casting and re-chromed by hand. A faithful fit for Golf and Polo grilles.",
    image: "/products/vw-grille-roundel.jpg",
    unitAmount: 1999,
    currency: "gbp",
    stock: 12,
  },
  {
    id: "porsche-bonnet-crest",
    priceId: "price_mock_porsche_crest",
    name: "Porsche Bonnet Crest",
    description:
      "The Stuttgart crest in full enamel colour, raised and lacquered over a gold-tone base. A centrepiece for the bonnet, or refinished for wheel centres.",
    image: "/products/porsche-bonnet-crest.jpg",
    unitAmount: 5499,
    currency: "gbp",
    stock: 3,
  },
  {
    id: "ford-classic-oval",
    priceId: "price_mock_ford_oval",
    name: "Ford Classic Blue Oval",
    description:
      "The classic Ford oval in deep blue enamel, re-lacquered and polished to a period correct standard. Suits Escort, Capri and Cortina restorations.",
    image: "/products/ford-classic-oval.jpg",
    unitAmount: 1799,
    currency: "gbp",
    stock: 9,
  },
  {
    id: "bmw-m-emblem",
    priceId: "price_mock_bmw_m",
    name: "BMW M Emblem",
    description:
      "The M motorsport emblem in its three stripe colours, set behind a slim chrome surround. A small mark that says a great deal.",
    image: "/products/bmw-m-emblem.jpg",
    unitAmount: 2299,
    currency: "gbp",
    stock: 6,
  },
  {
    id: "mercedes-amg-badge",
    priceId: "price_mock_amg_badge",
    name: "Mercedes AMG Wing Badge",
    description:
      "The AMG wing badge for boot or grille, with crisp lettering on a brushed metal field. Restored from an original and ready to fit.",
    image: "/products/mercedes-amg-badge.jpg",
    unitAmount: 3999,
    currency: "gbp",
    stock: 5,
  },
];

/** Hand-picked ids shown in the home page "Featured" grid. */
const FEATURED_IDS = [
  "porsche-bonnet-crest",
  "bmw-roundel-82mm",
  "mercedes-bonnet-star",
  "ford-classic-oval",
];

/** Map a Stripe product (with an expanded default_price) to our Product shape. */
function fromStripe(p: Stripe.Product): Product {
  const price = p.default_price as Stripe.Price | null;
  return {
    id: p.id,
    priceId: price?.id ?? "",
    name: p.name,
    description: p.description ?? "",
    image: p.images[0] ?? "/products/placeholder.jpg",
    unitAmount: price?.unit_amount ?? 0,
    currency: "gbp",
    stock: Number(p.metadata.stock ?? 0),
  };
}

/** Return all active products. Reads Stripe in live mode, mock data otherwise. */
export async function getProducts(): Promise<Product[]> {
  if (!stripe) return PRODUCTS;

  const res = await stripe.products.list({
    active: true,
    expand: ["data.default_price"],
    limit: 100,
  });
  // Only sellable products (those with a usable price).
  return res.data.map(fromStripe).filter((p) => p.priceId && p.unitAmount > 0);
}

/** Return a single product by id, or null. Reads Stripe in live mode. */
export async function getProduct(id: string): Promise<Product | null> {
  if (!stripe) {
    return PRODUCTS.find((product) => product.id === id) ?? null;
  }

  try {
    const p = await stripe.products.retrieve(id, {
      expand: ["default_price"],
    });
    if (!p.active) return null;
    return fromStripe(p);
  } catch {
    return null;
  }
}

/** Return the hand-picked featured products, in display order. */
export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getProducts();
  const picked = FEATURED_IDS.map((id) =>
    products.find((p) => p.id === id),
  ).filter((p): p is Product => Boolean(p));
  // In live mode the mock slugs won't match Stripe ids, so fall back to the
  // first few products to keep the home page populated.
  return picked.length > 0 ? picked : products.slice(0, 4);
}
