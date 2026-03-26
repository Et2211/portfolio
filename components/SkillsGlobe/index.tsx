"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";

import type { SkillGlobeItem, SkillsGlobeBlock } from "@/types/blocks";

import { Globe } from "./Globe";
import { getSimpleIcon } from "./simpleIconsRegistry";
import { SkillNode } from "./SkillNode";
import { generateFibonacciSpherePositions } from "./utils";

const CLOSE_DURATION = 300;

type SkillsGlobeProps = Omit<SkillsGlobeBlock, "_type">;

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
}

const SkillDetail = ({
  skill,
  onClose,
}: {
  skill: SkillGlobeItem;
  onClose: () => void;
}) => {
  const simpleIcon = skill.icon ? getSimpleIcon(skill.icon) : null;

  return (
    <>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors text-lg leading-none"
        aria-label="Close"
      >
        ✕
      </button>

      {simpleIcon && (
        <svg width={56} height={56} viewBox="0 0 24 24" aria-label={simpleIcon.title}>
          <path d={simpleIcon.path} fill={`#${simpleIcon.hex}`} />
        </svg>
      )}

      <h3 className="text-xl font-bold text-black dark:text-white">{skill.name}</h3>

      {skill.description ? (
        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
          {skill.description}
        </p>
      ) : (
        <p className="text-zinc-400 dark:text-zinc-600 text-sm italic">
          No description yet.
        </p>
      )}

      {skill.url && (
        <a
          href={skill.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-80 transition-opacity"
        >
          Visit ↗
        </a>
      )}
    </>
  );
}

export const SkillsGlobe = ({
  heading,
  skills = [],
  rotationSpeed = 0.3,
}: SkillsGlobeProps) => {
  const globeRadius = 1.7;
  const [displayedSkill, setDisplayedSkill] = useState<SkillGlobeItem | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [layoutOpen, setLayoutOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const positions = useMemo(
    () => generateFibonacciSpherePositions(skills.length, globeRadius),
    [skills.length, globeRadius],
  );

  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  const triggerClose = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setIsClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setDisplayedSkill(null);
      setIsClosing(false);
      closeTimerRef.current = null;
      setLayoutOpen(false);
    }, CLOSE_DURATION);
  };

  const handleSelect = (skill: SkillGlobeItem) => {
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
    <div className="relative w-full flex flex-col items-center justify-center py-10">
      {heading && (
        <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">{heading}</h2>
      )}

      <div className="w-full flex flex-col lg:flex-row items-center">
        {/* Globe */}
        <div
          className="flex-shrink-0 flex justify-center"
          style={{
            width: layoutOpen ? "50%" : "100%",
            transition: "width 500ms ease-in-out",
          }}
        >
          <div
            style={{ aspectRatio: "1/1", width: "min(90vw, 600px)", maxWidth: 700, margin: "0 auto" }}
          >
            <Canvas
              camera={{ position: [0, 0, 6], fov: 50 }}
              gl={{ alpha: true, antialias: true }}
              style={{ background: "transparent", width: "100%", height: "100%" }}
            >
              <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} dampingFactor={0.1} enableDamping />
              <Globe rotationSpeed={rotationSpeed} paused={!!displayedSkill} radius={globeRadius}>
                {skills.map((skill, index) => {
                  const position = positions[index];
                  if (!position) return null;
                  return (
                    <SkillNode
                      key={skill._key ?? `skill-${index}`}
                      skill={skill}
                      position={position}
                      onSelect={handleSelect}
                    />
                  );
                })}
              </Globe>
            </Canvas>
          </div>
        </div>

        {/* Desktop panel — always in DOM so width can animate. Hidden on mobile (bottom sheet used instead). */}
        <div
          className="hidden lg:block overflow-hidden flex-shrink-0"
          style={{
            width: layoutOpen ? "50%" : "0%",
            transition: "width 500ms ease-in-out",
          }}
        >
          {displayedSkill && (
            <AnimatedPanel
              isClosing={isClosing}
              hiddenTransform="translateX(2rem)"
              className="flex flex-col items-start gap-4 p-6 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 relative"
            >
              <SkillDetail skill={displayedSkill} onClose={triggerClose} />
            </AnimatedPanel>
          )}
        </div>
      </div>

      {/* Mobile bottom sheet */}
      {displayedSkill && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <AnimatedPanel
            isClosing={isClosing}
            hiddenTransform="none"
            className="absolute inset-0 bg-black/40"
          >
            <div className="absolute inset-0" onClick={triggerClose} />
          </AnimatedPanel>

          {/* Sheet */}
          <AnimatedPanel
            isClosing={isClosing}
            hiddenTransform="translateY(100%)"
            className="relative bg-white dark:bg-zinc-900 rounded-t-2xl p-6 pb-10 flex flex-col gap-4"
          >
            <div className="w-10 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full mx-auto -mt-1 mb-1" />
            <SkillDetail skill={displayedSkill} onClose={triggerClose} />
          </AnimatedPanel>
        </div>
      )}
    </div>
  );
};
