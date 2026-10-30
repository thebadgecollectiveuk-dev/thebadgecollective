import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { formatGBP } from "@/lib/format";
import type { Product } from "@/lib/products";
import type { TradeInfo } from "@/lib/trade/pricing";
import { TIERS } from "@/lib/trade/config";

type Props = {
  product: Product;
  info: TradeInfo; // must be eligible (tier + tradePricePence set)
  basePath: string; // e.g. /trade/<token>
  priority?: boolean;
};

/** Trade shop grid card: trade price + tier + stock state. Links to the trade product page. */
export function TradeProductCard({ product, info, basePath, priority = false }: Props) {
  const inStock = product.stock > 0;
  const href = `${basePath}/product/${product.id}`;
  const tierLabel = info.tier ? TIERS[info.tier].label : "";

  return (
    <article className="group relative flex flex-col">
      <Link
        href={href}
        className="relative block overflow-hidden rounded-md border border-border bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label={`View ${product.name}`}
      >
        <div className="relative aspect-square">
          <span
            className="product-glow absolute inset-0 z-0 scale-90 opacity-70 transition-opacity duration-500 group-hover:opacity-100"
            aria-hidden="true"
          />
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
          <span className="label-caps absolute left-3 top-3 z-20 rounded-sm border border-chrome/30 bg-background/80 px-2.5 py-1 text-chrome backdrop-blur-sm">
            {tierLabel}
          </span>
          {!inStock ? (
            <span className="label-caps absolute right-3 top-3 z-20 rounded-sm border border-border bg-background/80 px-2.5 py-1 text-muted-foreground backdrop-blur-sm">
              Out of stock
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
          <p className="shrink-0 text-right text-sm tabular-nums">
            <span className="block text-chrome">{formatGBP(info.tradePricePence!)}</span>
            <span className="block text-xs text-muted-foreground/60 line-through">
              {formatGBP(product.unitAmount)}
            </span>
          </p>
        </div>

        <p className="text-xs text-muted-foreground">
          Trade price per set · min {info.minSets} sets in this tier
        </p>

        <div className="mt-3">
          <Link
            href={href}
            className="label-caps inline-flex items-center text-muted-foreground transition-colors duration-300 hover:text-chrome"
          >
            {inStock ? "Add to order" : "Pre-order"}
            <span
              aria-hidden="true"
              className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
            >
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
