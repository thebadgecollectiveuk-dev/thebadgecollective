import type { MetadataRoute } from "next";

import { getProducts } from "@/lib/products";
import { SITE_URL } from "@/lib/seo/site-url";

// Rebuild the sitemap at most once an hour so new Stripe products appear.
export const revalidate = 3600;

/** Lists every public page so Google can find it. Trade pages are left out. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const pages: MetadataRoute.Sitemap = (
    [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/shipping-returns`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    ] as MetadataRoute.Sitemap
  ).map((p) => ({ ...p, lastModified: now }));

  const products = await getProducts();
  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/shop/${p.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
    images: p.image ? [p.image.startsWith("/") ? `${SITE_URL}${p.image}` : p.image] : undefined,
  }));

  return [...pages, ...productPages];
}
