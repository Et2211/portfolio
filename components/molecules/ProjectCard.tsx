"use client";

import { PortableText } from "@portabletext/react";
import { motion, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import type { MouseEvent } from "react";
import { useEffect, useId, useRef, useState } from "react";

import { RichText } from "@/components/atoms/RichText";
import { ProjectLinks } from "@/components/molecules/ProjectLinks";
import { TagList } from "@/components/molecules/TagList";
import { useIsPointerDevice } from "@/hooks/useIsPointerDevice";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { FeaturedProject } from "@/types/blocks";

interface ProjectCardProps {
  project: FeaturedProject;
  /** compact: tighter padding, no description, smaller text */
  compact?: boolean;
}

export const ProjectCard = ({ project, compact = false }: ProjectCardProps) => {
  const shouldReduceMotion = usePrefersReducedMotion();
  const isPointer = useIsPointerDevice();
  const interactive = isPointer && !shouldReduceMotion;

  const uid = useId();
  const safeId = uid.replace(/:/g, "-");
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [cardDims, setCardDims] = useState({ width: 0, height: 0 });

  // Critically-damped springs (ratio > 1) — cannot oscillate
  const rotateX = useSpring(0, { stiffness: 180, damping: 30 });
  const rotateY = useSpring(0, { stiffness: 180, damping: 30 });
  const transform = useTransform(
    [rotateX, rotateY],
    ([rx, ry]: number[]) =>
      `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`,
  );

  // Image shifts opposite to tilt — creates glass-depth illusion
  const imageX = useTransform(rotateY, (ry: number) => -ry * 0.7);
  const imageY = useTransform(rotateX, (rx: number) => rx * 0.7);

  // ResizeObserver only needed for the SVG tracer on pointer devices
  useEffect(() => {
    if (!interactive) {
      return;
    }
    const el = cardRef.current;
    if (!el) {
      return;
    }
    const ro = new ResizeObserver(([e]) =>
      setCardDims({ width: e.contentRect.width, height: e.contentRect.height }),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, [interactive]);

  const onMouseEnter = () => {
    if (interactive) {
      setIsHovered(true);
    }
  };
  const onMouseLeave = () => {
    if (!interactive) {
      return;
    }
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };
  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!interactive) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 14);
    rotateX.set(-py * 10);
    // CSS vars avoid re-rendering the whole card on every mousemove
    e.currentTarget.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };

  return (
    <motion.div
      ref={cardRef}
      style={interactive ? { transform } : undefined}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`relative flex flex-col overflow-hidden surface-card transition-shadow duration-300 ${
        interactive
          ? isHovered
            ? "shadow-glow-lg"
            : "shadow-[0_2px_12px_oklch(0_0_0/0.06)]"
          : ""
      }`}
    >
      {/* SVG border tracer — pointer devices only */}
      {cardDims.width > 0 && interactive && (
        <svg
          className="pointer-events-none absolute inset-0 z-20"
          width={cardDims.width}
          height={cardDims.height}
          style={{ position: "absolute", top: 0, left: 0, overflow: "visible" }}
        >
          <defs>
            <linearGradient
              id={`tg-${safeId}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" style={{ stopColor: "var(--accent-vivid)" }} />
              <stop
                offset="50%"
                style={{ stopColor: "var(--accent-vivid-2)" }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "var(--accent-vivid)" }}
              />
            </linearGradient>
          </defs>
          <motion.rect
            x="1"
            y="1"
            width={cardDims.width - 2}
            height={cardDims.height - 2}
            rx="10.5"
            fill="none"
            stroke={`url(#tg-${safeId})`}
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: isHovered ? 1 : 0,
              opacity: isHovered ? 1 : 0,
            }}
            transition={{
              pathLength: { duration: 0.55, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.15 },
            }}
          />
        </svg>
      )}

      {/* Spotlight — CSS-var position, pointer devices only */}
      {interactive && (
        <div
          className="pointer-events-none absolute inset-0 z-10 rounded-xl transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background:
              "radial-gradient(300px circle at var(--spot-x, 50%) var(--spot-y, 50%), color-mix(in oklch, var(--accent-vivid) 16%, transparent), color-mix(in oklch, var(--accent-vivid-2) 7%, transparent) 55%, transparent 70%)",
          }}
        />
      )}

      {project.image && (
        <div className="relative aspect-video w-full overflow-hidden">
          <motion.div
            className="absolute inset-0"
            style={interactive ? { x: imageX, y: imageY } : undefined}
            animate={
              interactive ? { scale: isHovered ? 1.06 : 1.02 } : undefined
            }
            transition={{ scale: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } }}
          >
            <Image
              src={project.image}
              alt={project.title ?? "Project screenshot"}
              fill
              className="object-cover"
              sizes={
                compact
                  ? "(max-width: 640px) 100vw, 33vw"
                  : "(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
              }
            />
          </motion.div>
          {interactive && (
            <div
              className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-500"
              style={{
                opacity: isHovered ? 1 : 0,
                background:
                  "linear-gradient(135deg, color-mix(in oklch, var(--accent-vivid) 22%, transparent) 0%, color-mix(in oklch, var(--accent-vivid-2) 10%, transparent) 100%)",
              }}
            />
          )}
        </div>
      )}

      <div
        className={`flex flex-1 flex-col ${compact ? "gap-2 p-4" : "gap-3 p-5"}`}
      >
        {project.title && (
          <h3
            className={`font-semibold transition-colors duration-300 ${compact ? "" : "text-lg"} ${
              isHovered && interactive ? "text-accent-vivid" : "text-foreground"
            }`}
          >
            {project.title}
          </h3>
        )}
        <TagList tags={project.tags} compact={compact} />
        {!compact && project.description && project.description.length > 0 && (
          <RichText>
            <PortableText value={project.description} />
          </RichText>
        )}
        <ProjectLinks
          liveUrl={project.liveUrl}
          githubUrl={project.githubUrl}
          moreInfoUrl={compact ? undefined : project.moreInfoUrl}
          size={compact ? "xs" : "sm"}
          className="mt-auto pt-2"
        />
      </div>
    </motion.div>
  );
};
