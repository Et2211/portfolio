
import type { SanityBlock, SanityKeyed, TimelineItem } from "@/types/generated/sanity";

import { AboutSection as AboutSectionComponent } from "./AboutSection";
import { type CarouselBlock, Carousel as CarouselComponent } from "./Carousel";
import { ContactSection as ContactSectionComponent } from "./ContactSection";
import { type FeatureAccordionBlock, FeatureAccordion as FeatureAccordionComponent } from "./FeatureAccordion";
import { FeaturedProjects as FeaturedProjectsComponent } from "./FeaturedProjects";
import { HeroPanel as HeroPanelComponent } from "./HeroPanel";
import { ImageWithDescription as ImageWithDescriptionComponent } from "./ImageWithDescription";
import { SkillsBar as SkillsBarComponent } from "./SkillsBar";
import { StatsBanner as StatsBannerComponent } from "./StatsBanner";
import { type SystemArchitectureBlock, SystemArchitecture as SystemArchitectureComponent } from "./SystemArchitecture";
import { TechStack as TechStackComponent } from "./TechStack";
import { TestimonialsSection as TestimonialsSectionComponent } from "./TestimonialsSection";
import { Timeline as TimelineComponent } from "./Timeline";

// Runtime types after server-side image URL building
export type TimelineItemWithBuiltUrl = Omit<TimelineItem, "image"> & { image?: string | null };

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
  textPosition?: 'above' | 'below' | 'before' | 'after';
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
  | FeatureAccordionBlock;

export type DynamicComponentWithBuiltUrls = {
  _type: "dynamicComponent";
  _key?: string;
  heading?: string;
  component?: DynamicComponentBlock[];
};

interface DynamicComponentRendererProps {
  components: DynamicComponentWithBuiltUrls[];
}


export const DynamicComponentRenderer = ({ components }: DynamicComponentRendererProps) => {
  if (!components || components.length === 0) {
    return null;
  }

  return (
    <div className="space-y-12">
      {components.map((dynamicComponent, index) => {
        if (!dynamicComponent.component || dynamicComponent.component.length === 0) {
          return null;
        }
        // Only one block per dynamicComponent.component due to validation
        const block = dynamicComponent.component[0];
        if (!block) return null;

        switch (block._type) {
          case "timeline":
            return (
              <TimelineComponent
                key={block._key || index}
                items={(block as TimelineBlock).items || []}
              />
            );
          case "imageWithDescription":
            return (
              <ImageWithDescriptionComponent
                key={block._key || index}
                image={(block as ImageWithDescriptionBlock).image}
                description={(block as ImageWithDescriptionBlock).description}
                textPosition={(block as ImageWithDescriptionBlock).textPosition}
              />
            );
          case "carousel":
            return (
              <CarouselComponent
                key={block._key || index}
                carousel={block as CarouselBlock}
              />
            );
          case "systemArchitecture":
            return (
              <SystemArchitectureComponent
                key={block._key || index}
                block={block as SystemArchitectureBlock}
              />
            );
          case "heroPanel":
            return (
              <HeroPanelComponent
                key={block._key || index}
                {...(block as HeroPanelBlock)}
              />
            );
          case "skillsBar":
            return (
              <SkillsBarComponent
                key={block._key || index}
                {...(block as SkillsBarBlock)}
              />
            );
          case "featuredProjects":
            return (
              <FeaturedProjectsComponent
                key={block._key || index}
                {...(block as FeaturedProjectsBlock)}
              />
            );
          case "statsBanner":
            return (
              <StatsBannerComponent
                key={block._key || index}
                {...(block as StatsBannerBlock)}
              />
            );
          case "aboutSection":
            return (
              <AboutSectionComponent
                key={block._key || index}
                {...(block as AboutSectionBlock)}
              />
            );
          case "testimonialsSection":
            return (
              <TestimonialsSectionComponent
                key={block._key || index}
                {...(block as TestimonialsSectionBlock)}
              />
            );
          case "contactSection":
            return (
              <ContactSectionComponent
                key={block._key || index}
                {...(block as ContactSectionBlock)}
              />
            );
          case "techStack":
            return (
              <TechStackComponent
                key={block._key || index}
                {...(block as TechStackBlock)}
              />
            );
          case "featureAccordion":
            return (
              <FeatureAccordionComponent
                key={block._key || index}
                {...(block as FeatureAccordionBlock)}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
};
