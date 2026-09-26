// The catch-all route receives URL paths as slug segments; Sanity stores them
// as paths. "/" is the home page (no segments).

export const slugToUrl = (slug?: string[]): string =>
  slug?.length ? `/${slug.join("/")}` : "/";

export const urlToSlug = (url: string): string[] | undefined =>
  url === "/" ? undefined : url.replace(/^\/+/, "").split("/");
