import Link from "next/link";
import { BadgeCheck, RotateCcw, Truck } from "lucide-react";

import { getFeaturedProducts } from "@/lib/products";
import { Container } from "@/components/site/container";
import { Emblem } from "@/components/site/logo";
import { Eyebrow, ChromeRule, SectionHeading } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/product/ProductGrid";

// Refresh the featured grid from Stripe at most once a minute.
export const revalidate = 60;

const PROMISES = [
  {
    icon: BadgeCheck,
    title: "Quality Checked",
    body: "Every badge is checked and verified before it leaves us.",
  },
  {
    icon: Truck,
    title: "Free UK Shipping over £75",
    body: "Free over £75, otherwise a flat £3.65 via Royal Mail, with a 2 to 3 working day delivery aim.",
  },
  {
    icon: RotateCcw,
    title: "14-Day Returns",
    body: "Fourteen days to return an unused badge in its original condition.",
  },
];

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[calc(100svh-4.5rem)] items-center overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 grid place-items-center"
          aria-hidden="true"
        >
          <Emblem className="size-[34rem] max-w-[100vw] max-h-[100vw] opacity-[0.05]" />
        </div>

        <Container className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-chrome/30 bg-surface/50 px-4 py-1.5">
            <span className="size-1.5 animate-pulse rounded-full bg-chrome" aria-hidden="true" />
            <span className="label-caps text-chrome">More coming soon</span>
          </div>
          <Eyebrow className="text-muted-foreground">Premium. Quality. Brand New.</Eyebrow>
          <h1 className="mt-7 font-serif text-5xl font-medium leading-[1.05] tracking-tight text-chrome sm:text-7xl lg:text-8xl">
            The Badge Collective
          </h1>
          <ChromeRule className="mt-8 max-w-[180px]" />
          <p className="mt-8 max-w-xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
            Premium, brand new car badges for the enthusiast. Shipped across the
            United Kingdom.
          </p>
          <div className="mt-10">
            <Button asChild size="lg">
              <Link href="/shop">Shop the Collection</Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Featured */}
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="The Collection"
            title="Featured badges"
            intro="A small, hand-picked selection from the current collection. Each one brand new and ready to fit."
          />
          <div className="mt-16">
            <ProductGrid products={featured} />
          </div>
          <div className="mt-16 flex justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/shop">View all badges</Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Brand promise */}
      <section className="border-y border-border bg-surface/40 py-16">
        <Container>
          <ul className="grid gap-12 sm:grid-cols-3 sm:gap-8">
            {PROMISES.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex flex-col items-center gap-4 text-center">
                <span className="flex size-12 items-center justify-center rounded-full border border-chrome/30 text-chrome">
                  <Icon className="size-5" strokeWidth={1.5} />
                </span>
                <h3 className="label-caps text-foreground">{title}</h3>
                <p className="max-w-[16rem] text-sm leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* About teaser */}
      <section className="py-20 sm:py-28">
        <Container className="flex max-w-3xl flex-col items-center text-center">
          <Eyebrow>Our story</Eyebrow>
          <h2 className="mt-5 font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            Built by enthusiasts, for enthusiasts
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            We set out to do one thing well: premium, brand new car badges,
            finished to a high standard and quality checked before they ship.
            Made for people who care about the details.
          </p>
          <div className="mt-9">
            <Button asChild variant="ghost">
              <Link href="/about">
                Read more about us
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
