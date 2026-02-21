import { NextResponse } from "next/server";
import { fetchStrapi } from "@/lib/strapi";

/**
 * GET /api/pages?url=/path
 * Fetches a specific page from Strapi CMS by URL
 * Cached for 1 hour
 * Required query params:
 * - url: The page URL to fetch
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageUrl = searchParams.get("url");

    if (!pageUrl) {
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400 },
      );
    }

    const data = await fetchStrapi({
      endpoint: `/api/pages?filters[Url][$eq]=${encodeURIComponent(pageUrl)}&populate=*`,
      revalidate: 3600, // Cache for 1 hour
    });
    return NextResponse.json({
      page: data.data && data.data.length > 0 ? data.data[0] : null,
    });
  } catch (error) {
    console.error("Error fetching pages:", error);
    return NextResponse.json(
      { error: "Failed to fetch pages" },
      { status: 500 },
    );
  }
}
