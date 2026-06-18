import * as React from "react";

import { Container } from "@/components/site/container";
import { ChromeRule } from "@/components/site/section";

type LegalPageProps = {
  title: string;
  updated: string;
  children: React.ReactNode;
};

/** Shared layout + typography for the plain-text legal pages. */
export function LegalPage({ title, updated, children }: LegalPageProps) {
  return (
    <div className="py-16 sm:py-24">
      <Container className="max-w-2xl">
        <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">Last updated: {updated}</p>
        <ChromeRule className="my-8 max-w-[120px] [background-image:linear-gradient(90deg,rgba(232,232,232,0.85),transparent)]" />
        <div className="flex flex-col gap-5 text-base leading-relaxed text-muted-foreground [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-chrome [&_h2]:mt-6 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-medium [&_h2]:text-foreground [&_li]:marker:text-muted-foreground/50 [&_strong]:font-medium [&_strong]:text-foreground [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5">
          {children}
        </div>
      </Container>
    </div>
  );
}
