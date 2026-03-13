"use client";

import { PortableText } from "@portabletext/react";
import Image from "next/image";

import type { SanityBlock, TimelineItem as TimelineItemType } from "@/types/generated/sanity";

// TimelineItem with pre-built image URL (string) instead of SanityImage object
type TimelineItemWithBuiltUrl = Omit<TimelineItemType, "image"> & {
  image?: string | null;
};

interface TimelineItemProps {
  item: TimelineItemWithBuiltUrl;
}

const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
};



export const TimelineItem = ({ item }: TimelineItemProps) => {
  const startDate = item.startDate ? formatDate(item.startDate) : "";
  const endDate = item.finishDate ? formatDate(item.finishDate) : "Current";
  const dateRange = startDate ? `${startDate} - ${endDate}` : "";

  return (
    <div
      key={(item as { _key?: string })._key}
      className="border-l-2 border-zinc-300 dark:border-zinc-700 pl-6 pb-8"
    >
      <h3 className="text-2xl font-semibold text-black dark:text-white mb-1">
        {item.title}
      </h3>
      {dateRange && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
          {dateRange}
        </p>
      )}
      {(item.image || (item.description && item.description.length > 0)) && (
        <div className="mt-4 flex flex-col md:flex-row md:gap-6">
          {item.image && (
            <div className="flex-shrink-0">
              <Image
                src={item.image as string}
                alt={item.title ?? ""}
                width={400}
                height={300}
                className="rounded-lg max-w-md w-full md:w-auto"
                objectFit="contain"
              />
            </div>
          )}
          {item.description && item.description.length > 0 && (
            <div className="prose dark:prose-invert text-zinc-600 dark:text-zinc-400 mt-4 md:mt-0">
              <PortableText value={item.description as SanityBlock[]} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
