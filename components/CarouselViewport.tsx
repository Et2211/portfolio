"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useMediaQuery } from "@/hooks/useMediaQuery";

// Slides are a fixed 300px square plus 8px padding on each side.
const SLIDE_SIZE = 300;
const SLIDE_WIDTH_WITH_PADDING = SLIDE_SIZE + 16;

interface CarouselViewportProps {
  /** Slides rendered on the server; the viewport only lays them out. */
  slides: { key: string; content: ReactNode }[];
  autoplay?: boolean;
  interval?: number;
  showDots?: boolean;
}

export const CarouselViewport = ({
  slides,
  autoplay = false,
  interval = 5000,
  showDots = true,
}: CarouselViewportProps) => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) {
      return;
    }
    const resizeObserver = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    resizeObserver.observe(node);
    return () => resizeObserver.disconnect();
  }, []);

  const plugins = useMemo(
    () =>
      autoplay ? [Autoplay({ delay: interval, stopOnInteraction: false })] : [],
    [autoplay, interval],
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      slidesToScroll: 1,
      align: "start",
      containScroll: "trimSnaps",
    },
    plugins,
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }
    const sync = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setScrollSnaps(emblaApi.scrollSnapList());
    };
    sync();
    emblaApi.on("select", sync);
    emblaApi.on("reInit", sync);
    return () => {
      emblaApi.off("select", sync);
      emblaApi.off("reInit", sync);
    };
  }, [emblaApi]);

  const slidesToShow = isMobile
    ? 1
    : Math.max(1, Math.floor(containerWidth / SLIDE_WIDTH_WITH_PADDING));
  const slideWidth = `${100 / slidesToShow}%`;

  return (
    <div className="relative" ref={containerRef}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div
          className="flex items-start"
          style={{
            justifyContent:
              slides.length < slidesToShow ? "center" : "flex-start",
          }}
        >
          {slides.map((slide) => (
            <div
              key={slide.key}
              className="min-w-0 flex-shrink-0 px-2"
              style={{ flexBasis: slideWidth }}
            >
              <div className="mx-auto flex h-[300px] w-[300px] flex-col overflow-auto">
                {slide.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showDots && scrollSnaps.length > 1 && slides.length > slidesToShow && (
        <div className="mt-4 flex justify-center gap-2">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`h-3 w-3 rounded-full transition-all ${
                index === selectedIndex
                  ? "w-8 bg-black dark:bg-white"
                  : "bg-gray-600 dark:bg-gray-400"
              }`}
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
