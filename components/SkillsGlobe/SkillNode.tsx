"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useCallback, useRef, useState } from "react";
import * as THREE from "three";

import type { SkillGlobeItem } from "@/types/blocks";

import { getSimpleIcon } from "./simpleIconsRegistry";

interface SkillNodeProps {
  skill: SkillGlobeItem;
  position: [number, number, number];
  radius?: number;
}

export const SkillNode = ({ skill, position, radius = 1.7 }: SkillNodeProps) => {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const hoveredRef = useRef(false);
  const worldPos = useRef(new THREE.Vector3());

  const simpleIcon = skill.icon ? getSimpleIcon(skill.icon) : null;

  useFrame(({ camera }) => {
    if (!groupRef.current || !divRef.current) return;
    groupRef.current.getWorldPosition(worldPos.current);

    // Project world position onto camera's view direction so depth stays correct
    // whether the globe is auto-rotating OR the user is orbiting with the mouse.
    const cameraDir = camera.position.clone().normalize();
    const dot = worldPos.current.dot(cameraDir); // -radius → +radius
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

    divRef.current.style.opacity = String(opacity);
    divRef.current.style.transform = `scale(${finalScale})`;
    divRef.current.style.pointerEvents = isFront ? "auto" : "none";
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
    if (skill.url) window.open(skill.url, "_blank", "noopener,noreferrer");
  }, [skill.url]);

  return (
    <group ref={groupRef} position={position}>
      <Html
        center
        distanceFactor={8}
        zIndexRange={[100, 0]}
        occlude={false}
      >
        <div
          ref={divRef}
          onClick={handleClick}
          onMouseEnter={handlePointerOver}
          onMouseLeave={handlePointerOut}
          style={{
            cursor: skill.url ? "pointer" : "default",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 4,
          }}
          className="select-none"
        >
          {simpleIcon && (
            <svg
              width={32}
              height={32}
              viewBox="0 0 24 24"
              aria-label={simpleIcon.title}
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
              className="rounded bg-black/80 px-2 py-1 text-xs text-white shadow-lg mt-1"
              style={{ pointerEvents: "none", whiteSpace: "nowrap" }}
            >
              {skill.name}
            </span>
          )}
        </div>
      </Html>
    </group>
  );
};
