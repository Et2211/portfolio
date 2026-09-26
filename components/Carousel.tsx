import type { CarouselBlock } from "@/types/blocks";

import { CarouselViewport } from "./CarouselViewport";
import { ImageWithDescription } from "./ImageWithDescription";
import { Timeline } from "./Timeline";

type CarouselItem = NonNullable<CarouselBlock["items"]>[number];

const renderSlide = (item: CarouselItem) => {
  switch (item._type) {
    case "imageWithDescription":
      return (
        <ImageWithDescription
          icon={item.icon}
          image={item.image}
          description={item.description}
          textPosition={item.textPosition}
          imageSize={96}
        />
      );
    case "timeline":
      return <Timeline items={item.items ?? []} />;
    default:
      return null;
  }
};

// Server component: slides are rendered here (so their icons/images resolve
// on the server) and handed to the client viewport for layout and swiping.
export const Carousel = ({
  items,
  autoplay,
  interval,
  showDots,
}: CarouselBlock) => {
  if (!items?.length) {
    return null;
  }

  return (
    <CarouselViewport
      autoplay={autoplay}
      interval={interval}
      showDots={showDots}
      slides={items.map((item, idx) => ({
        key: item._key ?? String(idx),
        content: renderSlide(item),
      }))}
    />
  );
};
