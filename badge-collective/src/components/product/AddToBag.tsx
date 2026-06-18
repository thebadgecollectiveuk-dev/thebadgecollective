"use client";

import * as React from "react";
import { Check, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/cart/quantity-stepper";
import { useCart } from "@/lib/cart-store";

type AddToBagProps = {
  product: {
    id: string;
    priceId: string;
    name: string;
    image: string;
    unitAmount: number;
    stock: number;
  };
};

export function AddToBag({ product }: AddToBagProps) {
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.openCart);
  const [qty, setQty] = React.useState(1);
  const [added, setAdded] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  const handleAdd = () => {
    addItem(
      {
        priceId: product.priceId,
        productId: product.id,
        name: product.name,
        image: product.image,
        unitAmount: product.unitAmount,
      },
      qty,
    );
    openCart();
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
      <QuantityStepper
        value={qty}
        max={product.stock}
        onIncrement={() => setQty((q) => Math.min(product.stock, q + 1))}
        onDecrement={() => setQty((q) => Math.max(1, q - 1))}
      />
      <Button size="lg" className="flex-1" onClick={handleAdd} aria-live="polite">
        {added ? (
          <>
            <Check />
            Added to bag
          </>
        ) : (
          <>
            <ShoppingBag />
            Add to Bag
          </>
        )}
      </Button>
    </div>
  );
}
