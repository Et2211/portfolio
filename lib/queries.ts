// GROQ queries. Kept together so pages and the footer expand page-builder
// blocks identically.

/**
 * Projection for an array of page-builder sections (`dynamicComponent`).
 * Expands two levels of nested `items` (carousel → timeline, grid →
 * sections) and resolves file downloads to a URL.
 */
const SECTIONS_PROJECTION = /* groq */ `{
  ...,
  component[]{
    ...,
    "fileUrl": file.asset->url,
    items[]{
      ...,
      items[]{
        ...
      }
    }
  }
}`;

export const PAGE_BY_URL_QUERY = /* groq */ `*[_type == "page" && url == $url][0]{
  _id,
  heading,
  url,
  pageComponents[]${SECTIONS_PROJECTION}
}`;

export const PAGE_URLS_QUERY = /* groq */ `*[_type == "page" && defined(url)].url`;

export const FOOTER_QUERY = /* groq */ `*[_type == "footer"][0]{
  components[]${SECTIONS_PROJECTION}
}`;

/** Navigation groups, already shaped as `{ heading, links: [{ label, href }] }`. */
export const NAVIGATION_QUERY = /* groq */ `*[_type == "navigation"][0].navGroups[]{
  "heading": navHeader,
  "links": navList[]{
    "label": navTitle,
    "href": coalesce(externalUrl, page->url)
  }
}`;
