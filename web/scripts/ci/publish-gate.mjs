#!/usr/bin/env node
/**
 * publish-gate.mjs — Faz 0B CI Publish Gate
 *
 * Pre-publish validation script for the design-system package.
 * Runs vitest, verifies critical component test files exist, and
 * ensures all tests pass before a publish is allowed.
 */

import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../..");

const CRITICAL_COMPONENTS = [
  { name: "Button", path: "packages/design-system/src/primitives/button/__tests__/Button.test.tsx" },
  { name: "Switch", path: "packages/design-system/src/primitives/switch/__tests__/Switch.test.tsx" },
  { name: "Checkbox", path: "packages/design-system/src/primitives/checkbox/__tests__/Checkbox.test.tsx" },
  { name: "Radio", path: "packages/design-system/src/primitives/radio/__tests__/Radio.test.tsx" },
  { name: "Input", path: "packages/design-system/src/primitives/input/__tests__/Input.test.tsx" },
  { name: "Select", path: "packages/design-system/src/primitives/select/__tests__/Select.test.tsx" },
];

const failures = [];

// ── Step 1: Verify critical component test files exist ───────────────
console.log("\n🔍 Checking critical component test files...\n");

for (const { name, path: relPath } of CRITICAL_COMPONENTS) {
  const fullPath = resolve(ROOT, relPath);
  if (!existsSync(fullPath)) {
    failures.push(`Missing test file for ${name}: ${relPath}`);
    console.log(`  ❌ ${name} — test file NOT found`);
  } else {
    console.log(`  ✔  ${name} — ${relPath}`);
  }
}

// ── Step 2: Run vitest on design-system ──────────────────────────────
console.log("\n🧪 Running vitest on packages/design-system...\n");

let testResult;
try {
  const output = execSync(
    "npx vitest run packages/design-system --reporter=json",
    { cwd: ROOT, stdio: ["pipe", "pipe", "pipe"], timeout: 120_000 }
  );
  testResult = JSON.parse(output.toString());
} catch (err) {
  // vitest exits non-zero when tests fail; stdout still contains JSON
  if (err.stdout) {
    try {
      testResult = JSON.parse(err.stdout.toString());
    } catch {
      // JSON parse failed — raw failure
    }
  }

  if (!testResult) {
    console.error("  ❌ vitest failed to execute or produce JSON output.");
    if (err.stderr) {
      console.error(err.stderr.toString().slice(0, 500));
    }
    failures.push("vitest execution error — could not parse results");
  }
}

// ── Step 3: Evaluate test results ────────────────────────────────────
if (testResult) {
  const numFiles = testResult.numTotalTestSuites ?? 0;
  const numTests = testResult.numTotalTests ?? 0;
  const numFailed = testResult.numFailedTests ?? 0;
  const numPassed = testResult.numPassedTests ?? 0;
  const suiteFailed = testResult.numFailedTestSuites ?? 0;

  console.log(`  Test suites : ${numFiles} total, ${suiteFailed} failed`);
  console.log(`  Tests       : ${numTests} total, ${numPassed} passed, ${numFailed} failed\n`);

  if (numFailed > 0 || suiteFailed > 0) {
    failures.push(`${numFailed} test(s) failed across ${suiteFailed} suite(s)`);

    // List failed suites for quick debugging
    if (testResult.testResults) {
      for (const suite of testResult.testResults) {
        if (suite.status === "failed") {
          console.log(`  ❌ FAILED: ${suite.name}`);
          for (const t of suite.assertionResults ?? []) {
            if (t.status === "failed") {
              console.log(`      • ${t.fullName}`);
            }
          }
        }
      }
    }
  }

  if (numTests === 0) {
    failures.push("No tests were found — vitest returned 0 total tests");
  }
}

// ── Summary ──────────────────────────────────────────────────────────
console.log("\n" + "─".repeat(60));

if (failures.length > 0) {
  console.log("\n❌ Publish gate FAILED:\n");
  for (const f of failures) {
    console.log(`  • ${f}`);
  }
  console.log("");
  process.exit(1);
} else {
  const numFiles = testResult?.numTotalTestSuites ?? 0;
  const numTests = testResult?.numTotalTests ?? 0;
  console.log(
    `\n✅ Publish gate passed: ${numFiles} test files, ${numTests} tests, 0 failures\n`
  );
  process.exit(0);
}
