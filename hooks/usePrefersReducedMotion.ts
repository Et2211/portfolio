"use client";
import { useMediaQuery } from "./useMediaQuery";

/**
 * Hydration-safe replacement for motion's `useReducedMotion`, which reads
 * matchMedia on the first client render and so can disagree with the server.
 */
export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
