import { DynamicComponentRenderer } from "./DynamicComponentRenderer";

export type GridLayoutBlock = {
  _type: "gridLayout";
  _key?: string;
  cols?: number;
  items?: import("./DynamicComponentRenderer").DynamicComponentWithBuiltUrls[];
};

const COL_CLASSES: Record<number, string> = {
  1: "grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
  5: "sm:grid-cols-5",
  6: "sm:grid-cols-6",
};

export const Grid = ({ cols = 2, items = [] }: GridLayoutBlock) => {
  if (items.length === 0) return null;

  const colClass = COL_CLASSES[cols] ?? "sm:grid-cols-2";

  return (
    <div className={`grid grid-cols-1 ${colClass} gap-6 items-start`}>
      {items.map((item, idx) => (
        <DynamicComponentRenderer key={item._key ?? idx} components={[item]} />
      ))}
    </div>
  );
};
