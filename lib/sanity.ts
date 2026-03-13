import { createClient } from 'next-sanity'

export const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: '2023-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

export async function fetchSanity(query: string, params: Record<string, unknown> = {}) {
  return await sanityClient.fetch(query, params)
}

// Types for Sanity data are now imported from generated types
