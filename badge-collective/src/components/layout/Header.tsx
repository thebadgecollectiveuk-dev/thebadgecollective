"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag } from "lucide-react";

import { cn } from "@/lib/utils";
import { useCart, selectCount } from "@/lib/cart-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { Logo } from "@/components/site/logo";
import { Container } from "@/components/site/container";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const mounted = useHydrated();
  const count = useCart(selectCount);
  const openCart = useCart((s) => s.openCart);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50">
      <div
        className={cn(
          "relative backdrop-blur-md transition-colors duration-500",
          scrolled ? "bg-background/85" : "bg-background/55",
        )}
      >
        <Container>
          <div className="relative grid h-16 grid-cols-[auto_1fr_auto] items-center sm:h-[4.5rem]">
            {/* Left: mobile menu + logo */}
            <div className="flex items-center gap-1">
              <Sheet>
                <SheetTrigger
                  aria-label="Open menu"
                  className="-ml-2 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-sm text-muted-foreground transition-colors duration-300 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
                >
                  <Menu className="size-5" />
                </SheetTrigger>
                <SheetContent side="left" className="max-w-[18rem]">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col px-2 py-4">
                    {NAV.map((item) => (
                      <SheetClose asChild key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "rounded-sm px-4 py-3 font-serif text-2xl tracking-tight transition-colors duration-300",
                            isActive(item.href)
                              ? "text-chrome"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          {item.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>

              <Logo className="max-md:absolute max-md:left-1/2 max-md:top-1/2 max-md:-translate-x-1/2 max-md:-translate-y-1/2" />
            </div>

            {/* Centre: nav */}
            <nav className="hidden items-center justify-center gap-10 md:flex">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "label-caps relative py-1 transition-colors duration-300",
                    isActive(item.href)
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                  {isActive(item.href) ? (
                    <span className="chrome-fill absolute inset-x-0 -bottom-0.5 h-px" />
                  ) : null}
                </Link>
              ))}
            </nav>

            {/* Right: bag */}
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={openCart}
                aria-label={
                  mounted && count > 0
                    ? `Open bag, ${count} item${count === 1 ? "" : "s"}`
                    : "Open bag"
                }
                className="relative inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-sm text-foreground transition-colors duration-300 hover:text-chrome focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ShoppingBag className="size-5" strokeWidth={1.5} />
                {mounted && count > 0 ? (
                  <span className="chrome-fill absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[0.625rem] font-semibold text-[#0a0a0a]">
                    {count}
                  </span>
                ) : null}
              </button>
            </div>
          </div>
        </Container>

        {/* Thin chrome hairline at the bottom of the header */}
        <div className="chrome-rule absolute inset-x-0 bottom-0 opacity-70" aria-hidden="true" />
      </div>
    </header>
  );
}
