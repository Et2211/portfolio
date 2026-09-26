"use client";
import { useMediaQuery } from "./useMediaQuery";

/** True on devices with a precise pointer that can hover (i.e. a mouse). */
export function useIsPointerDevice() {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}
