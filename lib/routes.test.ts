import { describe, expect, it } from "vitest";

import { slugToUrl, urlToSlug } from "./routes";

describe("slugToUrl / urlToSlug", () => {
  it("maps the home page to no segments", () => {
    expect(slugToUrl(undefined)).toBe("/");
    expect(slugToUrl([])).toBe("/");
    expect(urlToSlug("/")).toBeUndefined();
  });

  it.each(["/career/rac", "/projects/meal-planner", "/about"])(
    "round-trips %s",
    (url) => {
      expect(slugToUrl(urlToSlug(url))).toBe(url);
    },
  );
});
