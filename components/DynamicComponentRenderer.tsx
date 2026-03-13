
import type { TimelineItem } from "@/types/generated/sanity";

import { Timeline } from "./Timeline";

// TimelineItem with pre-built image URL (string) instead of SanityImage object
type TimelineItemWithBuiltUrl = Omit<TimelineItem, "image"> & { image?: string | null };

type SupportedComponent = {
  _type: "timeline";
  _key?: string;
  items: TimelineItemWithBuiltUrl[];
};

interface DynamicComponentRendererProps {
  components: SupportedComponent[];
}

export const DynamicComponentRenderer = ({
  components,
}: DynamicComponentRendererProps) => {
  if (!components || components.length === 0) {
    return null;
  }

  return (
    <div className="space-y-12">
      {components.map((component, index) => {
        switch (component._type) {
          case "timeline":
            return (
              <Timeline key={component._key || index} items={component.items} />
            );
          default:
            return null;
        }
      })}
    </div>
  );
};
