#!/usr/bin/env node
/**
 * verify-tree-shaking.mjs
 *
 * Verifies that the design-system package is correctly configured for
 * tree-shaking by bundlers (webpack, esbuild, rollup, etc.).
 *
 * Checks:
 *   1. sideEffects: false is set in package.json
 *   2. A single-component import can be resolved
 *   3. Barrel re-exports that may defeat tree-shaking are reported
 *
 * Usage: node scripts/ci/verify-tree-shaking.mjs
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../..");
const DS_ROOT = join(ROOT, "packages/design-system");
const PKG_PATH = join(DS_ROOT, "package.json");
const SRC_DIR = join(DS_ROOT, "src");

let exitCode = 0;

function pass(msg) {
  console.log(`  PASS  ${msg}`);
}

function fail(msg) {
  console.log(`  FAIL  ${msg}`);
  exitCode = 1;
}

function warn(msg) {
  console.log(`  WARN  ${msg}`);
}

console.log("\nTree-shaking verification for @mfe/design-system\n");

/* ------------------------------------------------------------------ */
/*  1. Verify sideEffects: false                                       */
/* ------------------------------------------------------------------ */

console.log("1. Checking sideEffects field in package.json...\n");

const pkg = JSON.parse(readFileSync(PKG_PATH, "utf-8"));

if (pkg.sideEffects === false) {
  pass("`sideEffects: false` is set in package.json");
} else if (pkg.sideEffects === undefined) {
  fail("`sideEffects` field is missing from package.json — bundlers will assume all files have side effects");
} else {
  warn(`\`sideEffects\` is set to ${JSON.stringify(pkg.sideEffects)} — verify this is intentional`);
}

/* ------------------------------------------------------------------ */
/*  2. Verify single-component import resolves                         */
/* ------------------------------------------------------------------ */

console.log("\n2. Checking that a single-component import resolves...\n");

const buttonIndex = join(SRC_DIR, "primitives/button/index.ts");
if (existsSync(buttonIndex)) {
  pass(`Button import path resolves: primitives/button/index.ts`);
} else {
  fail(`Button import path not found: ${buttonIndex}`);
}

// Also verify the main entry exists
const mainEntry = join(SRC_DIR, "index.ts");
if (existsSync(mainEntry)) {
  pass(`Main entry resolves: src/index.ts`);
} else {
  fail(`Main entry not found: ${mainEntry}`);
}

/* ------------------------------------------------------------------ */
/*  3. Scan barrel re-exports that may block tree-shaking              */
/* ------------------------------------------------------------------ */

console.log("\n3. Scanning for barrel re-exports that may impede tree-shaking...\n");

/**
 * Find `export * from "./..."` statements in a file and report them.
 * These wildcard re-exports can pull in entire module graphs if any
 * module in the chain has side effects or if the bundler cannot
 * statically analyse the exports.
 */
function findWildcardReExports(filePath, _label) {
  if (!existsSync(filePath)) return [];
  const content = readFileSync(filePath, "utf-8");
  const re = /export\s+\*\s+from\s+["']([^"']+)["']/g;
  const matches = [];
  let m;
  while ((m = re.exec(content)) !== null) {
    matches.push(m[1]);
  }
  return matches;
}

const mainReExports = findWildcardReExports(mainEntry, "src/index.ts");

if (mainReExports.length === 0) {
  pass("No wildcard re-exports in src/index.ts");
} else {
  warn(
    `src/index.ts has ${mainReExports.length} wildcard re-export(s). ` +
    `Consumers importing from the root barrel may pull in more code than intended:`
  );
  for (const target of mainReExports) {
    console.log(`         export * from "${target}"`);
  }
  console.log(
    "\n         Recommendation: consumers should use deep imports like\n" +
    '         import { Button } from "@mfe/design-system/primitives/button"\n' +
    "         for optimal tree-shaking.\n"
  );
}

// Check sub-barrels (primitives/index.ts, components/index.ts)
const subBarrels = [
  "primitives/index.ts",
  "components/index.ts",
];

for (const barrel of subBarrels) {
  const barrelPath = join(SRC_DIR, barrel);
  const reExports = findWildcardReExports(barrelPath, barrel);
  if (reExports.length > 0) {
    warn(`${barrel} has ${reExports.length} wildcard re-export(s)`);
  }
}

/* ------------------------------------------------------------------ */
/*  4. Verify dist/ contains ESM and CJS outputs                       */
/* ------------------------------------------------------------------ */

console.log("\n4. Checking dist/ contains ESM and CJS outputs...\n");

const DIST_DIR = join(DS_ROOT, "dist");

const isCI = process.env.CI === "true" || process.env.CI === "1";

if (!existsSync(DIST_DIR)) {
  if (isCI) {
    fail("dist/ directory does not exist — run `npm run build` first");
  } else {
    warn("dist/ directory does not exist — run `npm run build` first (skipped in local dev)");
  }
} else {
  pass("dist/ directory exists");

  const esmEntry = join(DIST_DIR, "index.js");
  const cjsEntry = join(DIST_DIR, "index.cjs");
  const dtsEntry = join(DIST_DIR, "index.d.ts");

  if (existsSync(esmEntry)) {
    pass("ESM output found: dist/index.js");
  } else if (isCI) {
    fail("ESM output missing: dist/index.js");
  } else {
    warn("ESM output missing: dist/index.js (expected in local dev without build)");
  }

  if (existsSync(cjsEntry)) {
    pass("CJS output found: dist/index.cjs");
  } else if (isCI) {
    fail("CJS output missing: dist/index.cjs");
  } else {
    warn("CJS output missing: dist/index.cjs (expected in local dev without build)");
  }

  if (existsSync(dtsEntry)) {
    pass("Type declarations found: dist/index.d.ts");
  } else {
    warn("Type declarations missing: dist/index.d.ts (expected if dts generation is disabled)");
  }
}

/* ------------------------------------------------------------------ */
/*  5. Verify exports map in package.json                              */
/* ------------------------------------------------------------------ */

console.log("\n5. Checking exports map in package.json...\n");

if (pkg.exports) {
  const entries = Object.keys(pkg.exports);
  pass(`exports map has ${entries.length} entry/entries: ${entries.join(", ")}`);

  if (pkg.exports["."]) {
    pass('Root export "." is defined');
  } else {
    fail('Root export "." is missing from exports map');
  }

  if (pkg.exports["./primitives/*"]) {
    pass('Per-primitive deep import "./primitives/*" is defined');
  } else {
    warn('Per-primitive deep import "./primitives/*" is not defined in exports map');
  }
} else {
  warn("No exports map in package.json — consumers cannot use deep imports via package exports");
}

/* ------------------------------------------------------------------ */
/*  Summary                                                            */
/* ------------------------------------------------------------------ */

console.log("\n" + (exitCode === 0 ? "All checks passed." : "Some checks failed.") + "\n");
process.exit(exitCode);
