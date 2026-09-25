"use client";

import { useFrame } from "@react-three/fiber";
import { ReactNode, useRef } from "react";
import type { Mesh } from "three";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface GlobeProps {
  rotationSpeed?: number;
  paused?: boolean;
  radius: number;
  children?: ReactNode;
}

export const Globe = ({
  rotationSpeed = 0.3,
  paused = false,
  radius,
  children,
}: GlobeProps) => {
  const meshRef = useRef<Mesh>(null);
  // WebGL isn't affected by the CSS reduced-motion rule, so check it here.
  // Dragging (OrbitControls) still works; only the auto-rotation stops.
  const reduceMotion = usePrefersReducedMotion();
  useFrame((_, delta) => {
    if (!paused && !reduceMotion && meshRef.current) {
      meshRef.current.rotation.y += delta * rotationSpeed;
    }
  });
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[radius, 20, 20]} />
      <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.25} />
      {/* Render children (skill nodes) as part of the rotating globe */}
      {typeof children !== "undefined" && children}
    </mesh>
  );
};
