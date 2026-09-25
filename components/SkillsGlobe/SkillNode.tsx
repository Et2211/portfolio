"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useCallback, useRef, useState } from "react";
import * as THREE from "three";

import type { GlobeSkill } from "./types";

interface SkillNodeProps {
  skill: GlobeSkill;
  position: [number, number, number];
  radius: number;
  onSelect: (skill: GlobeSkill) => void;
}

export const SkillNode = ({
  skill,
  position,
  radius = 1.7,
  onSelect,
}: SkillNodeProps) => {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const hoveredRef = useRef(false);
  const worldPos = useRef(new THREE.Vector3());
  const cameraDir = useRef(new THREE.Vector3());

  const simpleIcon = skill.iconData;

  useFrame(({ camera }) => {
    if (!groupRef.current || !buttonRef.current) {
      return;
    }
    groupRef.current.getWorldPosition(worldPos.current);

    // Project world position onto camera's view direction so depth stays correct
    // whether the globe is auto-rotating OR the user is orbiting with the mouse.
    // Reuse a vector rather than allocating one per node per frame.
    cameraDir.current.copy(camera.position).normalize();
    const dot = worldPos.current.dot(cameraDir.current); // -radius → +radius
    const depth = (dot + radius) / (2 * radius); // 0 = back, 1 = front
    const isFront = depth >= 0.5;

    // Clear hover state when icon rotates to the back
    if (!isFront && hoveredRef.current) {
      hoveredRef.current = false;
      setHovered(false);
    }

    // Opacity: never fully invisible — 0.2 at back, 1.0 at front
    const opacity = 0.2 + depth * 0.8;
    // Scale: shrink at back, grow at front
    const scale = 0.7 + depth * 0.4;
    const finalScale = hoveredRef.current ? scale * 1.2 : scale;

    buttonRef.current.style.opacity = String(opacity);
    buttonRef.current.style.transform = `scale(${finalScale})`;
    buttonRef.current.style.pointerEvents = isFront ? "auto" : "none";
    // Icons on the far side of the globe can't be clicked, so keep them out
    // of the tab order too.
    buttonRef.current.tabIndex = isFront ? 0 : -1;
  });

  const handlePointerOver = useCallback(() => {
    setHovered(true);
    hoveredRef.current = true;
  }, []);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    hoveredRef.current = false;
  }, []);

  const handleClick = useCallback(() => {
    onSelect(skill);
  }, [onSelect, skill]);

  return (
    <group ref={groupRef} position={position}>
      <Html center distanceFactor={8} zIndexRange={[100, 0]} occlude={false}>
        <button
          ref={buttonRef}
          type="button"
          aria-label={skill.name}
          onClick={handleClick}
          onMouseEnter={handlePointerOver}
          onMouseLeave={handlePointerOut}
          onFocus={handlePointerOver}
          onBlur={handlePointerOut}
          style={{
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 4,
          }}
          className="rounded-md border-0 bg-transparent select-none focus-visible:outline-2 focus-visible:outline-ring"
        >
          {simpleIcon && (
            <svg
              width={32}
              height={32}
              viewBox="0 0 24 24"
              aria-hidden="true"
              style={{
                display: "block",
                fill: hovered ? "white" : `#${simpleIcon.hex}`,
                filter: hovered
                  ? `drop-shadow(0 0 4px #${simpleIcon.hex}) drop-shadow(0 0 2px #${simpleIcon.hex})`
                  : "none",
                transition: "fill 0.2s ease, filter 0.2s ease",
              }}
            >
              <path d={simpleIcon.path} />
            </svg>
          )}
          {hovered && (
            <span
              className="mt-1 rounded bg-black/80 px-2 py-1 text-xs text-white shadow-lg"
              style={{ pointerEvents: "none", whiteSpace: "nowrap" }}
            >
              {skill.name}
            </span>
          )}
        </button>
      </Html>
    </group>
  );
};
