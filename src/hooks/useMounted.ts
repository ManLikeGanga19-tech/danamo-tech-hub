import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * false during SSR and hydration, true afterwards — without an extra
 * setState-in-effect render. Use it to gate client-only UI (e.g. theme-aware
 * images or toggles) and avoid hydration mismatches.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
