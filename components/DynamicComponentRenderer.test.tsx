import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { DynamicComponentWithBuiltUrls } from "@/types/blocks";

import { DynamicComponentRenderer } from "./DynamicComponentRenderer";

const section = (key: string, block: object): DynamicComponentWithBuiltUrls =>
  ({
    _key: key,
    _type: "dynamicComponent",
    component: [block],
  }) as DynamicComponentWithBuiltUrls;

const cta = (key: string, label: string) =>
  section(key, { _key: key, _type: "ctaButton", label, url: "/somewhere" });

describe("DynamicComponentRenderer", () => {
  it("skips unknown block types without leaving an empty section", () => {
    const html = renderToStaticMarkup(
      <DynamicComponentRenderer
        components={[
          cta("first", "First"),
          section("mystery", { _key: "mystery", _type: "notARealBlock" }),
          cta("last", "Last"),
        ]}
      />,
    );
    expect(html).toContain("First");
    expect(html).toContain("Last");
    // Only the known blocks after the first get a reveal wrapper.
    expect(html.match(/class="scroll-reveal"/g)).toHaveLength(1);
  });
});
