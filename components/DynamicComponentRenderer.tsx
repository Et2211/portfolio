
import type { TimelineItem } from "@/types/generated/sanity";

import { Timeline } from "./Timeline";


type SupportedComponent = { _type: "timeline"; _key?: string; items: TimelineItem[] };

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
