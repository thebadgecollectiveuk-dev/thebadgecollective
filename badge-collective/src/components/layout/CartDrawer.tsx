"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { useCart, selectSubtotal, selectCount } from "@/lib/cart-store";
import { formatGBP, shippingFor } from "@/lib/format";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { CheckoutButton } from "@/components/cart/checkout-button";

export function CartDrawer() {
  const isOpen = useCart((s) => s.isOpen);
  const setOpen = useCart((s) => s.setOpen);
  const closeCart = useCart((s) => s.closeCart);
  const items = useCart((s) => s.items);
  const subtotal = useCart(selectSubtotal);
  const count = useCart(selectCount);
  const shipping = items.length ? shippingFor(subtotal) : 0;
  const total = subtotal + shipping;

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your bag{count > 0 ? ` (${count})` : ""}</SheetTitle>
          <SheetDescription className="sr-only">
            Items in your shopping bag
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
            <ShoppingBag className="size-8 text-muted-foreground" strokeWidth={1.25} />
            <p className="font-serif text-xl text-foreground">Your bag is empty</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Browse the collection and add a badge or two.
            </p>
            <SheetClose asChild>
              <Button asChild variant="outline">
                <Link href="/shop">Shop the Collection</Link>
              </Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <div className="flex-1 divide-y divide-border overflow-y-auto px-6">
              {items.map((item) => (
                <CartLineItem
                  key={item.productId}
                  item={item}
                  onNavigate={closeCart}
                  className="py-5"
                />
              ))}
            </div>

            <SheetFooter>
              <dl className="flex flex-col gap-2 text-sm">
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
                <div className="mt-1 flex justify-between border-t border-border pt-3">
                  <dt className="font-medium text-foreground">Total</dt>
                  <dd className="font-medium tabular-nums text-foreground">
                    {formatGBP(total)}
                  </dd>
                </div>
              </dl>

              <div className="mt-5 flex flex-col gap-3">
                <CheckoutButton />
                <SheetClose asChild>
                  <Button asChild variant="ghost">
                    <Link href="/cart">View full bag</Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
