"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useCart, type CartItem } from "@/lib/cart-store";
import { formatGBP } from "@/lib/format";
import { QuantityStepper } from "./quantity-stepper";

type CartLineItemProps = {
  item: CartItem;
  onNavigate?: () => void;
  className?: string;
};

export function CartLineItem({ item, onNavigate, className }: CartLineItemProps) {
  const increment = useCart((s) => s.increment);
  const decrement = useCart((s) => s.decrement);
  const removeItem = useCart((s) => s.removeItem);

  return (
    <div className={cn("flex gap-4", className)}>
      <Link
        href={`/shop/${item.productId}`}
        onClick={onNavigate}
        className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-border bg-surface"
      >
        <span className="product-glow absolute inset-0" aria-hidden="true" />
        <Image
          src={item.image}
          alt={item.name}
          width={80}
          height={80}
          sizes="80px"
          className="relative h-full w-full object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/shop/${item.productId}`}
            onClick={onNavigate}
            className="font-serif text-base leading-tight text-foreground transition-colors duration-300 hover:text-chrome"
          >
            {item.name}
          </Link>
          <button
            type="button"
            onClick={() => removeItem(item.productId)}
            aria-label={`Remove ${item.name} from bag`}
            className="-mr-1 -mt-1 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-sm text-muted-foreground/70 transition-colors duration-300 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-4" />
          </button>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">{formatGBP(item.unitAmount)}</p>

        <div className="mt-auto flex items-center justify-between pt-3">
          <QuantityStepper
            size="sm"
            value={item.quantity}
            onIncrement={() => increment(item.productId)}
            onDecrement={() => decrement(item.productId)}
            label={`Quantity for ${item.name}`}
          />
          <p className="text-sm tabular-nums text-foreground">
            {formatGBP(item.unitAmount * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
}
