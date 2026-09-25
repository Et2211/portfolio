// GROQ queries. Kept together so pages and the footer expand page-builder
// blocks identically.

/**
 * Fields for one page-builder block: resolves file downloads to a URL and
 * expands nested `items` (e.g. carousel → timeline → timeline items). The
 * `defined()` guards stop GROQ adding `items: null` to every object.
 */
const BLOCK_FIELDS = /* groq */ `
  ...,
  _type == "cvDownload" => { "fileUrl": file.asset->url },
  defined(items) => {
    items[]{
      ...,
      defined(items) => { items[]{ ... } }
    }
  }`;

/**
 * Projection for an array of page-builder sections (`dynamicComponent`).
 * A grid's cells are sections too, so their blocks get the same fields.
 */
const SECTIONS_PROJECTION = /* groq */ `{
  ...,
  component[]{
    ${BLOCK_FIELDS},
    _type == "gridLayout" => {
      items[]{
        ...,
        component[]{${BLOCK_FIELDS}
        }
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
