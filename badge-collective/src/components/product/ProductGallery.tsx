"use client";

import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: string[];
  name: string;
  inStock: boolean;
};

export function ProductGallery({ images, name, inStock }: ProductGalleryProps) {
  const pics = images.length > 0 ? images : ["/products/placeholder.jpg"];
  const [active, setActive] = React.useState(0);
  const current = pics[Math.min(active, pics.length - 1)];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative overflow-hidden rounded-md border border-border bg-surface">
        <span className="product-glow absolute inset-0" aria-hidden="true" />
        <div className="relative aspect-square">
          <Image
            src={current}
            alt={name}
            fill
            priority
            sizes="(min-width: 1024px) 560px, 100vw"
            className={cn("object-cover", !inStock && "opacity-50 grayscale")}
          />
        </div>
      </div>

      {pics.length > 1 ? (
        <div className="flex flex-wrap gap-3">
          {pics.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1} of ${pics.length}`}
              aria-pressed={i === active}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-sm border bg-surface transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                i === active ? "border-chrome" : "border-border hover:border-chrome/50",
              )}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
