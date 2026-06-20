"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { useCart, selectSubtotal, selectCount } from "@/lib/cart-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatGBP, shippingFor } from "@/lib/format";
import { Container } from "@/components/site/container";
import { ChromeRule } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { CheckoutButton } from "@/components/cart/checkout-button";

export default function CartPage() {
  const mounted = useHydrated();

  const items = useCart((s) => s.items);
  const subtotal = useCart(selectSubtotal);
  const count = useCart(selectCount);
  const shipping = items.length ? shippingFor(subtotal) : 0;
  const total = subtotal + shipping;

  return (
    <div className="py-16 sm:py-20">
      <Container>
        <header className="flex flex-col gap-4">
          <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            Your bag
          </h1>
          <ChromeRule className="max-w-[120px] [background-image:linear-gradient(90deg,rgba(232,232,232,0.85),transparent)]" />
        </header>

        {!mounted ? (
          <p className="mt-12 text-sm text-muted-foreground">Retrieving your bag.</p>
        ) : items.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-6 rounded-md border border-border bg-surface/40 px-6 py-20 text-center">
            <ShoppingBag className="size-8 text-muted-foreground" strokeWidth={1.25} />
            <p className="font-serif text-2xl text-foreground">Your bag is empty</p>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Nothing here yet. Browse the collection and add the badges you have
              been looking for.
            </p>
            <Button asChild size="lg">
              <Link href="/shop">Shop the Collection</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
            {/* Line items */}
            <div>
              <p className="label-caps mb-6 text-muted-foreground/70">
                {count} item{count === 1 ? "" : "s"}
              </p>
              <ul className="divide-y divide-border border-y border-border">
                {items.map((item) => (
                  <li key={item.productId}>
                    <CartLineItem item={item} className="py-6" />
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button asChild variant="ghost">
                  <Link href="/shop">
                    <span aria-hidden="true">&larr;</span>
                    Continue shopping
                  </Link>
                </Button>
              </div>
            </div>

            {/* Summary */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-md border border-border bg-surface/50 p-6">
                <h2 className="font-serif text-xl text-foreground">Order summary</h2>
                <ChromeRule className="my-5 opacity-50" />
                <dl className="flex flex-col gap-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd className="tabular-nums">{formatGBP(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Shipping</dt>
                    <dd className="tabular-nums">
                      {shipping === 0 ? "Free" : formatGBP(shipping)}
                    </dd>
                  </div>
                  <div className="mt-2 flex justify-between border-t border-border pt-4 text-base">
                    <dt className="font-medium text-foreground">Total</dt>
                    <dd className="font-medium tabular-nums text-foreground">
                      {formatGBP(total)}
                    </dd>
                  </div>
                </dl>
                <div className="mt-6">
                  <CheckoutButton />
                </div>
                <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
                  Free UK shipping on orders over £25, otherwise a flat £3.99.
                  Taxes included where applicable.
                </p>
              </div>
            </aside>
          </div>
        )}
      </Container>
    </div>
  );
}
