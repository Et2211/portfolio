"use client";

import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import Image from "next/image";

import type { TimelineItem as TimelineItemType } from "@/lib/strapi";

interface TimelineItemProps {
  item: TimelineItemType;
}

export const TimelineItem = ({ item }: TimelineItemProps) => {
  return (
    <div
      key={item.id}
      className="border-l-2 border-zinc-300 dark:border-zinc-700 pl-6 pb-8"
    >
      <h3 className="text-2xl font-semibold text-black dark:text-white mb-2">
        {item.Title}
      </h3>
      {item.description && item.description.length > 0 && (
        <div className="prose dark:prose-invert text-zinc-600 dark:text-zinc-400">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <BlocksRenderer content={item.description as any} />
        </div>
      )}
      {item.Image && (
        <Image
          src={item.Image.url}
          alt={item.Image.alternativeText || item.Title}
          width={item.Image.width}
          height={item.Image.height}
          className="mt-4 rounded-lg max-w-md"
        />
      )}
    </div>
  );
};
