/**
 * Trade (B2B) settings — the single source of truth. Edit values here.
 *
 * Access is one secret link: /trade/<TRADE_LINK_TOKEN>. Trade prices are tiered
 * and assigned automatically from each product's retail price (RETAIL_PRICE_TO_TIER),
 * unless a product overrides them via Stripe metadata (`trade_tier` or `trade_price`).
 */

export type TradeTier = "standard" | "mid" | "porsche" | "top";

/** Trade price (pence) and minimum number of sets for each tier. */
export const TIERS: Record<
  TradeTier,
  { label: string; pricePence: number; minSets: number }
> = {
  standard: { label: "Standard", pricePence: 600, minSets: 5 }, // retail £8.99
  mid: { label: "Mid", pricePence: 999, minSets: 5 }, // retail £11.99
  porsche: { label: "Porsche", pricePence: 1499, minSets: 5 }, // retail £29.99
  top: { label: "Top", pricePence: 5000, minSets: 2 }, // retail £64.99
};

/**
 * Exact retail price (in pence) -> tier. Any product sold at one of these retail
 * prices automatically joins the matching trade tier — no per-product setup, so
 * new products appear in trade with no code change. Prices not listed here are
 * hidden from trade (and listed for the owner to map).
 */
export const RETAIL_PRICE_TO_TIER: Record<number, TradeTier> = {
  899: "standard",
  1199: "mid",
  2999: "porsche",
  6499: "top",
};

/** WhatsApp contact for trade pre-orders / questions. */
export const WHATSAPP_PREORDER_DISPLAY = "+44 7856 077278";
export const WHATSAPP_PREORDER_DIGITS = "447856077278";
