#!/usr/bin/env node

/**
 * Deprecation Audit
 *
 * Scans for @deprecated JSDoc annotations and console.warn deprecation warnings
 * across all .ts/.tsx source files. Reports count per component/module and
 * outputs a summary table.
 *
 * Usage:
 *   node scripts/ci/deprecation-audit.mjs              Human-readable table
 *   node scripts/ci/deprecation-audit.mjs --json        Output as JSON
 *   node scripts/ci/deprecation-audit.mjs --strict      Exit 1 if any deprecations found
 *   node scripts/ci/deprecation-audit.mjs --migration   Include migration guidance per entry
 *
 * Exit codes:
 *   0  OK
 *   1  Deprecations found (only with --strict)
 */

import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const ROOT = join(__filename, "..", "..", "..");
const SRC = join(ROOT, "src");

// ---------------------------------------------------------------------------
// Migration guidance lookup
// ---------------------------------------------------------------------------

const MIGRATION_GUIDE = {
  // Size aliases
  checkboxSize: "Rename to `size`",
  radioSize: "Rename to `size`",
  selectSize: "Rename to `size`",
  switchSize: "Rename to `size`",
  searchSize: "Rename to `size`",
  inputSize: "Rename to `size`",
  // Prop renames
  totalItems: "Rename to `total`",
  currentPage: "Rename to `current`",
  onPageChange: "Rename to `onChange`",
  onCheckedChange: "Rename to `onChange`",
  onSelectChange: "Rename to `onChange`",
  activeTabId: "Rename to `activeKey`",
  onTabChange: "Rename to `onChange`",
  activeStep: "Rename to `current`",
  onStepChange: "Rename to `onChange`",
  tooltip: "Rename to `content`",
  severity: "Rename to `variant`",
  hasError: "Rename to `error`",
  // Type aliases
  TagColor: "Rename to `TagVariant`",
  BadgeColor: "Rename to `BadgeVariant`",
  // Component aliases
  "Empty ": "Rename to `EmptyState`",
  DetailDrawerTabSection: "Rename to `DetailDrawerTab`",
};

/**
 * Extract a migration hint from a @deprecated annotation line.
 */
function getMigrationHint(text) {
  // Check for "Use X instead" pattern in the annotation itself
  const useMatch = text.match(/Use [`']?(\w+)[`']? instead/i);
  if (useMatch) return `→ Rename to \`${useMatch[1]}\``;

  // Check for "accepted but ignored" pattern
  if (/accepted but ignored/i.test(text)) return "→ Safe to remove (no-op)";
  if (/compat.*ignored/i.test(text)) return "→ Safe to remove (no-op)";
  if (/ignored.*compat/i.test(text)) return "→ Safe to remove (no-op)";
  if (/backward.?compat/i.test(text) && /ignored/i.test(text)) return "→ Safe to remove (no-op)";

  // Check known prop names
  for (const [key, hint] of Object.entries(MIGRATION_GUIDE)) {
    if (text.includes(key)) return `→ ${hint}`;
  }

  // Fallback
  if (/backward.?compat/i.test(text)) return "→ Remove or migrate (see DEPRECATION-REMOVAL-PLAN.md)";
  return "→ See docs/DEPRECATION-REMOVAL-PLAN.md";
}

const SCAN_DIRS = [
  "primitives",
  "components",
  "patterns",
  "advanced",
  "internal",
  "utils",
  "tokens",
  "theme",
  "providers",
  "a11y",
  "lib",
  "mcp",
  "performance",
  "legacy",
];

/**
 * Recursively find all .ts/.tsx files in a directory.
 * @param {string} dir
 * @returns {Promise<string[]>}
 */
async function findTsFiles(dir) {
  const results = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules" && entry.name !== "__tests__") {
        results.push(...(await findTsFiles(fullPath)));
      } else if (
        entry.isFile() &&
        (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) &&
        !entry.name.endsWith(".test.ts") &&
        !entry.name.endsWith(".test.tsx") &&
        !entry.name.endsWith(".spec.ts") &&
        !entry.name.endsWith(".spec.tsx") &&
        !entry.name.endsWith(".stories.tsx")
      ) {
        results.push(fullPath);
      }
    }
  } catch {
    // dir doesn't exist
  }
  return results;
}

/**
 * @typedef {{
 *   file: string;
 *   line: number;
 *   type: 'annotation' | 'console-warn';
 *   text: string;
 *   module: string;
 * }} DeprecationEntry
 */

/**
 * Determine the module name from a file path relative to src/.
 */
function getModule(filePath) {
  const rel = relative(SRC, filePath);
  const parts = rel.split("/");
  if (parts.length >= 2) {
    return `${parts[0]}/${parts[1]}`;
  }
  return parts[0];
}

async function scanFile(filePath) {
  /** @type {DeprecationEntry[]} */
  const entries = [];
  const content = await readFile(filePath, "utf-8");
  const lines = content.split("\n");
  const module = getModule(filePath);
  const relFile = relative(ROOT, filePath);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for @deprecated annotation
    if (/@deprecated/i.test(line)) {
      entries.push({
        file: relFile,
        line: i + 1,
        type: "annotation",
        text: line.trim(),
        module,
      });
    }

    // Check for console.warn with deprecation message
    if (/console\.warn\s*\(/.test(line) && /deprecat/i.test(line)) {
      entries.push({
        file: relFile,
        line: i + 1,
        type: "console-warn",
        text: line.trim(),
        module,
      });
    }
  }

  return entries;
}

async function main() {
  const jsonOutput = process.argv.includes("--json");
  const strictMode = process.argv.includes("--strict");
  const showMigration = process.argv.includes("--migration");

  /** @type {DeprecationEntry[]} */
  const allEntries = [];

  for (const dir of SCAN_DIRS) {
    const files = await findTsFiles(join(SRC, dir));
    for (const file of files) {
      const entries = await scanFile(file);
      allEntries.push(...entries);
    }
  }

  // Also scan root-level files
  const rootFiles = await findTsFiles(SRC);
  const rootOnlyFiles = rootFiles.filter((f) => {
    const rel = relative(SRC, f);
    return !rel.includes("/");
  });
  for (const file of rootOnlyFiles) {
    const entries = await scanFile(file);
    allEntries.push(...entries);
  }

  // Group by module
  /** @type {Record<string, DeprecationEntry[]>} */
  const byModule = {};
  for (const entry of allEntries) {
    if (!byModule[entry.module]) {
      byModule[entry.module] = [];
    }
    byModule[entry.module].push(entry);
  }

  const annotationCount = allEntries.filter((e) => e.type === "annotation").length;
  const consoleWarnCount = allEntries.filter((e) => e.type === "console-warn").length;

  if (jsonOutput) {
    const report = {
      total: allEntries.length,
      annotations: annotationCount,
      consoleWarns: consoleWarnCount,
      byModule: Object.fromEntries(
        Object.entries(byModule).map(([mod, entries]) => [
          mod,
          {
            count: entries.length,
            items: entries.map((e) => ({
              file: e.file,
              line: e.line,
              type: e.type,
              text: e.text,
              migration: getMigrationHint(e.text),
            })),
          },
        ])
      ),
      codemod: "node scripts/codemods/remove-deprecated-aliases.mjs --write <consumer-dir>",
      plan: "docs/DEPRECATION-REMOVAL-PLAN.md",
    };
    process.stdout.write(JSON.stringify(report, null, 2) + "\n");
  } else {
    console.log("");
    console.log("=== Deprecation Audit ===");
    console.log("");
    console.log(`Total deprecations:       ${allEntries.length}`);
    console.log(`@deprecated annotations:  ${annotationCount}`);
    console.log(`console.warn (deprec.):   ${consoleWarnCount}`);
    console.log("");

    if (allEntries.length === 0) {
      console.log("No deprecations found.");
      console.log("");
      return;
    }

    // Summary table by module
    const pad = (s, n) => String(s).padEnd(n).slice(0, n);
    const padR = (s, n) => String(s).padStart(n).slice(0, n);

    console.log(
      `${pad("Module", 30)} ${padR("@deprecated", 12)} ${padR("console.warn", 13)} ${padR("Total", 6)}`
    );
    console.log("-".repeat(63));

    const sortedModules = Object.entries(byModule).sort(
      (a, b) => b[1].length - a[1].length
    );

    for (const [mod, entries] of sortedModules) {
      const annot = entries.filter((e) => e.type === "annotation").length;
      const warn = entries.filter((e) => e.type === "console-warn").length;
      console.log(
        `${pad(mod, 30)} ${padR(String(annot), 12)} ${padR(String(warn), 13)} ${padR(String(entries.length), 6)}`
      );
    }

    console.log("");

    // Detailed list
    console.log("--- Details ---");
    for (const entry of allEntries) {
      const tag = entry.type === "annotation" ? "@deprecated" : "console.warn";
      const migration = showMigration ? `  ${getMigrationHint(entry.text)}` : "";
      console.log(`  [${tag}] ${entry.file}:${entry.line}${migration}`);
    }
    console.log("");

    if (allEntries.length > 0) {
      console.log("--- Migration ---");
      console.log("  Plan:    docs/DEPRECATION-REMOVAL-PLAN.md");
      console.log("  Codemod: node scripts/codemods/remove-deprecated-aliases.mjs --write <consumer-dir>");
      console.log("  Details: node scripts/ci/deprecation-audit.mjs --migration");
      console.log("");
    }
  }

  if (strictMode && allEntries.length > 0) {
    console.error(
      `FAIL: ${allEntries.length} deprecation(s) found in strict mode.`
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
