"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useMemo, useState } from "react";

export const CustomCursor = () => {
  const isPointer = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches,
    []
  );
  const [visible, setVisible] = useState(false);
  const [onInteractive, setOnInteractive] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const orbX = useSpring(mouseX, { stiffness: 200, damping: 28 });
  const orbY = useSpring(mouseY, { stiffness: 200, damping: 28 });

  useEffect(() => {
    if (!isPointer) return;

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setVisible(true);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const onOver = (e: PointerEvent) => {
      const el = e.target as HTMLElement;
      setOnInteractive(!!el.closest("a, button, [role='button'], [tabindex]"));
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("pointerover", onOver);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("pointerover", onOver);
    };
  }, [mouseX, mouseY]);

  if (!isPointer) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none"
      style={{
        x: orbX,
        y: orbY,
        translateX: "-50%",
        translateY: "-50%",
        background: "var(--accent-vivid)",
        filter: "blur(20px)",
        zIndex: 9999,
      }}
      animate={{
        width: onInteractive ? 40 : 90,
        height: onInteractive ? 40 : 90,
        opacity: visible ? (onInteractive ? 0.35 : 0.65) : 0,
      }}
      transition={{
        width: { type: "spring", stiffness: 120, damping: 20 },
        height: { type: "spring", stiffness: 120, damping: 20 },
        opacity: { duration: 0.4 },
      }}
    />
  );
};
