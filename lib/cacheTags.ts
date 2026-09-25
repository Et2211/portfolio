// Cache tags shared by the cached fetchers (lib/content.ts) and the Sanity
// webhook (app/api/revalidate), so the two can't drift apart.

/** Content shown on every page: navigation and footer. */
export const GLOBAL_TAG = "sanity:global";

/** Every CMS page (and every URL that was looked up and found no page). */
export const PAGES_TAG = "sanity:pages";

/**
 * Which tags a Sanity publish should expire.
 *
 * A page change expires every page rather than just its URL: the webhook
 * only knows the new URL, so a renamed or deleted page would otherwise keep
 * being served from its old URL, and a new page would stay a cached 404.
 * Navigation and the footer link to pages by URL, so they're refreshed too.
 * The site is small, so re-rendering all pages after a publish is cheap.
 */
export function tagsToRevalidate(documentType: string | undefined): string[] {
  switch (documentType) {
    case "page":
      return [PAGES_TAG, GLOBAL_TAG];
    case "navigation":
    case "footer":
      return [GLOBAL_TAG];
    default:
      return [];
  }
}
