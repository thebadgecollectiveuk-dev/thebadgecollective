import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { stripe } from "@/lib/stripe";
import { formatGBP } from "@/lib/format";
import { Container } from "@/components/site/container";
import { ChromeRule } from "@/components/site/section";
import { PrintButton } from "@/components/trade/PrintButton";

type Props = {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ session_id?: string }>;
};

export default async function TradeSuccessPage({ params, searchParams }: Props) {
  const { token } = await params;
  const { session_id } = await searchParams;
  const basePath = `/trade/${token}`;

  let order: {
    id: string;
    business: string | null;
    name: string | null;
    email: string | null;
    phone: string | null;
    address: string[];
    lines: { name: string; qty: number; total: number }[];
    shipping: number;
    total: number;
    date: string;
  } | null = null;

  if (stripe && session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ["line_items", "customer_details"],
      });
      const d = session.customer_details;
      const addr = d?.address;
      const business =
        session.custom_fields?.find((f) => f.key === "businessname")?.text?.value ?? null;
      order = {
        id: session.id.replace(/^cs_(test|live)_/, "").slice(0, 12).toUpperCase(),
        business,
        name: d?.name ?? null,
        email: d?.email ?? null,
        phone: d?.phone ?? null,
        address: [
          addr?.line1,
          addr?.line2,
          addr?.city,
          addr?.postal_code,
          addr?.country,
        ].filter((x): x is string => Boolean(x)),
        lines: (session.line_items?.data ?? []).map((li) => ({
          name: li.description ?? "Item",
          qty: li.quantity ?? 1,
          total: li.amount_total ?? 0,
        })),
        shipping: session.total_details?.amount_shipping ?? 0,
        total: session.amount_total ?? 0,
        date: new Date((session.created ?? Date.now() / 1000) * 1000).toLocaleDateString(
          "en-GB",
          { day: "numeric", month: "long", year: "numeric" },
        ),
      };
    } catch {
      order = null;
    }
  }

  return (
    <div className="py-14 sm:py-16">
      <Container className="max-w-2xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <CheckCircle2 className="size-12 text-chrome" strokeWidth={1.25} />
          <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            Thank you — order received
          </h1>
          <p className="max-w-md text-muted-foreground">
            Your trade order is confirmed and paid. We&apos;ll dispatch it via
            Royal Mail and email your receipt. A copy of your invoice is below.
          </p>
        </div>

        {order ? (
          <div className="mt-10 rounded-md border border-border bg-surface/50 p-6 sm:p-8 print:border-0 print:bg-transparent print:p-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-serif text-xl text-foreground">The Badge Collective</p>
                <p className="text-xs text-muted-foreground">Trade invoice</p>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <p>Order {order.id}</p>
                <p>{order.date}</p>
              </div>
            </div>

            <ChromeRule className="my-6 opacity-50" />

            <div className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <p className="label-caps text-muted-foreground/70">Billed to</p>
                {order.business ? <p className="text-foreground">{order.business}</p> : null}
                {order.name ? <p className="text-muted-foreground">{order.name}</p> : null}
                {order.email ? <p className="text-muted-foreground">{order.email}</p> : null}
                {order.phone ? <p className="text-muted-foreground">{order.phone}</p> : null}
              </div>
              {order.address.length > 0 ? (
                <div>
                  <p className="label-caps text-muted-foreground/70">Ship to</p>
                  {order.address.map((l, i) => (
                    <p key={i} className="text-muted-foreground">
                      {l}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>

            <ChromeRule className="my-6 opacity-50" />

            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground/70">
                  <th className="pb-2 font-normal">Item</th>
                  <th className="pb-2 text-center font-normal">Qty</th>
                  <th className="pb-2 text-right font-normal">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.lines.map((l, i) => (
                  <tr key={i} className="border-t border-border/60">
                    <td className="py-2 text-foreground">{l.name}</td>
                    <td className="py-2 text-center tabular-nums text-muted-foreground">
                      {l.qty}
                    </td>
                    <td className="py-2 text-right tabular-nums text-foreground">
                      {formatGBP(l.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-border">
                  <td colSpan={2} className="pt-3 text-muted-foreground">
                    Shipping (Royal Mail)
                  </td>
                  <td className="pt-3 text-right tabular-nums text-foreground">
                    {order.shipping === 0 ? "Free" : formatGBP(order.shipping)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className="pt-2 text-foreground">
                    Total paid
                  </td>
                  <td className="pt-2 text-right text-base tabular-nums text-chrome">
                    {formatGBP(order.total)}
                  </td>
                </tr>
              </tfoot>
            </table>

            <div className="mt-8 print:hidden">
              <PrintButton />
            </div>
          </div>
        ) : (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            Your payment went through. If you need an invoice, message us on
            WhatsApp and we&apos;ll send one over.
          </p>
        )}

        <p className="mt-10 text-center print:hidden">
          <Link
            href={basePath}
            className="label-caps text-muted-foreground transition-colors duration-300 hover:text-chrome"
          >
            &larr; Back to trade pricing
          </Link>
        </p>
      </Container>
    </div>
  );
}
