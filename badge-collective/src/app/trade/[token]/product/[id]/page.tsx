import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircle } from "lucide-react";

import { getProduct } from "@/lib/products";
import { formatGBP } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Container } from "@/components/site/container";
import { ChromeRule } from "@/components/site/section";
import { ProductGallery } from "@/components/product/ProductGallery";
import { AddToTradeCart } from "@/components/trade/AddToTradeCart";
import { tradeInfoFor } from "@/lib/trade/pricing";
import { TIERS } from "@/lib/trade/config";
import { WHATSAPP_PREORDER_DISPLAY, WHATSAPP_PREORDER_DIGITS } from "@/lib/trade/config";

type Props = { params: Promise<{ token: string; id: string }> };

export default async function TradeProductPage({ params }: Props) {
  const { token, id } = await params;
  const basePath = `/trade/${token}`;
  const product = await getProduct(id);
  if (!product) notFound();

  const info = tradeInfoFor(product);
  // Not a trade-eligible product → it has no trade price; keep it off trade.
  if (!info.eligible || !info.tradePricePence || !info.tier) notFound();

  const inStock = product.stock > 0;
  const tier = TIERS[info.tier];

  const waPreorder = `https://wa.me/${WHATSAPP_PREORDER_DIGITS}?text=${encodeURIComponent(
    `Hi Badge Collective, I'd like to pre-order the ${product.name} (trade).`,
  )}`;

  return (
    <div className="py-10 sm:py-14">
      <Container>
        <nav aria-label="Breadcrumb" className="label-caps flex items-center gap-2 text-muted-foreground/70">
          <Link href={basePath} className="transition-colors duration-300 hover:text-foreground">
            Trade
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-muted-foreground">{product.name}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery
            images={product.images && product.images.length > 0 ? product.images : [product.image]}
            name={product.name}
            inStock={inStock}
          />

          <div className="flex flex-col">
            <span className="label-caps w-fit rounded-sm border border-chrome/30 px-2.5 py-1 text-chrome">
              {tier.label} tier
            </span>
            <h1 className="mt-4 font-serif text-3xl font-medium leading-tight tracking-tight text-foreground sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-4 flex items-baseline gap-3">
              <p className="text-2xl tabular-nums text-chrome">
                {formatGBP(info.tradePricePence)}
              </p>
              <p className="text-sm tabular-nums text-muted-foreground/60 line-through">
                {formatGBP(product.unitAmount)} retail
              </p>
              <span className="text-sm text-muted-foreground">per set</span>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              Minimum {tier.minSets} sets in the {tier.label} tier (mixable with
              other {tier.label}-tier designs).
            </p>

            <div className="mt-4 flex items-center gap-2 text-sm">
              <span
                className={cn(
                  "inline-block size-1.5 rounded-full",
                  inStock ? "bg-chrome" : "bg-muted-foreground/50",
                )}
                aria-hidden="true"
              />
              <span className="text-muted-foreground">
                {inStock ? `In stock, ${product.stock} available` : "Out of stock"}
              </span>
            </div>

            <ChromeRule className="my-7 opacity-60" />

            <p className="text-base leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <div className="mt-9">
              {inStock ? (
                <AddToTradeCart
                  productId={product.id}
                  priceId={product.priceId}
                  name={product.name}
                  image={product.image}
                  tradePricePence={info.tradePricePence}
                  tier={info.tier}
                  stock={product.stock}
                />
              ) : (
                <div className="flex flex-col gap-4 rounded-md border border-border bg-surface/50 p-6">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Out of stock — message us on WhatsApp ({WHATSAPP_PREORDER_DISPLAY})
                    to arrange a pre-order.
                  </p>
                  <a
                    href={waPreorder}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-fit items-center gap-2 rounded-sm border border-chrome/35 px-5 py-2.5 text-sm text-foreground transition-colors duration-300 hover:border-chrome/70 hover:bg-white/[0.03]"
                  >
                    <MessageCircle className="size-4" /> Message us to pre-order
                  </a>
                </div>
              )}
            </div>

            <p className="mt-8">
              <Link
                href={`${basePath}/cart`}
                className="label-caps text-muted-foreground transition-colors duration-300 hover:text-chrome"
              >
                View trade bag &rarr;
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
