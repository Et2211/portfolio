const STRAPI_URL = process.env.STRAPI_URL;
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
export async function fetchCMS<T = { data: unknown[] }>({
  endpoint,
  revalidate,
}: FetchOptions): Promise<T> {
  // Validate that STRAPI_URL is set
  if (!STRAPI_URL) {
    throw new Error(
      "STRAPI_URL environment variable is not set. Please add it to your .env.local or Vercel environment variables.",
    );
  }

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
    const contentType = response.headers.get("content-type");
    let errorDetail = `HTTP ${response.status}`;

    // If response is HTML (error page), mention it in the error
    if (contentType?.includes("text/html")) {
      errorDetail +=
        " - received HTML instead of JSON (possible CORS error or wrong URL)";
    }

    throw new Error(`Failed to fetch ${endpoint} from ${url}: ${errorDetail}`);
  }

  try {
    return response.json();
  } catch (parseError) {
    const contentType = response.headers.get("content-type");
    throw new Error(
      `Failed to parse JSON from ${endpoint}. Content-Type: ${contentType}. Error: ${parseError instanceof Error ? parseError.message : String(parseError)}`,
    );
  }
}
