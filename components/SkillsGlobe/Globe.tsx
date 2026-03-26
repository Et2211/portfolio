"use client";

import { useFrame } from "@react-three/fiber";
import { ReactNode, useRef } from "react";
import type { Mesh } from "three";

interface GlobeProps {
  rotationSpeed?: number;
  paused?: boolean;
  radius?: number;
  children?: ReactNode;
}

export const Globe = ({
  rotationSpeed = 0.3,
  paused = false,
  radius = 2.5,
  children,
}: GlobeProps) => {
  const meshRef = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (!paused && meshRef.current) {
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
