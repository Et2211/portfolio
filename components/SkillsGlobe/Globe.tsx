"use client";

import { useFrame } from "@react-three/fiber";
import { ReactNode, useRef } from "react";
import type { Mesh } from "three";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface GlobeProps {
  rotationSpeed?: number;
  paused?: boolean;
  radius: number;
  /** Local position of a skill to turn to the front (e.g. it has focus). */
  focusTarget?: [number, number, number] | null;
  children?: ReactNode;
}

const TWO_PI = Math.PI * 2;
/** How quickly the globe turns to a focused skill (per second). */
const TURN_RATE = 8;
/** Below this many radians from the target, snap to it. */
const SNAP_ANGLE = 0.002;

export const Globe = ({
  rotationSpeed = 0.3,
  paused = false,
  radius,
  focusTarget = null,
  children,
}: GlobeProps) => {
  const meshRef = useRef<Mesh>(null);
  // WebGL isn't affected by the CSS reduced-motion rule, so check it here.
  // Dragging (OrbitControls) still works; only the auto-rotation stops.
  const reduceMotion = usePrefersReducedMotion();
  useFrame(({ camera }, delta) => {
    const mesh = meshRef.current;
    if (!mesh) {
      return;
    }
    if (focusTarget) {
      // Spin (about Y) so the focused skill faces the camera: rotating by θ
      // adds θ to a point's azimuth, so aim for the camera's azimuth.
      const [targetX, , targetZ] = focusTarget;
      const wanted =
        Math.atan2(camera.position.x, camera.position.z) -
        Math.atan2(targetX, targetZ);
      // Take the shortest way round from the current angle.
      const diff =
        ((((wanted - mesh.rotation.y + Math.PI) % TWO_PI) + TWO_PI) % TWO_PI) -
        Math.PI;
      // Ease towards it, snapping once close so the globe actually comes to
      // rest (and jumping straight there with reduced motion).
      const snap = reduceMotion || Math.abs(diff) < SNAP_ANGLE;
      mesh.rotation.y += snap ? diff : diff * Math.min(1, delta * TURN_RATE);
      return;
    }
    if (!paused && !reduceMotion) {
      mesh.rotation.y += delta * rotationSpeed;
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
