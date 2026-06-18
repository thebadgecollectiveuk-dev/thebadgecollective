"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Returns false during SSR and the first client render, then true once
 * hydrated. SSR-safe (no setState-in-effect), used to gate UI that depends
 * on the persisted client cart so server and client markup match.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
