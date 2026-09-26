/**
 * Helper types imported by the generated `types/generated/sanity.d.ts`.
 *
 * They come from the `sanity-codegen` package, which is only needed as a CLI
 * (`npm run codegen:sanity` runs it via npx). Installing it would pull in
 * Prettier 2 and Babel 7 peers, and without it every import below silently
 * resolved to `any` (hidden by `skipLibCheck`). These mirror its v0.9.8
 * definitions so the generated types are real types.
 */
declare module "sanity-codegen" {
  /** A reference to another document; the generic is for type-level use only. */
  export type SanityReference<_T> = {
    _type: "reference";
    _ref: string;
  };

  export type SanityKeyedReference<_T> = {
    _type: "reference";
    _key: string;
    _ref: string;
  };

  export type SanityAsset = SanityReference<unknown>;

  export interface SanityImage {
    asset: SanityAsset;
  }

  export interface SanityFile {
    asset: SanityAsset;
  }

  export interface SanityGeoPoint {
    _type: "geopoint";
    lat: number;
    lng: number;
    alt: number;
  }

  /** A Portable Text block. */
  export interface SanityBlock {
    _type: "block";
    [key: string]: unknown;
  }

  export interface SanityDocument {
    _id: string;
    _createdAt: string;
    _rev: string;
    _updatedAt: string;
  }

  export interface SanityImageCrop {
    _type: "sanity.imageCrop";
    bottom: number;
    left: number;
    right: number;
    top: number;
  }

  export interface SanityImageHotspot {
    _type: "sanity.imageHotspot";
    height: number;
    width: number;
    x: number;
    y: number;
  }

  export type SanityKeyed<T> = T extends object ? T & { _key: string } : T;

  export interface SanityImageAsset extends SanityDocument {
    _type: "sanity.imageAsset";
    assetId: string;
    extension: string;
    metadata: SanityImageMetadata;
    mimeType: string;
    originalFilename: string;
    path: string;
    sha1hash: string;
    size: number;
    uploadId: string;
    url: string;
  }

  export interface SanityImageMetadata {
    _type: "sanity.imageMetadata";
    dimensions: SanityImageDimensions;
    hasAlpha: boolean;
    isOpaque: boolean;
    lqip: string;
    palette: SanityImagePalette;
  }

  export interface SanityImageDimensions {
    _type: "sanity.imageDimensions";
    aspectRatio: number;
    height: number;
    width: number;
  }

  export interface SanityImagePalette {
    _type: "sanity.imagePalette";
    darkMuted: SanityImagePaletteSwatch;
    darkVibrant: SanityImagePaletteSwatch;
    dominant: SanityImagePaletteSwatch;
    lightMuted: SanityImagePaletteSwatch;
    lightVibrant: SanityImagePaletteSwatch;
    muted: SanityImagePaletteSwatch;
    vibrant: SanityImagePaletteSwatch;
  }

  export interface SanityImagePaletteSwatch {
    _type: "sanity.imagePaletteSwatch";
    background: string;
    foreground: string;
    population: number;
    title: string;
  }
}
