"use client";

import "@xyflow/react/dist/style.css";

import {
  Background,
  Controls,
  type Edge,
  EdgeLabelRenderer,
  type EdgeProps,
  type Node,
  ReactFlow,
  getSmoothStepPath,
} from "@xyflow/react";
import { useEffect, useRef, useState } from "react";

import type { ArchEdge, ArchNode, SanityKeyed } from "@/types/generated/sanity";

export type SystemArchitectureBlock = {
  _type: "systemArchitecture";
  _key?: string;
  heading?: string;
  nodes?: Array<SanityKeyed<ArchNode>>;
  edges?: Array<SanityKeyed<ArchEdge>>;
};

interface SystemArchitectureProps {
  block: SystemArchitectureBlock;
}

const TIER_ORDER: Record<string, number> = {
  frontend: 0,
  bff: 1,
  services: 2,
  data: 3,
  infra: 4,
  observability: 5,
  content: 0, // same row as frontend, positioned to the right
};

const TIER_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  frontend:    { bg: "#dbeafe", border: "#3b82f6", text: "#1e3a8a" },
  bff:         { bg: "#ede9fe", border: "#7c3aed", text: "#3b0764" },
  services:    { bg: "#fef3c7", border: "#f59e0b", text: "#78350f" },
  data:        { bg: "#d1fae5", border: "#10b981", text: "#064e3b" },
  content:     { bg: "#fce7f3", border: "#ec4899", text: "#831843" },
  infra:       { bg: "#f3f4f6", border: "#6b7280", text: "#111827" },
  observability: { bg: "#fff7ed", border: "#f97316", text: "#7c2d12" },
};

const NODE_WIDTH = 175;
const NODE_HEIGHT = 50;
const TIER_Y_GAP = 190;
const NODE_X_GAP = 420;

function buildFlowNodes(
  sanityNodes: Array<SanityKeyed<ArchNode>>,
  sanityEdges: Array<SanityKeyed<ArchEdge>>
): Node[] {
  // Group nodes by tier
  const byTier: Record<string, Array<SanityKeyed<ArchNode>>> = {};
  for (const node of sanityNodes) {
    const tier = node.tier ?? "infra";
    if (!byTier[tier]) byTier[tier] = [];
    byTier[tier].push(node);
  }

  const nodePositions: Record<string, { x: number; y: number }> = {};
  const flowNodes: Node[] = [];

  const makeStyle = (tier: string) => {
    const colors = TIER_COLORS[tier] ?? TIER_COLORS.infra;
    return {
      background: colors.bg,
      border: `2px solid ${colors.border}`,
      color: colors.text,
      borderRadius: 8,
      fontWeight: 600,
      fontSize: 12,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      textAlign: "center" as const,
      lineHeight: 1.3,
      padding: "4px 8px",
      whiteSpace: "normal" as const,
    };
  };

  // First pass: center all non-content tiers in their row
  for (const [tier, nodes] of Object.entries(byTier)) {
    if (tier === "content") continue;
    const posY = (TIER_ORDER[tier] ?? 5) * TIER_Y_GAP + 40;
    const totalWidth = nodes.length * NODE_X_GAP;
    const startX = -totalWidth / 2 + NODE_X_GAP / 2;
    nodes.forEach((node, idx) => {
      const nodeId = node.nodeId ?? `node-${idx}`;
      const posX = startX + idx * NODE_X_GAP;
      nodePositions[nodeId] = { x: posX, y: posY };
      flowNodes.push({
        id: nodeId,
        position: { x: posX, y: posY },
        data: { label: node.label ?? nodeId },
        style: makeStyle(tier),
      });
    });
  }

  // Second pass: realign single-node tiers directly below their source node.
  // This prevents e.g. Orders DB (data tier, 1 node) from sitting centred at x=0
  // and causing edge labels from the services tier to pile on top of each other.
  for (const [tier, nodes] of Object.entries(byTier)) {
    if (tier === "content" || nodes.length !== 1) continue;
    const nodeId = nodes[0].nodeId ?? "";
    // Find the first edge whose target is this node and whose source has a known position
    const incomingEdge = sanityEdges.find(
      (e) => e.targetId === nodeId && nodePositions[e.sourceId ?? ""]
    );
    if (incomingEdge?.sourceId && nodePositions[incomingEdge.sourceId]) {
      const sourceX = nodePositions[incomingEdge.sourceId].x;
      const flowNode = flowNodes.find((fn) => fn.id === nodeId);
      if (flowNode) {
        flowNode.position = { ...flowNode.position, x: sourceX };
        nodePositions[nodeId] = { ...nodePositions[nodeId], x: sourceX };
      }
    }
  }

  // Third pass: content nodes sit to the right of all other nodes at the frontend y-level
  const contentNodes = byTier["content"] ?? [];
  if (contentNodes.length > 0) {
    const allRightEdges = flowNodes.map((fn) => fn.position.x + NODE_WIDTH);
    const maxRightEdge = allRightEdges.length > 0 ? Math.max(...allRightEdges) : 0;
    const contentStartX = maxRightEdge + NODE_X_GAP;
    const frontendY = (TIER_ORDER["frontend"] ?? 0) * TIER_Y_GAP + 40;
    contentNodes.forEach((node, idx) => {
      const nodeId = node.nodeId ?? `content-${idx}`;
      flowNodes.push({
        id: nodeId,
        position: { x: contentStartX + idx * NODE_X_GAP, y: frontendY },
        data: { label: node.label ?? nodeId },
        style: makeStyle("content"),
      });
    });
  }

  return flowNodes;
}

function buildFlowEdges(sanityEdges: Array<SanityKeyed<ArchEdge>>): Edge[] {
  // Pre-count labelled edges per source so we can spread their label positions
  // and prevent them from landing on top of each other.
  const sourceLabelTotal: Record<string, number> = {};
  for (const edge of sanityEdges) {
    if (!edge.label) continue;
    const src = edge.sourceId ?? "";
    sourceLabelTotal[src] = (sourceLabelTotal[src] ?? 0) + 1;
  }
  const sourceLabelIdx: Record<string, number> = {};

  return sanityEdges.map((edge, edgeIdx) => {
    const variant = edge.variant ?? "default";
    const isPrimary = variant === "primary";
    const isError = variant === "error";
    const src = edge.sourceId ?? "";

    // Distribute label offsets between 0.12 and 0.28 across labelled edges
    // from the same source so they never overlap.
    let labelOffset = 0.18;
    if (edge.label) {
      const total = sourceLabelTotal[src] ?? 1;
      const labelIdx = sourceLabelIdx[src] ?? 0;
      sourceLabelIdx[src] = labelIdx + 1;
      labelOffset = total === 1 ? 0.45 : 0.38 + (labelIdx / (total - 1)) * 0.24;
    }

    return {
      id: edge.edgeId ?? `edge-${edgeIdx}`,
      source: src,
      target: edge.targetId ?? "",
      label: edge.label,
      animated: isPrimary,
      data: { labelOffset },
      style: {
        stroke: isError ? "#ef4444" : isPrimary ? "#3b82f6" : "#94a3b8",
        strokeWidth: isPrimary ? 3 : 1.5,
        strokeDasharray: isError ? "6 3" : undefined,
      },
      labelStyle: {
        fontSize: 11,
        fill: isError ? "#b91c1c" : isPrimary ? "#1d4ed8" : "#334155",
        fontWeight: 500,
      },
      type: "sourceLabel",
    };
  });
}

const TIER_LABELS: Record<string, string> = {
  frontend: "Frontend",
  bff: "BFF",
  services: "Services",
  data: "Data",
  content: "Content",
  infra: "Infrastructure",
  observability: "Observability",
};

// Custom edge that places its label at a specific percentage of the *actual rendered
// SVG path* (not the straight line between source and target). This is critical for
// smoothstep edges which have 90° bends — straight-line interpolation keeps all
// labels from the same source clustered at the same point before those bends.
const SourceLabelEdge = ({
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
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
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
}

const edgeTypes = { sourceLabel: SourceLabelEdge };

export const SystemArchitecture = ({ block }: SystemArchitectureProps) => {
  const [selectedNode, setSelectedNode] = useState<SanityKeyed<ArchNode> | null>(null);

  const sanityNodes = block.nodes ?? [];
  const sanityEdges = block.edges ?? [];

  const flowNodes = buildFlowNodes(sanityNodes, sanityEdges);
  const flowEdges = buildFlowEdges(sanityEdges);

  const nodeMap = Object.fromEntries(
    sanityNodes.map((sn) => [sn.nodeId, sn])
  );

  const handleNodeClick = (_evt: React.MouseEvent, node: Node) => {
    const sanityNode = nodeMap[node.id];
    setSelectedNode(sanityNode ?? null);
  };

  // Derive unique tiers present for the legend
  const tiersPresent = [...new Set(sanityNodes.map((sn) => sn.tier ?? "infra"))].sort(
    (ta, tb) => (TIER_ORDER[ta] ?? 3) - (TIER_ORDER[tb] ?? 3)
  );

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {tiersPresent.map((tier) => {
          const colors = TIER_COLORS[tier] ?? TIER_COLORS.infra;
          return (
            <span
              key={tier}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ background: colors.bg, color: colors.text, border: `1.5px solid ${colors.border}` }}
            >
              {TIER_LABELS[tier] ?? tier}
            </span>
          );
        })}
        <span
          className="inline-flex items-center gap-2 text-xs font-medium px-2.5 py-1 rounded-full"
          style={{ background: "#eff6ff", color: "#1d4ed8", border: "1.5px solid #93c5fd" }}
        >
          <svg width="18" height="4" aria-hidden="true" className="shrink-0">
            <line x1="0" y1="2" x2="18" y2="2" stroke="#3b82f6" strokeWidth="2.5" />
          </svg>
          Primary flow (B2B onboarding)
        </span>
      </div>

      <div className="flex gap-4">
        {/* Diagram */}
        <div
          className="rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden"
          style={{ height: 1050, flexGrow: 1, minWidth: 0 }}
        >
          <ReactFlow
            nodes={flowNodes}
            edges={flowEdges}
            edgeTypes={edgeTypes}
            onNodeClick={handleNodeClick}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={true}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#e2e8f0" gap={20} />
            <Controls showInteractive={false} />
          </ReactFlow>
        </div>

        {/* Detail panel */}
        {selectedNode && (
          <div className="w-72 flex-shrink-0 rounded-xl border border-zinc-200 dark:border-zinc-700 p-5 flex flex-col gap-3 bg-white dark:bg-zinc-900">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base font-semibold text-zinc-900 dark:text-white leading-tight">
                {selectedNode.label}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedNode(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-lg leading-none flex-shrink-0"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {selectedNode.tier && (
              <span
                className="self-start inline-flex text-xs font-medium px-2 py-0.5 rounded-full"
                style={{
                  background: (TIER_COLORS[selectedNode.tier] ?? TIER_COLORS.infra).bg,
                  color: (TIER_COLORS[selectedNode.tier] ?? TIER_COLORS.infra).text,
                  border: `1.5px solid ${(TIER_COLORS[selectedNode.tier] ?? TIER_COLORS.infra).border}`,
                }}
              >
                {TIER_LABELS[selectedNode.tier] ?? selectedNode.tier}
              </span>
            )}

            {selectedNode.description && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {selectedNode.description}
              </p>
            )}

            {selectedNode.techUsed && selectedNode.techUsed.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                  Tech Used
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedNode.techUsed as Array<SanityKeyed<string>>).map((tech, techIdx) => (
                    <span
                      key={(tech as { _key?: string })._key ?? techIdx}
                      className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded-full"
                    >
                      {String(tech)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
