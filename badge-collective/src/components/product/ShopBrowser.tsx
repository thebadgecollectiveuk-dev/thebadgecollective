"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { BRANDS } from "@/lib/brands";
import type { Product } from "@/lib/products";
import { ProductGrid } from "@/components/product/ProductGrid";

export function ShopBrowser({ products }: { products: Product[] }) {
  const active = useSearchParams().get("brand") ?? "all";
  const filtered =
    active === "all" ? products : products.filter((p) => p.brand === active);

  const chips = [{ slug: "all", label: "All" }, ...BRANDS];

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        {chips.map((c) => {
          const isActive = c.slug === active;
          const href = c.slug === "all" ? "/shop" : `/shop?brand=${c.slug}`;
          return (
            <Link
              key={c.slug}
              href={href}
              scroll={false}
              className={cn(
                "label-caps rounded-full border px-4 py-2 transition-colors duration-200",
                isActive
                  ? "border-chrome bg-surface text-foreground"
                  : "border-border text-muted-foreground hover:border-chrome/50 hover:text-foreground",
              )}
            >
              {c.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-12">
        {filtered.length > 0 ? (
          <ProductGrid products={filtered} priorityCount={3} />
        ) : (
          <p className="py-16 text-center text-muted-foreground">
            No badges in this category yet.
          </p>
        )}
      </div>
    </div>
  );
}
