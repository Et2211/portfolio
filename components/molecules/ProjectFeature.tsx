import { PortableText } from "@portabletext/react";
import Image from "next/image";

import { RichText } from "@/components/atoms/RichText";
import { ProjectLinks } from "@/components/molecules/ProjectLinks";
import { TagList } from "@/components/molecules/TagList";
import type { FeaturedProject } from "@/types/blocks";

// Class names are spelled out in full so Tailwind can find them.
const LAYOUTS = {
  /** Side by side from `sm` (ProjectBento's featured card). */
  compact: {
    row: "sm:flex-row",
    image: "sm:aspect-auto sm:min-h-[260px] sm:w-1/2",
    sizes: "(max-width: 640px) 100vw, 50vw",
    body: "gap-3 p-6",
    title: "text-lg",
  },
  /** Side by side from `lg` (ProjectSpotlight). */
  spacious: {
    row: "lg:flex-row",
    image: "lg:aspect-auto lg:min-h-[300px] lg:w-1/2",
    sizes: "(max-width: 1024px) 100vw, 50vw",
    body: "gap-4 p-6 lg:p-8",
    title: "text-xl",
  },
};

/** A project's image beside its title, tags, description and links. */
export const ProjectFeature = ({
  project,
  layout,
}: {
  project: FeaturedProject;
  layout: keyof typeof LAYOUTS;
}) => {
  const styles = LAYOUTS[layout];

  return (
    <div className={`flex flex-col ${styles.row}`}>
      {project.image && (
        <div className={`relative aspect-video w-full ${styles.image}`}>
          <Image
            src={project.image}
            alt={project.title ?? "Project screenshot"}
            fill
            className="object-cover"
            sizes={styles.sizes}
          />
        </div>
      )}
      <div className={`flex flex-1 flex-col ${styles.body}`}>
        {project.title && (
          <h3
            className={`${styles.title} font-semibold text-black dark:text-white`}
          >
            {project.title}
          </h3>
        )}
        <TagList tags={project.tags} />
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
  );
};
