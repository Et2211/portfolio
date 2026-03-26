"use client";

import { Html } from "@react-three/drei";
import { useCallback, useState } from "react";

import type { SkillGlobeItem } from "@/types/blocks";

import { getSimpleIcon } from "./simpleIconsRegistry";

interface SkillNodeProps {
  skill: SkillGlobeItem;
  position: [number, number, number];
}

/**
 * Maps a z-coordinate in the range [-radius, +radius] to a depth factor [0, 1]
 * where 1 = closest to camera (front) and 0 = furthest (back).
 */
const depthFactor = (zCoord: number, radius = 2.5): number =>
  (zCoord + radius) / (2 * radius);

export const SkillNode = ({ skill, position }: SkillNodeProps) => {
  const [hovered, setHovered] = useState(false);

  const depth = depthFactor(position[2]);
  // opacity: 0.35 at the back, 1 at the front
  const opacity = 1; // Set opacity to 1 for full visibility
  // scale: 0.75 at the back, 1.1 at the front
  const scale = 0.75 + depth * 0.35;

  const simpleIcon = skill.icon ? getSimpleIcon(skill.icon) : null;

  const handleClick = useCallback(() => {
    if (skill.url) {
      window.open(skill.url, "_blank", "noopener,noreferrer");
    }
  }, [skill.url]);

  const handlePointerOver = useCallback(() => setHovered(true), []);
  const handlePointerOut = useCallback(() => setHovered(false), []);

  return (
    <Html
      position={position}
      center
      distanceFactor={8}
      zIndexRange={[0, 100]}
      occlude={false}
    >
      <div
        onClick={handleClick}
        onMouseEnter={handlePointerOver}
        onMouseLeave={handlePointerOut}
        style={{
          opacity: 1,
          transform: `scale(${hovered ? scale * 1.1 : scale})`,
          cursor: skill.url ? "pointer" : "default",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 8,
          padding: 4,
          transition:
            "box-shadow 0.25s cubic-bezier(.4,2,.6,1), transform 0.25s cubic-bezier(.4,2,.6,1), opacity 0.25s cubic-bezier(.4,2,.6,1)",
          boxShadow: undefined,
        }}
        className="select-none"
      >
        {simpleIcon && (
          <svg
            width={32}
            height={32}
            viewBox="0 0 24 24"
            fill={`#${simpleIcon.hex}`}
            aria-label={simpleIcon.title}
            style={{ display: "block" }}
          >
            <path d={simpleIcon.path} />
          </svg>
        )}
        {hovered && (
          <span
            className="rounded bg-black/80 px-2 py-1 text-xs text-white shadow-lg mt-1"
            style={{ pointerEvents: "none", whiteSpace: "nowrap" }}
          >
            {skill.name}
          </span>
        )}
      </div>
    </Html>
  );
};
