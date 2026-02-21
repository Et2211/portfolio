import { NextResponse } from "next/server";

import { type NavigationResponse, fetchCMS } from "@/lib/strapi";

/**
 * GET /api/nav
 * Fetches navigation from Strapi CMS (single type with nested nav groups)
 * Cached for 1 minute since nav changes rarely
 */
export async function GET() {
  try {
    // eslint-disable-next-line no-console
    console.log("🔵 [NAV API] Starting navigation fetch...");

    // Fetch the single Navigation record with all nested nav groups and items
    // Use dot notation to populate nested dynamizone fields
    const data = await fetchCMS<NavigationResponse>({
      endpoint: "/api/navigation?populate=Nav_groups.Nav_list.*",
      revalidate: 60, // Cache for 1 minute
    });

    // eslint-disable-next-line no-console
    console.log(
      "🔵 [NAV API] Full Strapi response:",
      JSON.stringify(data, null, 2),
    );

    // eslint-disable-next-line no-console
    console.log(
      "🔵 [NAV API] Navigation object:",
      JSON.stringify(data.data, null, 2),
    );

    // eslint-disable-next-line no-console
    console.log(
      "🔵 [NAV API] Nav groups count:",
      data.data?.Nav_groups?.length,
    );

    if (data.data?.Nav_groups) {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      data.data.Nav_groups.forEach((group: any, idx: number) => {
        // eslint-disable-next-line no-console
        console.log(`🔵 [NAV API] Group ${idx}: "${group.Nav_header}"`);
        // eslint-disable-next-line no-console
        console.log(
          `🔵 [NAV API]   Items in group: ${(group as any).Nav_list?.length || 0}`,
        );
        (group as any).Nav_list?.forEach((item: any, itemIdx: number) => {
          // eslint-disable-next-line no-console
          console.log(
            `🔵 [NAV API]     Item ${itemIdx}: ${item.Nav_title} -> ${item.URL}`,
          );
        });
      });
      /* eslint-enable @typescript-eslint/no-explicit-any */
    }

    const response = {
      navigation: data.data || {},
    };

    // eslint-disable-next-line no-console
    console.log(
      "🔵 [NAV API] Final response:",
      JSON.stringify(response, null, 2),
    );

    return NextResponse.json(response);
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
