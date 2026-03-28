#!/usr/bin/env node
/**
 * Benchmark Report Generator
 *
 * Reads the latest benchmark results JSON and generates
 * a markdown report with methodology, environment, results,
 * and trend comparison.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const REPORTS_DIR = join(ROOT, "benchmark-reports");

/* ------------------------------------------------------------------ */
/*  Load results                                                        */
/* ------------------------------------------------------------------ */

function getResultFiles() {
  if (!existsSync(REPORTS_DIR)) return [];
  return readdirSync(REPORTS_DIR)
    .filter((f) => f.startsWith("results-") && f.endsWith(".json"))
    .sort();
}

function loadResult(filename) {
  return JSON.parse(readFileSync(join(REPORTS_DIR, filename), "utf-8"));
}

/* ------------------------------------------------------------------ */
/*  Generate markdown                                                    */
/* ------------------------------------------------------------------ */

function generateReport() {
  const files = getResultFiles();
  if (files.length === 0) {
    console.error("No benchmark results found. Run `pnpm bench` first.");
    process.exitCode = 1;
    return;
  }

  const latestFile = files[files.length - 1];
  const latest = loadResult(latestFile);
  const previous = files.length > 1 ? loadResult(files[files.length - 2]) : null;

  const { metadata, results, summary } = latest;

  let md = `# Benchmark Report\n\n`;
  md += `> Generated: ${metadata.timestamp}\n\n`;

  /* ── Methodology ── */
  md += `## Methodology\n\n`;
  md += `- Each package runs its dedicated \`test:perf\` script (or falls back to build time measurement)\n`;
  md += `- Results are compared against defined thresholds in \`benchmark-thresholds.json\`\n`;
  md += `- Regressions are flagged when a metric increases >15% from the previous run\n`;
  md += `- All benchmarks run in a clean environment with controlled concurrency\n\n`;

  /* ── Environment ── */
  md += `## Environment\n\n`;
  md += `| Property | Value |\n`;
  md += `|----------|-------|\n`;
  md += `| Git SHA | \`${metadata.gitSha}\` |\n`;
  md += `| Node | ${metadata.nodeVersion} |\n`;
  md += `| OS | ${metadata.os} |\n`;
  md += `| CPU | ${metadata.cpuModel} (${metadata.cpuCount} cores) |\n\n`;

  /* ── Results Table ── */
  md += `## Results\n\n`;
  md += `| Package | Metric | Value | Threshold | Status |\n`;
  md += `|---------|--------|------:|----------:|--------|\n`;

  for (const r of results) {
    const statusIcon =
      r.status === "pass" ? "\u2705 Pass" :
      r.status === "fail" ? "\u274C Fail" :
      r.status === "regression" ? "\u26A0\uFE0F Regression" :
      "\u23ED\uFE0F Skip";
    const threshold = r.threshold != null ? String(r.threshold) : "-";
    md += `| ${r.package} | ${r.metric} | ${r.value} | ${threshold} | ${statusIcon} |\n`;
  }

  md += `\n`;

  /* ── Trend Comparison ── */
  if (previous) {
    md += `## Trend Comparison\n\n`;
    md += `Previous run: ${previous.metadata.timestamp} (SHA: \`${previous.metadata.gitSha}\`)\n\n`;
    md += `| Package | Previous | Current | Delta |\n`;
    md += `|---------|----------|---------|-------|\n`;

    for (const r of results) {
      const prev = previous.results?.find((p) => p.package === r.package);
      if (prev) {
        const delta = prev.value > 0
          ? `${((r.value - prev.value) / prev.value * 100).toFixed(1)}%`
          : "-";
        md += `| ${r.package} | ${prev.value} | ${r.value} | ${delta} |\n`;
      }
    }
    md += `\n`;
  }

  /* ── Verdict ── */
  md += `## Verdict\n\n`;
  const verdict = summary.failed === 0 && summary.regressions === 0
    ? "\u2705 **ALL BENCHMARKS PASS** — No regressions detected."
    : `\u274C **${summary.failed} failures, ${summary.regressions} regressions** — Review required.`;
  md += `${verdict}\n\n`;
  md += `Summary: ${summary.passed}/${summary.total} pass, ${summary.failed} fail, ${summary.regressions} regression, ${summary.skipped} skip\n`;

  /* ── Write report ── */
  const outputPath = join(REPORTS_DIR, `report-${metadata.timestamp.slice(0, 10)}.md`);
  writeFileSync(outputPath, md);
  console.log(`Report generated: ${outputPath}`);
  console.log(md);
}

generateReport();
