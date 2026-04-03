"use client";

import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { useState } from "react";

import type { FeaturedProject } from "@/types/blocks";

export type ProjectSpotlightBlock = {
  _type: "projectSpotlight";
  _key?: string;
  heading?: string;
  projects?: FeaturedProject[];
};

export const ProjectSpotlight = ({
  heading,
  projects,
}: ProjectSpotlightBlock) => {
  const [index, setIndex] = useState(0);

  if (!projects || projects.length === 0) return null;

  const project = projects[index];
  const total = projects.length;

  return (
    <section className="py-4">
      {heading && (
        <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
          {heading}
        </h2>
      )}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900">
        <div className="flex flex-col lg:flex-row">
          {project.image && (
            <div className="relative w-full lg:w-1/2 aspect-video lg:aspect-auto lg:min-h-[300px]">
              <Image
                src={project.image}
                alt={project.title ?? "Project screenshot"}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          )}
          <div className="flex flex-col flex-1 gap-4 p-6 lg:p-8">
            {project.title && (
              <h3 className="text-xl font-semibold text-black dark:text-white">
                {project.title}
              </h3>
            )}
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-700 dark:text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {project.description && project.description.length > 0 && (
              <div className="prose prose-sm prose-gray dark:prose-invert max-w-none">
                <PortableText value={project.description} />
              </div>
            )}
            {(project.liveUrl || project.githubUrl || project.moreInfoUrl) && (
              <div className="flex gap-3 mt-auto">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-black dark:text-white underline underline-offset-2 hover:opacity-70 transition-opacity"
                  >
                    Live ↗
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-black dark:text-white underline underline-offset-2 hover:opacity-70 transition-opacity"
                  >
                    GitHub ↗
                  </a>
                )}
                {project.moreInfoUrl && (
                  <a
                    href={project.moreInfoUrl}
                    className="text-sm font-medium text-black dark:text-white underline underline-offset-2 hover:opacity-70 transition-opacity"
                  >
                    More info ↗
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {total > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setIndex((prev) => (prev - 1 + total) % total)}
              className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
            >
              ← Prev
            </button>
            <div className="flex gap-2 items-center">
              {projects.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === index
                      ? "bg-black dark:bg-white w-5"
                      : "bg-zinc-400 dark:bg-zinc-600 w-2"
                  }`}
                  aria-label={`Go to project ${idx + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIndex((prev) => (prev + 1) % total)}
              className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
