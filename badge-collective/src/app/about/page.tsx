import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/site/container";
import { Eyebrow, ChromeRule } from "@/components/site/section";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description:
    "The Badge Collective sources, restores and collects authentic car badges for enthusiasts across the UK.",
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
            The Badge Collective began with a simple frustration. The right badge
            is hard to find, and harder to find in the condition it deserves. We
            spent years tracking down emblems for our own cars, learning which
            were authentic, which had been reproduced, and which were worth the
            effort to restore.
          </p>
          <p>
            Today we do that work for other enthusiasts. Every badge is sourced
            with care, cleaned and checked, and photographed honestly so you know
            exactly what you are buying. Some are original survivors. Others are
            restored to a standard that suits a careful build. We tell you which
            is which.
          </p>
          <p>
            We are a small operation, and we like it that way. It means we can
            answer your questions, hunt down a marque you have been chasing, and
            stand behind everything we sell. If you cannot find what you are
            looking for, send us a message. There is a good chance we can help.
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
