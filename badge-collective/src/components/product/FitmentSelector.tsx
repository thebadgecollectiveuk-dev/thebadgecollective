"use client";

import * as React from "react";
import { Check, ShoppingBag } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import type { FitmentOption } from "@/lib/products";

type FitmentSelectorProps = {
  product: { id: string; name: string; image: string };
  fitments: FitmentOption[];
};

export function FitmentSelector({ product, fitments }: FitmentSelectorProps) {
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.openCart);

  // Nothing is selected by default — the customer must choose a fitment.
  const [selected, setSelected] = React.useState<string | null>(null);
  const [added, setAdded] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  React.useEffect(() => () => clearTimeout(timer.current), []);

  const chosen = fitments.find((f) => f.priceId === selected) ?? null;
  const canAdd = chosen != null && chosen.stock > 0;

  const handleAdd = () => {
    if (!chosen || chosen.stock <= 0) return;
    addItem(
      {
        priceId: chosen.priceId,
        productId: product.id,
        name: `${product.name} (${chosen.label})`,
        image: product.image,
        unitAmount: chosen.amount,
      },
      1,
    );
    openCart();
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="label-caps mb-3 text-muted-foreground/70">
          Choose your fitment
        </p>
        <div className="grid grid-cols-2 gap-3">
          {fitments.map((f) => {
            const oos = f.stock <= 0;
            return (
              <button
                key={f.priceId}
                type="button"
                disabled={oos}
                onClick={() => setSelected(f.priceId)}
                className={cn(
                  "rounded-md border px-4 py-4 text-center transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-30",
                  selected === f.priceId
                    ? "border-chrome bg-surface text-foreground"
                    : "border-border text-muted-foreground hover:border-chrome/50",
                )}
              >
                <span className="block text-lg font-medium text-foreground">
                  {f.label}
                </span>
                <span className="block text-xs">
                  {oos ? "Out of stock" : "centre caps"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {chosen?.includes ? (
        <p className="text-sm text-muted-foreground">
          <span className="text-foreground">Includes:</span> {chosen.includes}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          Please select a fitment (56mm or 68mm) to continue.
        </p>
      )}

      <Button size="lg" onClick={handleAdd} disabled={!canAdd} aria-live="polite">
        {added ? (
          <>
            <Check />
            Added to bag
          </>
        ) : chosen ? (
          <>
            <ShoppingBag />
            Add to Bag
          </>
        ) : (
          <>
            <ShoppingBag />
            Select a fitment
          </>
        )}
      </Button>
    </div>
  );
}
