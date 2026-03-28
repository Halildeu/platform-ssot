#!/usr/bin/env node

/**
 * Adoption Report
 *
 * Scans app directories for imports from '@mfe/design-system' and builds
 * an App x Component usage matrix.
 *
 * Usage:
 *   node scripts/ci/adoption-report.mjs              Human-readable table
 *   node scripts/ci/adoption-report.mjs --json        Output as JSON
 *   node scripts/ci/adoption-report.mjs --apps-dir <path>  Override apps directory
 *
 * Exit codes:
 *   0  Always (informational report)
 */

import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const SCRIPT_DIR = join(__filename, "..");
const ROOT = join(SCRIPT_DIR, "..", "..");
const MONOREPO_ROOT = join(ROOT, "..", "..");

// CLI args
const args = process.argv.slice(2);
const jsonOutput = args.includes("--json");
const appsDirIdx = args.indexOf("--apps-dir");
const APPS_DIR = appsDirIdx >= 0 ? args[appsDirIdx + 1] : join(MONOREPO_ROOT, "apps");

// Import patterns to detect
const IMPORT_PATTERNS = [
  // import { Foo } from '@mfe/design-system'
  /from\s+['"]@mfe\/design-system['"]/,
  // import { Foo } from '@mfe/design-system/primitives/button'
  /from\s+['"]@mfe\/design-system\/([^'"]+)['"]/,
  // require('@mfe/design-system')
  /require\s*\(\s*['"]@mfe\/design-system/,
];

/**
 * Recursively find all .ts/.tsx/.js/.jsx files, skipping node_modules and dist.
 */
async function findSourceFiles(dir, maxDepth = 10) {
  if (maxDepth <= 0) return [];
  const results = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (
        entry.name === "node_modules" ||
        entry.name === "dist" ||
        entry.name === ".next" ||
        entry.name === "build" ||
        entry.name === "coverage" ||
        entry.name.startsWith(".")
      ) {
        continue;
      }
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...(await findSourceFiles(fullPath, maxDepth - 1)));
      } else if (
        entry.isFile() &&
        /\.(tsx?|jsx?)$/.test(entry.name) &&
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
    // directory doesn't exist
  }
  return results;
}

/**
 * Extract design-system imports from a source file.
 * Returns an array of imported symbol names and deep-import paths.
 */
async function extractImports(filePath) {
  const content = await readFile(filePath, "utf-8");
  const imports = [];

  // Match: import { Foo, Bar as Baz } from '@mfe/design-system...'
  const importRegex =
    /import\s+(?:type\s+)?(?:\{([^}]+)\}|(\w+))\s+from\s+['"]@mfe\/design-system(?:\/([^'"]*))?\s*['"]/g;

  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const namedImports = match[1];
    const defaultImport = match[2];
    const deepPath = match[3] || null;

    if (namedImports) {
      const names = namedImports.split(",").map((n) => {
        const parts = n.trim().split(/\s+as\s+/);
        return parts[0].trim(); // original name before 'as'
      });
      for (const name of names) {
        if (name && !name.startsWith("//")) {
          imports.push({ name, deepPath });
        }
      }
    }
    if (defaultImport) {
      imports.push({ name: defaultImport, deepPath });
    }
  }

  return imports;
}

async function main() {
  // Discover apps
  let appDirs = [];
  try {
    const entries = await readdir(APPS_DIR, { withFileTypes: true });
    appDirs = entries
      .filter(
        (e) =>
          e.isDirectory() &&
          !e.name.startsWith(".") &&
          e.name !== "node_modules" &&
          e.name !== "dist"
      )
      .map((e) => ({ name: e.name, path: join(APPS_DIR, e.name) }));
  } catch {
    console.error(`Error: Apps directory not found at ${APPS_DIR}`);
    console.error("Use --apps-dir <path> to specify the location.");
    process.exit(1);
  }

  if (appDirs.length === 0) {
    console.log("No app directories found.");
    return;
  }

  // Scan each app
  /** @type {Record<string, Record<string, number>>} */
  const usageMatrix = {}; // app -> { componentName -> count }
  /** @type {Set<string>} */
  const allComponents = new Set();

  for (const app of appDirs) {
    usageMatrix[app.name] = {};
    const sourceFiles = await findSourceFiles(app.path);

    for (const file of sourceFiles) {
      try {
        const imports = await extractImports(file);
        for (const imp of imports) {
          const key = imp.deepPath
            ? `${imp.name} (${imp.deepPath})`
            : imp.name;
          allComponents.add(key);
          usageMatrix[app.name][key] = (usageMatrix[app.name][key] || 0) + 1;
        }
      } catch {
        // skip files that can't be read
      }
    }
  }

  const sortedComponents = [...allComponents].sort();
  const sortedApps = appDirs.map((a) => a.name).sort();

  // Summary stats
  const appStats = sortedApps.map((app) => ({
    app,
    componentCount: Object.keys(usageMatrix[app]).length,
    totalImports: Object.values(usageMatrix[app]).reduce((a, b) => a + b, 0),
  }));

  if (jsonOutput) {
    const report = {
      appsScanned: sortedApps.length,
      uniqueComponents: sortedComponents.length,
      apps: appStats,
      matrix: usageMatrix,
      components: sortedComponents,
    };
    process.stdout.write(JSON.stringify(report, null, 2) + "\n");
    return;
  }

  console.log("");
  console.log("=== Design System Adoption Report ===");
  console.log("");
  console.log(`Apps scanned:         ${sortedApps.length}`);
  console.log(`Unique imports:       ${sortedComponents.length}`);
  console.log("");

  // Per-app summary
  const pad = (s, n) => String(s).padEnd(n).slice(0, n);
  const padR = (s, n) => String(s).padStart(n).slice(0, n);

  console.log(`${pad("App", 24)} ${padR("Components", 12)} ${padR("Total Imports", 14)}`);
  console.log("-".repeat(52));

  for (const stat of appStats.sort((a, b) => b.totalImports - a.totalImports)) {
    console.log(
      `${pad(stat.app, 24)} ${padR(String(stat.componentCount), 12)} ${padR(String(stat.totalImports), 14)}`
    );
  }
  console.log("");

  // Top used components across all apps
  /** @type {Record<string, number>} */
  const componentTotals = {};
  for (const app of sortedApps) {
    for (const [comp, count] of Object.entries(usageMatrix[app])) {
      componentTotals[comp] = (componentTotals[comp] || 0) + count;
    }
  }

  const topComponents = Object.entries(componentTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25);

  if (topComponents.length > 0) {
    console.log("--- Top 25 Most Used Imports ---");
    console.log(`${pad("Import", 40)} ${padR("Total Uses", 11)} ${padR("Apps Using", 11)}`);
    console.log("-".repeat(64));

    for (const [comp, total] of topComponents) {
      const appsUsing = sortedApps.filter(
        (app) => usageMatrix[app][comp]
      ).length;
      console.log(
        `${pad(comp, 40)} ${padR(String(total), 11)} ${padR(String(appsUsing), 11)}`
      );
    }
    console.log("");
  }

  // Usage matrix (compact)
  if (sortedComponents.length > 0 && sortedComponents.length <= 50) {
    console.log("--- Usage Matrix (App x Component) ---");
    const compColWidth = 8;
    const appColWidth = 20;

    // Header row — show truncated component names
    let header = pad("", appColWidth);
    for (const comp of sortedComponents.slice(0, 20)) {
      const short = comp.length > compColWidth ? comp.slice(0, compColWidth - 1) + "." : comp;
      header += " " + pad(short, compColWidth);
    }
    console.log(header);
    console.log("-".repeat(header.length));

    for (const app of sortedApps) {
      let row = pad(app, appColWidth);
      for (const comp of sortedComponents.slice(0, 20)) {
        const count = usageMatrix[app][comp] || 0;
        row += " " + pad(count > 0 ? String(count) : ".", compColWidth);
      }
      console.log(row);
    }

    if (sortedComponents.length > 20) {
      console.log(`  ... and ${sortedComponents.length - 20} more components (use --json for full data)`);
    }
    console.log("");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
