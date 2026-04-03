import { SectionHeading } from "@/components/atoms/SectionHeading";
import { ProjectCard } from "@/components/molecules/ProjectCard";
import type { FeaturedProjectsBlock } from "@/types/blocks";

export const FeaturedProjects = ({
  heading,
  projects,
}: FeaturedProjectsBlock) => {
  if (!projects || projects.length === 0) return null;

  return (
    <section className="py-4">
      {heading && <SectionHeading>{heading}</SectionHeading>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, idx) => (
          <ProjectCard key={project._key ?? idx} project={project} />
        ))}
      </div>
    </section>
  );
};
