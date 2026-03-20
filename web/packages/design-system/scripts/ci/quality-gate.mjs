#!/usr/bin/env node
/**
 * Quality Gate Runner (CI)
 *
 * Delegates to the canonical pre-release-check.mjs with CI-appropriate flags.
 * This ensures CI and release use the SAME gate list.
 *
 * Usage:
 *   node scripts/ci/quality-gate.mjs              Run all gates (skips visual by default)
 *   node scripts/ci/quality-gate.mjs --visual      Include Playwright visual tests
 *
 * Exit codes:
 *   0  All gates passed
 *   1  One or more gates failed
 */

import { execSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = join(__dirname, "..", "..");
const includeVisual = process.argv.includes("--visual");

const flags = [
  "--allow-dirty",  // CI doesn't require clean tree (controlled by CI pipeline)
  ...(includeVisual ? [] : ["--skip-visual"]),
].join(" ");

try {
  execSync(
    `node scripts/release/pre-release-check.mjs ${flags}`,
    { cwd: PKG_ROOT, stdio: "inherit", timeout: 600_000 },
  );
} catch {
  process.exit(1);
}
