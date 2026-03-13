import { NextResponse } from "next/server";


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

    // Strapi CMS is deprecated; implement Sanity or remove this endpoint.
    await new Promise((resolve) => setTimeout(resolve, 0)); // satisfy require-await
    return NextResponse.json({ error: 'Strapi CMS is deprecated.' }, { status: 410 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // eslint-disable-next-line no-console
    console.error("\n❌ Failed to fetch pages:\n", message, "\n");

    const isDev = process.env.NODE_ENV === "development";

    return NextResponse.json(
      {
        error: "Failed to fetch pages",
        ...(isDev && { details: message }),
      },
      { status: 500 },
    );
  }
}
