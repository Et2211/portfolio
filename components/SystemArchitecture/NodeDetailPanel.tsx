import type { ArchNode, SanityKeyed } from "@/types/generated/sanity";

import { TIER_COLORS, TIER_LABELS } from "./constants";

interface NodeDetailPanelProps {
  selectedNode: SanityKeyed<ArchNode> | null;
  onClose: () => void;
}

export const NodeDetailPanel = ({ selectedNode, onClose }: NodeDetailPanelProps) => {
  if (!selectedNode) return null;

  return (
    <div className="w-72 flex-shrink-0 rounded-xl border border-zinc-200 dark:border-zinc-700 p-5 flex flex-col gap-3 bg-white dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-white leading-tight">
          {selectedNode.label}
        </h3>
        <button
          type="button"
          onClick={onClose}
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
  );
};
