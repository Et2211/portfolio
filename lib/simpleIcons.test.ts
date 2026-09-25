import { describe, expect, it } from "vitest";

import { getSimpleIcon } from "./simpleIcons";

describe("getSimpleIcon", () => {
  it.each([
    ["react", "React"],
    ["siReact", "React"],
    ["TYPESCRIPT", "TypeScript"],
    ["nextdotjs", "Next.js"],
    ["Next.js", "Next.js"],
  ])("finds %s", (key, title) => {
    expect(getSimpleIcon(key)?.title).toBe(title);
  });

  it("returns only what the client needs", () => {
    expect(Object.keys(getSimpleIcon("react") ?? {}).sort()).toEqual([
      "hex",
      "path",
      "title",
    ]);
  });

  it.each([null, undefined, "", "not-a-real-icon"])(
    "returns null for %j",
    (key) => {
      expect(getSimpleIcon(key)).toBeNull();
    },
  );
});
