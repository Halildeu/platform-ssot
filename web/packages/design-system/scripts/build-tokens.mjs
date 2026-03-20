#!/usr/bin/env node
/**
 * build-tokens.mjs
 * ----------------
 * F2a — Token Maturity build pipeline (design-system local).
 *
 * Reads design-system token .ts source files, parses the exported const
 * objects, and emits artifacts into dist/tokens/:
 *
 *   1. tokens.css   CSS custom properties (:root block) with descriptive comments.
 *   2. tokens.json  Flat key-value JSON suitable for Figma / external tools.
 *
 * Usage:  node scripts/build-tokens.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

/* ------------------------------------------------------------------ */
/*  Paths                                                              */
/* ------------------------------------------------------------------ */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");
const TOKENS_SRC = join(ROOT, "src/tokens");
const DIST_DIR = join(ROOT, "dist/tokens");

mkdirSync(DIST_DIR, { recursive: true });

/* ------------------------------------------------------------------ */
/*  Token source files to process (order matters for output)           */
/* ------------------------------------------------------------------ */
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
];

/* ------------------------------------------------------------------ */
/*  Category descriptions — appear as CSS block comments               */
/* ------------------------------------------------------------------ */
const CATEGORY_DESCRIPTIONS = {
  color: "Color palette and semantic color aliases",
  spacing: "Spacing scale based on a 4px grid system",
  radius: "Border radius scale",
  typography: "Font families, sizes, weights, line-heights, letter-spacings",
  motion: "Animation durations and easing curves",
  zIndex: "Z-index layering scale",
  elevation: "Box-shadow elevation scale",
  opacity: "State-based opacity values",
  density: "Compact / comfortable / spacious density modes",
  focusRing: "Accessible focus indicator configuration",
};

const EXPORT_DESCRIPTIONS = {
  palette: "Raw palette values — prefer semantic tokens in production",
  semanticColorTokens: "Semantic color aliases consumed via CSS custom properties",
  spacing: "Spacing scale — 4px grid (key = multiplier, value = px)",
  radius: "Border radius scale",
  fontFamily: "Font family stacks",
  fontSize: "Font size scale (rem)",
  fontWeight: "Font weight scale (numeric)",
  lineHeight: "Line height scale (unitless)",
  letterSpacing: "Letter spacing scale (em)",
  duration: "Animation duration scale",
  easing: "Easing / timing function curves",
  zIndex: "Z-index layer tokens",
  elevation: "Box-shadow elevation tokens",
  opacity: "Opacity tokens for interactive states and overlays",
  density: "Density mode tokens (compact / comfortable / spacious)",
  focusRing: "Focus ring configuration for accessible focus indicators",
};

/* ------------------------------------------------------------------ */
/*  Parser — extract `export const X = { ... } as const` blocks        */
/* ------------------------------------------------------------------ */

/**
 * Parse a single value literal from TypeScript source.
 * Handles strings, numbers, and nested objects.
 */
function parseValue(raw) {
  const trimmed = raw.trim();

  // String value (single or double quotes, or backticks)
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith("`") && trimmed.endsWith("`"))
  ) {
    return trimmed.slice(1, -1);
  }

  // Number
  if (!Number.isNaN(Number(trimmed)) && trimmed !== "") {
    return Number(trimmed);
  }

  return trimmed; // fallback — keep as string
}

/**
 * Extract the balanced brace content starting from `startIdx` in `src`.
 * `startIdx` must point at the opening `{`.
 */
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

/**
 * Parse a flat or one-level-nested object literal string into a JS object.
 * Strips comments, handles quoted keys and numeric keys.
 */
function parseObjectLiteral(block) {
  // Remove outer braces
  let inner = block.trim();
  if (inner.startsWith("{")) inner = inner.slice(1);
  if (inner.endsWith("}")) inner = inner.slice(0, -1);

  // Strip single-line comments
  inner = inner.replace(/\/\/.*$/gm, "");
  // Strip block comments
  inner = inner.replace(/\/\*[\s\S]*?\*\//g, "");

  const result = {};

  // Tokenise key-value pairs. We walk character-by-character to handle
  // nested objects and string values that may contain commas.
  let i = 0;
  while (i < inner.length) {
    // Skip whitespace / commas
    while (i < inner.length && /[\s,]/.test(inner[i])) i++;
    if (i >= inner.length) break;

    // ---- Parse key ----
    let key = "";
    if (inner[i] === '"' || inner[i] === "'") {
      const q = inner[i];
      i++; // skip opening quote
      while (i < inner.length && inner[i] !== q) {
        key += inner[i];
        i++;
      }
      i++; // skip closing quote
    } else {
      while (i < inner.length && inner[i] !== ":" && !/[\s]/.test(inner[i])) {
        key += inner[i];
        i++;
      }
    }
    key = key.trim();
    if (!key) break;

    // Skip to colon
    while (i < inner.length && inner[i] !== ":") i++;
    i++; // skip colon

    // Skip whitespace
    while (i < inner.length && /\s/.test(inner[i])) i++;

    // ---- Parse value ----
    if (inner[i] === "{") {
      // Nested object
      const nested = extractBraceBlock(inner, i);
      result[key] = parseObjectLiteral(nested);
      i += nested.length;
    } else if (inner[i] === '"' || inner[i] === "'" || inner[i] === "`") {
      const q = inner[i];
      i++; // skip opening quote
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
      i++; // skip closing quote
      result[key] = val;
    } else {
      // Number or identifier
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

/**
 * Given a .ts file's source, return an array of { name, value } for every
 * `export const <name> = { ... } as const` declaration found.
 */
function extractExportedConsts(source) {
  const results = [];
  // Match `export const NAME = {`  (the opening brace must be on this line or next)
  const pattern = /export\s+const\s+(\w+)\s*=\s*\{/g;
  let m;
  while ((m = pattern.exec(source)) !== null) {
    const name = m[1];
    const braceStart = m.index + m[0].length - 1; // point at `{`
    const block = extractBraceBlock(source, braceStart);
    results.push({ name, value: parseObjectLiteral(block) });
  }
  return results;
}

/* ------------------------------------------------------------------ */
/*  Utility — camelCase / PascalCase to kebab-case                     */
/* ------------------------------------------------------------------ */
function toKebab(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

/* ------------------------------------------------------------------ */
/*  Read & parse every token file                                      */
/* ------------------------------------------------------------------ */
const allTokens = {};
const exportEntries = []; // [{ category, name, keys, value }]

for (const file of TOKEN_FILES) {
  const filePath = join(TOKENS_SRC, file);
  let source;
  try {
    source = readFileSync(filePath, "utf-8");
  } catch {
    console.warn(`  [skip] ${file} not found`);
    continue;
  }

  const consts = extractExportedConsts(source);
  if (consts.length === 0) continue;

  const category = file.replace(/\.ts$/, "");
  for (const { name, value } of consts) {
    if (!allTokens[category]) allTokens[category] = {};
    allTokens[category][name] = value;
    exportEntries.push({
      category,
      name,
      keys: Object.keys(value),
      value,
    });
  }
}

/* ------------------------------------------------------------------ */
/*  1. dist/tokens/tokens.css                                          */
/* ------------------------------------------------------------------ */

/**
 * Flatten a (possibly nested) token object into CSS custom property
 * declarations.  Prefix is built up as we recurse.
 */
function flattenToCSS(obj, prefix) {
  const lines = [];
  for (const [key, val] of Object.entries(obj)) {
    const prop = `--${prefix}-${toKebab(String(key))}`;
    if (typeof val === "object" && val !== null && !Array.isArray(val)) {
      lines.push(...flattenToCSS(val, `${prefix}-${toKebab(String(key))}`));
    } else {
      lines.push(`  ${prop}: ${val};`);
    }
  }
  return lines;
}

let cssContent =
  `/* ------------------------------------------------------------------ */\n` +
  `/*  AUTO-GENERATED by scripts/build-tokens.mjs — do not edit          */\n` +
  `/*  Source of truth: src/tokens/*.ts                                   */\n` +
  `/* ------------------------------------------------------------------ */\n\n` +
  `:root {\n`;

let prevCategory = "";
for (const { category, name, value } of exportEntries) {
  const prefix = toKebab(name);

  // Emit category header on first encounter
  if (category !== prevCategory) {
    const desc = CATEGORY_DESCRIPTIONS[category] ?? category;
    cssContent += `\n  /* ============================================================ */\n`;
    cssContent += `  /* ${desc.padEnd(58)} */\n`;
    cssContent += `  /* ============================================================ */\n`;
    prevCategory = category;
  }

  const exportDesc = EXPORT_DESCRIPTIONS[name] ?? name;
  cssContent += `\n  /* ${exportDesc} */\n`;
  cssContent += flattenToCSS(value, prefix).join("\n") + "\n";
}

cssContent += `}\n`;

const cssPath = join(DIST_DIR, "tokens.css");
writeFileSync(cssPath, cssContent, "utf-8");
console.log(`  [ok] ${cssPath}`);

/* ------------------------------------------------------------------ */
/*  2. dist/tokens/tokens.json                                         */
/* ------------------------------------------------------------------ */

/**
 * Build a flat key-value JSON map suitable for Figma / external tooling.
 * Each entry: { name, category, value, cssVariable, description }
 */
function buildFlatEntries(entries) {
  const flat = [];

  for (const { category, name, value } of entries) {
    const prefix = toKebab(name);

    function walk(obj, pathParts, cssPrefix) {
      for (const [key, val] of Object.entries(obj)) {
        const tokenPath = [...pathParts, key];
        const cssProp = `--${cssPrefix}-${toKebab(String(key))}`;

        if (typeof val === "object" && val !== null && !Array.isArray(val)) {
          walk(val, tokenPath, `${cssPrefix}-${toKebab(String(key))}`);
        } else {
          flat.push({
            name: tokenPath.join("."),
            category,
            value: val,
            cssVariable: cssProp,
            description: EXPORT_DESCRIPTIONS[name] ?? "",
          });
        }
      }
    }

    walk(value, [name], prefix);
  }

  return flat;
}

const flatEntries = buildFlatEntries(exportEntries);
const jsonPath = join(DIST_DIR, "tokens.json");
writeFileSync(jsonPath, JSON.stringify(flatEntries, null, 2) + "\n", "utf-8");
console.log(`  [ok] ${jsonPath}`);

/* ------------------------------------------------------------------ */
/*  Summary                                                            */
/* ------------------------------------------------------------------ */
const totalTokens = flatEntries.length;
console.log(
  `\n  Build complete — ${exportEntries.length} exports, ${totalTokens} tokens total.`,
);
