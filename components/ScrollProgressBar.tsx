"use client";

import { motion, useScroll } from "motion/react";

export const ScrollProgressBar = () => {
  // Direct binding — no spring, so nothing oscillates after scroll stops
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 right-0 left-0 z-50 h-[3px] origin-left"
      style={{
        scaleX: scrollYProgress,
        background:
          "linear-gradient(90deg, var(--accent-vivid) 0%, var(--accent-vivid-2) 60%, oklch(0.75 0.18 150) 100%)",
      }}
    />
  );
};
