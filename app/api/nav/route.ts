import { NextResponse } from "next/server";

import { fetchCMS } from "@/lib/strapi";

/**
 * GET /api/nav
 * Fetches navigation groups from Strapi CMS
 * Cached for 1 minute since nav changes rarely
 */
export async function GET() {
  try {
    const data = await fetchCMS({
      endpoint: "/api/nav-groups?populate=*",
      revalidate: 60, // Cache for 1 minute
    });

    return NextResponse.json({
      navGroups: data.data || [],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // eslint-disable-next-line no-console
    console.error("\n❌ Failed to fetch navigation groups:\n", message, "\n");

    const isDev = process.env.NODE_ENV === "development";

    return NextResponse.json(
      {
        error: "Failed to fetch navigation",
        ...(isDev && { details: message }),
      },
      { status: 500 },
    );
  }
}
