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
};

export function PackSelector({ product, packs, custom }: PackSelectorProps) {
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.openCart);

  // Selection is a pack priceId, or the literal "custom".
  const [selected, setSelected] = React.useState<string>(
    packs[0]?.priceId ?? "custom",
  );
  const [customQty, setCustomQty] = React.useState<number>(custom?.minQty ?? 1);
  const [added, setAdded] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  React.useEffect(() => () => clearTimeout(timer.current), []);

  const isCustom = selected === "custom";
  const selectedPack = packs.find((p) => p.priceId === selected) ?? null;
  const minQty = custom?.minQty ?? 1;
  const effectiveQty = Math.max(minQty, Math.floor(customQty) || minQty);

  const lineTotal = isCustom
    ? custom
      ? custom.perBadge * effectiveQty
      : 0
    : selectedPack?.amount ?? 0;

  const handleAdd = () => {
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
    } else {
      return;
    }
    openCart();
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 2000);
  };

  const optionClass = (active: boolean) =>
    cn(
      "flex flex-col items-center gap-0.5 rounded-md border px-3 py-3 text-center transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      active
        ? "border-chrome bg-surface text-foreground"
        : "border-border text-muted-foreground hover:border-chrome/50",
    );

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="label-caps mb-3 text-muted-foreground/70">Choose quantity</p>
        <div className="grid grid-cols-3 gap-2">
          {packs.map((p) => (
            <button
              key={p.priceId}
              type="button"
              onClick={() => setSelected(p.priceId)}
              className={optionClass(selected === p.priceId)}
            >
              <span className="text-base font-medium text-foreground">{p.qty}</span>
              <span className="text-xs tabular-nums">{formatGBP(p.amount)}</span>
            </button>
          ))}
          {custom ? (
            <button
              type="button"
              onClick={() => setSelected("custom")}
              className={optionClass(isCustom)}
            >
              <span className="text-base font-medium text-foreground">Custom</span>
              <span className="text-xs tabular-nums">
                {formatGBP(custom.perBadge)}/ea
              </span>
            </button>
          ) : null}
        </div>
      </div>

      {isCustom && custom ? (
        <div className="flex flex-col gap-2">
          <label htmlFor="custom-qty" className="text-sm text-muted-foreground">
            Number of badges (minimum {custom.minQty})
          </label>
          <input
            id="custom-qty"
            type="number"
            inputMode="numeric"
            min={custom.minQty}
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

      <Button size="lg" onClick={handleAdd} aria-live="polite">
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
