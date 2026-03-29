#!/usr/bin/env node

/**
 * generate-stories-report.mjs
 *
 * Scans the design-system component directories and reports which components
 * have Storybook stories (.stories.tsx) and which ones are missing.
 *
 * Usage:
 *   node scripts/ci/generate-stories-report.mjs [--threshold <pct>] [--json]
 *
 * Options:
 *   --threshold <pct>  Minimum coverage percentage (default: 50). Exit 1 if below.
 *   --json             Output raw JSON instead of human-readable table.
 *
 * Exit codes:
 *   0  Coverage meets threshold
 *   1  Coverage below threshold
 */

import { readdirSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const ROOT = join(__filename, "..", "..", "..");
const SRC = join(ROOT, "src");

// ---- CLI args ----
const args = process.argv.slice(2);
const thresholdIdx = args.indexOf("--threshold");
const threshold = thresholdIdx >= 0 ? Number(args[thresholdIdx + 1]) : 50;
const jsonOutput = args.includes("--json");

// ---- Directories to scan ----
const SCAN_DIRS = [
  "primitives",
  "components",
  "patterns",
  "advanced",
];

/**
 * @typedef {{ name: string; category: string; path: string; hasStory: boolean; storyFile: string | null }} ComponentEntry
 */

/** @returns {ComponentEntry[]} */
function scanComponents() {
  /** @type {ComponentEntry[]} */
  const entries = [];

  for (const category of SCAN_DIRS) {
    const categoryDir = join(SRC, category);
    if (!existsSync(categoryDir)) continue;

    const children = readdirSync(categoryDir, { withFileTypes: true });

    for (const child of children) {
      // Skip non-directories, index files, and internal helpers
      if (!child.isDirectory()) continue;
      if (child.name.startsWith("_") || child.name.startsWith(".")) continue;

      const componentDir = join(categoryDir, child.name);

      // Check for at least one .tsx source file (excluding stories/tests)
      const files = readdirSync(componentDir);
      const hasSource = files.some(
        (f) =>
          f.endsWith(".tsx") &&
          !f.endsWith(".stories.tsx") &&
          !f.endsWith(".test.tsx") &&
          !f.endsWith(".spec.tsx"),
      );
      if (!hasSource) continue;

      // Check for .stories.tsx
      const storyFile = files.find((f) => f.endsWith(".stories.tsx")) ?? null;

      entries.push({
        name: child.name,
        category,
        path: relative(ROOT, componentDir),
        hasStory: storyFile !== null,
        storyFile,
      });
    }
  }

  return entries.sort((a, b) => {
    const catCmp = a.category.localeCompare(b.category);
    return catCmp !== 0 ? catCmp : a.name.localeCompare(b.name);
  });
}

// ---- Main ----

const components = scanComponents();
const withStory = components.filter((c) => c.hasStory);
const withoutStory = components.filter((c) => !c.hasStory);
const coverage = components.length > 0
  ? Math.round((withStory.length / components.length) * 100)
  : 0;

if (jsonOutput) {
  const report = {
    total: components.length,
    covered: withStory.length,
    missing: withoutStory.length,
    coveragePct: coverage,
    threshold,
    pass: coverage >= threshold,
    components,
  };
  process.stdout.write(JSON.stringify(report, null, 2) + "\n");
} else {
  console.log("");
  console.log("=== Storybook Coverage Report ===");
  console.log("");

  // Summary
  console.log(`Total components:   ${components.length}`);
  console.log(`With stories:       ${withStory.length}`);
  console.log(`Missing stories:    ${withoutStory.length}`);
  console.log(`Coverage:           ${coverage}%`);
  console.log(`Threshold:          ${threshold}%`);
  console.log(`Status:             ${coverage >= threshold ? "PASS" : "FAIL"}`);
  console.log("");

  // Table header
  const nameWidth = 30;
  const catWidth = 14;
  const statusWidth = 10;

  const padEnd = (str, len) => str.padEnd(len).slice(0, len);

  console.log(
    `${padEnd("Component", nameWidth)} ${padEnd("Category", catWidth)} ${padEnd("Story?", statusWidth)}`,
  );
  console.log("-".repeat(nameWidth + catWidth + statusWidth + 2));

  for (const comp of components) {
    const status = comp.hasStory ? "YES" : "MISSING";
    console.log(
      `${padEnd(comp.name, nameWidth)} ${padEnd(comp.category, catWidth)} ${padEnd(status, statusWidth)}`,
    );
  }

  console.log("");

  if (withoutStory.length > 0) {
    console.log("--- Missing Stories ---");
    for (const comp of withoutStory) {
      console.log(`  ${comp.path}/`);
    }
    console.log("");
  }
}

if (coverage < threshold) {
  if (!jsonOutput) {
    console.error(
      `ERROR: Story coverage ${coverage}% is below threshold ${threshold}%. Add stories for missing components.`,
    );
  }
  process.exit(1);
}
