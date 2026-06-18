import Link from "next/link";

import { Container } from "@/components/site/container";
import { Emblem } from "@/components/site/logo";
import { ChromeRule } from "@/components/site/section";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="grid min-h-[70svh] place-items-center py-20">
      <Container className="flex max-w-lg flex-col items-center text-center">
        <Emblem className="h-12 w-12 opacity-70" />
        <p className="mt-8 font-serif text-6xl font-medium text-chrome">404</p>
        <h1 className="mt-3 font-serif text-3xl font-medium tracking-tight text-foreground">
          This page has gone missing
        </h1>
        <ChromeRule className="mt-6 max-w-[120px]" />
        <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
          The page you were after is not here. It may have moved, or it may never
          have existed.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/">Back home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/shop">Shop the Collection</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
