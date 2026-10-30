"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Wraps the page in the retail chrome (announcement bar, header, footer, cart
 * drawer) on every route EXCEPT the self-contained trade area under `/trade`,
 * which brings its own layout. Retail output is byte-for-byte identical to
 * before; only `/trade` pages are given a clean slate.
 */
export function SiteChrome({
  announcement,
  header,
  footer,
  cartDrawer,
  children,
}: {
  announcement: ReactNode;
  header: ReactNode;
  footer: ReactNode;
  cartDrawer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isTrade = pathname?.startsWith("/trade") ?? false;

  if (isTrade) return <>{children}</>;

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <div className="relative z-10 flex min-h-dvh flex-col">
        {announcement}
        {header}
        <main className="flex-1">{children}</main>
        {footer}
      </div>
      {cartDrawer}
    </>
  );
}
