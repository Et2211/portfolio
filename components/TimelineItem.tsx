"use client";

import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import Image from "next/image";

import type { TimelineItem as TimelineItemType } from "@/lib/strapi";

interface TimelineItemProps {
  item: TimelineItemType;
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
      key={item.id}
      className="border-l-2 border-zinc-300 dark:border-zinc-700 pl-6 pb-8"
    >
      <h3 className="text-2xl font-semibold text-black dark:text-white mb-1">
        {item.Title}
      </h3>
      {dateRange && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
          {dateRange}
        </p>
      )}
      {item.description && item.description.length > 0 && (
        <div className="prose dark:prose-invert text-zinc-600 dark:text-zinc-400">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <BlocksRenderer content={item.description as any} />
        </div>
      )}
      {item.Image && (
        <Image
          src={`${process.env.NEXT_PUBLIC_STRAPI_URL || ""}${item.Image.url}`}
          alt={item.Image.alternativeText || item.Title}
          width={item.Image.width}
          height={item.Image.height}
          className="mt-4 rounded-lg max-w-md"
        />
      )}
    </div>
  );
};
