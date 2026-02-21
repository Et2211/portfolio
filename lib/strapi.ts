/**
 * Strapi API client utility
 */

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * Fetch data from Strapi API
 */
export async function fetchStrapi<T>(
  path: string,
  options: RequestInit = {},
): Promise<StrapiResponse<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Add API token if available
  if (STRAPI_API_TOKEN) {
    headers["Authorization"] = `Bearer ${STRAPI_API_TOKEN}`;
  }

  const url = `${STRAPI_URL}/api${path}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      // Enable caching for production, revalidate every hour
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(
        `Strapi API error: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching from Strapi:", error);
    throw error;
  }
}

/**
 * Fetch all pages from Strapi
 */
export async function getPages() {
  return fetchStrapi("/pages?populate=*");
}

/**
 * Fetch a single page by ID
 */
export async function getPage(id: string | number) {
  return fetchStrapi(`/pages/${id}?populate=*`);
}

/**
 * Fetch all navigation groups from Strapi
 */
export async function getNavGroups() {
  return fetchStrapi("/nav-groups?populate=deep");
}

/**
 * Fetch a single navigation group by ID
 */
export async function getNavGroup(id: string | number) {
  return fetchStrapi(`/nav-groups/${id}?populate=deep`);
}
