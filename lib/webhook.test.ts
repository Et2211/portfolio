import { describe, expect, it } from "vitest";

import { isWebhookPayload } from "./webhook";

describe("isWebhookPayload", () => {
  it.each([{ _type: "page" }, { _type: "footer", url: "/x" }, {}])(
    "accepts %j",
    (value) => {
      expect(isWebhookPayload(value)).toBe(true);
    },
  );

  it.each([[], [{ _type: "page" }], null, "page", 42, { _type: 42 }])(
    "rejects %j",
    (value) => {
      expect(isWebhookPayload(value)).toBe(false);
    },
  );
});
