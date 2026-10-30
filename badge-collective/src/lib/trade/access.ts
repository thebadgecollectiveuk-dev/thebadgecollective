/**
 * Trade access gate — one secret link via the TRADE_LINK_TOKEN env var.
 *
 * Server-only. The token in the URL (/trade/<token>) must match TRADE_LINK_TOKEN
 * exactly. To revoke access, change TRADE_LINK_TOKEN in Vercel and redeploy.
 */
import { timingSafeEqual } from "crypto";

/** The configured trade token, or null if trade is not enabled. */
export function tradeToken(): string | null {
  const t = process.env.TRADE_LINK_TOKEN;
  return t && t.length > 0 ? t : null;
}

/** Constant-time check that a URL token matches TRADE_LINK_TOKEN. */
export function isValidTradeToken(token: string | undefined | null): boolean {
  const expected = tradeToken();
  if (!expected || !token) return false;
  const a = Buffer.from(token, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
