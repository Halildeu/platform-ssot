#!/usr/bin/env node
/**
 * validate-tokens.mjs
 * -------------------
 * Faz 4A  Token validation script.
 *
 * Reads design-system token .ts source files and validates:
 *   1. No duplicate token names across files.
 *   2. All colour values are valid (hex, rgb, rgba, hsl, hsla, CSS var, named).
 *   3. All spacing / size values are numeric (px, rem, em, numbers).
 *   4. No undefined or empty references.
 *
 * Exit code 0 = all good, 1 = validation errors found.
 *
 * Usage:  node scripts/tokens/validate-tokens.mjs
 */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

/* ------------------------------------------------------------------ */
/*  Paths                                                              */
/* ------------------------------------------------------------------ */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "../..");
const TOKENS_SRC = join(ROOT, "packages/design-system/src/tokens");

const TOKEN_FILES = [
  "color.ts",
  "spacing.ts",
  "radius.ts",
  "typography.ts",
  "motion.ts",
  "zIndex.ts",
  "elevation.ts",
  "opacity.ts",
  "density.ts",
  "focusRing.ts",
  "semantic.ts",
];

/* ------------------------------------------------------------------ */
/*  Parser (same lightweight parser as build-tokens.mjs)               */
/* ------------------------------------------------------------------ */

function extractBraceBlock(src, startIdx) {
  let depth = 0;
  let i = startIdx;
  for (; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}") {
      depth--;
      if (depth === 0) return src.slice(startIdx, i + 1);
    }
  }
  return src.slice(startIdx);
}

function parseValue(raw) {
  const trimmed = raw.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith("`") && trimmed.endsWith("`"))
  ) {
    return trimmed.slice(1, -1);
  }
  if (!Number.isNaN(Number(trimmed)) && trimmed !== "") {
    return Number(trimmed);
  }
  return trimmed;
}

function parseObjectLiteral(block) {
  let inner = block.trim();
  if (inner.startsWith("{")) inner = inner.slice(1);
  if (inner.endsWith("}")) inner = inner.slice(0, -1);
  inner = inner.replace(/\/\/.*$/gm, "");
  inner = inner.replace(/\/\*[\s\S]*?\*\//g, "");

  const result = {};
  let i = 0;
  while (i < inner.length) {
    while (i < inner.length && /[\s,]/.test(inner[i])) i++;
    if (i >= inner.length) break;

    let key = "";
    if (inner[i] === '"' || inner[i] === "'") {
      const q = inner[i];
      i++;
      while (i < inner.length && inner[i] !== q) {
        key += inner[i];
        i++;
      }
      i++;
    } else {
      while (i < inner.length && inner[i] !== ":" && !/[\s]/.test(inner[i])) {
        key += inner[i];
        i++;
      }
    }
    key = key.trim();
    if (!key) break;

    while (i < inner.length && inner[i] !== ":") i++;
    i++;
    while (i < inner.length && /\s/.test(inner[i])) i++;

    if (inner[i] === "{") {
      const nested = extractBraceBlock(inner, i);
      result[key] = parseObjectLiteral(nested);
      i += nested.length;
    } else if (inner[i] === '"' || inner[i] === "'" || inner[i] === "`") {
      const q = inner[i];
      i++;
      let val = "";
      while (i < inner.length && inner[i] !== q) {
        if (inner[i] === "\\" && i + 1 < inner.length) {
          val += inner[i + 1];
          i += 2;
        } else {
          val += inner[i];
          i++;
        }
      }
      i++;
      result[key] = val;
    } else {
      let val = "";
      while (
        i < inner.length &&
        inner[i] !== "," &&
        inner[i] !== "}" &&
        inner[i] !== "\n"
      ) {
        val += inner[i];
        i++;
      }
      result[key] = parseValue(val);
    }
  }
  return result;
}

function extractExportedConsts(source) {
  const results = [];
  const pattern = /export\s+const\s+(\w+)\s*=\s*\{/g;
  let m;
  while ((m = pattern.exec(source)) !== null) {
    const name = m[1];
    const braceStart = m.index + m[0].length - 1;
    const block = extractBraceBlock(source, braceStart);
    results.push({ name, value: parseObjectLiteral(block) });
  }
  return results;
}

/* ------------------------------------------------------------------ */
/*  Validation helpers                                                 */
/* ------------------------------------------------------------------ */

const errors = [];
const warnings = [];

function err(file, msg) {
  errors.push(`[ERROR] ${file}: ${msg}`);
}
function warn(file, msg) {
  warnings.push(`[WARN]  ${file}: ${msg}`);
}

/* Valid colour pattern */
const COLOR_RE =
  /^(#([0-9a-fA-F]{3,8}))$|^rgb(a)?\(\s*[\d.%,\s/]+\)$|^hsl(a)?\(\s*[\d.%,\s/]+\)$|^var\(--[\w-]+.*\)$|^transparent$|^currentColor$|^inherit$|^none$/;

function isValidColor(val) {
  if (typeof val !== "string") return false;
  return COLOR_RE.test(val.trim());
}

/** Check whether a value looks like a valid size / spacing literal */
function isValidSize(val) {
  if (typeof val === "number") return true;
  if (typeof val !== "string") return false;
  const t = val.trim();
  // numeric with optional unit
  return /^-?[\d.]+(%|px|rem|em|vh|vw|ch|ex|vmin|vmax|pt|cm|mm|in)?$/.test(t);
}

/* ------------------------------------------------------------------ */
/*  Run validation                                                     */
/* ------------------------------------------------------------------ */

/** Track all top-level token keys to detect duplicates */
const seenKeys = new Map(); // key -> file

const COLOR_FILES = ["color.ts"];
const SIZE_FILES = ["spacing.ts", "radius.ts"];

for (const file of TOKEN_FILES) {
  const filePath = join(TOKENS_SRC, file);
  let source;
  try {
    source = readFileSync(filePath, "utf-8");
  } catch {
    warn(file, "File not found — skipped");
    continue;
  }

  const consts = extractExportedConsts(source);
  if (consts.length === 0 && file !== "semantic.ts") {
    warn(file, "No exported consts found");
    continue;
  }

  for (const { name, value } of consts) {
    /* --- 1. Duplicate detection (export name level) --- */
    if (seenKeys.has(name)) {
      err(file, `Duplicate export name "${name}" (also in ${seenKeys.get(name)})`);
    } else {
      seenKeys.set(name, file);
    }

    /* --- Flatten leaves for per-value checks --- */
    const leaves = [];

    function collectLeaves(obj, path) {
      for (const [k, v] of Object.entries(obj)) {
        const p = path ? `${path}.${k}` : k;
        if (typeof v === "object" && v !== null && !Array.isArray(v)) {
          collectLeaves(v, p);
        } else {
          leaves.push({ key: p, val: v });
        }
      }
    }
    collectLeaves(value, name);

    for (const { key, val } of leaves) {
      /* --- 4. No undefined / empty values --- */
      if (val === undefined || val === null || val === "") {
        err(file, `Empty or undefined value at "${key}"`);
        continue;
      }

      /* --- 2. Colour validation (only for colour files) --- */
      if (COLOR_FILES.includes(file) && typeof val === "string") {
        // Skip CSS variable references (semantic tokens map to var names)
        if (val.startsWith("--")) continue;
        if (!isValidColor(val)) {
          err(file, `Invalid color value at "${key}": ${val}`);
        }
      }

      /* --- 3. Spacing / size validation --- */
      if (SIZE_FILES.includes(file)) {
        if (!isValidSize(val)) {
          err(file, `Invalid size value at "${key}": ${val}`);
        }
      }
    }
  }
}

/* --- Cross-file duplicate key check (leaf-level within same category) --- */
const leafRegistry = new Map(); // "category.leaf" -> file
for (const file of TOKEN_FILES) {
  const filePath = join(TOKENS_SRC, file);
  let source;
  try {
    source = readFileSync(filePath, "utf-8");
  } catch {
    continue;
  }
  const consts = extractExportedConsts(source);
  for (const { name, value } of consts) {
    for (const key of Object.keys(value)) {
      const fqn = `${name}.${key}`;
      if (leafRegistry.has(fqn)) {
        err(
          file,
          `Duplicate token key "${fqn}" (also defined in ${leafRegistry.get(fqn)})`
        );
      } else {
        leafRegistry.set(fqn, file);
      }
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Report                                                             */
/* ------------------------------------------------------------------ */
console.log("\n  Token validation report");
console.log("  " + "-".length + "-".repeat(40));

if (warnings.length > 0) {
  console.log("");
  for (const w of warnings) console.log(`  ${w}`);
}

if (errors.length > 0) {
  console.log("");
  for (const e of errors) console.log(`  ${e}`);
  console.log(`\n  Result: FAIL (${errors.length} error(s), ${warnings.length} warning(s))\n`);
  process.exit(1);
} else {
  console.log(`\n  Result: PASS (0 errors, ${warnings.length} warning(s))\n`);
  process.exit(0);
}
