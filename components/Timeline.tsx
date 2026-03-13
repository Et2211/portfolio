import type { TimelineItem as TimelineItemType } from "@/types/generated/sanity";

import { TimelineItem } from "./TimelineItem";

// TimelineItem with pre-built image URL (string) instead of SanityImage object
type TimelineItemWithBuiltUrl = Omit<TimelineItemType, "image"> & {
  image?: string | null;
};

interface TimelineProps {
  items: TimelineItemWithBuiltUrl[];
}

export const Timeline = ({ items }: TimelineProps) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {items.map((item, idx) => (
        <TimelineItem key={(item as { _key?: string })._key ?? idx} item={item} />
      ))}
    </div>
  );
};
