"use client";

import Image from "next/image";
import { useState } from "react";

export type FeatureItem = {
  _key?: string;
  title?: string;
  summary?: string;
  detail?: string;
  image?: string | null;
};

export type FeatureAccordionBlock = {
  _type: "featureAccordion";
  _key?: string;
  heading?: string;
  items?: FeatureItem[];
};

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    className={`shrink-0 w-4 h-4 text-zinc-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
      {items.map((item, idx) => {
        const key = item._key ?? String(idx);
        const isOpen = openKeys.has(key);
        return (
          <div
            key={key}
            className="rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggle(key)}
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${key}`}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {item.title}
                </span>
                {item.summary && (
                  <span className="text-sm text-zinc-500 dark:text-zinc-400 leading-snug">
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
                className="px-5 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                  {item.detail}
                </p>
                {item.image && (
                  <div className="mt-4 relative w-full aspect-video rounded-lg overflow-hidden">
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
