#!/usr/bin/env node

/**
 * Semver Check
 *
 * Compares current public API surface against a saved baseline.
 * Detects breaking changes (removed exports) that should trigger a major bump.
 *
 * Usage:
 *   node scripts/ci/semver-check.mjs              Compare against baseline
 *   node scripts/ci/semver-check.mjs --update      Update the baseline file
 *   node scripts/ci/semver-check.mjs --json        Output as JSON
 *
 * Exit codes:
 *   0  No breaking changes (or --update mode)
 *   1  Breaking changes detected
 *   2  Baseline file missing (run with --update first)
 */

import { readFile, writeFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const SCRIPT_DIR = join(__filename, "..");
const ROOT = join(SCRIPT_DIR, "..", "..");
const SRC = join(ROOT, "src");
const BASELINE_FILE = join(SCRIPT_DIR, "api-baseline.json");

// Barrel index files to scan for public exports
const BARREL_FILES = [
  "index.ts",
  "primitives/index.ts",
  "components/index.ts",
  "patterns/index.ts",
  "advanced/index.ts",
  "internal/index.ts",
  "utils/index.ts",
  "tokens/index.ts",
  "theme/index.ts",
  "providers/index.ts",
  "a11y/index.ts",
  "lib/index.ts",
  "mcp/index.ts",
  "performance/index.ts",
  "headless/index.ts",
  "icons/index.ts",
];

/**
 * Extract export statements from a TypeScript file.
 * Returns an array of normalized export strings.
 */
function extractExports(content, filePath) {
  const exports = [];
  const lines = content.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip comments and empty lines
    if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) {
      continue;
    }

    // export { Foo, Bar } from "./module"
    const namedReExport = trimmed.match(
      /^export\s+(type\s+)?\{([^}]+)\}\s+from\s+["']([^"']+)["']/
    );
    if (namedReExport) {
      const isType = !!namedReExport[1];
      const names = namedReExport[2].split(",").map((n) => n.trim().split(/\s+as\s+/).pop().trim());
      const source = namedReExport[3];
      for (const name of names) {
        if (name) {
          exports.push({
            kind: isType ? "type" : "value",
            name,
            from: source,
            file: filePath,
          });
        }
      }
      continue;
    }

    // export * from "./module"
    const starReExport = trimmed.match(/^export\s+\*\s+from\s+["']([^"']+)["']/);
    if (starReExport) {
      exports.push({
        kind: "star",
        name: "*",
        from: starReExport[1],
        file: filePath,
      });
      continue;
    }

    // export const/function/class/enum/interface/type
    const directExport = trimmed.match(
      /^export\s+(default\s+)?(const|let|var|function|class|enum|interface|type|abstract\s+class)\s+(\w+)/
    );
    if (directExport) {
      exports.push({
        kind: directExport[1] ? "default" : "value",
        name: directExport[3],
        from: null,
        file: filePath,
      });
      continue;
    }

    // export default
    if (trimmed.startsWith("export default ")) {
      exports.push({
        kind: "default",
        name: "default",
        from: null,
        file: filePath,
      });
    }
  }

  return exports;
}

async function scanExports() {
  const allExports = [];

  for (const relPath of BARREL_FILES) {
    const fullPath = join(SRC, relPath);
    try {
      const content = await readFile(fullPath, "utf-8");
      const exports = extractExports(content, relPath);
      allExports.push(...exports);
    } catch {
      // File doesn't exist — skip
    }
  }

  // Also scan sub-module index files that may exist
  const subModuleDirs = [
    "primitives",
    "components",
    "patterns",
    "advanced",
  ];

  for (const dir of subModuleDirs) {
    try {
      const entries = await readdir(join(SRC, dir), { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory() && !entry.name.startsWith("_") && !entry.name.startsWith(".")) {
          const indexPath = join(SRC, dir, entry.name, "index.ts");
          try {
            const content = await readFile(indexPath, "utf-8");
            const exports = extractExports(content, `${dir}/${entry.name}/index.ts`);
            allExports.push(...exports);
          } catch {
            // no index.ts
          }
        }
      }
    } catch {
      // dir doesn't exist
    }
  }

  return allExports;
}

/**
 * Create a comparable fingerprint string for each export entry.
 */
function exportKey(exp) {
  return `${exp.kind}:${exp.name}:${exp.from || ""}:${exp.file}`;
}

async function main() {
  const updateMode = process.argv.includes("--update");
  const jsonOutput = process.argv.includes("--json");

  const currentExports = await scanExports();

  if (updateMode) {
    const baseline = {
      _generated: new Date().toISOString(),
      _comment: "Auto-generated API baseline. Do not edit manually.",
      exports: currentExports,
    };
    await writeFile(BASELINE_FILE, JSON.stringify(baseline, null, 2) + "\n");
    if (!jsonOutput) {
      console.log(`API baseline updated with ${currentExports.length} exports.`);
      console.log(`Written to: ${BASELINE_FILE}`);
    } else {
      console.log(JSON.stringify({ action: "update", count: currentExports.length }));
    }
    return;
  }

  // Load baseline
  let baseline;
  try {
    baseline = JSON.parse(await readFile(BASELINE_FILE, "utf-8"));
  } catch {
    console.error(
      "Error: No API baseline found. Run with --update first to create one."
    );
    console.error(`  node scripts/ci/semver-check.mjs --update`);
    process.exit(2);
  }

  const baselineKeys = new Set(baseline.exports.map(exportKey));
  const currentKeys = new Set(currentExports.map(exportKey));

  // Find removed exports (breaking changes)
  const removed = baseline.exports.filter((e) => !currentKeys.has(exportKey(e)));
  // Find added exports (minor/patch compatible)
  const added = currentExports.filter((e) => !baselineKeys.has(exportKey(e)));

  const hasBreaking = removed.length > 0;

  if (jsonOutput) {
    const report = {
      baselineCount: baseline.exports.length,
      currentCount: currentExports.length,
      added: added.map((e) => ({ kind: e.kind, name: e.name, file: e.file })),
      removed: removed.map((e) => ({ kind: e.kind, name: e.name, file: e.file })),
      breaking: hasBreaking,
      pass: !hasBreaking,
    };
    process.stdout.write(JSON.stringify(report, null, 2) + "\n");
  } else {
    console.log("");
    console.log("=== Semver API Check ===");
    console.log("");
    console.log(`Baseline exports: ${baseline.exports.length}`);
    console.log(`Current exports:  ${currentExports.length}`);
    console.log(`Added:            ${added.length}`);
    console.log(`Removed:          ${removed.length}`);
    console.log("");

    if (added.length > 0) {
      console.log("--- Added exports (non-breaking) ---");
      for (const e of added) {
        console.log(`  + [${e.kind}] ${e.name} (${e.file})`);
      }
      console.log("");
    }

    if (removed.length > 0) {
      console.log("--- Removed exports (BREAKING) ---");
      for (const e of removed) {
        console.log(`  - [${e.kind}] ${e.name} (${e.file})`);
      }
      console.log("");
    }

    if (hasBreaking) {
      console.log(
        "FAIL: Breaking changes detected. This requires a major version bump."
      );
    } else {
      console.log("PASS: No breaking changes detected.");
    }
    console.log("");
  }

  if (hasBreaking) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
