import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/site/container";
import { Emblem } from "@/components/site/logo";
import { Eyebrow, ChromeRule } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/site/whatsapp-button";

export const metadata: Metadata = {
  title: "Checkout coming soon",
  robots: { index: false, follow: false },
};

export default function CheckoutComingSoonPage() {
  return (
    <section className="grid min-h-[70svh] place-items-center py-20">
      <Container className="flex max-w-xl flex-col items-center text-center">
        <Emblem className="h-14 w-14 opacity-80" />
        <Eyebrow className="mt-8">Almost there</Eyebrow>
        <h1 className="mt-5 font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
          Online checkout, launching soon
        </h1>
        <ChromeRule className="mt-7 max-w-[140px]" />
        <p className="mt-7 max-w-md text-base leading-relaxed text-muted-foreground">
          Card payments arrive shortly. In the meantime, message us on WhatsApp
          to place your order and we&apos;ll arrange it with you personally.
        </p>
        <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <WhatsAppButton
            message="Hi Badge Collective, I'd like to place an order: "
            label="Message us on WhatsApp"
          />
          <Button asChild variant="outline" size="lg">
            <Link href="/cart">Back to bag</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
