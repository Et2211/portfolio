import { NextResponse } from "next/server";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

/**
 * GET /api/pages
 * Fetches pages from Strapi CMS
 * Cached for 1 hour
 * Optional query params:
 * - url: Fetch a specific page by URL
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageUrl = searchParams.get("url");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (STRAPI_API_TOKEN) {
      headers["Authorization"] = `Bearer ${STRAPI_API_TOKEN}`;
    }

    // If pageUrl is provided, fetch just that page
    if (pageUrl) {
      const response = await fetch(
        `${STRAPI_URL}/api/pages?filters[Url][$eq]=${encodeURIComponent(pageUrl)}&populate=*`,
        {
          headers,
          next: { revalidate: 3600 }, // Cache for 1 hour
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch page from Strapi");
      }

      const data = await response.json();
      return NextResponse.json({
        page: data.data && data.data.length > 0 ? data.data[0] : null,
      });
    }

    // Otherwise, fetch all pages
    const response = await fetch(`${STRAPI_URL}/api/pages?populate=*`, {
      headers,
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error("Failed to fetch pages from Strapi");
    }

    const data = await response.json();

    return NextResponse.json({
      pages: data.data || [],
    });
  } catch (error) {
    console.error("Error fetching pages:", error);
    return NextResponse.json(
      { error: "Failed to fetch pages" },
      { status: 500 },
    );
  }
}
