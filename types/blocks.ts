/**
 * The page-builder block types that components receive.
 *
 * Everything is derived from the Sanity schema types in
 * `types/generated/sanity.d.ts` (regenerate with `npm run codegen:full`), so
 * the component contract can't drift from the CMS. `Resolved` applies what
 * the server does before rendering: `buildImageUrls` turns every image field
 * into its CDN URL string.
 */
import type { WithBuiltImages } from "@/lib/sanity";
import type * as Sanity from "@/types/generated/sanity";

/** A CMS object after server-side image resolution; array items carry `_key`. */
export type Resolved<T> = WithBuiltImages<T> & { _key?: string };

// ── Nested items ─────────────────────────────────────────────────────────────
export type TimelineItemData = Resolved<Sanity.TimelineItem>;
export type SkillItem = Resolved<Sanity.SkillItem>;
export type SkillGlobeItem = Resolved<Sanity.SkillGlobeItem>;
export type FeaturedProject = Resolved<Sanity.FeaturedProject>;
export type StatItem = Resolved<Sanity.StatItem>;
export type AboutLink = Resolved<Sanity.AboutLink>;
export type TestimonialItem = Resolved<Sanity.TestimonialItem>;
export type TechStackGroupItem = Resolved<Sanity.TechStackGroup>;
export type FeatureItem = Resolved<Sanity.FeatureItem>;
export type ArchNodeData = Resolved<Sanity.ArchNode>;
export type ArchEdgeData = Resolved<Sanity.ArchEdge>;

// ── Blocks ───────────────────────────────────────────────────────────────────
export type TimelineBlock = Resolved<Sanity.Timeline>;
export type ImageWithDescriptionBlock = Resolved<Sanity.ImageWithDescription>;
export type CarouselBlock = Resolved<Sanity.Carousel>;
export type SystemArchitectureBlock = Resolved<Sanity.SystemArchitecture>;
/** `name` is rendered when present but isn't in the Studio schema yet. */
export type HeroPanelBlock = Resolved<Sanity.HeroPanel> & { name?: string };
export type SkillsBarBlock = Resolved<Sanity.SkillsBar>;
export type SkillsGlobeBlock = Resolved<Sanity.SkillsGlobe>;
export type FeaturedProjectsBlock = Resolved<Sanity.FeaturedProjects>;
export type ProjectSpotlightBlock = Resolved<Sanity.ProjectSpotlight>;
export type ProjectBentoBlock = Resolved<Sanity.ProjectBento>;
export type StatsBannerBlock = Resolved<Sanity.StatsBanner>;
export type AboutSectionBlock = Resolved<Sanity.AboutSection>;
export type TestimonialsSectionBlock = Resolved<Sanity.TestimonialsSection>;
export type ContactSectionBlock = Resolved<Sanity.ContactSection>;
export type TechStackBlock = Resolved<Sanity.TechStack>;
export type FeatureAccordionBlock = Resolved<Sanity.FeatureAccordion>;
export type CtaButtonBlock = Resolved<Sanity.CtaButton>;
/** `fileUrl` is projected by the GROQ query (`"fileUrl": file.asset->url`). */
export type CvDownloadBlock = Resolved<Sanity.CvDownload> & {
  fileUrl?: string | null;
};
export type GridLayoutBlock = Omit<Resolved<Sanity.GridLayout>, "items"> & {
  items?: DynamicComponentWithBuiltUrls[];
};

export type DynamicComponentBlock =
  | TimelineBlock
  | ImageWithDescriptionBlock
  | CarouselBlock
  | SystemArchitectureBlock
  | HeroPanelBlock
  | SkillsBarBlock
  | SkillsGlobeBlock
  | FeaturedProjectsBlock
  | ProjectSpotlightBlock
  | ProjectBentoBlock
  | StatsBannerBlock
  | AboutSectionBlock
  | TestimonialsSectionBlock
  | ContactSectionBlock
  | TechStackBlock
  | FeatureAccordionBlock
  | CtaButtonBlock
  | CvDownloadBlock
  | GridLayoutBlock;

/** A page-builder section: one block (enforced by Studio validation). */
export type DynamicComponentWithBuiltUrls = Omit<
  Resolved<Sanity.DynamicComponent>,
  "component"
> & {
  component?: DynamicComponentBlock[];
};

// Fails to compile when the schema gains a block type that isn't in the union
// above, so a new block can't be silently dropped by the renderer.
type SchemaBlockType = NonNullable<
  Sanity.DynamicComponent["component"]
>[number]["_type"];
type AssertNever<T extends never> = T;
export type MissingBlockTypes = AssertNever<
  Exclude<SchemaBlockType, DynamicComponentBlock["_type"]>
>;
