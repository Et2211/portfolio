"use client";

import { PortableText } from "@portabletext/react";
import { motion } from "motion/react";
import Image from "next/image";

import { RichText } from "@/components/atoms/RichText";
import { ProjectLinks } from "@/components/molecules/ProjectLinks";
import { TagList } from "@/components/molecules/TagList";
import { useIsPointerDevice } from "@/hooks/useIsPointerDevice";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { FeaturedProject } from "@/types/blocks";

import { BorderTracer } from "./BorderTracer";
import { useCardTilt } from "./useCardTilt";

interface ProjectCardProps {
  project: FeaturedProject;
  /** compact: tighter padding, no description, smaller text */
  compact?: boolean;
}

export const ProjectCard = ({ project, compact = false }: ProjectCardProps) => {
  const shouldReduceMotion = usePrefersReducedMotion();
  const isPointer = useIsPointerDevice();
  const interactive = isPointer && !shouldReduceMotion;

  const { isHovered, transform, imageX, imageY, handlers } =
    useCardTilt(interactive);

  return (
    <motion.div
      style={interactive ? { transform } : undefined}
      {...handlers}
      className={`relative flex flex-col overflow-hidden surface-card transition-shadow duration-300 ${
        interactive
          ? isHovered
            ? "shadow-glow-lg"
            : "shadow-[0_2px_12px_oklch(0_0_0/0.06)]"
          : ""
      }`}
    >
      {interactive && <BorderTracer active={isHovered} />}

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
              isHovered ? "text-accent-vivid" : "text-foreground"
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
