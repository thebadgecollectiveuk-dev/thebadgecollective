/**
 * Trade pricing — server-only. Works out a product's trade price + tier minimum.
 *
 * Priority (highest first):
 *   1. Stripe metadata `trade_price` (pence) override.
 *   2. Stripe metadata `trade_tier`.
 *   3. Automatic: exact retail price mapped in RETAIL_PRICE_TO_TIER.
 * If nothing resolves, the product is NOT trade-eligible (hidden from trade).
 * Only "single" products are eligible in v1 (packs/fitment are excluded).
 */
import type { Product } from "@/lib/products";
import { TIERS, RETAIL_PRICE_TO_TIER, type TradeTier } from "./config";

export type TradeInfo = {
  eligible: boolean;
  tier: TradeTier | null; // grouping key for the per-tier minimum
  tradePricePence: number | null;
  minSets: number | null;
};

const NOT_ELIGIBLE: TradeInfo = {
  eligible: false,
  tier: null,
  tradePricePence: null,
  minSets: null,
};

function resolveTier(product: Product): TradeTier | null {
  const meta = (product.tradeTier ?? "").toLowerCase();
  if (meta && meta in TIERS) return meta as TradeTier;
  return RETAIL_PRICE_TO_TIER[product.unitAmount] ?? null;
}

export function tradeInfoFor(product: Product): TradeInfo {
  if (product.pricingMode && product.pricingMode !== "single") return NOT_ELIGIBLE;

  const tier = resolveTier(product);

  // A `trade_price` override makes the product eligible; use the tier (or the
  // standard tier as a fallback) only to decide the minimum.
  if (product.tradePriceMeta && product.tradePriceMeta > 0) {
    const t: TradeTier = tier ?? "standard";
    return {
      eligible: true,
      tier: t,
      tradePricePence: product.tradePriceMeta,
      minSets: TIERS[t].minSets,
    };
  }

  if (tier) {
    return {
      eligible: true,
      tier,
      tradePricePence: TIERS[tier].pricePence,
      minSets: TIERS[tier].minSets,
    };
  }

  return NOT_ELIGIBLE;
}
