// Cached content fetchers. Everything is cached for days and invalidated on
// demand by the Sanity webhook via the tags in ./cacheTags.

import { cacheLife, cacheTag } from "next/cache";

import type { Footer, Page } from "@/types/generated/sanity";

import { GLOBAL_TAG, PAGES_TAG } from "./cacheTags";
import {
  FOOTER_QUERY,
  NAVIGATION_QUERY,
  PAGE_BY_URL_QUERY,
  PAGE_URLS_QUERY,
} from "./queries";
import { buildImageUrls, fetchSanity } from "./sanity";

export async function getPageByUrl(url: string) {
  "use cache";
  cacheLife("days");
  cacheTag(PAGES_TAG);
  const page = await fetchSanity<Page | null>(PAGE_BY_URL_QUERY, { url });
  // Resolve image URLs on the server so client components get plain strings.
  return page ? buildImageUrls(page) : null;
}

/** URL paths of every CMS page, e.g. ["/", "/career/rac"]. */
export async function getPageUrls(): Promise<string[]> {
  return await fetchSanity<string[]>(PAGE_URLS_QUERY);
}

export async function getFooter() {
  "use cache";
  cacheLife("days");
  cacheTag(GLOBAL_TAG);
  const footer = await fetchSanity<Pick<Footer, "components"> | null>(
    FOOTER_QUERY,
  );
  return footer ? buildImageUrls(footer) : null;
}

export type NavLink = { label: string; href: string };
export type NavSection = { heading: string; links: NavLink[] };

type NavigationResult = Array<{
  heading: string | null;
  links: Array<{ label: string | null; href: string | null }> | null;
}> | null;

// Errors are thrown rather than caught here: a caught error inside
// "use cache" would cache the fallback (e.g. an empty menu) for days.
export async function getNavigation(): Promise<NavSection[]> {
  "use cache";
  cacheLife("days");
  cacheTag(GLOBAL_TAG);
  const groups = await fetchSanity<NavigationResult>(NAVIGATION_QUERY);
  return (groups ?? []).map((group) => ({
    heading: group.heading ?? "",
    links: (group.links ?? []).map((link) => ({
      label: link.label ?? "",
      href: link.href ?? "#",
    })),
  }));
}
