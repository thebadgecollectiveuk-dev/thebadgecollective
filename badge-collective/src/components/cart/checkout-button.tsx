"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { createCheckoutSession } from "@/lib/checkout";

export function CheckoutButton({ className }: { className?: string }) {
  const items = useCart((s) => s.items);
  const closeCart = useCart((s) => s.closeCart);
  const [pending, startTransition] = React.useTransition();
  const empty = items.length === 0;

  return (
    <Button
      size="lg"
      className={cn("w-full", className)}
      disabled={empty || pending}
      onClick={() => {
        closeCart();
        startTransition(async () => {
          await createCheckoutSession(items);
        });
      }}
    >
      {pending ? "Redirecting" : "Checkout"}
      {!pending ? <ArrowRight /> : null}
    </Button>
  );
}
