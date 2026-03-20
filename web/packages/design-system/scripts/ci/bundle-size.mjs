#!/usr/bin/env node

/**
 * Bundle Size Report
 *
 * Analyzes the built dist/ output and reports per-module sizes.
 * Usage: node scripts/ci/bundle-size.mjs [--budget] [--json]
 *
 * --budget  Fail (exit 1) if any module exceeds its budget from bundle-budget.json
 * --json    Output raw JSON instead of a table
 *
 * Exit codes:
 *   0  All OK (or no --budget flag)
 *   1  Budget exceeded or dist/ missing
 */

import { readdir, stat, readFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const SCRIPT_DIR = join(__filename, "..");
const ROOT = join(SCRIPT_DIR, "..", "..");
const DIST_DIR = join(ROOT, "dist");
const BUDGET_FILE = join(SCRIPT_DIR, "bundle-budget.json");

// Top-level module categories to track
const MODULE_CATEGORIES = [
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
  "catalog",
  "legacy",
];

/**
 * Recursively collect total byte size of all files in a directory.
 * @param {string} dir
 * @returns {Promise<{totalBytes: number, fileCount: number}>}
 */
async function dirSize(dir) {
  let totalBytes = 0;
  let fileCount = 0;
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        const sub = await dirSize(fullPath);
        totalBytes += sub.totalBytes;
        fileCount += sub.fileCount;
      } else if (entry.isFile()) {
        const s = await stat(fullPath);
        totalBytes += s.size;
        fileCount += s.fileCount || 0;
        fileCount += 1;
      }
    }
  } catch {
    // directory doesn't exist — return 0
  }
  return { totalBytes, fileCount };
}

/**
 * Collect per-module sizes across ESM, CJS, and type declaration outputs.
 */
async function collectSizes() {
  /** @type {Record<string, {esm: number, cjs: number, types: number}>} */
  const modules = {};

  for (const mod of MODULE_CATEGORIES) {
    const esm = await dirSize(join(DIST_DIR, "esm", mod));
    const cjs = await dirSize(join(DIST_DIR, "cjs", mod));
    const types = await dirSize(join(DIST_DIR, mod));

    // Only include modules that have at least some output
    if (esm.totalBytes + cjs.totalBytes + types.totalBytes > 0) {
      modules[mod] = {
        esm: esm.totalBytes,
        cjs: cjs.totalBytes,
        types: types.totalBytes,
      };
    }
  }

  // Also capture top-level ESM chunks and root files not inside a sub-module.
  let esmRootBytes = 0;
  let cjsRootBytes = 0;
  try {
    const esmEntries = await readdir(join(DIST_DIR, "esm"), {
      withFileTypes: true,
    });
    for (const entry of esmEntries) {
      if (entry.isFile()) {
        const s = await stat(join(DIST_DIR, "esm", entry.name));
        esmRootBytes += s.size;
      }
    }
  } catch {
    /* no esm dir */
  }
  try {
    const cjsEntries = await readdir(join(DIST_DIR, "cjs"), {
      withFileTypes: true,
    });
    for (const entry of cjsEntries) {
      if (entry.isFile()) {
        const s = await stat(join(DIST_DIR, "cjs", entry.name));
        cjsRootBytes += s.size;
      }
    }
  } catch {
    /* no cjs dir */
  }

  // Root-level type declarations (index.d.ts, etc.)
  let typesRootBytes = 0;
  try {
    const distEntries = await readdir(DIST_DIR, { withFileTypes: true });
    for (const entry of distEntries) {
      if (entry.isFile() && (entry.name.endsWith(".d.ts") || entry.name.endsWith(".d.ts.map"))) {
        const s = await stat(join(DIST_DIR, entry.name));
        typesRootBytes += s.size;
      }
    }
  } catch {
    /* no dist dir */
  }

  if (esmRootBytes + cjsRootBytes + typesRootBytes > 0) {
    modules["_root"] = {
      esm: esmRootBytes,
      cjs: cjsRootBytes,
      types: typesRootBytes,
    };
  }

  return modules;
}

function toKB(bytes) {
  return (bytes / 1024).toFixed(1);
}

async function main() {
  const hasBudgetFlag = process.argv.includes("--budget");
  const jsonOutput = process.argv.includes("--json");

  // Check if dist/ exists
  try {
    await stat(DIST_DIR);
  } catch {
    console.error("Error: dist/ not found. Run the build first.");
    process.exit(1);
  }

  const modules = await collectSizes();

  // Build report rows
  const rows = Object.entries(modules)
    .map(([name, sizes]) => ({
      name,
      esm: sizes.esm,
      cjs: sizes.cjs,
      types: sizes.types,
      total: sizes.esm + sizes.cjs + sizes.types,
    }))
    .sort((a, b) => b.total - a.total);

  const grandTotal = rows.reduce((sum, r) => sum + r.total, 0);

  // Budget check
  let budgetViolations = [];
  let budget = null;
  if (hasBudgetFlag) {
    try {
      budget = JSON.parse(await readFile(BUDGET_FILE, "utf-8"));
    } catch {
      console.error(
        `Error: Could not read budget file at ${BUDGET_FILE}. Create it or remove --budget.`
      );
      process.exit(1);
    }

    // Check total
    if (budget.total_max_kb && grandTotal / 1024 > budget.total_max_kb) {
      budgetViolations.push(
        `TOTAL: ${toKB(grandTotal)} KB exceeds budget of ${budget.total_max_kb} KB`
      );
    }

    // Check per-module
    if (budget.modules) {
      for (const row of rows) {
        const modBudget = budget.modules[row.name];
        if (modBudget && row.total / 1024 > modBudget) {
          budgetViolations.push(
            `${row.name}: ${toKB(row.total)} KB exceeds budget of ${modBudget} KB`
          );
        }
      }
    }
  }

  if (jsonOutput) {
    const report = {
      modules: rows.map((r) => ({
        name: r.name,
        esm_kb: Number(toKB(r.esm)),
        cjs_kb: Number(toKB(r.cjs)),
        types_kb: Number(toKB(r.types)),
        total_kb: Number(toKB(r.total)),
      })),
      total_kb: Number(toKB(grandTotal)),
      budget: hasBudgetFlag
        ? { pass: budgetViolations.length === 0, violations: budgetViolations }
        : null,
    };
    process.stdout.write(JSON.stringify(report, null, 2) + "\n");
  } else {
    console.log("");
    console.log("=== Bundle Size Report ===");
    console.log("");

    // Table
    const pad = (s, n) => String(s).padEnd(n).slice(0, n);
    const padR = (s, n) => String(s).padStart(n).slice(0, n);

    console.log(
      `${pad("Module", 16)} ${padR("ESM (KB)", 10)} ${padR("CJS (KB)", 10)} ${padR("Types (KB)", 12)} ${padR("Total (KB)", 12)}`
    );
    console.log("-".repeat(62));

    for (const r of rows) {
      console.log(
        `${pad(r.name, 16)} ${padR(toKB(r.esm), 10)} ${padR(toKB(r.cjs), 10)} ${padR(toKB(r.types), 12)} ${padR(toKB(r.total), 12)}`
      );
    }

    console.log("-".repeat(62));
    console.log(
      `${pad("TOTAL", 16)} ${padR("", 10)} ${padR("", 10)} ${padR("", 12)} ${padR(toKB(grandTotal), 12)}`
    );
    console.log("");

    if (hasBudgetFlag) {
      if (budgetViolations.length === 0) {
        console.log("Budget check: PASS");
      } else {
        console.log("Budget check: FAIL");
        for (const v of budgetViolations) {
          console.log(`  - ${v}`);
        }
      }
      console.log("");
    }
  }

  if (hasBudgetFlag && budgetViolations.length > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
