import type {
  SanityBlock,
  SanityKeyed,
  TimelineItem,
} from "@/types/generated/sanity";

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

export type SkillGlobeItem = {
  _key?: string;
  name?: string;
  icon?: string;
  url?: string;
};

export type SkillsGlobeBlock = {
  _type: "skillsGlobe";
  _key?: string;
  heading?: string;
  rotationSpeed?: number;
  skills?: SkillGlobeItem[];
};
