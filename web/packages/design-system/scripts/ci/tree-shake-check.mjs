#!/usr/bin/env node

/**
 * Tree-Shaking Validation
 *
 * Verifies that importing a single component from a subpath export
 * produces a bundle significantly smaller than the full package.
 *
 * Usage: node scripts/ci/tree-shake-check.mjs
 *
 * Exit codes:
 *   0  All single-component bundles are within budget
 *   1  At least one bundle exceeded its budget, or dist/ is missing
 */

import { writeFile, unlink, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const __filename = fileURLToPath(import.meta.url);
const SCRIPT_DIR = join(__filename, "..");
const ROOT = join(SCRIPT_DIR, "..", "..");
const DIST_DIR = join(ROOT, "dist");
const TEMP_DIR = ROOT; // write temp entry files in project root

// Max allowed bundle size (in bytes) for a single-component import.
// A single primitive should be well under 50 KB after tree-shaking.
const SINGLE_COMPONENT_BUDGET_KB = 50;

// Components to test: [importName, subpath]
const TEST_CASES = [
  { name: "Button", subpath: "./dist/esm/primitives/index.js" },
  { name: "Input", subpath: "./dist/esm/primitives/index.js" },
  { name: "Badge", subpath: "./dist/esm/primitives/index.js" },
  { name: "Select", subpath: "./dist/esm/primitives/index.js" },
];

function toKB(bytes) {
  return (bytes / 1024).toFixed(1);
}

/**
 * Bundle a single named import and return the output size in bytes.
 */
async function measureSingleImport(componentName, subpath) {
  const entryFile = join(TEMP_DIR, `.tree-shake-entry-${componentName}.mjs`);
  const outFile = join(TEMP_DIR, `.tree-shake-out-${componentName}.js`);

  // Resolve the subpath to an absolute path so esbuild can find it
  const importPath = join(ROOT, subpath);

  const code = `import { ${componentName} } from ${JSON.stringify(importPath)};\nconsole.log(${componentName});\n`;

  try {
    await writeFile(entryFile, code, "utf-8");

    await build({
      entryPoints: [entryFile],
      bundle: true,
      outfile: outFile,
      format: "esm",
      platform: "browser",
      treeShaking: true,
      minify: true,
      // Mark React and other peer deps as external so we only measure
      // the design-system code that gets pulled in.
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@mfe/shared-http",
        "@mfe/shared-types",
      ],
      logLevel: "silent",
    });

    const s = await stat(outFile);
    return s.size;
  } finally {
    // Clean up temp files
    await unlink(entryFile).catch(() => {});
    await unlink(outFile).catch(() => {});
  }
}

/**
 * Measure the full barrel import size for comparison.
 */
async function measureFullBundle() {
  const entryFile = join(TEMP_DIR, ".tree-shake-entry-full.mjs");
  const outFile = join(TEMP_DIR, ".tree-shake-out-full.js");
  const importPath = join(ROOT, "dist/esm/index.js");

  const code = `export * from ${JSON.stringify(importPath)};\n`;

  try {
    await writeFile(entryFile, code, "utf-8");

    await build({
      entryPoints: [entryFile],
      bundle: true,
      outfile: outFile,
      format: "esm",
      platform: "browser",
      treeShaking: true,
      minify: true,
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@mfe/shared-http",
        "@mfe/shared-types",
      ],
      logLevel: "silent",
    });

    const s = await stat(outFile);
    return s.size;
  } finally {
    await unlink(entryFile).catch(() => {});
    await unlink(outFile).catch(() => {});
  }
}

async function main() {
  // Verify dist/ exists
  try {
    await stat(DIST_DIR);
  } catch {
    console.error("Error: dist/ not found. Run the build first.");
    process.exit(1);
  }

  console.log("");
  console.log("=== Tree-Shaking Validation ===");
  console.log("");

  // Measure full bundle for comparison
  let fullBundleSize;
  try {
    fullBundleSize = await measureFullBundle();
  } catch (err) {
    console.error("Failed to build full bundle for comparison:", err.message);
    process.exit(1);
  }

  const budgetBytes = SINGLE_COMPONENT_BUDGET_KB * 1024;
  const results = [];
  const violations = [];

  for (const tc of TEST_CASES) {
    try {
      const size = await measureSingleImport(tc.name, tc.subpath);
      const pass = size <= budgetBytes;
      const ratio = ((size / fullBundleSize) * 100).toFixed(1);

      results.push({
        name: tc.name,
        sizeKB: toKB(size),
        budgetKB: SINGLE_COMPONENT_BUDGET_KB,
        ratio,
        pass,
      });

      if (!pass) {
        violations.push(
          `${tc.name}: ${toKB(size)} KB exceeds budget of ${SINGLE_COMPONENT_BUDGET_KB} KB`
        );
      }
    } catch (err) {
      results.push({
        name: tc.name,
        sizeKB: "ERR",
        budgetKB: SINGLE_COMPONENT_BUDGET_KB,
        ratio: "-",
        pass: false,
      });
      violations.push(`${tc.name}: build failed - ${err.message}`);
    }
  }

  // Print table
  const pad = (s, n) => String(s).padEnd(n).slice(0, n);
  const padR = (s, n) => String(s).padStart(n).slice(0, n);

  console.log(
    `${pad("Component", 14)} ${padR("Size (KB)", 10)} ${padR("Budget (KB)", 12)} ${padR("% of Full", 10)} ${padR("Status", 8)}`
  );
  console.log("-".repeat(56));

  for (const r of results) {
    const status = r.pass ? "PASS" : "FAIL";
    console.log(
      `${pad(r.name, 14)} ${padR(r.sizeKB, 10)} ${padR(r.budgetKB, 12)} ${padR(r.ratio + "%", 10)} ${padR(status, 8)}`
    );
  }

  console.log("-".repeat(56));
  console.log(
    `${pad("Full bundle", 14)} ${padR(toKB(fullBundleSize), 10)} ${padR("-", 12)} ${padR("100.0%", 10)} ${padR("-", 8)}`
  );
  console.log("");

  if (violations.length === 0) {
    console.log(
      `Result: PASS - All single-component imports are within ${SINGLE_COMPONENT_BUDGET_KB} KB budget`
    );
  } else {
    console.log("Result: FAIL");
    for (const v of violations) {
      console.log(`  - ${v}`);
    }
  }
  console.log("");

  if (violations.length > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
