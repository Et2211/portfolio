import { NextResponse } from "next/server";
import { fetchStrapi } from "@/lib/strapi";

/**
 * GET /api/nav
 * Fetches navigation groups from Strapi CMS
 * Cached for 24 hours since nav changes rarely
 */
export async function GET() {
  try {
    const data = await fetchStrapi({
      endpoint: "/api/nav-groups?populate=*",
      revalidate: 86400, // Cache for 24 hours
    });

    return NextResponse.json({
      navGroups: data.data || [],
    });
  } catch (error) {
    console.error("Error fetching nav groups:", error);
    return NextResponse.json(
      { error: "Failed to fetch navigation" },
      { status: 500 },
    );
  }
}
