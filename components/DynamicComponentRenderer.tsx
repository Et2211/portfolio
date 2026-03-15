
import type { ImageWithDescription as ImageWithDescriptionType, TimelineItem } from "@/types/generated/sanity";

import { ImageWithDescription } from "./ImageWithDescription";
import { Timeline } from "./Timeline";

// TimelineItem with pre-built image URL (string) instead of SanityImage object
type TimelineItemWithBuiltUrl = Omit<TimelineItem, "image"> & { image?: string | null };

type SupportedComponent =
  | {
      _type: "timeline";
      _key?: string;
      items: TimelineItemWithBuiltUrl[];
    }
  | (ImageWithDescriptionType & { _key?: string });

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
          case "imageWithDescription":
            return (
              <ImageWithDescription
                key={component._key || index}
                image={component.image}
                description={component.description}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
};
