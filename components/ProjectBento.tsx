import { PortableText } from "@portabletext/react";
import Image from "next/image";

import { Badge } from "@/components/atoms/Badge";
import { RichText } from "@/components/atoms/RichText";
import { SectionHeading } from "@/components/atoms/SectionHeading";
import { ProjectCard } from "@/components/molecules/ProjectCard";
import { ProjectLinks } from "@/components/molecules/ProjectLinks";
import type { FeaturedProject } from "@/types/blocks";

export type ProjectBentoBlock = {
  _type: "projectBento";
  _key?: string;
  heading?: string;
  projects?: FeaturedProject[];
};

export const ProjectBento = ({ heading, projects }: ProjectBentoBlock) => {
  if (!projects || projects.length === 0) return null;

  const [featured, ...rest] = projects;

  return (
    <section className="py-4">
      {heading && <SectionHeading>{heading}</SectionHeading>}
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
                  <Badge key={idx} variant="tag">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            {featured.description && featured.description.length > 0 && (
              <RichText>
                <PortableText value={featured.description} />
              </RichText>
            )}
            <ProjectLinks
              liveUrl={featured.liveUrl}
              githubUrl={featured.githubUrl}
              className="mt-auto"
            />
          </div>
        </div>

        {/* Smaller tiles */}
        {rest.length > 0 && (
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${Math.min(rest.length, 3)}, minmax(0, 1fr))` }}
          >
            {rest.map((project, idx) => (
              <ProjectCard key={project._key ?? idx} project={project} compact />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
