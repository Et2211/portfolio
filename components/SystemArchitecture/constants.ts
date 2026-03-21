export const TIER_ORDER: Record<string, number> = {
  frontend: 0,
  bff: 1,
  services: 2,
  data: 3,
  infra: 4,
  observability: 5,
  content: 0, // same row as frontend, positioned to the right
};

export const TIER_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  frontend:      { bg: "#dbeafe", border: "#3b82f6", text: "#1e3a8a" },
  bff:           { bg: "#ede9fe", border: "#7c3aed", text: "#3b0764" },
  services:      { bg: "#fef3c7", border: "#f59e0b", text: "#78350f" },
  data:          { bg: "#d1fae5", border: "#10b981", text: "#064e3b" },
  content:       { bg: "#fce7f3", border: "#ec4899", text: "#831843" },
  infra:         { bg: "#f3f4f6", border: "#6b7280", text: "#111827" },
  observability: { bg: "#fff7ed", border: "#f97316", text: "#7c2d12" },
};

export const NODE_WIDTH = 175;
export const NODE_HEIGHT = 50;
export const TIER_Y_GAP = 190;
export const NODE_X_GAP = 420;

export const TIER_LABELS: Record<string, string> = {
  frontend: "Frontend",
  bff: "BFF",
  services: "Services",
  data: "Data",
  content: "Content",
  infra: "Infrastructure",
  observability: "Observability",
};
