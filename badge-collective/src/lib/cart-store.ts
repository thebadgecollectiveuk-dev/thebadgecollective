"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
  priceId: string;
  productId: string;
  name: string;
  image: string;
  unitAmount: number; // pence
  quantity: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (priceId: string) => void;
  setQuantity: (priceId: string, quantity: number) => void;
  increment: (priceId: string) => void;
  decrement: (priceId: string) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  setOpen: (open: boolean) => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,

      // Items are keyed by priceId, so different packs of the same product
      // (e.g. a 5-pack and a 10-pack) are tracked as separate lines.
      addItem: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.priceId === item.priceId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.priceId === item.priceId
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity }] };
        }),

      removeItem: (priceId) =>
        set((state) => ({
          items: state.items.filter((i) => i.priceId !== priceId),
        })),

      setQuantity: (priceId, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.priceId === priceId
                ? { ...i, quantity: Math.max(1, Math.round(quantity)) }
                : i,
            )
            .filter((i) => i.quantity > 0),
        })),

      increment: (priceId) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.priceId === priceId ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        })),

      decrement: (priceId) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.priceId === priceId ? { ...i, quantity: i.quantity - 1 } : i,
            )
            .filter((i) => i.quantity > 0),
        })),

      clear: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      setOpen: (open) => set({ isOpen: open }),
    }),
    {
      name: "tbc-cart",
      storage: createJSONStorage(() => localStorage),
      // Only the cart contents survive a refresh, not the drawer open state.
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

/** Total number of items (sum of quantities). */
export const selectCount = (state: CartState) =>
  state.items.reduce((total, item) => total + item.quantity, 0);

/** Subtotal in pence. */
export const selectSubtotal = (state: CartState) =>
  state.items.reduce((total, item) => total + item.unitAmount * item.quantity, 0);
