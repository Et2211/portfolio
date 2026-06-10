"use client";

import type { Variants } from "motion/react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";

import type { HeroPanelBlock } from "@/types/blocks";

import { AppLink } from "./AppLink";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const photoVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: EASE } },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: EASE } },
};

const taglineVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const ctaVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.96 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring" as const, stiffness: 220, damping: 24 },
  },
};

const SplitWords = ({ text, className }: { text: string; className?: string }) => (
  <span className={className} aria-label={text}>
    {text.split(" ").map((word, i) => (
      <motion.span key={i} variants={wordVariants} style={{ display: "inline-block", marginRight: "0.3em" }}>
        {word}
      </motion.span>
    ))}
  </span>
);

export const HeroPanel = ({
  name,
  role,
  tagline,
  photo,
  ctaLabel,
  ctaUrl,
  imagePosition = "left",
}: HeroPanelBlock) => {
  const isRight = imagePosition === "right";
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className={`relative flex flex-col items-center gap-8 py-12 ${isRight ? "sm:flex-row-reverse" : "sm:flex-row"}`}
    >
      {/* Vivid gradient blobs — CSS animations only, no JS scroll tracking */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div
          className={`absolute -top-32 md:-top-48 ${isRight ? "-left-32 md:-left-48" : "-right-32 md:-right-48"} w-[360px] h-[360px] md:w-[640px] md:h-[640px] rounded-full blur-[60px] md:blur-[110px] hero-blob`}
          style={{ background: "oklch(0.56 0.28 280 / 0.35)" }}
        />
        <div
          className={`absolute -bottom-16 ${isRight ? "-right-16" : "-left-16"} w-[260px] h-[260px] md:w-[480px] md:h-[480px] rounded-full blur-[50px] md:blur-[90px] hero-blob-reverse`}
          style={{ background: "oklch(0.72 0.18 196 / 0.28)" }}
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial={shouldReduceMotion ? "visible" : "hidden"}
        animate="visible"
        className="contents"
      >
        {/* Photo */}
        {photo && (
          <motion.div variants={photoVariants} className="flex-shrink-0 relative">
            {/* Outer spinning dashed ring */}
            {!shouldReduceMotion && (
              <>
                <div className="absolute ring-spin" style={{ inset: "-20px" }}>
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                      <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="oklch(0.56 0.28 280)" />
                        <stop offset="100%" stopColor="oklch(0.72 0.18 196)" />
                      </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="47" fill="none" stroke="url(#ring-grad)"
                      strokeWidth="1.2" strokeDasharray="8 7" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="absolute ring-spin-reverse" style={{ inset: "-8px" }}>
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="47" fill="none"
                      stroke="oklch(0.72 0.18 196 / 0.55)"
                      strokeWidth="0.8" strokeDasharray="3 14" strokeLinecap="round" />
                  </svg>
                </div>
              </>
            )}
            {/* Glow halo */}
            <div
              className="absolute inset-0 rounded-full -z-10"
              style={{ background: "oklch(0.56 0.28 280 / 0.35)", filter: "blur(24px)", transform: "scale(1.2)" }}
            />
            <Image
              src={photo}
              alt={name ?? "Profile photo"}
              width={240}
              height={240}
              className="rounded-full object-cover w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 relative z-10"
              priority
            />
          </motion.div>
        )}

        {/* Text */}
        <div className={`flex-1 flex flex-col gap-4 text-center ${isRight ? "sm:text-right" : "sm:text-left"}`}>
          {name && (
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
              style={{
                background: "linear-gradient(135deg, var(--foreground) 50%, var(--accent-vivid) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
              variants={containerVariants}
            >
              <SplitWords text={name} />
            </motion.h1>
          )}
          {role && (
            <motion.p
              className="text-lg sm:text-xl font-medium"
              style={{ color: "var(--accent-vivid)" }}
              variants={containerVariants}
            >
              <SplitWords text={role} />
            </motion.p>
          )}
          {tagline && (
            <motion.p className="text-base text-zinc-600 dark:text-zinc-300" variants={taglineVariants}>
              {tagline}
            </motion.p>
          )}
          {ctaLabel && ctaUrl && (
            <motion.div className="mt-2" variants={ctaVariants}>
              <AppLink href={ctaUrl} variant="primary">{ctaLabel}</AppLink>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
};
