"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { Container } from "@/components/site/container";
import { useHydrated } from "@/hooks/use-hydrated";
import { useTradeCart, selectTradeCount } from "@/lib/trade/trade-cart";

/** Minimal header for the trade area (separate from the retail header/cart). */
export function TradeHeader({ token }: { token: string }) {
  const mounted = useHydrated();
  const count = useTradeCart(selectTradeCount);
  const base = `/trade/${token}`;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href={base} className="flex items-center gap-3" aria-label="Trade home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo/brand-logo.svg" alt="The Badge Collective" width={40} height={40} className="h-10 w-10" />
            <span className="label-caps text-chrome">Trade</span>
          </Link>
          <Link
            href={`${base}/cart`}
            aria-label={mounted && count > 0 ? `Trade bag, ${count} items` : "Trade bag"}
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-sm text-foreground transition-colors duration-300 hover:text-chrome focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ShoppingBag className="size-5" strokeWidth={1.5} />
            {mounted && count > 0 ? (
              <span className="chrome-fill absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[0.625rem] font-semibold text-[#0a0a0a]">
                {count}
              </span>
            ) : null}
          </Link>
        </div>
      </Container>
    </header>
  );
}
