"use client";
import { useEffect, useState } from "react";

export function useIsPointerDevice() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    setOk(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);
  return ok;
}
