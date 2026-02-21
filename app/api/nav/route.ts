import { NextResponse } from "next/server";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

/**
 * GET /api/nav
 * Fetches navigation groups from Strapi CMS
 * Cached for 24 hours since nav changes rarely
 */
export async function GET() {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (STRAPI_API_TOKEN) {
      headers["Authorization"] = `Bearer ${STRAPI_API_TOKEN}`;
    }

    const response = await fetch(`${STRAPI_URL}/api/nav-groups?populate=*`, {
      headers,
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!response.ok) {
      throw new Error("Failed to fetch nav groups from Strapi");
    }

    const data = await response.json();

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
