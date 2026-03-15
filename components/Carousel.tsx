"use client";


import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

import type { SanityBlock, SanityKeyed, TimelineItem } from "@/types/generated/sanity";

import { ImageWithDescription as ImageWithDescriptionComponent } from "./ImageWithDescription";
import { Timeline as TimelineComponent } from "./Timeline";

// Runtime types after server-side image URL building
type TimelineItemWithBuiltUrl = Omit<TimelineItem, "image"> & { image?: string | null };

type TimelineBlock = {
  _type: "timeline";
  _key?: string;
  heading?: string;
  items?: TimelineItemWithBuiltUrl[];
};

type ImageWithDescriptionBlock = {
  _type: "imageWithDescription";
  _key?: string;
  heading?: string;
  image?: string | null;
  description?: SanityKeyed<SanityBlock>[];
};

type CarouselBlock = {
  _type: "carousel";
  _key?: string;
  heading?: string;
  autoplay?: boolean;
  interval?: number;
  showDots?: boolean;
  items?: (TimelineBlock | ImageWithDescriptionBlock)[];
};

interface CarouselProps {
  carousel: CarouselBlock;
}

export const Carousel = ({ carousel }: CarouselProps) => {
  const showDots = carousel.showDots ?? true;
  
  const [isMobile, setIsMobile] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    
    resizeObserver.observe(node);
    setContainerWidth(node.offsetWidth);
    
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const autoplayOptions = carousel.autoplay
    ? [Autoplay({ delay: carousel.interval ?? 5000, stopOnInteraction: false })]
    : [];

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      slidesToScroll: 1,
      align: "start"
    },
    autoplayOptions
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (!carousel.items || carousel.items.length === 0) return null;

  // Calculate how many 300px slides can fit in the container
  // Each slide has 300px width + 16px padding (8px on each side)
  const slideWidthWithPadding = 316; // 300px + 16px padding
  const calculatedSlidesToShow = Math.max(1, Math.floor(containerWidth / slideWidthWithPadding));
  
  const effectiveSlidesToShow = isMobile ? 1 : calculatedSlidesToShow || 1;
  const slideWidth = `${100 / effectiveSlidesToShow}%`;
  const shouldCenter = carousel.items.length < effectiveSlidesToShow;

  return (
    <div className="relative" ref={containerRef}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className={`flex ${shouldCenter ? 'justify-center' : ''}`}>
          {carousel.items.map((item, idx) => {
            if (item._type === "imageWithDescription") {
              return (
                <div
                  key={item._key || idx}
                  className="min-w-0 flex-shrink-0 px-2"
                  style={{ flexBasis: slideWidth }}
                >
                  <div className="w-[300px] h-[300px] mx-auto overflow-auto">
                    <ImageWithDescriptionComponent
                      image={(item as ImageWithDescriptionBlock).image}
                      description={(item as ImageWithDescriptionBlock).description}
                    />
                  </div>
                </div>
              );
            }
            if (item._type === "timeline") {
              return (
                <div
                  key={item._key || idx}
                  className="min-w-0 flex-shrink-0 px-2"
                  style={{ flexBasis: slideWidth }}
                >
                  <div className="w-[300px] h-[300px] mx-auto overflow-auto">
                    <TimelineComponent items={(item as TimelineBlock).items || []} />
                  </div>
                </div>
              );
            }
            return (
              <div
                key={idx}
                className="min-w-0 flex-shrink-0 px-2"
                style={{ flexBasis: slideWidth }}
              >
                <div className="w-[300px] h-[300px] mx-auto" />
              </div>
            );
          })}
        </div>
      </div>

      {showDots && scrollSnaps.length > 1 && carousel.items.length > effectiveSlidesToShow && (
        <div className="flex justify-center gap-2 mt-4">
          {scrollSnaps.map((snap, index) => (
            <button
              key={index}
              type="button"
              className={`h-3 w-3 rounded-full transition-all ${
                index === selectedIndex
                  ? "bg-black dark:bg-white w-8"
                  : "bg-gray-600 dark:bg-gray-400"
              }`}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
