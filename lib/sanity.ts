import { createClient } from 'next-sanity'

export const sanityClient = createClient({
  projectId: 'sjte2cbd', // from studio-portfolio/sanity.config.ts
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

export async function fetchSanity(query: string, params: Record<string, unknown> = {}) {
  return await sanityClient.fetch(query, params)
}

// Types for Sanity data are now imported from generated types
