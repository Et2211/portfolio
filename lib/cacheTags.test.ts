import { describe, expect, it } from "vitest";

import { GLOBAL_TAG, PAGES_TAG, tagsToRevalidate } from "./cacheTags";

describe("tagsToRevalidate", () => {
  it("expires every page plus navigation/footer when a page changes", () => {
    // Covers renamed, deleted and new pages: the old URL's cache entry and
    // any nav link to it are refreshed too.
    expect(tagsToRevalidate("page")).toEqual([PAGES_TAG, GLOBAL_TAG]);
  });

  it.each(["navigation", "footer"])("expires global content for %s", (type) => {
    expect(tagsToRevalidate(type)).toEqual([GLOBAL_TAG]);
  });

  it.each([undefined, "sanity.imageAsset", "post"])(
    "does nothing for %s",
    (type) => {
      expect(tagsToRevalidate(type)).toEqual([]);
    },
  );
});
