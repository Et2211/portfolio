"use client";

import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { useState } from "react";

import { Badge } from "@/components/atoms/Badge";
import { RichText } from "@/components/atoms/RichText";
import { SectionHeading } from "@/components/atoms/SectionHeading";
import { ProjectLinks } from "@/components/molecules/ProjectLinks";
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
        <div className="flex flex-col lg:flex-row">
          {project.image && (
            <div className="relative aspect-video w-full lg:aspect-auto lg:min-h-[300px] lg:w-1/2">
              <Image
                src={project.image}
                alt={project.title ?? "Project screenshot"}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          )}
          <div className="flex flex-1 flex-col gap-4 p-6 lg:p-8">
            {project.title && (
              <h3 className="text-xl font-semibold text-black dark:text-white">
                {project.title}
              </h3>
            )}
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag, idx) => (
                  <Badge key={idx} variant="tag">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            {project.description && project.description.length > 0 && (
              <RichText>
                <PortableText value={project.description} />
              </RichText>
            )}
            <ProjectLinks
              liveUrl={project.liveUrl}
              githubUrl={project.githubUrl}
              moreInfoUrl={project.moreInfoUrl}
              className="mt-auto"
            />
          </div>
        </div>

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
