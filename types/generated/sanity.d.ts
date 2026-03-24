import type {
  SanityReference,
  SanityKeyedReference,
  SanityAsset,
  SanityImage,
  SanityFile,
  SanityGeoPoint,
  SanityBlock,
  SanityDocument,
  SanityImageCrop,
  SanityImageHotspot,
  SanityKeyed,
  SanityImageAsset,
  SanityImageMetadata,
  SanityImageDimensions,
  SanityImagePalette,
  SanityImagePaletteSwatch,
} from "sanity-codegen";

export type {
  SanityReference,
  SanityKeyedReference,
  SanityAsset,
  SanityImage,
  SanityFile,
  SanityGeoPoint,
  SanityBlock,
  SanityDocument,
  SanityImageCrop,
  SanityImageHotspot,
  SanityKeyed,
  SanityImageAsset,
  SanityImageMetadata,
  SanityImageDimensions,
  SanityImagePalette,
  SanityImagePaletteSwatch,
};

/**
 * Navigation
 *
 *
 */
export interface Navigation extends SanityDocument {
  _type: "navigation";

  /**
   * Nav Groups — `array`
   *
   *
   */
  navGroups?: Array<SanityKeyed<NavGroup>>;
}

/**
 * Page
 *
 *
 */
export interface Page extends SanityDocument {
  _type: "page";

  /**
   * Heading — `string`
   *
   *
   */
  heading?: string;

  /**
   * URL — `string`
   *
   *
   */
  url?: string;

  /**
   * Page Components — `array`
   *
   *
   */
  pageComponents?: Array<SanityKeyed<DynamicComponent>>;
}

/**
 * Footer
 *
 *
 */
export interface Footer extends SanityDocument {
  _type: "footer";

  /**
   * Components — `array`
   *
   * Components rendered in the site footer on every page.
   */
  components?: Array<SanityKeyed<DynamicComponent>>;
}

export type NavGroup = {
  _type: "navGroup";
  /**
   * Nav Header — `string`
   *
   *
   */
  navHeader?: string;

  /**
   * Nav List — `array`
   *
   *
   */
  navList?: Array<SanityKeyed<NavItem>>;
};

export type NavItem = {
  _type: "navItem";
  /**
   * Nav Title — `string`
   *
   *
   */
  navTitle?: string;

  /**
   * Page — `reference`
   *
   *
   */
  page?: SanityReference<Page>;

  /**
   * External URL — `url`
   *
   * Optional: Use for external links. Leave blank for internal pages.
   */
  externalUrl?: string;
};

export type Timeline = {
  _type: "timeline";
  /**
   * Heading — `string`
   *
   * For identifying this timeline in the CMS.
   */
  heading?: string;

  /**
   * Items — `array`
   *
   *
   */
  items?: Array<SanityKeyed<TimelineItem>>;
};

export type TimelineItem = {
  _type: "timelineItem";
  /**
   * Title — `string`
   *
   *
   */
  title?: string;

  /**
   * Image — `image`
   *
   *
   */
  image?: {
    _type: "image";
    asset: SanityReference<SanityImageAsset>;
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;
  };

  /**
   * Description — `array`
   *
   *
   */
  description?: Array<SanityKeyed<SanityBlock>>;

  /**
   * Start Date — `date`
   *
   *
   */
  startDate?: string;

  /**
   * Finish Date — `date`
   *
   *
   */
  finishDate?: string;
};

export type ImageWithDescription = {
  _type: "imageWithDescription";
  /**
   * Heading — `string`
   *
   * For identifying this image block in the CMS.
   */
  heading?: string;

  /**
   * Image — `image`
   *
   *
   */
  image?: {
    _type: "image";
    asset: SanityReference<SanityImageAsset>;
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;
  };

  /**
   * Description — `array`
   *
   * A short description below the image.
   */
  description?: Array<SanityKeyed<SanityBlock>>;

  /**
   * Text Position — `string`
   *
   * Position of the text relative to the image.
   */
  textPosition?: "above" | "below" | "before" | "after";
};

export type DynamicComponent = {
  _type: "dynamicComponent";
  /**
   * Heading — `string`
   *
   * For identifying this dynamic component in the CMS.
   */
  heading?: string;

  /**
   * Component — `array`
   *
   *
   */
  component?: Array<
    | SanityKeyed<Timeline>
    | SanityKeyed<ImageWithDescription>
    | SanityKeyed<Carousel>
    | SanityKeyed<SystemArchitecture>
    | SanityKeyed<HeroPanel>
    | SanityKeyed<SkillsBar>
    | SanityKeyed<FeaturedProjects>
    | SanityKeyed<StatsBanner>
    | SanityKeyed<AboutSection>
    | SanityKeyed<TestimonialsSection>
    | SanityKeyed<ContactSection>
    | SanityKeyed<TechStack>
    | SanityKeyed<FeatureAccordion>
  >;
};

export type Carousel = {
  _type: "carousel";
  /**
   * Heading — `string`
   *
   * For identifying this carousel in the CMS.
   */
  heading?: string;

  /**
   * Carousel Items — `array`
   *
   *
   */
  items?: Array<SanityKeyed<ImageWithDescription> | SanityKeyed<Timeline>>;

  /**
   * Show Navigation Dots — `boolean`
   *
   *
   */
  showDots?: boolean;

  /**
   * Autoplay — `boolean`
   *
   *
   */
  autoplay?: boolean;

  /**
   * Autoplay Interval (ms) — `number`
   *
   *
   */
  interval?: number;
};

export type SystemArchitecture = {
  _type: "systemArchitecture";
  /**
   * Heading — `string`
   *
   * For identifying this component in the CMS.
   */
  heading?: string;

  /**
   * Primary Flow Legend Label — `string`
   *
   * Label shown in the legend for the primary (blue animated) edge. E.g. "CMS data flow" or "Primary flow (B2B onboarding)".
   */
  primaryFlowLabel?: string;

  /**
   * Nodes — `array`
   *
   * The system components to display as nodes.
   */
  nodes?: Array<SanityKeyed<ArchNode>>;

  /**
   * Edges — `array`
   *
   * Connections between nodes.
   */
  edges?: Array<SanityKeyed<ArchEdge>>;
};

export type ArchNode = {
  _type: "archNode";
  /**
   * Node ID — `string`
   *
   * Unique identifier (e.g. "nextjs-frontend"). Used to connect edges.
   */
  nodeId?: string;

  /**
   * Label — `string`
   *
   * Display name on the node.
   */
  label?: string;

  /**
   * Tier — `string`
   *
   * Controls vertical positioning in the diagram.
   */
  tier?:
    | "frontend"
    | "bff"
    | "services"
    | "data"
    | "content"
    | "infra"
    | "observability";

  /**
   * Description — `text`
   *
   * Shown in the detail panel when clicking the node.
   */
  description?: string;

  /**
   * Tech Used — `array`
   *
   * List of technologies (e.g. "Next.js", "TypeScript").
   */
  techUsed?: Array<SanityKeyed<string>>;
};

export type ArchEdge = {
  _type: "archEdge";
  /**
   * Edge ID — `string`
   *
   * Unique identifier for this connection.
   */
  edgeId?: string;

  /**
   * Source Node ID — `string`
   *
   * The nodeId of the source node.
   */
  sourceId?: string;

  /**
   * Target Node ID — `string`
   *
   * The nodeId of the target node.
   */
  targetId?: string;

  /**
   * Edge Label — `string`
   *
   * Optional label shown on the connection arrow.
   */
  label?: string;

  /**
   * Variant — `string`
   *
   * Visual style: default (grey), primary (blue animated — main request flow), error (red dashed — failure/fallback path).
   */
  variant?: "default" | "primary" | "error";
};

export type HeroPanel = {
  _type: "heroPanel";
  /**
   * Role / Title — `string`
   *
   * e.g. "Senior Software Engineer"
   */
  role?: string;

  /**
   * Tagline — `text`
   *
   * A short sentence summarising what you do.
   */
  tagline?: string;

  /**
   * Photo — `image`
   *
   *
   */
  photo?: {
    _type: "image";
    asset: SanityReference<SanityImageAsset>;
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;
  };

  /**
   * Image Position — `string`
   *
   * Which side the photo appears on (desktop layout).
   */
  imagePosition?: "left" | "right";

  /**
   * CTA Button Label — `string`
   *
   * e.g. "View my work"
   */
  ctaLabel?: string;

  /**
   * CTA Button URL — `string`
   *
   * Relative path or absolute URL the CTA button links to.
   */
  ctaUrl?: string;
};

export type SkillsBar = {
  _type: "skillsBar";
  /**
   * Heading — `string`
   *
   * For identifying this block in the CMS.
   */
  heading?: string;

  /**
   * Skills — `array`
   *
   *
   */
  skills?: Array<SanityKeyed<SkillItem>>;
};

export type SkillItem = {
  _type: "skillItem";
  /**
   * Name — `string`
   *
   *
   */
  name?: string;

  /**
   * Category — `string`
   *
   * Optional grouping label, e.g. "Frontend", "Infrastructure".
   */
  category?: string;
};

export type FeaturedProjects = {
  _type: "featuredProjects";
  /**
   * Heading — `string`
   *
   * For identifying this block in the CMS.
   */
  heading?: string;

  /**
   * Projects — `array`
   *
   *
   */
  projects?: Array<SanityKeyed<FeaturedProject>>;
};

export type FeaturedProject = {
  _type: "featuredProject";
  /**
   * Title — `string`
   *
   *
   */
  title?: string;

  /**
   * Description — `array`
   *
   *
   */
  description?: Array<SanityKeyed<SanityBlock>>;

  /**
   * Screenshot / Thumbnail — `image`
   *
   *
   */
  image?: {
    _type: "image";
    asset: SanityReference<SanityImageAsset>;
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;
  };

  /**
   * Tags — `array`
   *
   * e.g. "Next.js", "TypeScript", "Kubernetes"
   */
  tags?: Array<SanityKeyed<string>>;

  /**
   * Live URL — `string`
   *
   *
   */
  liveUrl?: string;

  /**
   * GitHub URL — `string`
   *
   *
   */
  githubUrl?: string;
};

export type StatsBanner = {
  _type: "statsBanner";
  /**
   * Stats — `array`
   *
   *
   */
  stats?: Array<SanityKeyed<StatItem>>;
};

export type StatItem = {
  _type: "statItem";
  /**
   * Value — `string`
   *
   * e.g. "8+" or "3"
   */
  value?: string;

  /**
   * Label — `string`
   *
   * e.g. "Years experience"
   */
  label?: string;
};

export type AboutSection = {
  _type: "aboutSection";
  /**
   * Photo — `image`
   *
   *
   */
  photo?: {
    _type: "image";
    asset: SanityReference<SanityImageAsset>;
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;
  };

  /**
   * Bio — `array`
   *
   * Rich text bio.
   */
  bio?: Array<SanityKeyed<SanityBlock>>;

  /**
   * Links — `array`
   *
   * External profile links shown below the bio.
   */
  links?: Array<SanityKeyed<AboutLink>>;
};

export type AboutLink = {
  _type: "aboutLink";
  /**
   * Label — `string`
   *
   * e.g. "GitHub", "LinkedIn", "Download CV"
   */
  label?: string;

  /**
   * URL — `string`
   *
   *
   */
  url?: string;
};

export type TestimonialsSection = {
  _type: "testimonialsSection";
  /**
   * Heading — `string`
   *
   *
   */
  heading?: string;

  /**
   * Testimonials — `array`
   *
   *
   */
  testimonials?: Array<SanityKeyed<TestimonialItem>>;
};

export type TestimonialItem = {
  _type: "testimonialItem";
  /**
   * Quote — `text`
   *
   *
   */
  quote?: string;

  /**
   * Author — `string`
   *
   *
   */
  author?: string;

  /**
   * Role — `string`
   *
   * Author's job title.
   */
  role?: string;

  /**
   * Company — `string`
   *
   *
   */
  company?: string;
};

export type ContactSection = {
  _type: "contactSection";
  /**
   * Heading — `string`
   *
   *
   */
  heading?: string;

  /**
   * Intro — `array`
   *
   * Short intro text above the contact links.
   */
  intro?: Array<SanityKeyed<SanityBlock>>;

  /**
   * Email — `string`
   *
   *
   */
  email?: string;

  /**
   * GitHub URL — `string`
   *
   *
   */
  githubUrl?: string;

  /**
   * LinkedIn URL — `string`
   *
   *
   */
  linkedinUrl?: string;
};

export type TechStack = {
  _type: "techStack";
  /**
   * Heading — `string`
   *
   * For identifying this block in the CMS.
   */
  heading?: string;

  /**
   * Groups — `array`
   *
   *
   */
  groups?: Array<SanityKeyed<TechStackGroup>>;
};

export type TechStackGroup = {
  _type: "techStackGroup";
  /**
   * Group Name — `string`
   *
   * e.g. "Frontend", "CMS", "Infrastructure"
   */
  groupName?: string;

  /**
   * Description — `text`
   *
   * Optional: explain why this group of tech was chosen.
   */
  description?: string;

  /**
   * Items — `array`
   *
   * List of technologies in this group.
   */
  items?: Array<SanityKeyed<string>>;
};

export type FeatureAccordion = {
  _type: "featureAccordion";
  /**
   * Heading — `string`
   *
   * For identifying this component in the CMS.
   */
  heading?: string;

  /**
   * Items — `array`
   *
   *
   */
  items?: Array<SanityKeyed<FeatureItem>>;
};

export type FeatureItem = {
  _type: "featureItem";
  /**
   * Title — `string`
   *
   *
   */
  title?: string;

  /**
   * Summary — `string`
   *
   * One-line description shown in the collapsed state.
   */
  summary?: string;

  /**
   * Detail — `text`
   *
   * Expanded detail shown when the item is clicked open.
   */
  detail?: string;
};

export type Documents = Navigation | Page | Footer;
