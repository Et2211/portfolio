"use client";

import { motion, useMotionValue } from "motion/react";
import { useEffect, useRef } from "react";

import type { TimelineBlock } from "@/types/blocks";

import { TimelineItem } from "./TimelineItem";

type TimelineProps = Pick<TimelineBlock, "items">;

export const Timeline = ({ items = [] }: TimelineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // 0–1 scroll progress through the timeline. A MotionValue rather than
  // state, so scrolling doesn't re-render the timeline or its items.
  const fill = useMotionValue(0);

  useEffect(() => {
    const update = () => {
      const el = containerRef.current;
      if (!el) {
        return;
      }
      const { top, height } = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      // Start filling when the top of the timeline enters the viewport,
      // finish when the bottom reaches the middle of the screen.
      const progress = (windowH * 0.6 - top) / (height - windowH * 0.4);
      fill.set(Math.min(1, Math.max(0, progress)));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [fill]);

  if (!items.length) {
    return null;
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Track line — left on mobile, centre on desktop */}
      <div className="absolute top-0 bottom-0 left-4 w-px bg-zinc-200 md:left-1/2 md:-translate-x-1/2 dark:bg-zinc-800" />
      {/* Fill line, scaled from the top (no layout work while scrolling) */}
      <motion.div
        className="absolute top-0 bottom-0 left-4 w-[2px] origin-top bg-linear-to-b from-accent-vivid to-accent-vivid-2 md:left-1/2 md:-translate-x-1/2"
        style={{ scaleY: fill }}
      />

      <div>
        {items.map((item, idx) => (
          <TimelineItem
            key={item._key ?? idx}
            item={item}
            index={idx}
            containerRef={containerRef}
            fill={fill}
          />
        ))}
      </div>
    </div>
  );
};
