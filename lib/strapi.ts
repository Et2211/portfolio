const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

interface FetchStrapiOptions {
  endpoint: string;
  revalidate?: number;
}

/**
 * Fetch data from Strapi CMS with authentication
 * @param endpoint - The Strapi API endpoint (e.g., "/api/pages?populate=*")
 * @param revalidate - Optional revalidation time in seconds for Next.js caching
 * @returns The JSON response data
 */
export async function fetchStrapi<T = any>({
  endpoint,
  revalidate,
}: FetchStrapiOptions): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (STRAPI_API_TOKEN) {
    headers["Authorization"] = `Bearer ${STRAPI_API_TOKEN}`;
  }

  const url = `${STRAPI_URL}${endpoint}`;

  const fetchOptions: RequestInit = {
    headers,
    ...(revalidate !== undefined && { next: { revalidate } }),
  };

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    throw new Error(`Failed to fetch from Strapi: ${endpoint}`);
  }

  return response.json();
}
