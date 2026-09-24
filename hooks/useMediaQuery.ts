"use client";
import { useCallback, useSyncExternalStore } from "react";

// Server snapshot is false so the hydration render matches the server HTML;
// React re-renders with the real value straight after hydrating, and again
// whenever the media query starts or stops matching.
const getServerSnapshot = () => false;

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );
  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
