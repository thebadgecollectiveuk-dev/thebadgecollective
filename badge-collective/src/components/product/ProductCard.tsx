import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { formatGBP } from "@/lib/format";
import type { Product } from "@/lib/products";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
};

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const inStock = product.stock > 0;
  const href = `/shop/${product.id}`;

  return (
    <article className="group relative flex flex-col">
      <Link
        href={href}
        className="relative block overflow-hidden rounded-md border border-border bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label={`View ${product.name}`}
      >
        <div className="relative aspect-square">
          <span className="product-glow absolute inset-0 z-0 scale-90 opacity-70 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw"
            className={cn(
              "relative z-10 object-cover transition-[transform,filter] duration-500 ease-out group-hover:scale-[1.03]",
              !inStock && "opacity-40 grayscale",
            )}
          />
          {!inStock ? (
            <span className="label-caps absolute left-3 top-3 z-20 rounded-sm border border-border bg-background/80 px-2.5 py-1 text-muted-foreground backdrop-blur-sm">
              Sold out
            </span>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-1 pt-4">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-serif text-lg leading-snug text-foreground">
            <Link
              href={href}
              className="transition-colors duration-300 hover:text-chrome focus-visible:outline-none focus-visible:text-chrome"
            >
              {product.name}
            </Link>
          </h3>
          <p className="shrink-0 text-sm tabular-nums text-muted-foreground">
            {product.pricingMode === "packs"
              ? `From ${formatGBP(product.unitAmount)}`
              : formatGBP(product.unitAmount)}
          </p>
        </div>

        <div className="mt-3">
          {inStock ? (
            <Link
              href={href}
              className="label-caps inline-flex items-center text-muted-foreground transition-colors duration-300 hover:text-chrome"
            >
              View
              <span aria-hidden="true" className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
          ) : (
            <Link
              href={`/contact?subject=${encodeURIComponent(product.name)}`}
              className="label-caps inline-flex items-center text-muted-foreground transition-colors duration-300 hover:text-chrome"
            >
              Notify via WhatsApp
              <span aria-hidden="true" className="ml-2">&rarr;</span>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
