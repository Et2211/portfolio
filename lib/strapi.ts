const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

interface FetchOptions {
  endpoint: string;
  revalidate?: number;
}

/**
 * Unified fetch utility for Strapi CMS
 * Call Strapi directly from server components
 * @param endpoint - The Strapi API endpoint (e.g., "/api/pages?populate=*")
 * @param revalidate - Optional revalidation time in seconds for Next.js caching
 * @returns The JSON response data
 */
export async function fetchCMS<T = any>({
  endpoint,
  revalidate,
}: FetchOptions): Promise<T> {
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
    throw new Error(`Failed to fetch: ${endpoint}`);
  }

  return response.json();
}
