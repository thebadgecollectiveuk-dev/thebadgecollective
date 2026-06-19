import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";

import { Container } from "@/components/site/container";
import { Eyebrow, ChromeRule } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { stripe } from "@/lib/stripe";
import { formatGBP } from "@/lib/format";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

type SearchParams = { searchParams: Promise<{ session_id?: string }> };

type OrderSummary = {
  lines: { name: string; quantity: number; amount: number }[];
  total: number;
};

async function getOrderSummary(sessionId: string): Promise<OrderSummary | null> {
  if (!stripe) return null;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });
    const lines =
      session.line_items?.data.map((item) => ({
        name: item.description ?? "Badge",
        quantity: item.quantity ?? 1,
        amount: item.amount_total ?? 0,
      })) ?? [];
    return { lines, total: session.amount_total ?? 0 };
  } catch {
    return null;
  }
}

export default async function CheckoutSuccessPage({ searchParams }: SearchParams) {
  const { session_id } = await searchParams;

  const reference = session_id ? session_id.slice(-8).toUpperCase() : null;
  const order = session_id ? await getOrderSummary(session_id) : null;

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
        {order && order.lines.length > 0 ? (
          <div className="mt-8 w-full max-w-sm border-t border-chrome/20 pt-6 text-left">
            <ul className="space-y-2">
              {order.lines.map((line, i) => (
                <li
                  key={i}
                  className="flex justify-between text-sm text-muted-foreground"
                >
                  <span>
                    {line.quantity} &times; {line.name}
                  </span>
                  <span className="tabular-nums text-foreground">
                    {formatGBP(line.amount)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-chrome/20 pt-4 text-sm font-medium">
              <span className="text-foreground">Total</span>
              <span className="tabular-nums text-foreground">
                {formatGBP(order.total)}
              </span>
            </div>
          </div>
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
