import type {
  SanityBlock,
  SanityKeyed,
  TimelineItem,
} from "@/types/generated/sanity";

import { AboutSection as AboutSectionComponent } from "./AboutSection";
import { type CarouselBlock, Carousel as CarouselComponent } from "./Carousel";
import { ContactSection as ContactSectionComponent } from "./ContactSection";
import {
  type FeatureAccordionBlock,
  FeatureAccordion as FeatureAccordionComponent,
} from "./FeatureAccordion";
import { FeaturedProjects as FeaturedProjectsComponent } from "./FeaturedProjects";
import { Grid as GridComponent, type GridLayoutBlock } from "./Grid";
import { HeroPanel as HeroPanelComponent } from "./HeroPanel";
import { ImageWithDescription as ImageWithDescriptionComponent } from "./ImageWithDescription";
import { SkillsBar as SkillsBarComponent } from "./SkillsBar";
import { StatsBanner as StatsBannerComponent } from "./StatsBanner";
import {
  type SystemArchitectureBlock,
  SystemArchitecture as SystemArchitectureComponent,
} from "./SystemArchitecture";
import { TechStack as TechStackComponent } from "./TechStack";
import { TestimonialsSection as TestimonialsSectionComponent } from "./TestimonialsSection";
import { Timeline as TimelineComponent } from "./Timeline";

// Runtime types after server-side image URL building
export type TimelineItemWithBuiltUrl = Omit<TimelineItem, "image"> & {
  image?: string | null;
};

export type TimelineBlock = {
  _type: "timeline";
  _key?: string;
  heading?: string;
  items?: TimelineItemWithBuiltUrl[];
};

export type ImageWithDescriptionBlock = {
  _type: "imageWithDescription";
  _key?: string;
  heading?: string;
  image?: string | null;
  description?: SanityKeyed<SanityBlock>[];
  textPosition?: "above" | "below" | "before" | "after";
};

export type HeroPanelBlock = {
  _type: "heroPanel";
  _key?: string;
  name?: string;
  role?: string;
  tagline?: string;
  photo?: string | null;
  ctaLabel?: string;
  ctaUrl?: string;
  imagePosition?: "left" | "right";
};

export type SkillItem = {
  _key?: string;
  name?: string;
  category?: string;
};

export type SkillsBarBlock = {
  _type: "skillsBar";
  _key?: string;
  heading?: string;
  skills?: SkillItem[];
};

export type FeaturedProject = {
  _key?: string;
  title?: string;
  description?: SanityKeyed<SanityBlock>[];
  image?: string | null;
  tags?: string[];
  liveUrl?: string;
  githubUrl?: string;
};

export type FeaturedProjectsBlock = {
  _type: "featuredProjects";
  _key?: string;
  heading?: string;
  projects?: FeaturedProject[];
};

export type StatItem = {
  _key?: string;
  value?: string;
  label?: string;
};

export type StatsBannerBlock = {
  _type: "statsBanner";
  _key?: string;
  stats?: StatItem[];
};

export type AboutLink = {
  _key?: string;
  label?: string;
  url?: string;
};

export type AboutSectionBlock = {
  _type: "aboutSection";
  _key?: string;
  photo?: string | null;
  bio?: SanityKeyed<SanityBlock>[];
  links?: AboutLink[];
};

export type TestimonialItem = {
  _key?: string;
  quote?: string;
  author?: string;
  role?: string;
  company?: string;
};

export type TestimonialsSectionBlock = {
  _type: "testimonialsSection";
  _key?: string;
  heading?: string;
  testimonials?: TestimonialItem[];
};

export type ContactSectionBlock = {
  _type: "contactSection";
  _key?: string;
  heading?: string;
  intro?: SanityKeyed<SanityBlock>[];
  email?: string;
  githubUrl?: string;
  linkedinUrl?: string;
};

export type TechStackGroupItem = {
  _key?: string;
  groupName?: string;
  description?: string;
  items?: string[];
};

export type TechStackBlock = {
  _type: "techStack";
  _key?: string;
  heading?: string;
  groups?: TechStackGroupItem[];
};

type DynamicComponentBlock =
  | TimelineBlock
  | ImageWithDescriptionBlock
  | CarouselBlock
  | SystemArchitectureBlock
  | HeroPanelBlock
  | SkillsBarBlock
  | FeaturedProjectsBlock
  | StatsBannerBlock
  | AboutSectionBlock
  | TestimonialsSectionBlock
  | ContactSectionBlock
  | TechStackBlock
  | FeatureAccordionBlock
  | GridLayoutBlock;

export type { GridLayoutBlock };

export type DynamicComponentWithBuiltUrls = {
  _type: "dynamicComponent";
  _key?: string;
  heading?: string;
  component?: DynamicComponentBlock[];
};

interface DynamicComponentRendererProps {
  components: DynamicComponentWithBuiltUrls[];
}

// Type guard functions for discriminated union narrowing
function isTimelineBlock(block: DynamicComponentBlock): block is TimelineBlock {
  return block._type === "timeline";
}

function isImageWithDescriptionBlock(
  block: DynamicComponentBlock,
): block is ImageWithDescriptionBlock {
  return block._type === "imageWithDescription";
}

function isCarouselBlock(block: DynamicComponentBlock): block is CarouselBlock {
  return block._type === "carousel";
}

function isSystemArchitectureBlock(
  block: DynamicComponentBlock,
): block is SystemArchitectureBlock {
  return block._type === "systemArchitecture";
}

function isHeroPanelBlock(
  block: DynamicComponentBlock,
): block is HeroPanelBlock {
  return block._type === "heroPanel";
}

function isSkillsBarBlock(
  block: DynamicComponentBlock,
): block is SkillsBarBlock {
  return block._type === "skillsBar";
}

function isFeaturedProjectsBlock(
  block: DynamicComponentBlock,
): block is FeaturedProjectsBlock {
  return block._type === "featuredProjects";
}

function isStatsBannerBlock(
  block: DynamicComponentBlock,
): block is StatsBannerBlock {
  return block._type === "statsBanner";
}

function isAboutSectionBlock(
  block: DynamicComponentBlock,
): block is AboutSectionBlock {
  return block._type === "aboutSection";
}

function isTestimonialsSectionBlock(
  block: DynamicComponentBlock,
): block is TestimonialsSectionBlock {
  return block._type === "testimonialsSection";
}

function isContactSectionBlock(
  block: DynamicComponentBlock,
): block is ContactSectionBlock {
  return block._type === "contactSection";
}

function isTechStackBlock(
  block: DynamicComponentBlock,
): block is TechStackBlock {
  return block._type === "techStack";
}

function isFeatureAccordionBlock(
  block: DynamicComponentBlock,
): block is FeatureAccordionBlock {
  return block._type === "featureAccordion";
}

function isGridLayoutBlock(
  block: DynamicComponentBlock,
): block is GridLayoutBlock {
  return block._type === "gridLayout";
}

export const DynamicComponentRenderer = ({
  components,
}: DynamicComponentRendererProps) => {
  if (!components || components.length === 0) {
    return null;
  }

  return (
    <div className="space-y-12">
      {components.map((dynamicComponent, index) => {
        if (
          !dynamicComponent.component ||
          dynamicComponent.component.length === 0
        ) {
          return null;
        }
        // Only one block per dynamicComponent.component due to validation
        const block = dynamicComponent.component[0];
        if (!block) return null;

        switch (block._type) {
          case "timeline":
            if (isTimelineBlock(block)) {
              return (
                <TimelineComponent
                  key={block._key || index}
                  items={block.items || []}
                />
              );
            }
            break;
          case "imageWithDescription":
            if (isImageWithDescriptionBlock(block)) {
              return (
                <ImageWithDescriptionComponent
                  key={block._key || index}
                  image={block.image}
                  description={block.description}
                  textPosition={block.textPosition}
                />
              );
            }
            break;
          case "carousel":
            if (isCarouselBlock(block)) {
              return (
                <CarouselComponent key={block._key || index} carousel={block} />
              );
            }
            break;
          case "systemArchitecture":
            if (isSystemArchitectureBlock(block)) {
              return (
                <SystemArchitectureComponent
                  key={block._key || index}
                  block={block}
                />
              );
            }
            break;
          case "heroPanel":
            if (isHeroPanelBlock(block)) {
              return (
                <HeroPanelComponent key={block._key || index} {...block} />
              );
            }
            break;
          case "skillsBar":
            if (isSkillsBarBlock(block)) {
              return (
                <SkillsBarComponent key={block._key || index} {...block} />
              );
            }
            break;
          case "featuredProjects":
            if (isFeaturedProjectsBlock(block)) {
              return (
                <FeaturedProjectsComponent
                  key={block._key || index}
                  {...block}
                />
              );
            }
            break;
          case "statsBanner":
            if (isStatsBannerBlock(block)) {
              return (
                <StatsBannerComponent key={block._key || index} {...block} />
              );
            }
            break;
          case "aboutSection":
            if (isAboutSectionBlock(block)) {
              return (
                <AboutSectionComponent key={block._key || index} {...block} />
              );
            }
            break;
          case "testimonialsSection":
            if (isTestimonialsSectionBlock(block)) {
              return (
                <TestimonialsSectionComponent
                  key={block._key || index}
                  {...block}
                />
              );
            }
            break;
          case "contactSection":
            if (isContactSectionBlock(block)) {
              return (
                <ContactSectionComponent key={block._key || index} {...block} />
              );
            }
            break;
          case "techStack":
            if (isTechStackBlock(block)) {
              return (
                <TechStackComponent key={block._key || index} {...block} />
              );
            }
            break;
          case "featureAccordion":
            if (isFeatureAccordionBlock(block)) {
              return (
                <FeatureAccordionComponent
                  key={block._key || index}
                  {...block}
                />
              );
            }
            break;
          case "gridLayout":
            if (isGridLayoutBlock(block)) {
              return (
                <GridComponent
                  key={block._key || index}
                  {...block}
                  renderItem={(item, idx) => (
                    <DynamicComponentRenderer
                      key={item._key ?? idx}
                      components={[item]}
                    />
                  )}
                />
              );
            }
            break;
          default:
            return null;
        }
      })}
    </div>
  );
};
