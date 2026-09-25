"use client";

import "@xyflow/react/dist/style.css";

import {
  Background,
  Controls,
  type NodeChange,
  ReactFlow,
} from "@xyflow/react";
import { useCallback, useMemo, useState } from "react";

import type { SystemArchitectureBlock } from "@/types/blocks";

import { TIER_COLORS, TIER_LABELS, tierOrder } from "./constants";
import { buildFlowEdges, buildFlowNodes } from "./layout";
import { NodeDetailPanel } from "./NodeDetailPanel";
import { SourceLabelEdge } from "./SourceLabelEdge";

const edgeTypes = { sourceLabel: SourceLabelEdge };

// Nodes can't be moved or deleted here, so replace React Flow's default
// screen-reader instructions (which describe both).
const ARIA_LABELS = {
  "node.a11yDescription.default":
    "Press enter or space to show details about this component.",
  "node.a11yDescription.keyboardDisabled":
    "Press enter or space to show details about this component.",
};

export const SystemArchitecture = ({
  nodes,
  edges,
  primaryFlowLabel,
}: SystemArchitectureBlock) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { flowNodes, flowEdges, nodesById, tiersPresent } = useMemo(() => {
    const sanityNodes = nodes ?? [];
    const sanityEdges = edges ?? [];
    return {
      flowNodes: buildFlowNodes(sanityNodes, sanityEdges),
      flowEdges: buildFlowEdges(sanityEdges),
      nodesById: new Map(sanityNodes.map((node) => [node.nodeId, node])),
      // Tiers present, in row order, for the legend
      tiersPresent: [
        ...new Set(sanityNodes.map((node) => node.tier ?? "infra")),
      ].sort((ta, tb) => tierOrder(ta) - tierOrder(tb)),
    };
  }, [nodes, edges]);

  // Only the selected id is state; the nodes React Flow draws are derived
  // from props every render, so refreshed CMS data can't leave them stale.
  const flowNodesWithSelection = useMemo(
    () =>
      flowNodes.map((node) => ({ ...node, selected: node.id === selectedId })),
    [flowNodes, selectedId],
  );
  // If the selected node disappears from the data, the panel closes.
  const selectedNode = (selectedId && nodesById.get(selectedId)) || null;

  // Clicking a node or pressing enter/space on a focused one selects it;
  // clicking the background deselects. The detail panel follows.
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    for (const change of changes) {
      if (change.type !== "select") {
        continue;
      }
      if (change.selected) {
        setSelectedId(change.id);
      } else {
        setSelectedId((current) => (current === change.id ? null : current));
      }
    }
  }, []);

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {tiersPresent.map((tier) => {
          const colors = TIER_COLORS[tier] ?? TIER_COLORS.infra;
          return (
            <span
              key={tier}
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
              style={{
                background: colors.bg,
                color: colors.text,
                border: `1.5px solid ${colors.border}`,
              }}
            >
              {TIER_LABELS[tier] ?? tier}
            </span>
          );
        })}
        {primaryFlowLabel && (
          <span
            className="inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium"
            style={{
              background: "#eff6ff",
              color: "#1d4ed8",
              border: "1.5px solid #93c5fd",
            }}
          >
            <svg width="18" height="4" aria-hidden="true" className="shrink-0">
              <line
                x1="0"
                y1="2"
                x2="18"
                y2="2"
                stroke="#3b82f6"
                strokeWidth="2.5"
              />
            </svg>
            {primaryFlowLabel}
          </span>
        )}
      </div>

      <div className="flex gap-4">
        {/* Diagram */}
        <div
          className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700"
          style={{ height: 1050, flexGrow: 1, minWidth: 0 }}
        >
          <ReactFlow
            nodes={flowNodesWithSelection}
            edges={flowEdges}
            edgeTypes={edgeTypes}
            onNodesChange={handleNodesChange}
            ariaLabelConfig={ARIA_LABELS}
            edgesFocusable={false}
            deleteKeyCode={null}
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
        <NodeDetailPanel
          selectedNode={selectedNode}
          onClose={() => setSelectedId(null)}
        />
      </div>
    </div>
  );
};
