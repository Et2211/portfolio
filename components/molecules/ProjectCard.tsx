import { PortableText } from "@portabletext/react";
import Image from "next/image";

import { Badge } from "@/components/atoms/Badge";
import { ProjectLinks } from "@/components/molecules/ProjectLinks";
import { RichText } from "@/components/atoms/RichText";
import type { FeaturedProject } from "@/types/blocks";

interface ProjectCardProps {
  project: FeaturedProject;
  /** compact: tighter padding, no description, smaller text */
  compact?: boolean;
}

export const ProjectCard = ({ project, compact = false }: ProjectCardProps) => (
  <div className="flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors">
    {project.image && (
      <div className="relative w-full aspect-video">
        <Image
          src={project.image}
          alt={project.title ?? "Project screenshot"}
          fill
          className="object-cover"
          sizes={compact ? "(max-width: 640px) 100vw, 33vw" : "(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"}
        />
      </div>
    )}
    <div className={`flex flex-col flex-1 ${compact ? "gap-2 p-4" : "gap-3 p-5"}`}>
      {project.title && (
        <h3 className={`font-semibold text-black dark:text-white ${compact ? "" : "text-lg"}`}>
          {project.title}
        </h3>
      )}
      {project.tags && project.tags.length > 0 && (
        <div className={`flex flex-wrap ${compact ? "gap-1" : "gap-1.5"}`}>
          {project.tags.map((tag, idx) => (
            <Badge key={idx} variant="tag">
              {tag}
            </Badge>
          ))}
        </div>
      )}
      {!compact && project.description && project.description.length > 0 && (
        <RichText>
          <PortableText value={project.description} />
        </RichText>
      )}
      <ProjectLinks
        liveUrl={project.liveUrl}
        githubUrl={project.githubUrl}
        moreInfoUrl={compact ? undefined : project.moreInfoUrl}
        size={compact ? "xs" : "sm"}
        className="mt-auto pt-2"
      />
    </div>
  </div>
);
