"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";

import type { SkillsGlobeBlock } from "@/types/blocks";

import { Globe } from "./Globe";
import { SkillNode } from "./SkillNode";
import { generateFibonacciSpherePositions } from "./utils";

type SkillsGlobeProps = Omit<SkillsGlobeBlock, "_type">;

export const SkillsGlobe = ({
  heading,
  skills = [],
  rotationSpeed = 0.3,
}: SkillsGlobeProps) => {
  const globeRadius = 1.7;
  const positions = useMemo(
    () => generateFibonacciSpherePositions(skills.length, globeRadius),
    [skills.length, globeRadius],
  );

  // Responsive width, with extra vertical space (aspect ratio 1.2:1)
  return (
    <div className="relative w-full flex flex-col items-center justify-center">
      {heading && <h2 className="text-2xl font-bold">{heading}</h2>}
      <div
        style={{
          aspectRatio: "1/1",
          width: "min(90vw, 600px)",
          maxWidth: 700,
          margin: "0 auto",
        }}
        className="flex items-center justify-center"
      >
        <Canvas
          camera={{ position: [0, 0, 6], fov: 50 }}
          gl={{ alpha: true, antialias: true }}
          style={{ background: "transparent", width: "100%", height: "100%" }}
        >
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={false}
            dampingFactor={0.1}
            enableDamping
          />
          {/* Parent all skill nodes to the rotating globe mesh */}
          <Globe
            rotationSpeed={rotationSpeed}
            paused={false}
            radius={globeRadius}
          >
            {skills.map((skill, index) => {
              const position = positions[index];
              if (!position) return null;
              return (
                <SkillNode
                  key={skill._key ?? `skill-${index}`}
                  skill={skill}
                  position={position}
                />
              );
            })}
          </Globe>
        </Canvas>
      </div>
    </div>
  );
};
