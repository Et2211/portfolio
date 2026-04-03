"use client";

import { PortableText } from "@portabletext/react";
import Image from "next/image";

import { useInView } from "@/hooks/useInView";
import type { SanityBlock, TimelineItem as TimelineItemType } from "@/types/generated/sanity";


type TimelineItemWithBuiltUrl = Omit<TimelineItemType, "image"> & {
  image?: string | null;
};

interface TimelineItemProps {
  item: TimelineItemWithBuiltUrl;
  index: number;
}

const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
};

export const TimelineItem = ({ item, index }: TimelineItemProps) => {
  const isLeft = index % 2 === 0;
  const { ref, isInView } = useInView({ threshold: 0.2 });

  const startDate = item.startDate ? formatDate(item.startDate) : "";
  const endDate = item.finishDate ? formatDate(item.finishDate) : "Present";
  const dateRange = startDate ? `${startDate} – ${endDate}` : "";

  const card = (
    <div
      className={`w-full md:w-[calc(50%-2rem)] transition-all duration-700 ease-out ${
        isInView
          ? "opacity-100 translate-x-0"
          : isLeft
            ? "opacity-0 md:-translate-x-8"
            : "opacity-0 md:translate-x-8"
      }`}
    >
      <div className={`rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 ${isLeft ? "md:text-right" : "md:text-left"}`}>
        <h3 className="text-lg font-semibold text-black dark:text-white mb-1">
          {item.title}
        </h3>
        {dateRange && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
            {dateRange}
          </p>
        )}
        {item.image && (
          <div className={`mb-4 ${isLeft ? "md:flex md:justify-end" : ""}`}>
            <Image
              src={item.image}
              alt={item.title ?? ""}
              width={400}
              height={300}
              className="rounded-lg w-full max-w-sm object-contain"
            />
          </div>
        )}
        {item.description && item.description.length > 0 && (
          <div className={`prose prose-sm prose-gray dark:prose-invert max-w-none ${isLeft ? "md:text-right" : "md:text-left"}`}>
            <PortableText value={item.description as SanityBlock[]} />
          </div>
        )}
      </div>
    </div>
  );

  const dot = (
    <div className="flex flex-col items-center flex-shrink-0 w-8 md:w-16">
      <div
        className={`w-4 h-4 rounded-full border-2 border-zinc-900 dark:border-white bg-white dark:bg-zinc-900 transition-all duration-500 ${
          isInView ? "scale-100" : "scale-0"
        }`}
      />
    </div>
  );

  return (
    <div
      ref={ref}
      className="relative flex items-start gap-0 py-8"
    >
      {/* Mobile: always left-aligned dot + full-width card */}
      <div className="flex md:hidden items-start w-full">
        {dot}
        <div className="flex-1">{card}</div>
      </div>

      {/* Desktop: alternating layout */}
      <div className="hidden md:flex w-full items-start">
        {isLeft ? (
          <>
            {card}
            {dot}
            <div className="w-[calc(50%-2rem)]" />
          </>
        ) : (
          <>
            <div className="w-[calc(50%-2rem)]" />
            {dot}
            {card}
          </>
        )}
      </div>
    </div>
  );
};
