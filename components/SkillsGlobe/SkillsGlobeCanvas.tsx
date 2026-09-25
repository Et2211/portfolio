"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";

import { SectionHeading } from "@/components/atoms/SectionHeading";
import { useMediaQuery } from "@/hooks/useMediaQuery";

import { Globe } from "./Globe";
import { SkillNode } from "./SkillNode";
import { GLOBE_RADIUS, type GlobeSkill } from "./types";
import { generateFibonacciSpherePositions } from "./utils";

const CLOSE_DURATION = 300;

interface SkillsGlobeCanvasProps {
  heading?: string;
  rotationSpeed?: number;
  skills: GlobeSkill[];
}

// Wraps a panel so it transitions in on mount and out when isClosing flips true.
// hiddenTransform is the CSS transform string for the hidden state, e.g. "translateX(2rem)".
const AnimatedPanel = ({
  isClosing,
  hiddenTransform,
  className,
  children,
}: {
  isClosing: boolean;
  hiddenTransform: string;
  className?: string;
  children: React.ReactNode;
}) => {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const hidden = !entered || isClosing;

  return (
    <div
      className={className}
      style={{
        opacity: hidden ? 0 : 1,
        transform: hidden ? hiddenTransform : "none",
        transition: "opacity 300ms ease-in-out, transform 300ms ease-in-out",
      }}
    >
      {children}
    </div>
  );
};

const SkillDetail = ({
  skill,
  onClose,
}: {
  skill: GlobeSkill;
  onClose: () => void;
}) => {
  const simpleIcon = skill.iconData;

  return (
    <>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-lg leading-none text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-200"
        aria-label="Close"
      >
        ✕
      </button>

      {simpleIcon && (
        <svg
          width={56}
          height={56}
          viewBox="0 0 24 24"
          aria-label={simpleIcon.title}
        >
          <path d={simpleIcon.path} fill={`#${simpleIcon.hex}`} />
        </svg>
      )}

      <h3 className="text-xl font-bold text-black dark:text-white">
        {skill.name}
      </h3>

      {skill.description ? (
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {skill.description}
        </p>
      ) : (
        <p className="text-sm text-zinc-400 italic dark:text-zinc-600">
          No description yet.
        </p>
      )}

      {skill.url && (
        <a
          href={skill.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-80 dark:bg-white dark:text-black"
        >
          Visit ↗
        </a>
      )}
    </>
  );
};

export const SkillsGlobeCanvas = ({
  heading,
  skills,
  rotationSpeed = 0.3,
}: SkillsGlobeCanvasProps) => {
  const [displayedSkill, setDisplayedSkill] = useState<GlobeSkill | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [layoutOpen, setLayoutOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const positions = useMemo(
    () => generateFibonacciSpherePositions(skills.length, GLOBE_RADIUS),
    [skills.length],
  );

  useEffect(
    () => () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    },
    [],
  );

  const triggerClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    setIsClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setDisplayedSkill(null);
      setIsClosing(false);
      closeTimerRef.current = null;
      setLayoutOpen(false);
    }, CLOSE_DURATION);
  };

  const handleSelect = (skill: GlobeSkill) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (displayedSkill?._key === skill._key && !isClosing) {
      triggerClose();
    } else {
      setIsClosing(false);
      setLayoutOpen(true);
      setDisplayedSkill(skill);
    }
  };

  return (
    <div className="relative flex w-full flex-col items-center justify-center py-10">
      {heading && (
        <SectionHeading align="center" className="mb-4">
          {heading}
        </SectionHeading>
      )}

      <div className="flex w-full flex-col items-start gap-6 lg:flex-row lg:items-center">
        {/* Globe */}
        <div
          className="flex flex-shrink-0 justify-center"
          style={{
            width: isDesktop && layoutOpen ? "50%" : "100%",
            transition: "width 500ms ease-in-out",
          }}
        >
          <div
            style={{
              aspectRatio: "1/1",
              width: "min(90vw, 600px)",
              maxWidth: 700,
              margin: "0 auto",
            }}
          >
            <Canvas
              camera={{ position: [0, 0, 6], fov: 50 }}
              gl={{ alpha: true, antialias: true }}
              style={{
                background: "transparent",
                width: "100%",
                height: "100%",
              }}
            >
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate={false}
                dampingFactor={0.1}
                enableDamping
              />
              <Globe
                rotationSpeed={rotationSpeed}
                paused={!!displayedSkill}
                radius={GLOBE_RADIUS}
              >
                {skills.map((skill, index) => {
                  const position = positions[index];
                  if (!position) {
                    return null;
                  }
                  return (
                    <SkillNode
                      key={skill._key ?? `skill-${index}`}
                      skill={skill}
                      position={position}
                      radius={GLOBE_RADIUS}
                      onSelect={handleSelect}
                    />
                  );
                })}
              </Globe>
            </Canvas>
          </div>
        </div>

        {/* Desktop panel — only takes space when skill is selected */}
        <div
          className="hidden overflow-hidden lg:block"
          style={{
            width: isDesktop && layoutOpen ? "50%" : "0%",
            transition: "width 500ms ease-in-out, opacity 500ms ease-in-out",
            opacity: layoutOpen ? 1 : 0,
            pointerEvents: layoutOpen ? "auto" : "none",
          }}
        >
          {displayedSkill && (
            <AnimatedPanel
              isClosing={isClosing}
              hiddenTransform="translateX(2rem)"
              className="relative flex flex-col items-start gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <SkillDetail skill={displayedSkill} onClose={triggerClose} />
            </AnimatedPanel>
          )}
        </div>
      </div>

      {/* Mobile panel — appears below globe in normal flow */}
      {displayedSkill && (
        <div className="mt-6 w-full lg:hidden">
          <AnimatedPanel
            isClosing={isClosing}
            hiddenTransform="translateY(1rem)"
            className="relative flex flex-col items-start gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <SkillDetail skill={displayedSkill} onClose={triggerClose} />
          </AnimatedPanel>
        </div>
      )}
    </div>
  );
};
