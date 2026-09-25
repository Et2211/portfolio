"use client";

import { useEffect, useRef, useState } from "react";

import type { TimelineItemData } from "@/types/blocks";

import { TimelineItem } from "./TimelineItem";

interface TimelineProps {
  items: TimelineItemData[];
}

export const Timeline = ({ items }: TimelineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fillPercent, setFillPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) {
        return;
      }

      const { top, height } = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      // Start filling when the top of the timeline enters the viewport,
      // finish when the bottom reaches the middle of the screen.
      const progress = (windowH * 0.6 - top) / (height - windowH * 0.4);
      setFillPercent(Math.min(1, Math.max(0, progress)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Track line — left on mobile, centre on desktop */}
      <div className="absolute top-0 bottom-0 left-4 w-px bg-zinc-200 md:left-1/2 md:-translate-x-1/2 dark:bg-zinc-800" />
      {/* Fill line — gradient accent matches the rest of the visual system */}
      <div
        className="absolute top-0 left-4 w-[2px] origin-top transition-none md:left-1/2 md:-translate-x-1/2"
        style={{
          height: `${fillPercent * 100}%`,
          background:
            "linear-gradient(to bottom, var(--accent-vivid), var(--accent-vivid-2))",
        }}
      />

      <div className="space-y-0">
        {items.map((item, idx) => (
          <TimelineItem
            key={item._key ?? idx}
            item={item}
            index={idx}
            containerRef={containerRef}
            fillPercent={fillPercent}
          />
        ))}
      </div>
    </div>
  );
};
