import { evaluate, parse } from "groq-js";
import { describe, expect, it } from "vitest";

import { FOOTER_QUERY, PAGE_BY_URL_QUERY } from "./queries";

// Runs the real GROQ against an in-memory dataset, so the projections are
// tested without a Sanity project.
const fileAsset = {
  _id: "file-cv-pdf",
  _type: "sanity.fileAsset",
  url: "https://cdn.sanity.io/files/test/cv.pdf",
};

const cvDownload = {
  _key: "cv",
  _type: "cvDownload",
  label: "Download CV",
  file: { _type: "file", asset: { _type: "reference", _ref: "file-cv-pdf" } },
};

const section = (key: string, block: object) => ({
  _key: key,
  _type: "dynamicComponent",
  component: [block],
});

const timeline = {
  _key: "tl",
  _type: "timeline",
  items: [{ _key: "job", _type: "timelineItem", title: "RAC" }],
};

const page = {
  _id: "home",
  _type: "page",
  url: "/",
  pageComponents: [
    section("top-cv", cvDownload),
    section("timeline", timeline),
    section("grid", {
      _key: "grid",
      _type: "gridLayout",
      items: [
        section("cell-cv", cvDownload),
        section("cell-timeline", timeline),
        section("cell-grid", {
          _key: "inner-grid",
          _type: "gridLayout",
          items: [section("inner-cv", cvDownload)],
        }),
      ],
    }),
  ],
};

const run = async (query: string, params: Record<string, string> = {}) => {
  const result = await evaluate(parse(query), {
    dataset: [
      fileAsset,
      page,
      {
        _id: "footer",
        _type: "footer",
        components: [section("f-cv", cvDownload)],
      },
    ],
    params,
  });
  return result.get();
};

describe("page-builder projections", () => {
  it("resolves fileUrl for a top-level CV download", async () => {
    const result = await run(PAGE_BY_URL_QUERY, { url: "/" });
    expect(result.pageComponents[0].component[0].fileUrl).toBe(fileAsset.url);
  });

  it("resolves fileUrl for a CV download inside a grid cell", async () => {
    const result = await run(PAGE_BY_URL_QUERY, { url: "/" });
    const grid = result.pageComponents[2].component[0];
    expect(grid.items[0].component[0].fileUrl).toBe(fileAsset.url);
  });

  it("keeps nested block content (a timeline inside a grid cell)", async () => {
    const result = await run(PAGE_BY_URL_QUERY, { url: "/" });
    const cellTimeline =
      result.pageComponents[2].component[0].items[1].component[0];
    expect(cellTimeline.items[0].title).toBe("RAC");
  });

  it("resolves fileUrl for a CV download in a grid nested in a grid", async () => {
    const result = await run(PAGE_BY_URL_QUERY, { url: "/" });
    const innerGrid =
      result.pageComponents[2].component[0].items[2].component[0];
    expect(innerGrid.items[0].component[0].fileUrl).toBe(fileAsset.url);
  });

  it("only adds fileUrl to CV download blocks", async () => {
    const result = await run(PAGE_BY_URL_QUERY, { url: "/" });
    expect(result.pageComponents[1].component[0]).not.toHaveProperty("fileUrl");
  });

  it("projects the footer the same way", async () => {
    const result = await run(FOOTER_QUERY);
    expect(result.components[0].component[0].fileUrl).toBe(fileAsset.url);
  });
});
