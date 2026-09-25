import { describe, expect, it } from "vitest";

import { buildImageUrls } from "./sanity";

const image = (id: string) => ({
  _type: "image" as const,
  asset: { _ref: `image-${id}-200x100-png`, _type: "reference" as const },
});

describe("buildImageUrls", () => {
  it("replaces image fields at any depth with CDN URLs", () => {
    const result = buildImageUrls({
      photo: image("abc"),
      items: [{ image: image("def"), title: "Card" }],
    });

    expect(result.photo).toBe(
      "https://cdn.sanity.io/images/test-project/test/abc-200x100.png",
    );
    expect(result.items[0].image).toBe(
      "https://cdn.sanity.io/images/test-project/test/def-200x100.png",
    );
    expect(result.items[0].title).toBe("Card");
  });

  it("leaves file assets and plain values alone", () => {
    const file = { _type: "file", asset: { _ref: "file-xyz-pdf" } };
    expect(buildImageUrls({ file, count: 3, nothing: null })).toEqual({
      file,
      count: 3,
      nothing: null,
    });
  });
});
