"use client";

import Image from "next/image";
import { useState } from "react";

import type { FeatureAccordionBlock } from "@/types/blocks";

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

export const FeatureAccordion = ({ items = [] }: FeatureAccordionBlock) => {
  const [openKeys, setOpenKeys] = useState<Set<string>>(new Set());

  const toggle = (key: string) => {
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2">
      {items.map((item, idx) => {
        const key = item._key ?? String(idx);
        const isOpen = openKeys.has(key);
        return (
          <div
            key={key}
            className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700"
          >
            <button
              type="button"
              onClick={() => toggle(key)}
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${key}`}
              className="flex w-full cursor-pointer items-center justify-between gap-4 bg-white px-5 py-4 text-left transition-colors hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {item.title}
                </span>
                {item.summary && (
                  <span className="text-sm leading-snug text-zinc-500 dark:text-zinc-400">
                    {item.summary}
                  </span>
                )}
              </div>
              <ChevronIcon open={isOpen} />
            </button>
            {isOpen && item.detail && (
              <div
                id={`accordion-content-${key}`}
                role="region"
                className="animate-in border-t border-zinc-100 bg-zinc-50 px-5 py-4 duration-200 fade-in slide-in-from-top-2 dark:border-zinc-800 dark:bg-zinc-800/50"
              >
                <p className="text-sm leading-relaxed whitespace-pre-line text-zinc-600 dark:text-zinc-300">
                  {item.detail}
                </p>
                {item.image && (
                  <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-lg">
                    <Image
                      src={item.image}
                      alt={item.title ?? "Feature image"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw rounded"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
