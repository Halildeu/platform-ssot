#!/usr/bin/env node
/**
 * component-diff.mjs
 *
 * Compare design system API between two git refs.
 *
 * Usage: node scripts/ci/component-diff.mjs v1.0.0 v2.0.0
 *        node scripts/ci/component-diff.mjs HEAD~10 HEAD
 *        node scripts/ci/component-diff.mjs main feature-branch
 */

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */

const ROOT = resolve(__dirname, "../..");
const DESIGN_SYSTEM_SRC = "packages/design-system/src";
const ENTRY_FILE = `${DESIGN_SYSTEM_SRC}/index.ts`;

/* ------------------------------------------------------------------ */
/*  CLI args                                                           */
/* ------------------------------------------------------------------ */

const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));

function getFlag(flag) {
  return process.argv.includes(flag);
}

function getArg(flag) {
  const idx = process.argv.indexOf(flag);
  return idx !== -1 && idx + 1 < process.argv.length
    ? process.argv[idx + 1]
    : null;
}

const outputFile = getArg("--output");
const jsonOutput = getFlag("--json");

if (args.length < 2) {
  console.error(
    "Usage: node scripts/ci/component-diff.mjs <ref-old> <ref-new> [--output file] [--json]"
  );
  console.error("");
  console.error("Examples:");
  console.error("  node scripts/ci/component-diff.mjs v1.0.0 v2.0.0");
  console.error("  node scripts/ci/component-diff.mjs HEAD~10 HEAD");
  console.error("  node scripts/ci/component-diff.mjs main feature-branch --json");
  process.exit(1);
}

const [refOld, refNew] = args;

/* ------------------------------------------------------------------ */
/*  Extract exports from a git ref                                     */
/* ------------------------------------------------------------------ */

/**
 * Get the content of a file at a specific git ref.
 */
function getFileAtRef(ref, filePath) {
  try {
    return execSync(`git show ${ref}:${filePath}`, {
      encoding: "utf-8",
      cwd: ROOT,
      stdio: ["pipe", "pipe", "pipe"],
    });
  } catch {
    return null;
  }
}

/**
 * Resolve a module path trying .ts, .tsx, index.ts, index.tsx variants.
 */
function resolveFileAtRef(ref, filePath) {
  const candidates = [
    filePath,
    filePath + ".ts",
    filePath + ".tsx",
    filePath + "/index.ts",
    filePath + "/index.tsx",
  ];
  for (const c of candidates) {
    const content = getFileAtRef(ref, c);
    if (content !== null) return { path: c, content };
  }
  return null;
}

/**
 * Extract named exports from TypeScript source at a git ref.
 * Mirrors the logic from detect-breaking.mjs but works on git refs.
 */
function extractExportsAtRef(ref, filePath, visited = new Set()) {
  const resolved = resolveFileAtRef(ref, filePath);
  if (!resolved) return { values: [], types: [] };

  if (visited.has(resolved.path)) return { values: [], types: [] };
  visited.add(resolved.path);

  const content = resolved.content;
  const dir = dirname(resolved.path);

  const values = [];
  const types = [];

  // Remove comments
  const cleaned = content
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*/g, "");

  const collapsed = cleaned.replace(/\n/g, " ");

  // export * from "./something"
  const reExportAllRe = /export\s+\*\s+from\s+["'](\.[^"']+)["']/g;
  let m;
  while ((m = reExportAllRe.exec(collapsed)) !== null) {
    const target = join(dir, m[1]).replace(/\\/g, "/");
    const sub = extractExportsAtRef(ref, target, visited);
    values.push(...sub.values);
    types.push(...sub.types);
  }

  // export type { A, B, C }
  const typeExportRe = /export\s+type\s+\{([^}]+)\}/g;
  while ((m = typeExportRe.exec(collapsed)) !== null) {
    types.push(...parseNamedExports(m[1]));
  }

  // export { A, B, C } (not "export type {")
  const namedExportRe = /export\s+\{([^}]+)\}/g;
  while ((m = namedExportRe.exec(collapsed)) !== null) {
    const prefix = collapsed.slice(Math.max(0, m.index - 10), m.index + 7);
    if (/export\s+type\s+\{/.test(prefix)) continue;
    values.push(...parseNamedExports(m[1]));
  }

  // export const/let/var
  const constRe = /export\s+(?:const|let|var)\s+(\w+)/g;
  while ((m = constRe.exec(collapsed)) !== null) values.push(m[1]);

  // export function
  const funcRe = /export\s+(?:async\s+)?function\s+(\w+)/g;
  while ((m = funcRe.exec(collapsed)) !== null) values.push(m[1]);

  // export class
  const classRe = /export\s+class\s+(\w+)/g;
  while ((m = classRe.exec(collapsed)) !== null) values.push(m[1]);

  // export type X = ...
  const typeAliasRe = /export\s+type\s+(\w+)\s*[=<]/g;
  while ((m = typeAliasRe.exec(collapsed)) !== null) types.push(m[1]);

  // export interface X
  const ifaceRe = /export\s+interface\s+(\w+)/g;
  while ((m = ifaceRe.exec(collapsed)) !== null) types.push(m[1]);

  // export enum X
  const enumRe = /export\s+enum\s+(\w+)/g;
  while ((m = enumRe.exec(collapsed)) !== null) values.push(m[1]);

  return { values, types };
}

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
/*  Scan for deprecated props at a ref (prop-level diff)               */
/* ------------------------------------------------------------------ */

function scanDeprecatedPropsAtRef(ref) {
  // Get list of tsx files at ref
  let fileList;
  try {
    fileList = execSync(
      `git ls-tree -r --name-only ${ref} -- ${DESIGN_SYSTEM_SRC}`,
      { encoding: "utf-8", cwd: ROOT, stdio: ["pipe", "pipe", "pipe"] }
    )
      .trim()
      .split("\n")
      .filter((f) => f.endsWith(".tsx"));
  } catch {
    return [];
  }

  const deprecations = [];
  for (const file of fileList) {
    const content = getFileAtRef(ref, file);
    if (!content) continue;

    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const match = lines[i].match(/@deprecated\s+(.*)/);
      if (!match) continue;

      const message = match[1].replace(/\*\/\s*$/, "").trim();
      // Look for the prop on the next line
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        const nextLine = lines[j].trim();
        if (!nextLine || nextLine.startsWith("*") || nextLine.startsWith("//"))
          continue;
        const propMatch = nextLine.match(/^(\w+)\??:\s/);
        if (propMatch) {
          const fileName = file.split("/").pop().replace(/\.tsx$/, "");
          deprecations.push({
            component: fileName,
            prop: propMatch[1],
            message,
          });
        }
        break;
      }
    }
  }

  return deprecations;
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

console.log(`Comparing design system API: ${refOld} → ${refNew}\n`);

// Verify refs exist
try {
  execSync(`git rev-parse ${refOld}`, {
    cwd: ROOT,
    stdio: ["pipe", "pipe", "pipe"],
  });
} catch {
  console.error(`Error: git ref "${refOld}" not found.`);
  process.exit(1);
}

try {
  execSync(`git rev-parse ${refNew}`, {
    cwd: ROOT,
    stdio: ["pipe", "pipe", "pipe"],
  });
} catch {
  console.error(`Error: git ref "${refNew}" not found.`);
  process.exit(1);
}

// Extract exports from both refs
console.log(`Extracting exports from ${refOld}...`);
const oldExports = extractExportsAtRef(refOld, ENTRY_FILE);
const oldValues = new Set([...new Set(oldExports.values)]);
const oldTypes = new Set([...new Set(oldExports.types)]);

console.log(`Extracting exports from ${refNew}...`);
const newExports = extractExportsAtRef(refNew, ENTRY_FILE);
const newValues = new Set([...new Set(newExports.values)]);
const newTypes = new Set([...new Set(newExports.types)]);

// Compute diffs
const addedValues = [...newValues].filter((n) => !oldValues.has(n)).sort();
const removedValues = [...oldValues].filter((n) => !newValues.has(n)).sort();
const addedTypes = [...newTypes].filter((n) => !oldTypes.has(n)).sort();
const removedTypes = [...oldTypes].filter((n) => !newTypes.has(n)).sort();

// Scan for deprecation changes
console.log("Scanning for deprecation changes...\n");
const oldDeprecations = scanDeprecatedPropsAtRef(refOld);
const newDeprecations = scanDeprecatedPropsAtRef(refNew);

const newlyDeprecated = newDeprecations.filter(
  (nd) =>
    !oldDeprecations.some(
      (od) => od.component === nd.component && od.prop === nd.prop
    )
);

const removedDeprecations = oldDeprecations.filter(
  (od) =>
    !newDeprecations.some(
      (nd) => nd.component === od.component && nd.prop === od.prop
    )
);

/* ------------------------------------------------------------------ */
/*  Build result                                                       */
/* ------------------------------------------------------------------ */

const result = {
  refs: { old: refOld, new: refNew },
  summary: {
    oldValueCount: oldValues.size,
    oldTypeCount: oldTypes.size,
    newValueCount: newValues.size,
    newTypeCount: newTypes.size,
  },
  added: { values: addedValues, types: addedTypes },
  removed: { values: removedValues, types: removedTypes },
  deprecations: {
    newlyDeprecated,
    removedDeprecations,
  },
  breaking:
    removedValues.length > 0 ||
    removedTypes.length > 0,
};

/* ------------------------------------------------------------------ */
/*  Render output                                                      */
/* ------------------------------------------------------------------ */

if (jsonOutput) {
  const jsonStr = JSON.stringify(result, null, 2);
  if (outputFile) {
    writeFileSync(outputFile, jsonStr + "\n", "utf-8");
    console.log(`JSON output written to ${outputFile}`);
  } else {
    console.log(jsonStr);
  }
  process.exit(result.breaking ? 1 : 0);
}

// Markdown output
const lines = [];

lines.push(`# Component API Diff: \`${refOld}\` → \`${refNew}\``);
lines.push("");
lines.push(
  `| Metric | ${refOld} | ${refNew} | Delta |`
);
lines.push("|--------|-------|-------|-------|");
lines.push(
  `| Value exports | ${oldValues.size} | ${newValues.size} | ${newValues.size - oldValues.size >= 0 ? "+" : ""}${newValues.size - oldValues.size} |`
);
lines.push(
  `| Type exports | ${oldTypes.size} | ${newTypes.size} | ${newTypes.size - oldTypes.size >= 0 ? "+" : ""}${newTypes.size - oldTypes.size} |`
);
lines.push("");

if (result.breaking) {
  lines.push("## BREAKING CHANGES");
  lines.push("");
}

if (removedValues.length > 0) {
  lines.push("### Removed Value Exports");
  lines.push("");
  for (const name of removedValues) {
    lines.push(`- \`${name}\``);
  }
  lines.push("");
}

if (removedTypes.length > 0) {
  lines.push("### Removed Type Exports");
  lines.push("");
  for (const name of removedTypes) {
    lines.push(`- \`${name}\``);
  }
  lines.push("");
}

if (addedValues.length > 0) {
  lines.push("### Added Value Exports");
  lines.push("");
  for (const name of addedValues) {
    lines.push(`- \`${name}\``);
  }
  lines.push("");
}

if (addedTypes.length > 0) {
  lines.push("### Added Type Exports");
  lines.push("");
  for (const name of addedTypes) {
    lines.push(`- \`${name}\``);
  }
  lines.push("");
}

if (newlyDeprecated.length > 0) {
  lines.push("### Newly Deprecated");
  lines.push("");
  lines.push("| Component | Prop | Message |");
  lines.push("|-----------|------|---------|");
  for (const d of newlyDeprecated) {
    lines.push(`| ${d.component} | \`${d.prop}\` | ${d.message} |`);
  }
  lines.push("");
}

if (removedDeprecations.length > 0) {
  lines.push("### Deprecations Removed (completed migrations)");
  lines.push("");
  lines.push("| Component | Prop | Was |");
  lines.push("|-----------|------|-----|");
  for (const d of removedDeprecations) {
    lines.push(`| ${d.component} | \`${d.prop}\` | ${d.message} |`);
  }
  lines.push("");
}

if (
  addedValues.length === 0 &&
  addedTypes.length === 0 &&
  removedValues.length === 0 &&
  removedTypes.length === 0 &&
  newlyDeprecated.length === 0 &&
  removedDeprecations.length === 0
) {
  lines.push("No API changes detected between the two refs.");
  lines.push("");
}

const output = lines.join("\n");

if (outputFile) {
  writeFileSync(outputFile, output + "\n", "utf-8");
  console.log(`Diff report written to ${outputFile}`);
} else {
  console.log(output);
}

process.exit(result.breaking ? 1 : 0);
