"use client";
import { useMemo } from "react";

export function useIsPointerDevice() {
  return useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    []
  );
}
