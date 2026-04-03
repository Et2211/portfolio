import { PortableText } from "@portabletext/react";
import Image from "next/image";

import type { FeaturedProject } from "@/types/blocks";

export type ProjectBentoBlock = {
  _type: "projectBento";
  _key?: string;
  heading?: string;
  projects?: FeaturedProject[];
};

const BentoTile = ({ project }: { project: FeaturedProject }) => (
  <div className="flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors">
    {project.image && (
      <div className="relative w-full aspect-video">
        <Image
          src={project.image}
          alt={project.title ?? "Project screenshot"}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 33vw"
        />
      </div>
    )}
    <div className="flex flex-col flex-1 gap-2 p-4">
      {project.title && (
        <h3 className="font-semibold text-black dark:text-white">
          {project.title}
        </h3>
      )}
      {project.tags && project.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {project.tags.map((tag, idx) => (
            <span
              key={idx}
              className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-xs text-zinc-600 dark:text-zinc-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {(project.liveUrl || project.githubUrl || project.moreInfoUrl) && (
        <div className="flex gap-3 mt-auto pt-1">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-black dark:text-white underline underline-offset-2 hover:opacity-70 transition-opacity"
            >
              Live ↗
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-black dark:text-white underline underline-offset-2 hover:opacity-70 transition-opacity"
            >
              GitHub ↗
            </a>
          )}
          {project.moreInfoUrl && (
            <a
              href={project.moreInfoUrl}
              className="text-xs font-medium text-black dark:text-white underline underline-offset-2 hover:opacity-70 transition-opacity"
            >
              More info ↗
            </a>
          )}
        </div>
      )}
    </div>
  </div>
);

export const ProjectBento = ({ heading, projects }: ProjectBentoBlock) => {
  if (!projects || projects.length === 0) return null;

  const [featured, ...rest] = projects;

  return (
    <section className="py-4">
      {heading && (
        <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
          {heading}
        </h2>
      )}
      <div className="flex flex-col gap-4">
        {/* Large featured card */}
        <div className="flex flex-col sm:flex-row rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors">
          {featured.image && (
            <div className="relative w-full sm:w-1/2 aspect-video sm:aspect-auto sm:min-h-[260px]">
              <Image
                src={featured.image}
                alt={featured.title ?? "Project screenshot"}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
          )}
          <div className="flex flex-col flex-1 gap-3 p-6">
            {featured.title && (
              <h3 className="text-lg font-semibold text-black dark:text-white">
                {featured.title}
              </h3>
            )}
            {featured.tags && featured.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {featured.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-700 dark:text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {featured.description && featured.description.length > 0 && (
              <div className="prose prose-sm prose-gray dark:prose-invert max-w-none">
                <PortableText value={featured.description} />
              </div>
            )}
            {(featured.liveUrl || featured.githubUrl) && (
              <div className="flex gap-3 mt-auto">
                {featured.liveUrl && (
                  <a
                    href={featured.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-black dark:text-white underline underline-offset-2 hover:opacity-70 transition-opacity"
                  >
                    Live ↗
                  </a>
                )}
                {featured.githubUrl && (
                  <a
                    href={featured.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-black dark:text-white underline underline-offset-2 hover:opacity-70 transition-opacity"
                  >
                    GitHub ↗
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Smaller tiles */}
        {rest.length > 0 && (
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${Math.min(rest.length, 3)}, minmax(0, 1fr))` }}
          >
            {rest.map((project, idx) => (
              <BentoTile key={project._key ?? idx} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
