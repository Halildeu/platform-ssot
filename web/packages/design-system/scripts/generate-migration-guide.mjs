#!/usr/bin/env node

/**
 * generate-migration-guide.mjs
 *
 * Scans all .ts/.tsx files under src/ for @deprecated JSDoc tags and
 * console.warn deprecation patterns, then outputs a markdown migration guide
 * to stdout.
 *
 * Usage:
 *   node scripts/generate-migration-guide.mjs
 */

import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

const SRC_DIR = path.resolve(
  new URL(".", import.meta.url).pathname,
  "..",
  "src",
);

// ── helpers ──────────────────────────────────────────────────────────────────

/** Recursively collect every .ts / .tsx file under `dir`. */
function collectFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFiles(full));
    } else if (/\.tsx?$/.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

/** Derive a human-readable component name from a file path. */
function componentName(filePath) {
  const rel = path.relative(SRC_DIR, filePath);
  const parts = rel.replace(/\\/g, "/").split("/");

  // For index files, use the parent directory name
  if (/^index\.tsx?$/.test(parts[parts.length - 1])) {
    parts.pop();
  } else {
    // Strip extension from the last segment
    parts[parts.length - 1] = parts[parts.length - 1].replace(/\.tsx?$/, "");
  }

  // Return the last meaningful segment, PascalCase-ish
  const name = parts[parts.length - 1] || "Unknown";
  return name.charAt(0).toUpperCase() + name.slice(1);
}

// ── patterns ─────────────────────────────────────────────────────────────────

/**
 * Match @deprecated JSDoc annotations.
 * Captures an optional message after the tag.
 *
 * Examples matched:
 *   @deprecated Use `size` instead.
 *   @deprecated Will be removed in v3.
 */
const JSDOC_DEPRECATED_RE = /@deprecated\s*(.*)/i;

/**
 * Match console.warn deprecation calls.
 *
 * Covers patterns like:
 *   console.warn("SelectSize is deprecated. Use size instead.")
 *   console.warn(`"switchSize" is deprecated — use "size"`)
 *   console.warn('[DesignSystem] prop "x" is deprecated, use "y"')
 */
const CONSOLE_WARN_RE = /console\.warn\(\s*[`'"](.*deprecated.*)[`'"]/i;

/**
 * Try to extract (oldProp, newProp) from a deprecation message string.
 * Returns { oldProp, newProp } or nulls when extraction fails.
 */
function extractProps(message) {
  const oldProp = null;
  let newProp = null;

  // Pattern: `"oldProp" is deprecated ... use "newProp"`
  const quoted =
    /["'`](\w+)["'`]\s*(?:is\s+)?deprecated.*?(?:use|replace\s+with|replaced\s+by)\s*["'`](\w+)["'`]/i;
  let m = message.match(quoted);
  if (m) {
    return { oldProp: m[1], newProp: m[2] };
  }

  // Pattern: `Use <newProp> instead of <oldProp>`
  const useInsteadOf =
    /use\s+["'`]?(\w+)["'`]?\s+instead\s+of\s+["'`]?(\w+)["'`]?/i;
  m = message.match(useInsteadOf);
  if (m) {
    return { oldProp: m[2], newProp: m[1] };
  }

  // Pattern: `<oldProp> → <newProp>`  or  `<oldProp> -> <newProp>`
  const arrow = /["'`]?(\w+)["'`]?\s*(?:→|->)\s*["'`]?(\w+)["'`]?/;
  m = message.match(arrow);
  if (m) {
    return { oldProp: m[1], newProp: m[2] };
  }

  // Single word after "use"
  const useWord = /use\s+["'`]?(\w+)["'`]?/i;
  m = message.match(useWord);
  if (m) {
    newProp = m[1];
  }

  return { oldProp, newProp };
}

// ── scan ─────────────────────────────────────────────────────────────────────

async function scanFile(filePath) {
  const entries = [];
  const component = componentName(filePath);

  const stream = fs.createReadStream(filePath, { encoding: "utf-8" });
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  for await (const line of rl) {
    let message = null;

    // Check for @deprecated
    let m = line.match(JSDOC_DEPRECATED_RE);
    if (m) {
      message = m[1].replace(/\*\/\s*$/, "").trim();
    }

    // Check for console.warn deprecation
    if (!message) {
      m = line.match(CONSOLE_WARN_RE);
      if (m) {
        message = m[1].trim();
      }
    }

    if (message) {
      const { oldProp, newProp } = extractProps(message);
      entries.push({
        component,
        oldProp: oldProp || "—",
        newProp: newProp || "—",
        notes: message || "Deprecated",
      });
    }
  }

  return entries;
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!fs.existsSync(SRC_DIR)) {
    console.error(`Error: src/ directory not found at ${SRC_DIR}`);
    process.exit(1);
  }

  const files = collectFiles(SRC_DIR);
  const allEntries = [];

  for (const file of files) {
    const entries = await scanFile(file);
    allEntries.push(...entries);
  }

  // Sort by component name for readability
  allEntries.sort((a, b) => a.component.localeCompare(b.component));

  // ── Output markdown ────────────────────────────────────────────────────
  const today = new Date().toISOString().slice(0, 10);

  const lines = [
    "# Design System Migration Guide",
    `Generated: ${today}`,
    "",
    "## Deprecated Props",
    "",
    "| Component | Old Prop | New Prop | Notes |",
    "|-----------|----------|----------|-------|",
  ];

  if (allEntries.length === 0) {
    lines.push("| _(none found)_ | | | |");
  } else {
    for (const e of allEntries) {
      // Escape pipes inside notes
      const notes = e.notes.replace(/\|/g, "\\|");
      lines.push(`| ${e.component} | ${e.oldProp} | ${e.newProp} | ${notes} |`);
    }
  }

  lines.push(
    "",
    "## Migration Steps",
    "",
    "1. Search your codebase for deprecated prop names listed above",
    "2. Replace with the corresponding new prop names",
    "3. Remove any usage of removed props",
    "4. Test thoroughly — run your test suite and verify visually",
    "5. Repeat before each major version upgrade",
    "",
  );

  console.log(lines.join("\n"));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
