"use client";

import { animate, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

import { useInView } from "@/hooks/useInView";
import { useIsPointerDevice } from "@/hooks/useIsPointerDevice";
import type { StatsBannerBlock } from "@/types/blocks";

function parseStatValue(raw: string): { num: number; suffix: string } | null {
  const match = raw.match(/^([\d.,]+)(.*)$/);
  if (!match) return null;
  const num = parseFloat(match[1].replace(/,/g, ""));
  if (isNaN(num)) return null;
  return { num, suffix: match[2] ?? "" };
}

const AnimatedStat = ({ value }: { value: string }) => {
  const parsed = useMemo(() => parseStatValue(value), [value]);
  const [displayed, setDisplayed] = useState(parsed ? `0${parsed.suffix}` : value);
  const { ref, isInView } = useInView({ threshold: 0.5, once: true });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current || !parsed) return;
    hasAnimated.current = true;
    const controls = animate(0, parsed.num, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      onUpdate: (val) => {
        const rounded = Number.isInteger(parsed.num) ? Math.round(val) : Math.round(val * 10) / 10;
        setDisplayed(`${rounded}${parsed.suffix}`);
      },
    });
    return () => controls.stop();
  }, [isInView, parsed]);

  return (
    <span
      ref={ref}
      className="text-3xl sm:text-4xl font-bold tabular-nums"
      style={{
        background: "linear-gradient(135deg, var(--accent-vivid) 0%, var(--accent-vivid-2) 100%)",
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
    className="flex flex-col items-center gap-1 text-center py-8 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 hover:border-[var(--accent-vivid)]/40"
    whileHover={isPointer ? {
      y: -4,
      scale: 1.02,
      boxShadow: "0 0 30px oklch(0.56 0.28 280 / 0.22), 0 8px 24px oklch(0 0 0 / 0.1)"
    } : undefined}
    transition={{ type: "spring", stiffness: 260, damping: 26 }}
  >
    {stat.value && <AnimatedStat value={stat.value} />}
    {stat.label && (
      <span className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{stat.label}</span>
    )}
    <div
      className="mt-3 h-0.5 w-10 rounded-full"
      style={{ background: "linear-gradient(90deg, var(--accent-vivid), var(--accent-vivid-2))" }}
    />
  </motion.div>
);

export const StatsBanner = ({ stats }: StatsBannerBlock) => {
  const isPointer = useIsPointerDevice();

  if (!stats || stats.length === 0) return null;

  return (
    <section className="py-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <StatCard key={stat._key ?? idx} stat={stat} idx={idx} isPointer={isPointer} />
        ))}
      </div>
    </section>
  );
};
