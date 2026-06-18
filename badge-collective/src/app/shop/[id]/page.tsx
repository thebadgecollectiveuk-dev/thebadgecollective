import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getProduct, getProducts } from "@/lib/products";
import { formatGBP } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Container } from "@/components/site/container";
import { ChromeRule } from "@/components/site/section";
import { AddToBag } from "@/components/product/AddToBag";
import { WhatsAppButton } from "@/components/site/whatsapp-button";

type Params = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Badge not found" };

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image, width: 1100, height: 1100 }],
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const inStock = product.stock > 0;
  const lowStock = inStock && product.stock <= 5;

  return (
    <div className="py-10 sm:py-14">
      <Container>
        <nav aria-label="Breadcrumb" className="label-caps flex items-center gap-2 text-muted-foreground/70">
          <Link href="/shop" className="transition-colors duration-300 hover:text-foreground">
            Shop
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-muted-foreground">{product.name}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Image */}
          <div className="relative overflow-hidden rounded-md border border-border bg-surface">
            <span className="product-glow absolute inset-0" aria-hidden="true" />
            <div className="relative aspect-square">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(min-width: 1024px) 560px, 100vw"
                className={cn("object-cover", !inStock && "opacity-50 grayscale")}
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <h1 className="font-serif text-3xl font-medium leading-tight tracking-tight text-foreground sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-4 text-2xl tabular-nums text-chrome">
              {formatGBP(product.unitAmount)}
            </p>

            <div className="mt-4 flex items-center gap-2 text-sm">
              <span
                className={cn(
                  "inline-block size-1.5 rounded-full",
                  inStock ? "bg-chrome" : "bg-muted-foreground/50",
                )}
                aria-hidden="true"
              />
              <span className="text-muted-foreground">
                {inStock
                  ? lowStock
                    ? `In stock, only ${product.stock} left`
                    : "In stock"
                  : "Sold out"}
              </span>
            </div>

            <ChromeRule className="my-7 opacity-60" />

            <p className="text-base leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <div className="mt-9">
              {inStock ? (
                <AddToBag
                  product={{
                    id: product.id,
                    priceId: product.priceId,
                    name: product.name,
                    image: product.image,
                    unitAmount: product.unitAmount,
                    stock: product.stock,
                  }}
                />
              ) : (
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-muted-foreground">
                    This one has sold out. We can let you know if another comes
                    in, or try to source it for you.
                  </p>
                  <WhatsAppButton
                    message={`Hi Badge Collective, do you have the ${product.name} back in stock?`}
                    label="Notify me via WhatsApp"
                  />
                </div>
              )}
            </div>

            {/* Source request */}
            <div className="mt-12 rounded-md border border-border bg-surface/50 p-6">
              <h2 className="font-serif text-lg text-foreground">
                Can&apos;t find what you&apos;re looking for?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Message us on WhatsApp and we&apos;ll do our best to source it.
              </p>
              <div className="mt-5">
                <WhatsAppButton
                  variant="outline"
                  size="default"
                  message={`Hi Badge Collective, I'm looking for a specific badge: `}
                  label="Message us on WhatsApp"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
