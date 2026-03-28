#!/usr/bin/env node
/**
 * visual-diff-check.mjs — Faz 0B Visual Diff Validation
 *
 * Detects changes in design-system primitives and components since
 * the previous commit and outputs a review checklist when changes
 * are found.
 */

import { execSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../..");

const WATCHED_PATHS = [
  "packages/design-system/src/primitives/",
  "packages/design-system/src/components/",
];

// ── Collect changed files ────────────────────────────────────────────
let changedFiles = [];

try {
  const raw = execSync("git diff --name-only HEAD~1", {
    cwd: ROOT,
    encoding: "utf-8",
    stdio: ["pipe", "pipe", "pipe"],
  }).trim();

  if (raw.length > 0) {
    changedFiles = raw.split("\n").filter((file) =>
      WATCHED_PATHS.some((prefix) => file.startsWith(prefix))
    );
  }
} catch (err) {
  // HEAD~1 may not exist in a shallow clone or initial commit
  console.log("⚠️  Could not determine diff (shallow clone or first commit).");
  console.log("    Skipping visual diff check.\n");
  process.exit(0);
}

// ── Report ───────────────────────────────────────────────────────────
if (changedFiles.length === 0) {
  console.log("\n✅ No design system changes detected.\n");
  process.exit(0);
}

console.log("\n⚠️  Design system files changed. Visual diff review required.\n");
console.log("Changed files:");
for (const file of changedFiles) {
  console.log(`  • ${file}`);
}

console.log("\n📋 Review checklist:");
console.log("  - [ ] Run visual diff comparison before merge.");
console.log("  - [ ] Verify no unintended visual regressions.");
console.log("  - [ ] Confirm dark mode rendering is unaffected.");
console.log("  - [ ] Confirm compact density rendering is unaffected.\n");

// Exit 0 — this is advisory, not a hard gate
process.exit(0);
