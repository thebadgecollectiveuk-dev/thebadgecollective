"use client";

import * as React from "react";
import { Check, ShoppingBag } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatGBP } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import type { PackOption, CustomOption } from "@/lib/products";

type PackSelectorProps = {
  product: { id: string; name: string; image: string };
  packs: PackOption[];
  custom: CustomOption | null;
  stock: number; // total badges available
};

export function PackSelector({ product, packs, custom, stock }: PackSelectorProps) {
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.openCart);

  // A pack can only be ordered if there are enough badges in stock for it.
  const packAvailable = (p: PackOption) => p.qty <= stock;
  const customAvailable = custom != null && stock >= custom.minQty;
  const firstAvailable = packs.find(packAvailable);
  const minQty = custom?.minQty ?? 1;

  const [selected, setSelected] = React.useState<string>(
    firstAvailable?.priceId ?? (customAvailable ? "custom" : ""),
  );
  const [customQty, setCustomQty] = React.useState<number>(minQty);
  const [added, setAdded] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  React.useEffect(() => () => clearTimeout(timer.current), []);

  const isCustom = selected === "custom";
  const selectedPack = packs.find((p) => p.priceId === selected) ?? null;
  // Clamp the custom amount between its minimum and the available stock.
  const effectiveQty = Math.min(
    stock,
    Math.max(minQty, Math.floor(customQty) || minQty),
  );

  const canAdd = isCustom
    ? customAvailable
    : selectedPack != null && packAvailable(selectedPack);

  const lineTotal = isCustom
    ? custom
      ? custom.perBadge * effectiveQty
      : 0
    : selectedPack?.amount ?? 0;

  const handleAdd = () => {
    if (!canAdd) return;
    if (isCustom && custom) {
      addItem(
        {
          priceId: custom.priceId,
          productId: product.id,
          name: `${product.name} (${effectiveQty} badges)`,
          image: product.image,
          unitAmount: custom.perBadge,
        },
        effectiveQty,
      );
    } else if (selectedPack) {
      addItem(
        {
          priceId: selectedPack.priceId,
          productId: product.id,
          name: `${product.name} (${selectedPack.qty}-pack)`,
          image: product.image,
          unitAmount: selectedPack.amount,
        },
        1,
      );
    }
    openCart();
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 2000);
  };

  const optionClass = (active: boolean) =>
    cn(
      "flex flex-col items-center gap-0.5 rounded-md border px-3 py-3 text-center transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-30",
      active
        ? "border-chrome bg-surface text-foreground"
        : "border-border text-muted-foreground hover:border-chrome/50",
    );

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="label-caps mb-3 text-muted-foreground/70">Choose quantity</p>
        <div className="grid grid-cols-3 gap-2">
          {packs.map((p) => {
            const available = packAvailable(p);
            return (
              <button
                key={p.priceId}
                type="button"
                disabled={!available}
                onClick={() => setSelected(p.priceId)}
                title={available ? undefined : "Not enough stock"}
                className={optionClass(selected === p.priceId)}
              >
                <span className="text-base font-medium text-foreground">{p.qty}</span>
                <span className="text-xs tabular-nums">
                  {available ? formatGBP(p.amount) : "Out of stock"}
                </span>
              </button>
            );
          })}
          {customAvailable ? (
            <button
              type="button"
              onClick={() => setSelected("custom")}
              className={optionClass(isCustom)}
            >
              <span className="text-base font-medium text-foreground">Custom</span>
              <span className="text-xs tabular-nums">
                {formatGBP(custom!.perBadge)}/ea
              </span>
            </button>
          ) : null}
        </div>
      </div>

      {isCustom && custom ? (
        <div className="flex flex-col gap-2">
          <label htmlFor="custom-qty" className="text-sm text-muted-foreground">
            Number of badges ({custom.minQty}&ndash;{stock} available)
          </label>
          <input
            id="custom-qty"
            type="number"
            inputMode="numeric"
            min={custom.minQty}
            max={stock}
            value={customQty}
            onChange={(e) => setCustomQty(Number(e.target.value))}
            onBlur={() => setCustomQty(effectiveQty)}
            className="h-11 w-32 rounded-sm border border-input bg-transparent px-3 text-foreground tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      ) : null}

      <div className="flex items-center justify-between border-t border-border pt-4">
        <span className="text-sm text-muted-foreground">
          {isCustom ? `${effectiveQty} badges` : "Total"}
        </span>
        <span className="text-xl tabular-nums text-chrome">
          {formatGBP(lineTotal)}
        </span>
      </div>

      <Button size="lg" onClick={handleAdd} disabled={!canAdd} aria-live="polite">
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
