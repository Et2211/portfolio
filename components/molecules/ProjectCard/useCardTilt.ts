"use client";

import { useSpring, useTransform } from "motion/react";
import type { MouseEvent } from "react";
import { useState } from "react";

// Critically-damped springs (damping ratio > 1) so the tilt can't oscillate.
const SPRING = { stiffness: 180, damping: 30 };
const MAX_TILT_Y_DEG = 14;
const MAX_TILT_X_DEG = 10;
/** How far the image shifts against the tilt, per degree (parallax depth). */
const PARALLAX_PX_PER_DEG = 0.7;

/**
 * 3D tilt that follows the pointer, plus a counter-shift for the card's
 * image. Also exposes the pointer position as --spot-x/--spot-y CSS
 * variables (for a spotlight) without re-rendering on every mouse move.
 */
export function useCardTilt(enabled: boolean) {
  const [isHovered, setIsHovered] = useState(false);
  const rotateX = useSpring(0, SPRING);
  const rotateY = useSpring(0, SPRING);

  const transform = useTransform(
    [rotateX, rotateY],
    ([rx, ry]: number[]) =>
      `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`,
  );
  const imageX = useTransform(
    rotateY,
    (ry: number) => -ry * PARALLAX_PX_PER_DEG,
  );
  const imageY = useTransform(
    rotateX,
    (rx: number) => rx * PARALLAX_PX_PER_DEG,
  );

  const handlers = {
    onMouseEnter: () => {
      if (enabled) {
        setIsHovered(true);
      }
    },
    onMouseLeave: () => {
      if (!enabled) {
        return;
      }
      setIsHovered(false);
      rotateX.set(0);
      rotateY.set(0);
    },
    onMouseMove: (e: MouseEvent<HTMLElement>) => {
      if (!enabled) {
        return;
      }
      const rect = e.currentTarget.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      rotateY.set(px * MAX_TILT_Y_DEG);
      rotateX.set(-py * MAX_TILT_X_DEG);
      e.currentTarget.style.setProperty(
        "--spot-x",
        `${e.clientX - rect.left}px`,
      );
      e.currentTarget.style.setProperty(
        "--spot-y",
        `${e.clientY - rect.top}px`,
      );
    },
  };

  return {
    isHovered: enabled && isHovered,
    transform,
    imageX,
    imageY,
    handlers,
  };
}
