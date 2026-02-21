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

    if (data.data?.Nav_groups) {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      data.data.Nav_groups.forEach((group: any, groupIdx: number) => {
        // eslint-disable-next-line no-console
        console.log(`\n📍 Group ${groupIdx}: ${group.Nav_header}`);
        // eslint-disable-next-line no-console
        console.log(`   Total items: ${group.Nav_list?.length}`);
        group.Nav_list?.forEach((item: any, itemIdx: number) => {
          // eslint-disable-next-line no-console
          console.log(`   Item ${itemIdx}:`, JSON.stringify(item, null, 2));
        });
      });
      /* eslint-enable @typescript-eslint/no-explicit-any */
    }

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
