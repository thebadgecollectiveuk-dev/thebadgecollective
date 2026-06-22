import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/site/container";
import { Eyebrow, ChromeRule } from "@/components/site/section";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description:
    "The Badge Collective offers premium, brand new car badges for enthusiasts across the UK.",
};

export default function AboutPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container className="max-w-2xl">
        <header className="flex flex-col gap-5">
          <Eyebrow>Our story</Eyebrow>
          <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            About The Badge Collective
          </h1>
          <ChromeRule className="max-w-[120px] [background-image:linear-gradient(90deg,rgba(232,232,232,0.85),transparent)]" />
        </header>

        {/*
          {{ABOUT_PLACEHOLDER}}
          Owner: replace the three paragraphs below with your own story.
          Brand voice: premium, restrained, enthusiast-focused. No em dashes.
        */}
        <div className="mt-10 flex flex-col gap-6 text-base leading-relaxed text-muted-foreground">
          <p>
            The Badge Collective began with a simple goal: premium, brand new car
            badges, done properly. We were tired of poor-quality emblems and
            wanted badges that look and fit exactly as they should, straight out
            of the packet.
          </p>
          <p>
            Today we offer that quality to other enthusiasts. Every badge is brand
            new, quality checked, and photographed honestly so you know exactly
            what you are buying. No surprises, no compromises.
          </p>
          <p>
            We are a small operation, and we like it that way. It means we can
            answer your questions, help you find the right badge, and stand behind
            everything we sell. If you cannot find what you are looking for, send
            us a message. There is a good chance we can help.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/shop">Shop the Collection</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Get in touch</Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
