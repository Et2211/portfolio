"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

export const CustomCursor = () => {
  const [isPointer, setIsPointer] = useState(false);
  const [visible, setVisible] = useState(false);
  const [onInteractive, setOnInteractive] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Ring lags behind the cursor with a spring
  const ringX = useSpring(mouseX, { stiffness: 150, damping: 28 });
  const ringY = useSpring(mouseY, { stiffness: 150, damping: 28 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setIsPointer(true);

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
    <>
      {/* Dot — tracks pointer exactly */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          width: 6,
          height: 6,
          background: "var(--accent-vivid)",
        }}
        animate={{ opacity: visible ? 1 : 0, scale: onInteractive ? 0.5 : 1 }}
        transition={{ opacity: { duration: 0.2 }, scale: { duration: 0.15 } }}
      />
      {/* Ring — spring-lagged, expands over interactive elements */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998]"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          border: "1.5px solid var(--accent-vivid)",
        }}
        animate={{
          width: onInteractive ? 44 : 28,
          height: onInteractive ? 44 : 28,
          opacity: visible ? (onInteractive ? 0.5 : 0.65) : 0,
        }}
        transition={{
          width: { type: "spring", stiffness: 200, damping: 25 },
          height: { type: "spring", stiffness: 200, damping: 25 },
          opacity: { duration: 0.2 },
        }}
      />
    </>
  );
};
