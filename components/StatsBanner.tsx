"use client";

import { animate } from "motion/react";
import { useEffect, useMemo, useState } from "react";

import { useInView } from "@/hooks/useInView";
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
      className="bg-linear-135 from-accent-vivid to-accent-vivid-2 text-gradient text-3xl font-bold tabular-nums sm:text-4xl"
    >
      {displayed}
    </span>
  );
};

const StatCard = ({
  stat,
}: {
  stat: NonNullable<StatsBannerBlock["stats"]>[number];
}) => (
  <div className="flex flex-col items-center gap-1 surface-muted px-4 py-8 text-center transition-[border-color,box-shadow,translate,scale] duration-300 ease-out-back hover:-translate-y-1 hover:scale-102 hover:border-accent-vivid/40 hover:shadow-glow-md">
    {stat.value && <AnimatedStat value={stat.value} />}
    {stat.label && (
      <span className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        {stat.label}
      </span>
    )}
    <div className="mt-3 accent-rule w-10" />
  </div>
);

export const StatsBanner = ({ stats }: StatsBannerBlock) => {
  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <section className="py-4">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat, idx) => (
          <StatCard key={stat._key ?? idx} stat={stat} />
        ))}
      </div>
    </section>
  );
};
