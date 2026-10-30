"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Trade cart — completely separate from the retail cart so trade prices never
 * leak onto the retail site. Prices stored here are for DISPLAY only; the trade
 * checkout always recomputes them on the server.
 */
export type TradeCartItem = {
  productId: string;
  priceId: string;
  name: string;
  image: string;
  tradePricePence: number;
  tier: string;
  stock: number;
  quantity: number;
};

type TradeCartState = {
  items: TradeCartItem[];
  add: (item: Omit<TradeCartItem, "quantity">, qty?: number) => void;
  remove: (priceId: string) => void;
  setQuantity: (priceId: string, qty: number) => void;
  clear: () => void;
};

const clampToStock = (qty: number, stock: number) =>
  Math.max(1, Math.min(stock, Math.round(qty)));

export const useTradeCart = create<TradeCartState>()(
  persist(
    (set) => ({
      items: [],
      add: (item, qty = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.priceId === item.priceId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.priceId === item.priceId
                  ? { ...i, quantity: clampToStock(i.quantity + qty, item.stock) }
                  : i,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { ...item, quantity: clampToStock(qty, item.stock) },
            ],
          };
        }),
      remove: (priceId) =>
        set((state) => ({ items: state.items.filter((i) => i.priceId !== priceId) })),
      setQuantity: (priceId, qty) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.priceId === priceId
                ? { ...i, quantity: clampToStock(qty, i.stock) }
                : i,
            )
            .filter((i) => i.quantity > 0),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "tbc-trade-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export const selectTradeCount = (s: TradeCartState) =>
  s.items.reduce((t, i) => t + i.quantity, 0);

export const selectTradeSubtotal = (s: TradeCartState) =>
  s.items.reduce((t, i) => t + i.tradePricePence * i.quantity, 0);
