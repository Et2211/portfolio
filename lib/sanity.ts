import { createImageUrlBuilder } from "@sanity/image-url";
import { createClient } from "next-sanity";

import type { SanityImage } from "../types/generated/sanity";

export const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: "2023-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const builder = createImageUrlBuilder({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
});

export function buildImageUrl(source: SanityImage): string {
  if (!source) return "";
  if (typeof source === "string") return source;
  // Only allow SanityImage objects
  if (
    typeof source === "object" &&
    source !== null &&
    "asset" in source &&
    typeof source.asset === "object" &&
    source.asset !== null &&
    "_ref" in source.asset &&
    typeof source.asset._ref === "string"
  ) {
    return builder.image(source).url();
  }
  return "";
}

export async function fetchSanity<T>(
  query: string,
  params: Record<string, string | number | boolean | null> = {},
  options?: { tags?: string[] },
): Promise<T> {
  // For tagged fetches (navigation, footer): cache for 1 hour and use tag-based invalidation
  // For page data: don't cache at the data layer (revalidate: 0) so webhook invalidation works cleanly.
  // ISR still handles route caching, but data is always fresh on regeneration.
  const nextOptions = options?.tags
    ? { tags: options.tags, revalidate: 3600 }
    : { revalidate: 0 };
  return await sanityClient.fetch<T>(query, params, { next: nextOptions });
}

export type SanityValue =
  | string
  | number
  | boolean
  | null
  | SanityValue[]
  | AnyObject;
interface AnyObject {
  [key: string]: SanityValue;
}

const isSanityImage = (val: SanityValue): val is SanityImage => {
  if (typeof val !== "object" || val === null) return false;
  const obj = val as AnyObject;
  if (!("asset" in obj) || typeof obj.asset !== "object" || obj.asset === null)
    return false;
  const ref = (obj.asset as AnyObject)._ref;
  // Only treat as image if the ref starts with "image-"
  return typeof ref === "string" && ref.startsWith("image-");
};

export function buildImageUrlForItem(item: SanityValue): SanityValue {
  if (typeof item !== "object" || item === null) return item;
  if (Array.isArray(item)) return item.map(buildImageUrlForItem);

  const obj = item as AnyObject;
  const result: AnyObject = {};

  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (isSanityImage(value)) {
      result[key] = buildImageUrl(value);
    } else if (Array.isArray(value)) {
      result[key] = (value as SanityValue[]).map(buildImageUrlForItem);
    } else if (typeof value === "object" && value !== null) {
      result[key] = buildImageUrlForItem(value);
    } else {
      result[key] = value;
    }
  }

  return result;
}

export function buildImageUrlsForComponents(
  components: AnyObject[],
): AnyObject[] {
  return components.map(
    (component) => buildImageUrlForItem(component) as AnyObject,
  );
}
