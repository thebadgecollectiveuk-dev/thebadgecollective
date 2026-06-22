import Link from "next/link";

import { Container } from "@/components/site/container";
import { Logo } from "@/components/site/logo";

const EXPLORE = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const LEGAL = [
  { href: "/shipping-returns", label: "Shipping & Returns" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
];

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-border">
      <div className="chrome-rule absolute inset-x-0 top-0 opacity-40" aria-hidden="true" />
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-5">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Premium, brand new car badges for the enthusiast. Shipped with
              care across the United Kingdom.
            </p>
          </div>

          {/* Explore */}
          <div className="flex flex-col gap-4">
            <p className="label-caps text-muted-foreground/70">Explore</p>
            <ul className="flex flex-col gap-3">
              {EXPLORE.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-foreground/90 transition-colors duration-300 hover:text-chrome"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <p className="label-caps text-muted-foreground/70">Contact</p>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <a
                  href="mailto:thebadgecollectiveuk@gmail.com"
                  className="text-foreground/90 transition-colors duration-300 hover:text-chrome"
                >
                  thebadgecollectiveuk@gmail.com
                </a>
              </li>
              <li className="text-muted-foreground">United Kingdom</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse items-start justify-between gap-6 border-t border-border pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            © 2026 The Badge Collective. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-xs text-muted-foreground transition-colors duration-300 hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
