import type { TimelineItem as TimelineItemType } from "@/lib/strapi";

import { TimelineItem } from "./TimelineItem";

interface TimelineProps {
  items: TimelineItemType[];
}

export const Timeline = ({ items }: TimelineProps) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {items.map((item) => (
        <TimelineItem key={item.id} item={item} />
      ))}
    </div>
  );
};
