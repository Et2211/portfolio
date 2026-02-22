const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

// Re-export types for convenience
export type {
  Navigation,
  NavigationResponse,
  NavItem,
  NavGroup,
  Page,
  PageResponse,
  TimelineItem,
  TimelineComponent,
  DynamicComponent,
  BlocksContent,
} from "@/types/strapi";

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
/**
 * Helper function to provide helpful error messages based on HTTP status
 */
function getStrapiErrorHint(
  status: number,
  endpoint: string,
  // url is used in error messages
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  url: string,
): string {
  switch (status) {
    case 400:
      return `Bad request to ${endpoint}. Check the endpoint syntax and query parameters.`;
    case 401:
      return "Unauthorized: STRAPI_API_TOKEN is missing or invalid. Generate a new token in Strapi admin panel.";
    case 403:
      return "Forbidden: Your API token doesn't have permission to access this endpoint.";
    case 404:
      return `Not found: The endpoint ${endpoint} doesn't exist. Check your Strapi schema.`;
    case 500:
      return "Strapi server error. Check if your Strapi instance is running and healthy.";
    case 503:
      return "Strapi service unavailable. The server may be starting up or under maintenance.";
    default:
      if (status >= 500) {
        return "Strapi server error. Check the Strapi logs for details.";
      }
      return `HTTP ${status} error. Check your Strapi configuration or network connection.`;
  }
}

export async function fetchCMS<T = { data: unknown[] }>({
  endpoint,
  revalidate,
}: FetchOptions): Promise<T> {
  // Validate that STRAPI_URL is set
  if (!STRAPI_URL) {
    throw new Error(
      "STRAPI_URL environment variable is not set.\n" +
        "• Local: Add it to .env.local\n" +
        "• Vercel: Add it to Settings → Environment Variables\n" +
        "Format: https://your-strapi-domain.com (without /admin)",
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

  let response: Response;
  try {
    response = await fetch(url, fetchOptions);
  } catch (fetchError) {
    const errorMsg =
      fetchError instanceof Error ? fetchError.message : String(fetchError);
    throw new Error(
      `Failed to connect to Strapi at ${STRAPI_URL}\n` +
        `Error: ${errorMsg}\n` +
        `• Check if STRAPI_URL is correct and the server is running\n` +
        `• Verify network connectivity\n` +
        `• Check firewall/CORS settings if accessing remotely`,
    );
  }

  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    const isHtml = contentType?.includes("text/html");
    const hint = getStrapiErrorHint(response.status, endpoint, url);

    let errorMessage = `Strapi API Error [${response.status}] for endpoint: ${endpoint}\n${hint}`;

    if (isHtml) {
      errorMessage += `\n• Received HTML instead of JSON (wrong domain or routing issue?)`;
    }

    throw new Error(errorMessage);
  }

  try {
    return response.json();
  } catch (parseError) {
    const contentType = response.headers.get("content-type");
    const errorMsg =
      parseError instanceof Error ? parseError.message : String(parseError);
    throw new Error(
      `Failed to parse Strapi response from ${endpoint}\n` +
        `Content-Type: ${contentType}\n` +
        `Error: ${errorMsg}\n` +
        `• Check if the endpoint returns valid JSON\n` +
        `• Verify the Strapi schema and content exists`,
    );
  }
}
