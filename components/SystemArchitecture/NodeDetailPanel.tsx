import { Eyebrow } from "@/components/atoms/Eyebrow";
import { TagList } from "@/components/molecules/TagList";
import type { ArchNodeData } from "@/types/blocks";

import { TIER_COLORS, TIER_LABELS } from "./constants";

interface NodeDetailPanelProps {
  selectedNode: ArchNodeData | null;
  onClose: () => void;
}

export const NodeDetailPanel = ({
  selectedNode,
  onClose,
}: NodeDetailPanelProps) => {
  if (!selectedNode) {
    return null;
  }

  return (
    <div className="flex w-72 flex-shrink-0 flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base leading-tight font-semibold text-zinc-900 dark:text-white">
          {selectedNode.label}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="flex-shrink-0 text-lg leading-none text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      {selectedNode.tier && (
        <span
          className="inline-flex self-start rounded-full px-2 py-0.5 text-xs font-medium"
          style={{
            background: (TIER_COLORS[selectedNode.tier] ?? TIER_COLORS.infra)
              .bg,
            color: (TIER_COLORS[selectedNode.tier] ?? TIER_COLORS.infra).text,
            border: `1.5px solid ${(TIER_COLORS[selectedNode.tier] ?? TIER_COLORS.infra).border}`,
          }}
        >
          {TIER_LABELS[selectedNode.tier] ?? selectedNode.tier}
        </span>
      )}

      {selectedNode.description && (
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {selectedNode.description}
        </p>
      )}

      {selectedNode.techUsed && selectedNode.techUsed.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <Eyebrow>Tech Used</Eyebrow>
          <TagList tags={selectedNode.techUsed} />
        </div>
      )}
    </div>
  );
};
