import type { ComponentType } from "react";
import { Fragment } from "react";

import type {
  DynamicComponentBlock,
  DynamicComponentWithBuiltUrls,
  GridLayoutBlock,
} from "@/types/blocks";

import { AboutSection } from "./AboutSection";
import { Carousel } from "./Carousel";
import { ContactSection } from "./ContactSection";
import { CtaButton } from "./CtaButton";
import { CvDownload } from "./CvDownload";
import { FeatureAccordion } from "./FeatureAccordion";
import { FeaturedProjects } from "./FeaturedProjects";
import { Grid } from "./Grid";
import { HeroPanel } from "./HeroPanel";
import { ImageWithDescription } from "./ImageWithDescription";
import { ProjectBento } from "./ProjectBento";
import { ProjectSpotlight } from "./ProjectSpotlight";
import { ScrollReveal } from "./ScrollReveal";
import { SkillsBar } from "./SkillsBar";
import { SkillsGlobe } from "./SkillsGlobe";
import { StatsBanner } from "./StatsBanner";
import { SystemArchitecture } from "./SystemArchitecture";
import { TechStack } from "./TechStack";
import { TestimonialsSection } from "./TestimonialsSection";
import { Timeline } from "./Timeline";

type BlockType = DynamicComponentBlock["_type"];
type BlockOf<T extends BlockType> = Extract<
  DynamicComponentBlock,
  { _type: T }
>;

// A grid's cells are themselves page-builder sections.
const GridBlock = (block: GridLayoutBlock) => (
  <Grid
    {...block}
    renderItem={(item, idx) => (
      <DynamicComponentRenderer key={item._key ?? idx} components={[item]} />
    )}
  />
);

/**
 * Which component renders each Sanity block type. Every block component
 * takes its block's fields as props. Typed so that adding a block type to
 * the schema (and so to DynamicComponentBlock) fails to compile until it's
 * mapped here, and each component must accept its own block's shape.
 */
const BLOCK_COMPONENTS: { [T in BlockType]: ComponentType<BlockOf<T>> } = {
  aboutSection: AboutSection,
  carousel: Carousel,
  contactSection: ContactSection,
  ctaButton: CtaButton,
  cvDownload: CvDownload,
  featureAccordion: FeatureAccordion,
  featuredProjects: FeaturedProjects,
  gridLayout: GridBlock,
  heroPanel: HeroPanel,
  imageWithDescription: ImageWithDescription,
  projectBento: ProjectBento,
  projectSpotlight: ProjectSpotlight,
  skillsBar: SkillsBar,
  skillsGlobe: SkillsGlobe,
  statsBanner: StatsBanner,
  systemArchitecture: SystemArchitecture,
  techStack: TechStack,
  testimonialsSection: TestimonialsSection,
  timeline: Timeline,
};

const renderBlock = (block: DynamicComponentBlock) => {
  // TypeScript can't correlate the union's `_type` with the mapped entry, so
  // widen here; BLOCK_COMPONENTS' type guarantees the pairing is right.
  const Component = BLOCK_COMPONENTS[block._type] as
    ComponentType<DynamicComponentBlock> | undefined;
  // Unknown types can still arrive from the CMS at runtime (e.g. a schema
  // change deployed before the site), so skip rather than crash.
  return Component ? <Component {...block} /> : null;
};

interface DynamicComponentRendererProps {
  components: DynamicComponentWithBuiltUrls[];
}

export const DynamicComponentRenderer = ({
  components,
}: DynamicComponentRendererProps) => {
  if (!components?.length) {
    return null;
  }

  return (
    <div className="space-y-12">
      {components.map((section, index) => {
        // Studio validation allows exactly one block per section.
        const block = section.component?.[0];
        if (!block) {
          return null;
        }

        const key = block._key || index;
        const content = renderBlock(block);

        // The first block is usually above the fold (and often the LCP
        // element), so render it straight away instead of revealing it.
        if (index === 0) {
          return <Fragment key={key}>{content}</Fragment>;
        }

        return (
          <ScrollReveal key={key} delay={Math.min(index * 80, 320)}>
            {content}
          </ScrollReveal>
        );
      })}
    </div>
  );
};
