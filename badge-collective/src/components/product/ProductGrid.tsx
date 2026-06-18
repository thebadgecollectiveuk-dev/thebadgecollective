import { cn } from "@/lib/utils";
import type { Product } from "@/lib/products";
import { ProductCard } from "./ProductCard";

type ProductGridProps = {
  products: Product[];
  className?: string;
  priorityCount?: number;
};

export function ProductGrid({
  products,
  className,
  priorityCount = 0,
}: ProductGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index < priorityCount}
        />
      ))}
    </div>
  );
}
