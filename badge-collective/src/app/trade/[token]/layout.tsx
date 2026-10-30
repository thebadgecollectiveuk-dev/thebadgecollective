import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { isValidTradeToken } from "@/lib/trade/access";
import { TradeHeader } from "@/components/trade/TradeHeader";
import { Container } from "@/components/site/container";

// The trade area is secret: never statically built, never cached, never indexed.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trade",
  robots: { index: false, follow: false },
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ token: string }>;
};

export default async function TradeLayout({ children, params }: Props) {
  const { token } = await params;
  // Wrong or missing link → behave exactly like the public site.
  if (!isValidTradeToken(token)) redirect("/");

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <div className="relative z-10 flex min-h-dvh flex-col">
        <TradeHeader token={token} />
        <main className="flex-1">{children}</main>
        <footer className="mt-20 border-t border-border py-10">
          <Container>
            <p className="text-center text-xs text-muted-foreground/70">
              The Badge Collective — Trade. Prices are confidential and for
              registered trade customers only.
            </p>
          </Container>
        </footer>
      </div>
    </>
  );
}
