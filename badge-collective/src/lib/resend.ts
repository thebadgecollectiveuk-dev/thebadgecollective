/**
 * Resend email client + order emails.
 *
 * Optional: if RESEND_API_KEY is absent the helpers below are no-ops, so the
 * webhook still succeeds without email configured. When set, two emails go out
 * on a completed checkout: a confirmation to the customer and a notification to
 * ORDER_NOTIFICATION_EMAIL.
 *
 * Server-only.
 */
import { Resend } from "resend";

import { SITE } from "./site";
import { formatGBP } from "./format";

const apiKey = process.env.RESEND_API_KEY;

/** True once a Resend API key is configured. */
export const isResendEnabled = Boolean(apiKey);

const resend = apiKey ? new Resend(apiKey) : null;

// Replace with a verified sending address on your domain once Resend is set up.
const FROM = `${SITE.name} <orders@${SITE.domain}>`;

export type OrderLine = {
  name: string;
  quantity: number;
  /** Line total in pence (unit amount * quantity). */
  amount: number;
};

export type OrderEmail = {
  customerEmail: string | null;
  reference: string;
  lines: OrderLine[];
  /** Grand total in pence, including shipping. */
  total: number;
  shippingAddress?: string | null;
};

function renderLines(lines: OrderLine[]): string {
  return lines
    .map(
      (l) =>
        `<tr><td style="padding:4px 12px 4px 0">${l.quantity} &times; ${l.name}</td>` +
        `<td style="padding:4px 0;text-align:right">${formatGBP(l.amount)}</td></tr>`,
    )
    .join("");
}

function orderHtml(order: OrderEmail): string {
  return `
    <div style="font-family:system-ui,sans-serif;max-width:520px;color:#111">
      <h2 style="font-weight:500">Order ${order.reference}</h2>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        ${renderLines(order.lines)}
        <tr><td style="padding-top:12px;border-top:1px solid #ddd">Total</td>
        <td style="padding-top:12px;border-top:1px solid #ddd;text-align:right">${formatGBP(order.total)}</td></tr>
      </table>
      ${order.shippingAddress ? `<p style="color:#555">Shipping to:<br>${order.shippingAddress}</p>` : ""}
    </div>`;
}

/** Send the customer confirmation and the internal order notification. */
export async function sendOrderEmails(order: OrderEmail): Promise<void> {
  if (!resend) return; // Resend not configured — silently skip.

  const notifyTo = process.env.ORDER_NOTIFICATION_EMAIL ?? SITE.email;
  const html = orderHtml(order);

  // Internal notification (always, if we have a destination).
  await resend.emails.send({
    from: FROM,
    to: notifyTo,
    subject: `New order ${order.reference}`,
    html,
  });

  // Customer confirmation (only when Stripe gave us their email).
  if (order.customerEmail) {
    await resend.emails.send({
      from: FROM,
      to: order.customerEmail,
      subject: `Your ${SITE.name} order is confirmed`,
      html:
        `<p>Thank you for your order. Your badges will be dispatched within two working days.</p>` +
        html,
    });
  }
}
