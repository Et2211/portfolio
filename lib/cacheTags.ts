// Cache tags shared by the cached fetchers (lib/content.ts) and the Sanity
// webhook (app/api/revalidate), so the two can't drift apart.

/** Content shown on every page: navigation and footer. */
export const GLOBAL_TAG = "sanity:global";

/** A single CMS page, keyed by its URL path (e.g. "/career/rac"). */
export const pageTag = (url: string) => `page:${url}`;
