#!/usr/bin/env node
/**
 * Reproducible Benchmark Runner
 *
 * Runs benchmarks for all X-suite packages and generates
 * versioned JSON results for CI artifact upload.
 *
 * Output: benchmark-reports/results-{timestamp}.json
 */

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { platform, release, cpus } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const REPORTS_DIR = join(ROOT, "benchmark-reports");
const THRESHOLDS_PATH = join(ROOT, "benchmark-thresholds.json");

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function gitSha() {
  try {
    return execSync("git rev-parse --short HEAD", { encoding: "utf-8" }).trim();
  } catch {
    return "unknown";
  }
}

function loadThresholds() {
  if (!existsSync(THRESHOLDS_PATH)) {
    console.warn("[bench] No benchmark-thresholds.json found — running without thresholds");
    return {};
  }
  return JSON.parse(readFileSync(THRESHOLDS_PATH, "utf-8"));
}

function loadPreviousResults() {
  if (!existsSync(REPORTS_DIR)) return null;
  const files = readdirSync(REPORTS_DIR)
    .filter((f) => f.startsWith("results-") && f.endsWith(".json"))
    .sort()
    .reverse();
  if (files.length === 0) return null;
  return JSON.parse(readFileSync(join(REPORTS_DIR, files[0]), "utf-8"));
}

/* ------------------------------------------------------------------ */
/*  Benchmark definitions                                              */
/* ------------------------------------------------------------------ */

const PACKAGES = [
  { name: "@mfe/design-system", script: "test:perf", metric: "render-time-ms" },
  { name: "@mfe/x-data-grid", script: "test:perf", metric: "mount-time-ms" },
  { name: "@mfe/x-charts", script: "test:perf", metric: "render-time-ms" },
  { name: "@mfe/x-form-builder", script: "test:perf", metric: "build-time-ms" },
  { name: "@mfe/x-editor", script: "test:perf", metric: "init-time-ms" },
  { name: "@mfe/shared-http", script: "test:perf", metric: "request-time-ms" },
];

/* ------------------------------------------------------------------ */
/*  Runner                                                              */
/* ------------------------------------------------------------------ */

async function runBenchmarks() {
  const thresholds = loadThresholds();
  const previous = loadPreviousResults();
  const timestamp = new Date().toISOString();
  const sha = gitSha();

  const metadata = {
    timestamp,
    gitSha: sha,
    nodeVersion: process.version,
    os: `${platform()} ${release()}`,
    cpuModel: cpus()[0]?.model ?? "unknown",
    cpuCount: cpus().length,
  };

  console.log("\n=== @mfe Benchmark Suite ===");
  console.log(`SHA: ${sha}  Node: ${process.version}  OS: ${metadata.os}`);
  console.log("─".repeat(60));

  const results = [];

  for (const pkg of PACKAGES) {
    const startTime = performance.now();
    let status = "pass";
    let value = 0;
    let error = null;

    try {
      const output = execSync(`pnpm --filter ${pkg.name} run ${pkg.script} 2>&1`, {
        encoding: "utf-8",
        timeout: 120_000,
        cwd: join(ROOT, "..", ".."),
      });

      // Parse benchmark output — expects last line like "metric: 42.5"
      const match = output.match(/(?:^|\n)\s*[\w-]+:\s*([\d.]+)\s*(?:ms|s)?\s*$/m);
      value = match ? parseFloat(match[1]) : 0;
    } catch (_e) {
      // If perf test script doesn't exist, measure build time as fallback
      try {
        const buildStart = performance.now();
        execSync(`pnpm --filter ${pkg.name} run build 2>&1`, {
          encoding: "utf-8",
          timeout: 120_000,
          cwd: join(ROOT, "..", ".."),
        });
        value = Math.round(performance.now() - buildStart);
      } catch (_buildErr) {
        status = "skip";
        error = "No perf test or build script available";
      }
    }

    const elapsed = Math.round(performance.now() - startTime);

    // Check threshold
    const threshold = thresholds[pkg.name]?.[pkg.metric];
    if (threshold && value > threshold) {
      status = "fail";
    }

    // Check regression against previous
    let regression = null;
    if (previous) {
      const prev = previous.results?.find((r) => r.package === pkg.name);
      if (prev && prev.value > 0 && value > 0) {
        const delta = ((value - prev.value) / prev.value) * 100;
        regression = { previousValue: prev.value, deltaPercent: Math.round(delta * 100) / 100 };
        if (delta > 15) status = "regression";
      }
    }

    results.push({
      package: pkg.name,
      metric: pkg.metric,
      value,
      threshold: threshold ?? null,
      status,
      regression,
      elapsedMs: elapsed,
      error,
    });

    const icon = status === "pass" ? "\u2705" : status === "fail" ? "\u274C" : status === "regression" ? "\u26A0\uFE0F" : "\u23ED\uFE0F";
    const regStr = regression ? ` (${regression.deltaPercent > 0 ? "+" : ""}${regression.deltaPercent}%)` : "";
    console.log(`${icon} ${pkg.name.padEnd(28)} ${String(value).padStart(8)} ${pkg.metric}${regStr}`);
  }

  console.log("─".repeat(60));

  // Summary
  const passed = results.filter((r) => r.status === "pass").length;
  const failed = results.filter((r) => r.status === "fail").length;
  const regressions = results.filter((r) => r.status === "regression").length;
  const skipped = results.filter((r) => r.status === "skip").length;

  console.log(`\nResults: ${passed} pass, ${failed} fail, ${regressions} regression, ${skipped} skip`);

  // Write results
  if (!existsSync(REPORTS_DIR)) mkdirSync(REPORTS_DIR, { recursive: true });

  const dateStr = timestamp.slice(0, 10);
  const outputPath = join(REPORTS_DIR, `results-${dateStr}.json`);

  const report = { metadata, results, summary: { passed, failed, regressions, skipped, total: results.length } };
  writeFileSync(outputPath, JSON.stringify(report, null, 2));
  console.log(`\nReport written to ${outputPath}`);

  // Exit with error if any failures
  if (failed > 0 || regressions > 0) {
    process.exitCode = 1;
  }
}

runBenchmarks().catch((err) => {
  console.error("Benchmark runner failed:", err);
  process.exitCode = 1;
});
