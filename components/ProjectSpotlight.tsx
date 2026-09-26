"use client";

import { useState } from "react";

import { SectionHeading } from "@/components/atoms/SectionHeading";
import { ProjectFeature } from "@/components/molecules/ProjectFeature";
import type { ProjectSpotlightBlock } from "@/types/blocks";

export const ProjectSpotlight = ({
  heading,
  projects,
}: ProjectSpotlightBlock) => {
  const [index, setIndex] = useState(0);

  if (!projects || projects.length === 0) {
    return null;
  }

  const project = projects[index];
  const total = projects.length;

  return (
    <section className="py-4">
      {heading && <SectionHeading>{heading}</SectionHeading>}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <ProjectFeature project={project} layout="spacious" />

        {total > 1 && (
          <div className="flex items-center justify-between border-t border-zinc-200 px-6 py-3 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setIndex((prev) => (prev - 1 + total) % total)}
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
            >
              ← Prev
            </button>
            <div className="flex items-center gap-2">
              {projects.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === index
                      ? "w-5 bg-black dark:bg-white"
                      : "w-2 bg-zinc-400 dark:bg-zinc-600"
                  }`}
                  aria-label={`Go to project ${idx + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIndex((prev) => (prev + 1) % total)}
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
