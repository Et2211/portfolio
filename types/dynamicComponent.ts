import type { CarouselBlock } from "@/components/Carousel";
import type { FeatureAccordionBlock } from "@/components/FeatureAccordion";
import type { SystemArchitectureBlock } from "@/components/SystemArchitecture";

import type {
  AboutSectionBlock,
  ContactSectionBlock,
  FeaturedProjectsBlock,
  HeroPanelBlock,
  ImageWithDescriptionBlock,
  SkillsBarBlock,
  SkillsGlobeBlock,
  StatsBannerBlock,
  TechStackBlock,
  TestimonialsSectionBlock,
  TimelineBlock,
} from "./blocks";

export type GridLayoutBlock = {
  _type: "gridLayout";
  _key?: string;
  cols?: number;
  items?: DynamicComponentWithBuiltUrls[];
};

export type DynamicComponentWithBuiltUrls = {
  _type: "dynamicComponent";
  _key?: string;
  heading?: string;
  component?: DynamicComponentBlock[];
};

export type DynamicComponentBlock =
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
  | GridLayoutBlock
  | SkillsGlobeBlock;
