import type { Metadata } from "next";

import { getProducts } from "@/lib/products";
import { Container } from "@/components/site/container";
import { Eyebrow, ChromeRule } from "@/components/site/section";
import { ProductGrid } from "@/components/product/ProductGrid";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse the full collection of premium, brand new car badges. Flat-rate UK shipping at £2.70.",
};

// Re-read the catalogue from Stripe at most once a minute, so edits in the
// Stripe Dashboard appear on the site automatically without a redeploy.
export const revalidate = 60;

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="py-16 sm:py-20">
      <Container>
        <header className="flex flex-col items-center gap-5 text-center">
          <Eyebrow>The Collection</Eyebrow>
          <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            Shop all badges
          </h1>
          <ChromeRule className="max-w-[140px]" />
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
            {products.length} badges in the current collection. Brand new and
            ready to fit.
          </p>
        </header>

        <div className="mt-16">
          <ProductGrid products={products} priorityCount={3} />
        </div>
      </Container>
    </div>
  );
}
