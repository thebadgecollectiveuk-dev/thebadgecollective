import type { Metadata } from "next";
import { Mail, MessageCircle } from "lucide-react";

import { SITE } from "@/lib/site";
import { Container } from "@/components/site/container";
import { Eyebrow, ChromeRule } from "@/components/site/section";
import { WhatsAppButton } from "@/components/site/whatsapp-button";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with The Badge Collective on WhatsApp or by email. Looking for a specific badge? We'll do our best to source it.",
};

type SearchParams = { searchParams: Promise<{ subject?: string }> };

export default async function ContactPage({ searchParams }: SearchParams) {
  const { subject } = await searchParams;
  const waMessage = subject
    ? `Hi Badge Collective, I'm interested in the ${subject}.`
    : "Hi Badge Collective, ";

  return (
    <div className="py-16 sm:py-24">
      <Container className="max-w-4xl">
        <header className="flex flex-col items-center gap-5 text-center">
          <Eyebrow>Contact</Eyebrow>
          <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            Get in touch
          </h1>
          <ChromeRule className="max-w-[140px]" />
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
            Looking for a specific badge we don&apos;t have listed? Message us on
            WhatsApp and we&apos;ll do our best to source it.
          </p>
        </header>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {/* WhatsApp (primary) */}
          <div className="flex flex-col rounded-md border border-chrome/30 bg-surface/60 p-8">
            <span className="flex size-11 items-center justify-center rounded-full border border-chrome/40 text-chrome">
              <MessageCircle className="size-5" strokeWidth={1.5} />
            </span>
            <h2 className="mt-6 font-serif text-2xl text-foreground">WhatsApp</h2>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
              The quickest way to reach us. Ask about a badge, request a photo,
              or place an order while online checkout is on its way.
            </p>
            <div className="mt-8">
              <WhatsAppButton message={waMessage} className="w-full sm:w-auto" />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col rounded-md border border-border bg-surface/40 p-8">
            <span className="flex size-11 items-center justify-center rounded-full border border-border text-muted-foreground">
              <Mail className="size-5" strokeWidth={1.5} />
            </span>
            <h2 className="mt-6 font-serif text-2xl text-foreground">Email</h2>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
              Prefer to write? Send us the details and we&apos;ll get back to you,
              usually within a working day.
            </p>
            <div className="mt-8">
              <a
                href={`mailto:${SITE.email}`}
                className="text-base text-foreground underline-offset-4 transition-colors duration-300 hover:text-chrome hover:underline"
              >
                {SITE.email}
              </a>
            </div>
          </div>
        </div>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          The Badge Collective ships across the {SITE.region}.
        </p>
      </Container>
    </div>
  );
}
