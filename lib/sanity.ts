import { createImageUrlBuilder } from '@sanity/image-url'
import { createClient } from 'next-sanity'

import type { SanityImage } from '../types/generated/sanity';


export const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: '2023-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

const builder = createImageUrlBuilder({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
})

export function buildImageUrl(source: SanityImage): string {
  if (!source) return ''
  if (typeof source === 'string') return source
  // Only allow SanityImage objects
  if (
    typeof source === 'object' &&
    source !== null &&
    'asset' in source &&
    typeof source.asset === 'object' &&
    source.asset !== null &&
    '_ref' in source.asset &&
    typeof source.asset._ref === 'string'
  ) {
    return builder.image(source).url()
  }
  return ''
}

export async function fetchSanity<T>(
  query: string,
  params: Record<string, string | number | boolean | null> = {},
): Promise<T> {
  return await sanityClient.fetch<T>(query, params)
}

export type SanityValue = string | number | boolean | null | SanityValue[] | AnyObject;
interface AnyObject { [key: string]: SanityValue }

const isSanityImage = (val: SanityValue): val is SanityImage =>
  typeof val === "object" &&
  val !== null &&
  "asset" in (val as AnyObject) &&
  typeof (val as AnyObject).asset === "object" &&
  (val as AnyObject).asset !== null;

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
  return components.map((component) => buildImageUrlForItem(component) as AnyObject);
}
