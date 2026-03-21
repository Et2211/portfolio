import type { Edge, Node } from "@xyflow/react";

import type { ArchEdge, ArchNode, SanityKeyed } from "@/types/generated/sanity";

import {
  NODE_HEIGHT,
  NODE_WIDTH,
  NODE_X_GAP,
  TIER_COLORS,
  TIER_ORDER,
  TIER_Y_GAP,
} from "./constants";

export function buildFlowNodes(
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
  for (const [tier, nodes] of Object.entries(byTier)) {
    if (tier === "content" || nodes.length !== 1) continue;
    const nodeId = nodes[0].nodeId ?? "";
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

  // Third pass: content nodes sit to the right
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

export function buildFlowEdges(sanityEdges: Array<SanityKeyed<ArchEdge>>): Edge[] {
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
