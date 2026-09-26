"use client";

import { PortableText } from "@portabletext/react";
import { type MotionValue, useMotionValueEvent } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { RichText } from "@/components/atoms/RichText";
import { useInView } from "@/hooks/useInView";
import { useIsPointerDevice } from "@/hooks/useIsPointerDevice";
import { formatDate } from "@/lib/utils";
import type { TimelineItemData } from "@/types/blocks";

interface TimelineItemProps {
  item: TimelineItemData;
  index: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** 0–1 fill progress of the timeline line. */
  fill: MotionValue<number>;
}

export const TimelineItem = ({
  item,
  index,
  containerRef,
  fill,
}: TimelineItemProps) => {
  const isLeft = index % 2 === 0;
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const dotRef = useRef<HTMLDivElement>(null);
  // Where this item's dot sits along the timeline, as a 0–1 fraction.
  const dotThreshold = useRef(1);
  const [isFilled, setIsFilled] = useState(false);
  const [cardHovered, setCardHovered] = useState(false);
  const isPointer = useIsPointerDevice();

  // Re-measure whenever the timeline's size changes (resize, images loading).
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const measure = () => {
      const dot = dotRef.current;
      if (!dot) {
        return;
      }
      const dotRect = dot.getBoundingClientRect();
      const dotMid =
        dotRect.top +
        dotRect.height / 2 -
        container.getBoundingClientRect().top;
      dotThreshold.current = dotMid / container.offsetHeight;
      setIsFilled(fill.get() >= dotThreshold.current);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef, fill]);

  // Only re-renders when the fill crosses this dot, not on every scroll.
  useMotionValueEvent(fill, "change", (progress) =>
    setIsFilled(progress >= dotThreshold.current),
  );

  const startDate = item.startDate ? formatDate(item.startDate) : "";
  const endDate = item.finishDate ? formatDate(item.finishDate) : "Present";
  const dateRange = startDate ? `${startDate} – ${endDate}` : "";

  const dotGlowStyle =
    isFilled && cardHovered && isPointer
      ? {
          boxShadow: `0 0 10px 3px color-mix(in oklch, var(--accent-vivid) 50%, transparent)`,
        }
      : undefined;

  // One card, placed by the grid: [dot | card] on mobile,
  // [card | dot | empty] or [empty | dot | card] alternating on desktop.
  return (
    // Hidden-until-in-view styles live in globals.css (.timeline-item) behind
    // `scripting: enabled`, so the cards are visible without JavaScript.
    <div
      ref={ref}
      data-in-view={isInView || undefined}
      className="timeline-item grid grid-cols-[2rem_1fr] items-start py-8 md:grid-cols-[1fr_4rem_1fr]"
    >
      <div className="col-start-1 row-start-1 flex justify-center md:col-start-2">
        <div
          ref={dotRef}
          className={`timeline-dot h-4 w-4 rounded-full border-2 border-zinc-900 transition-all duration-300 dark:border-white ${
            isFilled ? "bg-zinc-900 dark:bg-white" : "bg-white dark:bg-zinc-900"
          }`}
          style={dotGlowStyle}
        />
      </div>

      <div
        data-side={isLeft ? "left" : "right"}
        className={`timeline-card col-start-2 row-start-1 w-full transition-all duration-700 ease-out ${
          isLeft ? "md:col-start-1" : "md:col-start-3"
        }`}
      >
        {/* Hover is also tracked in JS because it lights up the dot. */}
        <div
          className={`group surface-card p-6 transition-shadow duration-300 hover:shadow-glow-md ${isLeft ? "md:text-right" : "md:text-left"}`}
          onMouseEnter={() => isPointer && setCardHovered(true)}
          onMouseLeave={() => isPointer && setCardHovered(false)}
        >
          <h3 className="mb-1 text-lg font-semibold transition-colors duration-300 group-hover:text-accent-vivid">
            {item.title}
          </h3>
          {dateRange && (
            <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">
              {dateRange}
            </p>
          )}
          {item.image && (
            <div className={`mb-4 ${isLeft ? "md:flex md:justify-end" : ""}`}>
              <Image
                src={item.image}
                alt={item.title ?? ""}
                width={400}
                height={300}
                className="w-full max-w-sm rounded-lg object-contain"
              />
            </div>
          )}
          {item.description && item.description.length > 0 && (
            <RichText className={isLeft ? "md:text-right" : "md:text-left"}>
              <PortableText value={item.description} />
            </RichText>
          )}
        </div>
      </div>
    </div>
  );
};
