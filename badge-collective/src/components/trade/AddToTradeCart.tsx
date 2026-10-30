"use client";

import * as React from "react";
import { Check, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/cart/quantity-stepper";
import { useTradeCart, type TradeCartItem } from "@/lib/trade/trade-cart";

type Props = Omit<TradeCartItem, "quantity">;

export function AddToTradeCart(props: Props) {
  const add = useTradeCart((s) => s.add);
  const [qty, setQty] = React.useState(1);
  const [added, setAdded] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  React.useEffect(() => () => clearTimeout(timer.current), []);

  const handleAdd = () => {
    add(props, qty);
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
      <QuantityStepper
        value={qty}
        max={props.stock}
        onIncrement={() => setQty((q) => Math.min(props.stock, q + 1))}
        onDecrement={() => setQty((q) => Math.max(1, q - 1))}
      />
      <Button size="lg" className="flex-1" onClick={handleAdd} aria-live="polite">
        {added ? (
          <>
            <Check /> Added to trade bag
          </>
        ) : (
          <>
            <ShoppingBag /> Add to Trade Bag
          </>
        )}
      </Button>
    </div>
  );
}
