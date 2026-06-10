"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

export const CustomCursor = () => {
  const [isPointer, setIsPointer] = useState(false);
  const [visible, setVisible] = useState(false);
  const [onInteractive, setOnInteractive] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Ring — fast spring from mouseX/Y
  const ringX = useSpring(mouseX, { stiffness: 150, damping: 28 });
  const ringY = useSpring(mouseY, { stiffness: 150, damping: 28 });

  // Trailing particle t1 — chains from mouseX/Y
  const t1X = useSpring(mouseX, { stiffness: 120, damping: 24 });
  const t1Y = useSpring(mouseY, { stiffness: 120, damping: 24 });

  // Trailing particle t2 — chains from t1
  const t2X = useSpring(t1X, { stiffness: 70, damping: 20 });
  const t2Y = useSpring(t1Y, { stiffness: 70, damping: 20 });

  // Trailing particle t3 — chains from t2
  const t3X = useSpring(t2X, { stiffness: 40, damping: 18 });
  const t3Y = useSpring(t2Y, { stiffness: 40, damping: 18 });

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
      {/* Trailing particle t3 — furthest back */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none"
        style={{
          x: t3X,
          y: t3Y,
          translateX: "-50%",
          translateY: "-50%",
          width: 2,
          height: 2,
          background: "var(--accent-vivid-2)",
          zIndex: 9995,
        }}
        animate={{ opacity: visible ? 0.24 : 0 }}
        transition={{ opacity: { duration: 0.2 } }}
      />

      {/* Trailing particle t2 */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none"
        style={{
          x: t2X,
          y: t2Y,
          translateX: "-50%",
          translateY: "-50%",
          width: 3,
          height: 3,
          background: "oklch(0.64 0.23 238)",
          zIndex: 9996,
        }}
        animate={{ opacity: visible ? 0.4 : 0 }}
        transition={{ opacity: { duration: 0.2 } }}
      />

      {/* Trailing particle t1 — closest to cursor */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none"
        style={{
          x: t1X,
          y: t1Y,
          translateX: "-50%",
          translateY: "-50%",
          width: 4,
          height: 4,
          background: "var(--accent-vivid)",
          zIndex: 9997,
        }}
        animate={{ opacity: visible ? 0.58 : 0 }}
        transition={{ opacity: { duration: 0.2 } }}
      />

      {/* Ring — spring-lagged, expands over interactive elements */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          border: "1.5px solid var(--accent-vivid)",
          zIndex: 9998,
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

      {/* Dot — tracks pointer exactly */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          width: 6,
          height: 6,
          background: "var(--accent-vivid)",
          zIndex: 9999,
        }}
        animate={{ opacity: visible ? 1 : 0, scale: onInteractive ? 0.5 : 1 }}
        transition={{ opacity: { duration: 0.2 }, scale: { duration: 0.15 } }}
      />
    </>
  );
};
