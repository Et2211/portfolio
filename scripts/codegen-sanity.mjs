// Regenerates types/generated/sanity.d.ts from the studio's compiled schemas.
//
// sanity-codegen needs Prettier 2 and Babel 7 peers, and Babel resolves its
// plugins from the working directory, so a plain `npx sanity-codegen` here
// fails (and installing it would clash with this repo's Prettier 3). Instead,
// install the pinned toolchain into a throwaway directory and run it there.
//
// Usage: npm run codegen:full   (rebuilds the studio schemas first)
//        npm run codegen:sanity (uses the existing studio build)

import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SCHEMA_PATH = path.resolve(
  ROOT,
  "../studio-portfolio/dist/schemaTypes/index.js",
);
const OUTPUT_PATH = path.join(ROOT, "types/generated/sanity.d.ts");

// Exact versions, so re-running codegen resolves the same toolchain.
const TOOLCHAIN = [
  "sanity-codegen@0.9.8",
  "babel-plugin-module-resolver@4.1.0",
  "@babel/core@7.29.7",
  "@babel/preset-env@7.29.7",
  "@babel/preset-react@7.29.7",
  "@babel/preset-typescript@7.29.7",
  "prettier@2.8.8",
];

if (!existsSync(SCHEMA_PATH)) {
  process.stderr.write(
    `Studio schemas not built: ${SCHEMA_PATH}\n` +
      "Run `npm run codegen:full` to build them first.\n",
  );
  process.exit(1);
}

const workDir = mkdtempSync(path.join(tmpdir(), "sanity-codegen-"));

try {
  const run = (command, args) =>
    execFileSync(command, args, { cwd: workDir, stdio: "inherit" });

  run("npm", ["init", "-y", "--silent"]);
  run("npm", ["install", "--no-audit", "--no-fund", "--silent", ...TOOLCHAIN]);
  writeFileSync(
    path.join(workDir, "sanity-codegen.config.js"),
    `module.exports = ${JSON.stringify({
      schemaPath: SCHEMA_PATH,
      outputPath: OUTPUT_PATH,
    })};\n`,
  );
  run("npx", ["sanity-codegen"]);
} finally {
  rmSync(workDir, { recursive: true, force: true });
}
