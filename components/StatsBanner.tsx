"use client";

import { animate, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

import { useInView } from "@/hooks/useInView";
import { useIsPointerDevice } from "@/hooks/useIsPointerDevice";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { StatsBannerBlock } from "@/types/blocks";

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

function parseStatValue(raw: string): { num: number; suffix: string } | null {
  const match = raw.match(/^([\d.,]+)(.*)$/);
  if (!match) {
    return null;
  }
  const num = parseFloat(match[1].replace(/,/g, ""));
  if (isNaN(num)) {
    return null;
  }
  return { num, suffix: match[2] ?? "" };
}

const formatCount = (current: number, target: number, suffix: string) => {
  const rounded = Number.isInteger(target)
    ? Math.round(current)
    : Math.round(current * 10) / 10;
  return `${rounded}${suffix}`;
};

// Server-renders the real value (for crawlers, no-JS visitors and screen
// readers). With JS, CSS hides it until the count-up starts, so the number
// never flashes before counting from zero.
const AnimatedStat = ({ value }: { value: string }) => {
  const parsed = useMemo(() => parseStatValue(value), [value]);
  const reduceMotion = usePrefersReducedMotion();
  const [displayed, setDisplayed] = useState(value);
  const [isCounting, setIsCounting] = useState(false);
  const { ref, isInView } = useInView<HTMLSpanElement>({
    threshold: 0.5,
    once: true,
  });

  const canAnimate = parsed !== null && !reduceMotion;

  useEffect(() => {
    if (!isInView || !parsed || reduceMotion) {
      return;
    }
    const controls = animate(0, parsed.num, {
      duration: 2,
      ease: EASE_OUT_EXPO,
      onUpdate: (current) => {
        setIsCounting(true);
        setDisplayed(formatCount(current, parsed.num, parsed.suffix));
      },
      // Land on the source string exactly — rounding the tween would turn
      // "4.75" into "4.8" and drop the separator from "1,200+".
      onComplete: () => setDisplayed(value),
    });
    return () => controls.stop();
  }, [isInView, parsed, reduceMotion, value]);

  return (
    <span
      ref={ref}
      data-count-up={canAnimate || undefined}
      data-counting={isCounting || undefined}
      className="text-3xl font-bold tabular-nums sm:text-4xl"
      style={{
        background:
          "linear-gradient(135deg, var(--accent-vivid) 0%, var(--accent-vivid-2) 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {displayed}
    </span>
  );
};

const StatCard = ({
  stat,
  idx,
  isPointer,
}: {
  stat: NonNullable<StatsBannerBlock["stats"]>[number];
  idx: number;
  isPointer: boolean;
}) => (
  <motion.div
    key={stat._key ?? idx}
    className="flex flex-col items-center gap-1 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-8 text-center transition-colors duration-300 hover:border-[var(--accent-vivid)]/40 dark:border-zinc-800 dark:bg-zinc-900"
    whileHover={
      isPointer
        ? {
            y: -4,
            scale: 1.02,
            boxShadow:
              "0 0 30px oklch(0.56 0.28 280 / 0.22), 0 8px 24px oklch(0 0 0 / 0.1)",
          }
        : undefined
    }
    transition={{ type: "spring", stiffness: 260, damping: 26 }}
  >
    {stat.value && <AnimatedStat value={stat.value} />}
    {stat.label && (
      <span className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        {stat.label}
      </span>
    )}
    <div
      className="mt-3 h-0.5 w-10 rounded-full"
      style={{
        background:
          "linear-gradient(90deg, var(--accent-vivid), var(--accent-vivid-2))",
      }}
    />
  </motion.div>
);

export const StatsBanner = ({ stats }: StatsBannerBlock) => {
  const isPointer = useIsPointerDevice();

  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <section className="py-4">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat, idx) => (
          <StatCard
            key={stat._key ?? idx}
            stat={stat}
            idx={idx}
            isPointer={isPointer}
          />
        ))}
      </div>
    </section>
  );
};
