#!/usr/bin/env node
/**
 * Performance Benchmark Runner
 *
 * Runs the vitest performance benchmark suite and compares results against
 * stored baselines.  Optionally updates the baseline file.
 *
 * Usage:
 *   node scripts/ci/perf-benchmark.mjs                 # run & compare
 *   node scripts/ci/perf-benchmark.mjs --update-baseline  # run & save new baselines
 */
import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = join(__dirname, "..", "..");
const BASELINE_FILE = join(__dirname, "perf-baseline.json");

const BENCHMARK_COMPONENTS = [
  "Button",
  "Input",
  "Select",
  "Checkbox",
  "Switch",
  "Tabs",
  "Dialog",
  "Accordion",
  "ToastProvider",
  "Tooltip",
  "DataGrid",
  "Combobox",
  "DatePicker",
  "Slider",
  "Pagination",
  "SearchInput",
];

async function main() {
  const updateBaseline = process.argv.includes("--update-baseline");

  console.log("⚡ Performance Benchmark\n");

  // ── Run vitest suite ──────────────────────────────────────────────
  let stdout = "";
  let stderr = "";
  try {
    stdout = execSync(
      "npx vitest run src/__tests__/perf-benchmark.test.tsx --reporter=verbose 2>&1",
      { cwd: PKG_ROOT, encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] },
    );
  } catch (e) {
    // vitest exits non-zero if a test fails — we still want the output
    stdout = e.stdout || "";
    stderr = e.stderr || "";
  }

  // ── Parse timing results from console.log lines ───────────────────
  // Lines look like: "Button: 1.23ms avg"
  const timingRegex = /^([A-Za-z]+):\s+([\d.]+)ms\s+avg/;
  const results = {};
  for (const line of (stdout + "\n" + stderr).split("\n")) {
    const m = line.trim().match(timingRegex);
    if (m) {
      results[m[1]] = parseFloat(m[2]);
    }
  }

  // ── Load baseline ────────────────────────────────────────────────
  let baseline;
  try {
    baseline = JSON.parse(await readFile(BASELINE_FILE, "utf-8"));
  } catch {
    baseline = { components: {} };
  }

  // ── Report ───────────────────────────────────────────────────────
  console.log("\n┌──────────────────┬──────────┬──────────┬──────────┬────────┐");
  console.log("│ Component        │ Avg (ms) │ Max (ms) │ Baseline │ Status │");
  console.log("├──────────────────┼──────────┼──────────┼──────────┼────────┤");

  let hasFailure = false;

  for (const name of BENCHMARK_COMPONENTS) {
    const avg = results[name];
    const spec = baseline.components?.[name] || {};
    const maxMs = spec.maxMs ?? 10;
    const prev = spec.baseline;

    const avgStr = avg != null ? avg.toFixed(2).padStart(6) : "  N/A ";
    const maxStr = String(maxMs).padStart(6);
    const prevStr = prev != null ? prev.toFixed(2).padStart(6) : "  N/A ";

    let status = "  ✓  ";
    if (avg == null) {
      status = "  ?  ";
    } else if (avg > maxMs) {
      status = "  ✗  ";
      hasFailure = true;
    }

    console.log(
      `│ ${name.padEnd(16)} │ ${avgStr}   │ ${maxStr}   │ ${prevStr}   │${status} │`,
    );
  }

  console.log("└──────────────────┴──────────┴──────────┴──────────┴────────┘\n");

  // ── Update baseline if requested ──────────────────────────────────
  if (updateBaseline) {
    for (const name of BENCHMARK_COMPONENTS) {
      if (results[name] != null) {
        if (!baseline.components[name]) {
          baseline.components[name] = { maxMs: 5 };
        }
        baseline.components[name].baseline = parseFloat(results[name].toFixed(2));
      }
    }
    baseline._updated = new Date().toISOString().slice(0, 10);
    await writeFile(BASELINE_FILE, JSON.stringify(baseline, null, 2) + "\n", "utf-8");
    console.log(`✅ Baseline updated → ${BASELINE_FILE}\n`);
  }

  if (hasFailure) {
    console.log("❌ Some components exceeded their performance budget.\n");
    process.exit(1);
  } else {
    console.log("✅ All components within performance budget.\n");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
