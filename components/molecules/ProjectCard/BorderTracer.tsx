"use client";

import { motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";

// The card is rounded-xl (14px, see --radius-xl); the stroke is inset by
// 1px so it sits inside the border, hence a 13px radius.
const CORNER_RADIUS = 13;

/** An accent outline that draws itself around the parent card on hover. */
export const BorderTracer = ({ active }: { active: boolean }) => {
  const gradientId = `tracer-${useId()}`;
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const card = svgRef.current?.parentElement;
    if (!card) {
      return;
    }
    const observer = new ResizeObserver(([entry]) =>
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      }),
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 overflow-visible"
      width={size.width}
      height={size.height}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "var(--accent-vivid)" }} />
          <stop offset="50%" style={{ stopColor: "var(--accent-vivid-2)" }} />
          <stop offset="100%" style={{ stopColor: "var(--accent-vivid)" }} />
        </linearGradient>
      </defs>
      {size.width > 0 && (
        <motion.rect
          x="1"
          y="1"
          width={size.width - 2}
          height={size.height - 2}
          rx={CORNER_RADIUS}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
          transition={{
            pathLength: { duration: 0.55, ease: [0.4, 0, 0.2, 1] },
            opacity: { duration: 0.15 },
          }}
        />
      )}
    </svg>
  );
};
