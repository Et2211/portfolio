"use client";

import "@xyflow/react/dist/style.css";

import {
  Background,
  Controls,
  type Node,
  ReactFlow,
} from "@xyflow/react";
import { useState } from "react";

import type { ArchEdge, ArchNode, SanityKeyed } from "@/types/generated/sanity";

import { TIER_COLORS, TIER_LABELS, TIER_ORDER } from "./constants";
import { buildFlowEdges, buildFlowNodes } from "./layout";
import { NodeDetailPanel } from "./NodeDetailPanel";
import { SourceLabelEdge } from "./SourceLabelEdge";

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
        <NodeDetailPanel selectedNode={selectedNode} onClose={() => setSelectedNode(null)} />
      </div>
    </div>
  );
};
