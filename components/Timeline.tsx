"use client";

import { useEffect, useRef, useState } from "react";

import type { TimelineItem as TimelineItemType } from "@/types/generated/sanity";

import { TimelineItem } from "./TimelineItem";

type TimelineItemWithBuiltUrl = Omit<TimelineItemType, "image"> & {
  image?: string | null;
};

interface TimelineProps {
  items: TimelineItemWithBuiltUrl[];
}

export const Timeline = ({ items }: TimelineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fillPercent, setFillPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;

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

  if (!items || items.length === 0) return null;

  return (
    <div ref={containerRef} className="relative">
      {/* Track line — left on mobile, centre on desktop */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-1/2 bg-zinc-200 dark:bg-zinc-800" />
      {/* Fill line — gradient accent matches the rest of the visual system */}
      <div
        className="absolute left-4 md:left-1/2 top-0 w-[2px] md:-translate-x-1/2 transition-none origin-top"
        style={{
          height: `${fillPercent * 100}%`,
          background: "linear-gradient(to bottom, var(--accent-vivid), var(--accent-vivid-2))",
        }}
      />

      <div className="space-y-0">
        {items.map((item, idx) => (
          <TimelineItem
            key={(item as { _key?: string })._key ?? idx}
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
