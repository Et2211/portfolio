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
  tier?: "frontend" | "bff" | "services" | "data" | "content" | "infra" | "observability";

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
   * Visual style: default (grey), primary (blue animated), error (red dashed).
   */
  variant?: "default" | "primary" | "error";
};

export type Documents = Navigation | Page;
