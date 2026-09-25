import { describe, expect, it } from "vitest";

import type { ArchEdgeData, ArchNodeData } from "@/types/blocks";

import { TIER_Y_GAP, TOP_PADDING } from "./constants";
import { buildFlowEdges, buildFlowNodes } from "./layout";

const node = (nodeId: string, tier?: string): ArchNodeData =>
  ({ _type: "archNode", nodeId, label: nodeId, tier }) as ArchNodeData;

const positionOf = (nodes: ReturnType<typeof buildFlowNodes>, id: string) =>
  nodes.find((flowNode) => flowNode.id === id)?.position;

describe("buildFlowNodes", () => {
  const nodes = buildFlowNodes(
    [
      node("web", "frontend"),
      node("api", "bff"),
      node("db", "data"),
      node("cms", "content"),
      node("mystery", "not-a-tier"),
      node("host", "infra"),
    ],
    [],
  );

  it("places each tier on its own row, top to bottom", () => {
    expect(positionOf(nodes, "web")?.y).toBe(TOP_PADDING);
    expect(positionOf(nodes, "api")?.y).toBe(TOP_PADDING + TIER_Y_GAP);
    expect(positionOf(nodes, "db")?.y).toBe(TOP_PADDING + 3 * TIER_Y_GAP);
  });

  it("puts content on the frontend row, to the right of everything else", () => {
    const cms = positionOf(nodes, "cms");
    expect(cms?.y).toBe(positionOf(nodes, "web")?.y);
    const others = nodes.filter((flowNode) => flowNode.id !== "cms");
    for (const other of others) {
      expect(cms!.x).toBeGreaterThan(other.position.x);
    }
  });

  it("treats unknown tiers like infra", () => {
    expect(positionOf(nodes, "mystery")?.y).toBe(positionOf(nodes, "host")?.y);
  });
});

describe("buildFlowEdges", () => {
  const edge = (variant: ArchEdgeData["variant"]): ArchEdgeData =>
    ({
      _type: "archEdge",
      sourceId: "a",
      targetId: "b",
      label: "calls",
      variant,
    }) as ArchEdgeData;

  // Labels are HTML, so the colour must be `color` (not SVG `fill`).
  it.each([
    ["primary", "#1d4ed8"],
    ["error", "#b91c1c"],
    ["default", "#334155"],
  ] as const)("colours %s labels", (variant, color) => {
    const [flowEdge] = buildFlowEdges([edge(variant)]);
    expect(flowEdge.labelStyle).toMatchObject({ color });
  });

  it("animates only primary edges", () => {
    const [primary, plain] = buildFlowEdges([edge("primary"), edge("default")]);
    expect(primary.animated).toBe(true);
    expect(plain.animated).toBe(false);
  });
});
