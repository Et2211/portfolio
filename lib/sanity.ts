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
    return builder.image(source).width(400).height(300).url()
  }
  return ''
}

export async function fetchSanity<T>(
  query: string,
  params: Record<string, string | number | boolean | null> = {},
): Promise<T> {
  return await sanityClient.fetch<T>(query, params)
}

// Types for Sanity data are now imported from generated types
