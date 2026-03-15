
import type { SanityBlock, SanityKeyed, TimelineItem } from "@/types/generated/sanity";

import { type CarouselBlock, Carousel as CarouselComponent } from "./Carousel";
import { ImageWithDescription as ImageWithDescriptionComponent } from "./ImageWithDescription";
import { Timeline as TimelineComponent } from "./Timeline";

// Runtime types after server-side image URL building
export type TimelineItemWithBuiltUrl = Omit<TimelineItem, "image"> & { image?: string | null };

export type TimelineBlock = {
  _type: "timeline";
  _key?: string;
  heading?: string;
  items?: TimelineItemWithBuiltUrl[];
};

export type ImageWithDescriptionBlock = {
  _type: "imageWithDescription";
  _key?: string;
  heading?: string;
  image?: string | null;
  description?: SanityKeyed<SanityBlock>[];
  textPosition?: 'above' | 'below' | 'before' | 'after';
};

type DynamicComponentBlock = TimelineBlock | ImageWithDescriptionBlock | CarouselBlock;

export type DynamicComponentWithBuiltUrls = {
  _type: "dynamicComponent";
  _key?: string;
  heading?: string;
  component?: DynamicComponentBlock[];
};

interface DynamicComponentRendererProps {
  components: DynamicComponentWithBuiltUrls[];
}


export const DynamicComponentRenderer = ({ components }: DynamicComponentRendererProps) => {
  if (!components || components.length === 0) {
    return null;
  }

  return (
    <div className="space-y-12">
      {components.map((dynamicComponent, index) => {
        if (!dynamicComponent.component || dynamicComponent.component.length === 0) {
          return null;
        }
        // Only one block per dynamicComponent.component due to validation
        const block = dynamicComponent.component[0];
        if (!block) return null;

        switch (block._type) {
          case "timeline":
            return (
              <TimelineComponent
                key={block._key || index}
                items={(block as TimelineBlock).items || []}
              />
            );
          case "imageWithDescription":
            return (
              <ImageWithDescriptionComponent
                key={block._key || index}
                image={(block as ImageWithDescriptionBlock).image}
                description={(block as ImageWithDescriptionBlock).description}
                textPosition={(block as ImageWithDescriptionBlock).textPosition}
              />
            );
          case "carousel":
            return (
              <CarouselComponent
                key={block._key || index}
                carousel={block as CarouselBlock}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
};
