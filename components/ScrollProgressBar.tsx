"use client";

import { motion, useScroll } from "motion/react";

export const ScrollProgressBar = () => {
  // Direct binding — no spring, so nothing oscillates after scroll stops
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-50 origin-left"
      style={{
        scaleX: scrollYProgress,
        background:
          "linear-gradient(90deg, oklch(0.56 0.28 280) 0%, oklch(0.72 0.18 196) 60%, oklch(0.75 0.18 150) 100%)",
      }}
    />
  );
};
