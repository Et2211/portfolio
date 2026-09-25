import path from "node:path";

import { defineConfig } from "vitest/config";

const root = import.meta.dirname;

export default defineConfig({
  resolve: {
    alias: {
      "@": root,
      // Next's `server-only` guard throws outside a React Server build.
      "server-only": path.join(root, "node_modules/server-only/empty.js"),
    },
  },
  test: {
    include: ["**/*.test.ts"],
    exclude: ["node_modules/**", ".next/**"],
    // lib/sanity.ts requires these at import time.
    env: { SANITY_PROJECT_ID: "test-project", SANITY_DATASET: "test" },
  },
});
