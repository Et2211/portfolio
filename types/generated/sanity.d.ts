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

export type Documents = Navigation | Page;
