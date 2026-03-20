#!/usr/bin/env node
/**
 * detect-breaking.mjs
 * Detects breaking changes by comparing public API exports against baseline.
 * Usage: node scripts/ci/detect-breaking.mjs [--update-baseline]
 *
 * Exit codes:
 *   0 — no breaking changes (or baseline updated)
 *   1 — breaking changes detected (removed / renamed exports)
 */

import { readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */

const ROOT = resolve(__dirname, "../..");
const DESIGN_SYSTEM_SRC = join(ROOT, "packages/design-system/src");
const ENTRY_FILE = join(DESIGN_SYSTEM_SRC, "index.ts");
const BASELINE_PATH = join(__dirname, ".export-baseline.json");
const UPDATE_BASELINE = process.argv.includes("--update-baseline");

/* ------------------------------------------------------------------ */
/*  Export extraction                                                   */
/* ------------------------------------------------------------------ */

/**
 * Resolve a file path trying .ts, .tsx, index.ts, index.tsx variants.
 * Returns the actual path that exists, or null.
 */
function resolveFile(filePath) {
  const candidates = [
    filePath,
    filePath + ".ts",
    filePath + ".tsx",
    join(filePath, "index.ts"),
    join(filePath, "index.tsx"),
  ];
  for (const c of candidates) {
    if (existsSync(c) && statSync(c).isFile()) return c;
  }
  return null;
}

/**
 * Extract named exports from a TypeScript source file.
 * Handles multi-line export blocks and recursive export * resolution.
 */
function extractExportsFromFile(filePath, visited = new Set()) {
  const actualPath = resolveFile(filePath);
  if (!actualPath) return { values: [], types: [] };

  const resolved = resolve(actualPath);
  if (visited.has(resolved)) return { values: [], types: [] };
  visited.add(resolved);

  const content = readFileSync(resolved, "utf-8");
  const dir = dirname(resolved);

  const values = [];
  const types = [];

  // Remove block comments and line comments
  const cleaned = content
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*/g, "");

  // Collapse multi-line statements: join everything into a single string
  // then split on semicolons/newlines to get complete statements
  const collapsed = cleaned.replace(/\n/g, " ");

  // --- export * from "./something" ---
  const reExportAllRe = /export\s+\*\s+from\s+["'](\.[^"']+)["']/g;
  let m;
  while ((m = reExportAllRe.exec(collapsed)) !== null) {
    const target = resolve(dir, m[1]);
    const sub = extractExportsFromFile(target, visited);
    values.push(...sub.values);
    types.push(...sub.types);
  }

  // --- export type { A, B, C } ---
  const typeExportRe = /export\s+type\s+\{([^}]+)\}/g;
  while ((m = typeExportRe.exec(collapsed)) !== null) {
    types.push(...parseNamedExports(m[1]));
  }

  // --- export { A, B, C } ---  (but NOT "export type {")
  const namedExportRe = /export\s+\{([^}]+)\}/g;
  while ((m = namedExportRe.exec(collapsed)) !== null) {
    // Skip if this is actually a "export type {" match
    const prefix = collapsed.slice(Math.max(0, m.index - 10), m.index + 7);
    if (/export\s+type\s+\{/.test(prefix)) continue;
    values.push(...parseNamedExports(m[1]));
  }

  // --- export const / let / var ---
  const constRe = /export\s+(?:const|let|var)\s+(\w+)/g;
  while ((m = constRe.exec(collapsed)) !== null) {
    values.push(m[1]);
  }

  // --- export function ---
  const funcRe = /export\s+(?:async\s+)?function\s+(\w+)/g;
  while ((m = funcRe.exec(collapsed)) !== null) {
    values.push(m[1]);
  }

  // --- export class ---
  const classRe = /export\s+class\s+(\w+)/g;
  while ((m = classRe.exec(collapsed)) !== null) {
    values.push(m[1]);
  }

  // --- export type X = ... ---
  const typeAliasRe = /export\s+type\s+(\w+)\s*[=<]/g;
  while ((m = typeAliasRe.exec(collapsed)) !== null) {
    types.push(m[1]);
  }

  // --- export interface X ---
  const ifaceRe = /export\s+interface\s+(\w+)/g;
  while ((m = ifaceRe.exec(collapsed)) !== null) {
    types.push(m[1]);
  }

  // --- export enum X ---
  const enumRe = /export\s+enum\s+(\w+)/g;
  while ((m = enumRe.exec(collapsed)) !== null) {
    values.push(m[1]);
  }

  return { values, types };
}

/**
 * Parse "Foo, Bar as Baz, default as Qux" into exported names.
 */
function parseNamedExports(raw) {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const asMatch = s.match(/\w+\s+as\s+(\w+)/);
      return asMatch ? asMatch[1] : s;
    });
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

console.log("Scanning design system public API...\n");

if (!existsSync(ENTRY_FILE)) {
  console.error(`Entry file not found: ${ENTRY_FILE}`);
  process.exit(1);
}

const { values, types } = extractExportsFromFile(ENTRY_FILE);

const currentExports = {
  values: [...new Set(values)].sort(),
  types: [...new Set(types)].sort(),
};

const totalCount = currentExports.values.length + currentExports.types.length;
console.log(
  `Found ${currentExports.values.length} value exports and ${currentExports.types.length} type exports (${totalCount} total)\n`
);

/* ------------------------------------------------------------------ */
/*  Update baseline mode                                               */
/* ------------------------------------------------------------------ */

if (UPDATE_BASELINE || !existsSync(BASELINE_PATH)) {
  const label = existsSync(BASELINE_PATH) ? "Updated" : "Created";
  writeFileSync(
    BASELINE_PATH,
    JSON.stringify(currentExports, null, 2) + "\n",
    "utf-8"
  );
  console.log(`${label} baseline at ${BASELINE_PATH}`);
  process.exit(0);
}

/* ------------------------------------------------------------------ */
/*  Compare with baseline                                              */
/* ------------------------------------------------------------------ */

let baseline;
try {
  baseline = JSON.parse(readFileSync(BASELINE_PATH, "utf-8"));
} catch (err) {
  console.error(`Failed to read baseline: ${err.message}`);
  process.exit(1);
}

const baselineValues = new Set(baseline.values || []);
const baselineTypes = new Set(baseline.types || []);
const currentValues = new Set(currentExports.values);
const currentTypes = new Set(currentExports.types);

// Removed = in baseline but NOT in current  (BREAKING)
const removedValues = [...baselineValues].filter((n) => !currentValues.has(n));
const removedTypes = [...baselineTypes].filter((n) => !currentTypes.has(n));

// Added = in current but NOT in baseline  (non-breaking)
const addedValues = [...currentValues].filter((n) => !baselineValues.has(n));
const addedTypes = [...currentTypes].filter((n) => !baselineTypes.has(n));

/* ------------------------------------------------------------------ */
/*  Report                                                             */
/* ------------------------------------------------------------------ */

let hasBreaking = false;

if (removedValues.length > 0) {
  hasBreaking = true;
  console.log("BREAKING: Removed value exports:");
  for (const name of removedValues) {
    console.log(`  - ${name}`);
  }
  console.log("");
}

if (removedTypes.length > 0) {
  hasBreaking = true;
  console.log("BREAKING: Removed type exports:");
  for (const name of removedTypes) {
    console.log(`  - ${name}`);
  }
  console.log("");
}

if (addedValues.length > 0) {
  console.log("Added value exports (non-breaking):");
  for (const name of addedValues) {
    console.log(`  + ${name}`);
  }
  console.log("");
}

if (addedTypes.length > 0) {
  console.log("Added type exports (non-breaking):");
  for (const name of addedTypes) {
    console.log(`  + ${name}`);
  }
  console.log("");
}

if (hasBreaking) {
  console.error(
    "Breaking changes detected! If intentional, run:\n" +
      "  node scripts/ci/detect-breaking.mjs --update-baseline\n"
  );
  process.exit(1);
} else {
  console.log("No breaking changes detected.");
  process.exit(0);
}
