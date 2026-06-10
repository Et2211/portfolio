"use client";

import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { RichText } from "@/components/atoms/RichText";
import { useInView } from "@/hooks/useInView";
import { useIsPointerDevice } from "@/hooks/useIsPointerDevice";
import { formatDate } from "@/lib/utils";
import type { SanityBlock, TimelineItem as TimelineItemType } from "@/types/generated/sanity";

type TimelineItemWithBuiltUrl = Omit<TimelineItemType, "image"> & {
  image?: string | null;
};

interface TimelineItemProps {
  item: TimelineItemWithBuiltUrl;
  index: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  fillPercent: number;
}


export const TimelineItem = ({ item, index, containerRef, fillPercent }: TimelineItemProps) => {
  const isLeft = index % 2 === 0;
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const dotRef = useRef<HTMLDivElement>(null);
  const [dotThreshold, setDotThreshold] = useState(1);
  const [cardHovered, setCardHovered] = useState(false);
  const isPointer = useIsPointerDevice();

  useEffect(() => {
    const measure = () => {
      const dot = dotRef.current;
      const container = containerRef.current;
      if (!dot || !container) return;
      const containerTop = container.getBoundingClientRect().top;
      const dotMid = dot.getBoundingClientRect().top + dot.offsetHeight / 2 - containerTop;
      setDotThreshold(dotMid / container.offsetHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [containerRef]);

  const isFilled = fillPercent >= dotThreshold;

  const startDate = item.startDate ? formatDate(item.startDate) : "";
  const endDate = item.finishDate ? formatDate(item.finishDate) : "Present";
  const dateRange = startDate ? `${startDate} – ${endDate}` : "";

  const dotClasses = `w-4 h-4 rounded-full border-2 transition-all duration-300 ${
    isInView ? "scale-100" : "scale-0"
  } ${
    isFilled
      ? "border-zinc-900 dark:border-white bg-zinc-900 dark:bg-white"
      : "border-zinc-900 dark:border-white bg-white dark:bg-zinc-900"
  }`;

  const dotGlowStyle =
    isFilled && cardHovered && isPointer
      ? { boxShadow: "0 0 10px 3px oklch(0.56 0.28 280 / 0.5)" }
      : undefined;

  // Mobile dot — no ref needed, threshold is measured from the desktop dot
  const mobileDot = (
    <div className="flex flex-col items-center flex-shrink-0 w-8">
      <div className={dotClasses} style={dotGlowStyle} />
    </div>
  );

  const desktopDot = (
    <div className="flex flex-col items-center flex-shrink-0 w-16">
      <div className={dotClasses} style={dotGlowStyle} />
    </div>
  );

  const card = (
    <div
      className={`w-full md:w-[calc(50%-2rem)] transition-all duration-700 ease-out ${
        isInView
          ? "opacity-100 translate-x-0"
          : isLeft
            ? "opacity-0 md:-translate-x-8"
            : "opacity-0 md:translate-x-8"
      }`}
    >
      <motion.div
        className={`rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 ${isLeft ? "md:text-right" : "md:text-left"}`}
        whileHover={isPointer ? {
          boxShadow: "0 0 28px oklch(0.56 0.28 280 / 0.18), 0 4px 16px oklch(0 0 0 / 0.08)",
        } : undefined}
        transition={{ boxShadow: { duration: 0.25 } }}
        onHoverStart={() => isPointer && setCardHovered(true)}
        onHoverEnd={() => isPointer && setCardHovered(false)}
      >
        <h3
          className="text-lg font-semibold mb-1 transition-colors duration-300"
          style={{ color: cardHovered && isPointer ? "var(--accent-vivid)" : undefined }}
        >
          {item.title}
        </h3>
        {dateRange && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
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
              className="rounded-lg w-full max-w-sm object-contain"
            />
          </div>
        )}
        {item.description && item.description.length > 0 && (
          <RichText className={isLeft ? "md:text-right" : "md:text-left"}>
            <PortableText value={item.description as SanityBlock[]} />
          </RichText>
        )}
      </motion.div>
    </div>
  );

  return (
    <div ref={ref} className="relative flex items-start gap-0 py-8">
      {/* Always-rendered anchor for dot position measurement */}
      <div ref={dotRef} className="absolute top-8 left-0 w-0 h-4 pointer-events-none" aria-hidden />

      {/* Mobile: left-aligned line + dot + card */}
      <div className="flex md:hidden items-start w-full">
        {mobileDot}
        <div className="flex-1">{card}</div>
      </div>

      {/* Desktop: alternating */}
      <div className="hidden md:flex w-full items-start">
        {isLeft ? (
          <>
            {card}
            {desktopDot}
            <div className="w-[calc(50%-2rem)]" />
          </>
        ) : (
          <>
            <div className="w-[calc(50%-2rem)]" />
            {desktopDot}
            {card}
          </>
        )}
      </div>
    </div>
  );
};
