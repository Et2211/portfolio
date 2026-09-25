"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { Pause, Play } from "lucide-react";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

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
  // JS-driven, so the CSS reduced-motion rule can't stop it.
  const reduceMotion = usePrefersReducedMotion();
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

  // Autoplaying content needs a way to stop it (WCAG 2.2.2): a pause button,
  // plus pausing while the slides are hovered or focused.
  const canAutoplay = autoplay && !reduceMotion;
  const [isPaused, setIsPaused] = useState(false);
  const plugins = useMemo(
    () =>
      canAutoplay && !isPaused
        ? [
            Autoplay({
              delay: interval,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
              stopOnFocusIn: true,
            }),
          ]
        : [],
    [canAutoplay, isPaused, interval],
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

      {(canAutoplay || showDots) && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {canAutoplay && (
            <button
              type="button"
              onClick={() => setIsPaused((paused) => !paused)}
              aria-label={isPaused ? "Play carousel" : "Pause carousel"}
              className="mr-2 flex h-7 w-7 items-center justify-center rounded-full text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              {isPaused ? (
                <Play aria-hidden="true" size={14} />
              ) : (
                <Pause aria-hidden="true" size={14} />
              )}
            </button>
          )}
          {showDots &&
            scrollSnaps.length > 1 &&
            slides.length > slidesToShow &&
            scrollSnaps.map((_, index) => (
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
