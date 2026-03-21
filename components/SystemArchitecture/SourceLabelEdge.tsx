import {
  EdgeLabelRenderer,
  type EdgeProps,
  getSmoothStepPath,
} from "@xyflow/react";
import { useEffect, useRef, useState } from "react";

/**
 * Custom edge that places its label at a specific percentage of the *actual rendered
 * SVG path* (not the straight line between source and target). This is critical for
 * smoothstep edges which have 90 degree bends — straight-line interpolation keeps all
 * labels from the same source clustered at the same point before those bends.
 */
export const SourceLabelEdge = ({
  id,
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
  label,
  style,
  labelStyle,
  markerEnd,
  data,
}: EdgeProps) => {
  const labelOffset = (data?.labelOffset as number) ?? 0.45;
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const pathRef = useRef<SVGPathElement>(null);
  const [labelPos, setLabelPos] = useState<{ px: number; py: number } | null>(null);

  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    const len = el.getTotalLength();
    const pt = el.getPointAtLength(len * labelOffset);
    setLabelPos({ px: pt.x, py: pt.y });
  }, [edgePath, labelOffset]);

  const lx = labelPos?.px ?? sourceX + (targetX - sourceX) * labelOffset;
  const ly = labelPos?.py ?? sourceY + (targetY - sourceY) * labelOffset;

  return (
    <>
      <path
        ref={pathRef}
        id={id}
        d={edgePath}
        fill="none"
        style={style}
        markerEnd={markerEnd}
        className="react-flow__edge-path"
      />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${lx}px,${ly}px)`,
              background: "rgba(255,255,255,0.95)",
              borderRadius: 4,
              padding: "2px 6px",
              fontSize: 11,
              color: "#334155",
              fontWeight: 500,
              pointerEvents: "none",
              whiteSpace: "nowrap",
              ...labelStyle,
            }}
            className="nodrag nopan"
          >
            {String(label)}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};
