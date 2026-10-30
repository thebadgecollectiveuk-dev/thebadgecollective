"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Loader2, AlertCircle } from "lucide-react";

import { Container } from "@/components/site/container";
import { Eyebrow, ChromeRule } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/cart/quantity-stepper";
import { formatGBP, shippingFor } from "@/lib/format";
import {
  useTradeCart,
  selectTradeSubtotal,
  type TradeCartItem,
} from "@/lib/trade/trade-cart";
import { useHydrated } from "@/hooks/use-hydrated";
import { TIERS, type TradeTier } from "@/lib/trade/config";
import { createTradeCheckout } from "@/lib/trade/checkout";

type Props = { params: Promise<{ token: string }> };

export default function TradeCartPage({ params }: Props) {
  const { token } = React.use(params);
  const basePath = `/trade/${token}`;
  const mounted = useHydrated();

  const items = useTradeCart((s) => s.items);
  const setQuantity = useTradeCart((s) => s.setQuantity);
  const remove = useTradeCart((s) => s.remove);
  const subtotal = useTradeCart(selectTradeSubtotal);

  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  // Sum quantities per tier to check the per-tier minimums.
  const tierTotals = React.useMemo(() => {
    const totals: Partial<Record<TradeTier, number>> = {};
    for (const it of items) {
      const tier = it.tier as TradeTier;
      if (tier in TIERS) totals[tier] = (totals[tier] ?? 0) + it.quantity;
    }
    return totals;
  }, [items]);

  const shortfalls = (Object.keys(tierTotals) as TradeTier[])
    .map((tier) => ({ tier, have: tierTotals[tier] ?? 0, min: TIERS[tier].minSets }))
    .filter((t) => t.have < t.min);

  const canCheckout = items.length > 0 && shortfalls.length === 0;
  const shipping = shippingFor(subtotal);

  const handleCheckout = async () => {
    setError(null);
    setPending(true);
    try {
      const res = await createTradeCheckout(
        token,
        items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      );
      // Only returns on error; success redirects to Stripe.
      if (res?.error) {
        setError(res.error);
        setPending(false);
      }
    } catch {
      setError("Something went wrong starting checkout. Please try again.");
      setPending(false);
    }
  };

  if (!mounted) {
    return (
      <div className="py-16">
        <Container>
          <p className="text-center text-muted-foreground">Loading your trade bag…</p>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-14 sm:py-16">
      <Container>
        <header className="flex flex-col items-center gap-5 text-center">
          <Eyebrow>Trade / Wholesale</Eyebrow>
          <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            Your trade bag
          </h1>
          <ChromeRule className="max-w-[140px]" />
        </header>

        {items.length === 0 ? (
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">Your trade bag is empty.</p>
            <p className="mt-6">
              <Link
                href={basePath}
                className="label-caps text-muted-foreground transition-colors duration-300 hover:text-chrome"
              >
                &larr; Back to trade pricing
              </Link>
            </p>
          </div>
        ) : (
          <div className="mx-auto mt-12 grid max-w-4xl gap-12 lg:grid-cols-[1fr_20rem]">
            {/* Lines */}
            <ul className="divide-y divide-border">
              {items.map((item) => (
                <TradeLine
                  key={item.priceId}
                  item={item}
                  onQty={(q) => setQuantity(item.priceId, q)}
                  onRemove={() => remove(item.priceId)}
                />
              ))}
            </ul>

            {/* Summary */}
            <aside className="flex flex-col gap-5 self-start rounded-md border border-border bg-surface/50 p-6">
              {/* Per-tier minimum status */}
              <div className="flex flex-col gap-2">
                <p className="label-caps text-muted-foreground">Minimum order</p>
                {(Object.keys(tierTotals) as TradeTier[]).map((tier) => {
                  const have = tierTotals[tier] ?? 0;
                  const min = TIERS[tier].minSets;
                  const ok = have >= min;
                  return (
                    <div key={tier} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{TIERS[tier].label}</span>
                      <span className={ok ? "text-chrome" : "text-amber-400"}>
                        {have} / {min} sets
                      </span>
                    </div>
                  );
                })}
              </div>

              <ChromeRule className="opacity-50" />

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tabular-nums text-foreground">{formatGBP(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">UK shipping</span>
                <span className="tabular-nums text-foreground">
                  {shipping === 0 ? "Free" : formatGBP(shipping)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="text-foreground">Total</span>
                <span className="text-lg tabular-nums text-chrome">
                  {formatGBP(subtotal + shipping)}
                </span>
              </div>

              {shortfalls.length > 0 ? (
                <p className="flex items-start gap-2 text-xs text-amber-400">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <span>
                    Add more to meet the minimum:{" "}
                    {shortfalls
                      .map(
                        (s) =>
                          `${TIERS[s.tier].label} needs ${s.min - s.have} more`,
                      )
                      .join("; ")}
                    .
                  </span>
                </p>
              ) : null}

              {error ? (
                <p className="flex items-start gap-2 text-xs text-amber-400">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <span>{error}</span>
                </p>
              ) : null}

              <Button
                size="lg"
                className="w-full"
                disabled={!canCheckout || pending}
                onClick={handleCheckout}
              >
                {pending ? (
                  <>
                    <Loader2 className="animate-spin" /> Starting checkout…
                  </>
                ) : (
                  "Proceed to checkout"
                )}
              </Button>

              <Link
                href={basePath}
                className="label-caps text-center text-muted-foreground transition-colors duration-300 hover:text-chrome"
              >
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </Container>
    </div>
  );
}

function TradeLine({
  item,
  onQty,
  onRemove,
}: {
  item: TradeCartItem;
  onQty: (q: number) => void;
  onRemove: () => void;
}) {
  const tier = item.tier in TIERS ? TIERS[item.tier as TradeTier].label : "";
  return (
    <li className="flex gap-4 py-5">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-sm border border-border bg-surface">
        {item.image ? (
          <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-serif text-foreground">{item.name}</p>
            <p className="text-xs text-muted-foreground">
              {tier} tier · {formatGBP(item.tradePricePence)} per set
            </p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${item.name}`}
            className="text-muted-foreground transition-colors duration-300 hover:text-foreground"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
        <div className="flex items-center justify-between gap-3">
          <QuantityStepper
            size="sm"
            value={item.quantity}
            max={item.stock}
            onIncrement={() => onQty(item.quantity + 1)}
            onDecrement={() => onQty(item.quantity - 1)}
          />
          <span className="text-sm tabular-nums text-foreground">
            {formatGBP(item.tradePricePence * item.quantity)}
          </span>
        </div>
      </div>
    </li>
  );
}
