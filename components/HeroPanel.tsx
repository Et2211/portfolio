import Image from "next/image";
import { useId } from "react";

import type { HeroPanelBlock } from "@/types/blocks";

import { AppLink } from "./AppLink";

// Entrance timing (see .hero-enter-* in globals.css): elements enter one after
// another, and the words inside the name and role stagger within their slot.
const FIRST_DELAY_MS = 50;
const STEP_MS = 100;

const enterDelay = (ms: number) => ({ animationDelay: `${ms}ms` });

const SplitWords = ({ text, startMs }: { text: string; startMs: number }) =>
  text.split(" ").map((word, wordIdx) => (
    // Real spaces between the inline-block words keep the text readable to
    // copy/paste, innerText and screen readers.
    <span key={wordIdx}>
      {wordIdx > 0 && " "}
      <span
        className="hero-enter-word"
        style={enterDelay(startMs + FIRST_DELAY_MS + wordIdx * STEP_MS)}
      >
        {word}
      </span>
    </span>
  ));

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
  // Unique per instance, so two heroes on a page don't share a gradient.
  const ringGradientId = `ring-grad-${useId()}`;

  // Slots are assigned in render order, skipping anything not rendered.
  let slot = 0;
  const nextSlot = () => FIRST_DELAY_MS + slot++ * STEP_MS;
  const photoMs = photo ? nextSlot() : 0;
  const nameMs = name ? nextSlot() : 0;
  const roleMs = role ? nextSlot() : 0;
  const taglineMs = tagline ? nextSlot() : 0;
  const ctaMs = ctaLabel && ctaUrl ? nextSlot() : 0;

  return (
    <section
      className={`relative flex flex-col items-center gap-8 py-12 ${isRight ? "sm:flex-row-reverse" : "sm:flex-row"}`}
    >
      {/* Vivid gradient blobs — CSS animations only, no JS scroll tracking */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className={`absolute -top-32 md:-top-48 ${isRight ? "-left-32 md:-left-48" : "-right-32 md:-right-48"} hero-blob h-[360px] w-[360px] rounded-full blur-[60px] md:h-[640px] md:w-[640px] md:blur-[110px]`}
          style={{
            background:
              "color-mix(in oklch, var(--accent-vivid) 35%, transparent)",
          }}
        />
        <div
          className={`absolute -bottom-16 ${isRight ? "-right-16" : "-left-16"} hero-blob-reverse h-[260px] w-[260px] rounded-full blur-[50px] md:h-[480px] md:w-[480px] md:blur-[90px]`}
          style={{
            background:
              "color-mix(in oklch, var(--accent-vivid-2) 28%, transparent)",
          }}
        />
      </div>

      {/* Photo */}
      {photo && (
        <div
          className="hero-enter-photo relative flex-shrink-0"
          style={enterDelay(photoMs)}
        >
          {/* Spinning dashed rings (the reduced-motion CSS rule stops them) */}
          <div className="ring-spin absolute" style={{ inset: "-20px" }}>
            <svg viewBox="0 0 100 100" className="h-full w-full">
              <defs>
                <linearGradient
                  id={ringGradientId}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    style={{ stopColor: "var(--accent-vivid)" }}
                  />
                  <stop
                    offset="100%"
                    style={{ stopColor: "var(--accent-vivid-2)" }}
                  />
                </linearGradient>
              </defs>
              <circle
                cx="50"
                cy="50"
                r="47"
                fill="none"
                stroke={`url(#${ringGradientId})`}
                strokeWidth="1.2"
                strokeDasharray="8 7"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="ring-spin-reverse absolute" style={{ inset: "-8px" }}>
            <svg viewBox="0 0 100 100" className="h-full w-full">
              <circle
                cx="50"
                cy="50"
                r="47"
                fill="none"
                style={{
                  stroke:
                    "color-mix(in oklch, var(--accent-vivid-2) 55%, transparent)",
                }}
                strokeWidth="0.8"
                strokeDasharray="3 14"
                strokeLinecap="round"
              />
            </svg>
          </div>
          {/* Glow halo */}
          <div
            className="absolute inset-0 -z-10 rounded-full"
            style={{
              background:
                "color-mix(in oklch, var(--accent-vivid) 35%, transparent)",
              filter: "blur(24px)",
              transform: "scale(1.2)",
            }}
          />
          <Image
            src={photo}
            alt={name ?? "Profile photo"}
            width={240}
            height={240}
            className="relative z-10 h-40 w-40 rounded-full object-cover sm:h-56 sm:w-56 md:h-64 md:w-64"
            priority
          />
        </div>
      )}

      {/* Text */}
      <div
        className={`flex flex-1 flex-col gap-4 text-center ${isRight ? "sm:text-right" : "sm:text-left"}`}
      >
        {name && (
          <h1 className="bg-linear-135 from-foreground from-50% to-accent-vivid text-gradient text-3xl leading-tight font-bold sm:text-4xl md:text-5xl">
            <SplitWords text={name} startMs={nameMs} />
          </h1>
        )}
        {role && (
          <p className="text-lg font-medium text-accent-vivid sm:text-xl">
            <SplitWords text={role} startMs={roleMs} />
          </p>
        )}
        {tagline && (
          <p
            className="hero-enter-rise text-base text-zinc-600 dark:text-zinc-300"
            style={enterDelay(taglineMs)}
          >
            {tagline}
          </p>
        )}
        {ctaLabel && ctaUrl && (
          <div className="hero-enter-pop mt-2" style={enterDelay(ctaMs)}>
            <AppLink href={ctaUrl} variant="primary">
              {ctaLabel}
            </AppLink>
          </div>
        )}
      </div>
    </section>
  );
};
