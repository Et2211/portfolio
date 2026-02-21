import { NextResponse } from "next/server";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

/**
 * GET /api/cms
 * Fetches all content from Strapi CMS in a single call
 */
export async function GET() {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (STRAPI_API_TOKEN) {
      headers["Authorization"] = `Bearer ${STRAPI_API_TOKEN}`;
    }

    console.log("Fetching from Strapi:", STRAPI_URL);

    // Fetch all content types in parallel
    const [pagesRes, navGroupsRes] = await Promise.all([
      fetch(`${STRAPI_URL}/api/pages?populate=*`, {
        headers,
        next: { revalidate: 3600 }, // Cache for 1 hour
      }),
      fetch(`${STRAPI_URL}/api/nav-groups?populate=*`, {
        headers,
        next: { revalidate: 3600 },
      }),
    ]);

    console.log("Pages response status:", pagesRes.status);
    console.log("Nav groups response status:", navGroupsRes.status);

    if (!pagesRes.ok || !navGroupsRes.ok) {
      const pagesError = await pagesRes.text();
      const navGroupsError = await navGroupsRes.text();
      console.error("Pages error:", pagesError);
      console.error("Nav groups error:", navGroupsError);
      throw new Error("Failed to fetch from Strapi");
    }

    const [pages, navGroups] = await Promise.all([
      pagesRes.json(),
      navGroupsRes.json(),
    ]);

    // Return all content in one response
    return NextResponse.json({
      pages: pages.data,
      navGroups: navGroups.data,
    });
  } catch (error) {
    console.error("Error fetching CMS content:", error);
    return NextResponse.json(
      { error: "Failed to fetch content from CMS" },
      { status: 500 },
    );
  }
}
