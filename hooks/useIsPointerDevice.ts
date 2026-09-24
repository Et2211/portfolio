"use client";
import { useSyncExternalStore } from "react";

const QUERY = "(hover: hover) and (pointer: fine)";

const subscribe = (onChange: () => void) => {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
};

const getSnapshot = () => window.matchMedia(QUERY).matches;

// Server snapshot is false so the hydration render matches the server HTML;
// React re-renders with the real value straight after hydrating.
const getServerSnapshot = () => false;

export function useIsPointerDevice() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
