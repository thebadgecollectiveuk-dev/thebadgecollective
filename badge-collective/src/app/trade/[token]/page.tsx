import Link from "next/link";
import { Truck, Package, MessageCircle } from "lucide-react";

import { getProducts } from "@/lib/products";
import { Container } from "@/components/site/container";
import { Eyebrow, ChromeRule } from "@/components/site/section";
import { TradeProductCard } from "@/components/trade/TradeProductCard";
import { tradeInfoFor } from "@/lib/trade/pricing";
import { WHATSAPP_PREORDER_DISPLAY, WHATSAPP_PREORDER_DIGITS } from "@/lib/trade/config";

type Props = { params: Promise<{ token: string }> };

export default async function TradeShopPage({ params }: Props) {
  const { token } = await params;
  const basePath = `/trade/${token}`;
  const products = await getProducts();

  const eligible: { product: (typeof products)[number]; info: ReturnType<typeof tradeInfoFor> }[] = [];
  const unmapped: (typeof products)[number][] = [];
  for (const product of products) {
    const info = tradeInfoFor(product);
    if (info.eligible) eligible.push({ product, info });
    else unmapped.push(product);
  }

  // Surface products that don't map to a tier so the owner knows to set one.
  if (unmapped.length > 0) {
    console.warn(
      "[trade] Products not mapped to a trade tier (hidden from trade):",
      unmapped.map((p) => `${p.name} (${(p.unitAmount / 100).toFixed(2)})`).join(", "),
    );
  }

  const waPreorder = `https://wa.me/${WHATSAPP_PREORDER_DIGITS}?text=${encodeURIComponent(
    "Hi Badge Collective, I'd like to ask about trade pre-orders.",
  )}`;

  return (
    <div className="py-14 sm:py-16">
      <Container>
        <header className="flex flex-col items-center gap-5 text-center">
          <Eyebrow>Trade / Wholesale</Eyebrow>
          <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            Trade pricing
          </h1>
          <ChromeRule className="max-w-[140px]" />
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
            Confidential wholesale prices for registered trade customers. Prices
            shown are per set.
          </p>
        </header>

        {/* Info banner */}
        <div className="mx-auto mt-10 max-w-3xl rounded-md border border-border bg-surface/50 p-6">
          <ul className="grid gap-4 sm:grid-cols-3">
            <li className="flex flex-col items-center gap-2 text-center">
              <Package className="size-5 text-chrome" strokeWidth={1.5} />
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground">Minimum order</span>: 5 sets per
                tier (2 for the top tier). Mix any designs within a tier.
              </p>
            </li>
            <li className="flex flex-col items-center gap-2 text-center">
              <Truck className="size-5 text-chrome" strokeWidth={1.5} />
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground">UK delivery</span> via Royal
                Mail, tracked. Dispatched once payment clears.
              </p>
            </li>
            <li className="flex flex-col items-center gap-2 text-center">
              <MessageCircle className="size-5 text-chrome" strokeWidth={1.5} />
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground">Questions or pre-orders?</span>{" "}
                <a
                  href={waPreorder}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-chrome underline-offset-4 hover:underline"
                >
                  WhatsApp {WHATSAPP_PREORDER_DISPLAY}
                </a>
              </p>
            </li>
          </ul>
        </div>

        {/* Grid */}
        {eligible.length > 0 ? (
          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3">
            {eligible.map(({ product, info }, i) => (
              <TradeProductCard
                key={product.id}
                product={product}
                info={info}
                basePath={basePath}
                priority={i < 3}
              />
            ))}
          </div>
        ) : (
          <p className="mt-16 text-center text-muted-foreground">
            No trade products are available right now.
          </p>
        )}

        {/* Unmapped products — owner note */}
        {unmapped.length > 0 ? (
          <div className="mx-auto mt-16 max-w-3xl rounded-md border border-dashed border-border bg-surface/30 p-6">
            <h2 className="font-serif text-lg text-foreground">
              Not yet priced for trade ({unmapped.length})
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              These products don&apos;t match a trade tier, so they&apos;re hidden
              from the trade shop. Set their retail price to a tier price, or add a{" "}
              <code className="text-chrome">trade_tier</code> /{" "}
              <code className="text-chrome">trade_price</code> on the product in
              Stripe to include them.
            </p>
            <ul className="mt-4 space-y-1 text-sm text-muted-foreground/80">
              {unmapped.map((p) => (
                <li key={p.id} className="flex justify-between gap-4">
                  <span>{p.name}</span>
                  <span className="tabular-nums">
                    {(p.unitAmount / 100).toLocaleString("en-GB", {
                      style: "currency",
                      currency: "GBP",
                    })}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <p className="mt-12 text-center">
          <Link
            href={`${basePath}/cart`}
            className="label-caps text-muted-foreground transition-colors duration-300 hover:text-chrome"
          >
            View trade bag &rarr;
          </Link>
        </p>
      </Container>
    </div>
  );
}
