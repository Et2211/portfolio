import { SectionHeading } from "@/components/atoms/SectionHeading";
import { ProjectCard } from "@/components/molecules/ProjectCard";
import { ProjectFeature } from "@/components/molecules/ProjectFeature";
import type { ProjectBentoBlock } from "@/types/blocks";

// One column on phones, then up to three as space allows.
const TILE_COLUMNS: Record<number, string> = {
  1: "",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
};

export const ProjectBento = ({ heading, projects }: ProjectBentoBlock) => {
  if (!projects || projects.length === 0) {
    return null;
  }

  const [featured, ...rest] = projects;

  return (
    <section className="py-4">
      {heading && <SectionHeading>{heading}</SectionHeading>}
      <div className="flex flex-col gap-4">
        {/* Large featured card */}
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600">
          <ProjectFeature project={featured} layout="compact" />
        </div>

        {/* Smaller tiles */}
        {rest.length > 0 && (
          <div
            className={`grid gap-4 ${TILE_COLUMNS[Math.min(rest.length, 3)]}`}
          >
            {rest.map((project, idx) => (
              <ProjectCard
                key={project._key ?? idx}
                project={project}
                compact
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
