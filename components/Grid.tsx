import type {
  DynamicComponentWithBuiltUrls,
  GridLayoutBlock,
} from "@/types/dynamicComponent";

export type { GridLayoutBlock };

type GridProps = GridLayoutBlock & {
  renderItem: (
    item: DynamicComponentWithBuiltUrls,
    idx: number,
  ) => React.ReactNode;
};

const COL_CLASSES: Record<number, string> = {
  1: "grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 md:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
  5: "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
  6: "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
};

export const Grid = ({ cols = 2, items = [], renderItem }: GridProps) => {
  if (items.length === 0) return null;

  const colClass = COL_CLASSES[cols] ?? "sm:grid-cols-2";

  return (
    <div className={`grid grid-cols-1 ${colClass} gap-6 items-start`}>
      {items.map((item, idx) => renderItem(item, idx))}
    </div>
  );
};
