import { NextResponse } from "next/server";

import { type NavigationResponse, fetchCMS } from "@/lib/strapi";

/**
 * GET /api/nav
 * Fetches navigation from Strapi CMS (single type with nested nav groups)
 * Cached for 1 minute since nav changes rarely
 */
export async function GET() {
  try {
    // Fetch the single Navigation record with all nested nav groups and items
    // Use dot notation to populate nested dynamizone fields
    const data = await fetchCMS<NavigationResponse>({
      endpoint: "/api/navigation?populate=Nav_groups.Nav_list.*",
      revalidate: 60, // Cache for 1 minute
    });
    // eslint-disable-next-line no-console
    console.log(
      "📊 Navigation data received:",
      JSON.stringify(data.data, null, 2),
    );
    // eslint-disable-next-line no-console
    console.log("📦 Nav groups count:", data.data?.Nav_groups?.length);
    return NextResponse.json({
      navigation: data.data || {},
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
