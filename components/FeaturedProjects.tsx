import { PortableText } from "@portabletext/react";
import Image from "next/image";

import type { FeaturedProject, FeaturedProjectsBlock } from "./DynamicComponentRenderer";

const ProjectCard = ({ project }: { project: FeaturedProject }) => (
  <div className="flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900">
    {project.image && (
      <div className="relative w-full aspect-video">
        <Image
          src={project.image}
          alt={project.title ?? "Project screenshot"}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
        />
      </div>
    )}
    <div className="flex flex-col flex-1 gap-3 p-5">
      {project.title && (
        <h3 className="text-lg font-semibold text-black dark:text-white">{project.title}</h3>
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
      {(project.liveUrl || project.githubUrl) && (
        <div className="flex gap-3 mt-auto pt-2">
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
        </div>
      )}
    </div>
  </div>
);

export const FeaturedProjects = ({ heading, projects }: FeaturedProjectsBlock) => {
  if (!projects || projects.length === 0) return null;

  return (
    <section className="py-4">
      {heading && (
        <h2 className="text-2xl font-bold text-black dark:text-white mb-6">{heading}</h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, idx) => (
          <ProjectCard key={project._key ?? idx} project={project} />
        ))}
      </div>
    </section>
  );
};
