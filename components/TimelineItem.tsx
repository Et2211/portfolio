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

// Helper to construct proper image URL for Strapi (handles media subdomain in production)
const getImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return "";

  // If URL is already absolute, check if it needs domain replacement
  if (imageUrl.startsWith("http")) {
    // Replace incorrect domain with media subdomain if needed
    if (imageUrl.includes("strapiapp.com") && !imageUrl.includes("media")) {
      return imageUrl.replace("strapiapp.com", "media.strapiapp.com");
    }
    return imageUrl;
  }

  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "";
  if (!baseUrl) return imageUrl;

  // For Strapi Cloud with media subdomain, replace domain with media subdomain
  if (baseUrl.includes("strapiapp.com") && !baseUrl.includes("media")) {
    const mediaUrl = baseUrl.replace("strapiapp.com", "media.strapiapp.com");
    return `${mediaUrl}${imageUrl}`;
  }

  // For local or other setups, use base URL directly
  return `${baseUrl}${imageUrl}`;
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
      {(item.Image || (item.description && item.description.length > 0)) && (
        <div className="mt-4 flex flex-col md:flex-row md:gap-6">
          {item.Image && (
            <div className="flex-shrink-0">
              <Image
                src={getImageUrl(item.Image.url)}
                alt={item.Image.alternativeText || item.Title}
                width={item.Image.width}
                height={item.Image.height}
                className="rounded-lg max-w-md w-full md:w-auto"
              />
            </div>
          )}
          {item.description && item.description.length > 0 && (
            <div className="prose dark:prose-invert text-zinc-600 dark:text-zinc-400 mt-4 md:mt-0">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <BlocksRenderer content={item.description as any} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
