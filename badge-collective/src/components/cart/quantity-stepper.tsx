"use client";

import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

type QuantityStepperProps = {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
  size?: "sm" | "default";
  label?: string;
  className?: string;
};

export function QuantityStepper({
  value,
  onIncrement,
  onDecrement,
  min = 1,
  max,
  size = "default",
  label = "Quantity",
  className,
}: QuantityStepperProps) {
  const atMin = value <= min;
  const atMax = max != null && value >= max;
  const dim = size === "sm" ? "h-9 w-9" : "h-11 w-11";

  const btn =
    "inline-flex items-center justify-center cursor-pointer text-muted-foreground transition-colors duration-300 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset disabled:pointer-events-none disabled:opacity-30";

  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "inline-flex items-center rounded-sm border border-input",
        className,
      )}
    >
      <button
        type="button"
        onClick={onDecrement}
        disabled={atMin}
        aria-label="Decrease quantity"
        className={cn(btn, dim)}
      >
        <Minus className="size-4" />
      </button>
      <span
        aria-live="polite"
        className={cn(
          "min-w-9 select-none text-center text-sm tabular-nums text-foreground",
          size === "sm" && "min-w-7",
        )}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        disabled={atMax}
        aria-label="Increase quantity"
        className={cn(btn, dim)}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
