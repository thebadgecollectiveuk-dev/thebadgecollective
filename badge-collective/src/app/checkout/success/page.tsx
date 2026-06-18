import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";

import { Container } from "@/components/site/container";
import { Eyebrow, ChromeRule } from "@/components/site/section";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

type SearchParams = { searchParams: Promise<{ session_id?: string }> };

export default async function CheckoutSuccessPage({ searchParams }: SearchParams) {
  const { session_id } = await searchParams;

  // TODO (Stripe): fetch the real order once keys are added, e.g.
  //   const session = await stripe.checkout.sessions.retrieve(session_id, {
  //     expand: ["line_items", "line_items.data.price.product"],
  //   });
  // then render the line items, totals and shipping address below.

  const reference = session_id ? session_id.slice(-8).toUpperCase() : null;

  return (
    <section className="grid min-h-[70svh] place-items-center py-20">
      <Container className="flex max-w-xl flex-col items-center text-center">
        <span className="flex size-14 items-center justify-center rounded-full border border-chrome/40 text-chrome">
          <Check className="size-6" strokeWidth={1.5} />
        </span>
        <Eyebrow className="mt-8">Thank you</Eyebrow>
        <h1 className="mt-5 font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
          Your order is confirmed
        </h1>
        <ChromeRule className="mt-7 max-w-[140px]" />
        <p className="mt-7 max-w-md text-base leading-relaxed text-muted-foreground">
          We&apos;ve received your order and a confirmation email is on its way.
          Your badges will be dispatched within two working days.
        </p>
        {reference ? (
          <p className="mt-6 text-sm text-muted-foreground">
            Order reference{" "}
            <span className="text-foreground tabular-nums">{reference}</span>
          </p>
        ) : null}
        <div className="mt-10">
          <Button asChild size="lg">
            <Link href="/shop">Continue shopping</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
