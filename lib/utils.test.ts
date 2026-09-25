import { afterEach, describe, expect, it } from "vitest";

import { formatDate } from "./utils";

describe("formatDate", () => {
  const originalTz = process.env.TZ;
  afterEach(() => {
    // Assigning undefined would store the string "undefined", so delete it.
    if (originalTz === undefined) {
      delete process.env.TZ;
    } else {
      process.env.TZ = originalTz;
    }
  });

  // Sanity dates are YYYY-MM-DD (parsed as UTC midnight). Formatting them in
  // the local zone showed "Jan 2021" to anyone west of UTC.
  it.each(["UTC", "America/New_York", "Pacific/Honolulu", "Asia/Tokyo"])(
    "shows the same month in %s",
    (tz) => {
      process.env.TZ = tz;
      expect(formatDate("2021-02-01")).toBe("Feb 2021");
    },
  );

  it("returns an empty string for a missing date", () => {
    expect(formatDate("")).toBe("");
  });
});
