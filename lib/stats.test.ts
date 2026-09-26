import { describe, expect, it } from "vitest";

import { formatCount, parseStatValue } from "./stats";

describe("parseStatValue", () => {
  it.each([
    ["7+", { num: 7, suffix: "+" }],
    ["1,200+", { num: 1200, suffix: "+" }],
    ["4.75", { num: 4.75, suffix: "" }],
    ["99.9%", { num: 99.9, suffix: "%" }],
  ])("parses %s", (raw, expected) => {
    expect(parseStatValue(raw)).toEqual(expected);
  });

  it.each(["Multiple", "", "TypeScript · React"])(
    "returns null for non-numeric %j",
    (raw) => {
      expect(parseStatValue(raw)).toBeNull();
    },
  );
});

describe("formatCount", () => {
  it("counts whole numbers towards an integer target", () => {
    expect(formatCount(3.6, 7, "+")).toBe("4+");
  });

  it("counts to one decimal place towards a fractional target", () => {
    expect(formatCount(2.34, 4.75, "")).toBe("2.3");
  });
});
