#!/usr/bin/env node
/**
 * diff-tokens.mjs
 * ---------------
 * Compares the current tokens.json build output against a fresh build
 * and reports added, removed, and changed tokens.
 *
 * Usage:  node scripts/tokens/diff-tokens.mjs
 */

import { readFileSync, existsSync, copyFileSync, unlinkSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "../..");
const BUILD_DIR = join(ROOT, "packages/design-system/src/tokens/build");
const TOKENS_JSON = join(BUILD_DIR, "tokens.json");
const TOKENS_JSON_BAK = join(BUILD_DIR, "tokens.json.bak");

/* ------------------------------------------------------------------ */
/*  1. Read current tokens.json (if it exists)                         */
/* ------------------------------------------------------------------ */
let oldTokens = {};
let hadPrevious = false;

if (existsSync(TOKENS_JSON)) {
  hadPrevious = true;
  try {
    oldTokens = JSON.parse(readFileSync(TOKENS_JSON, "utf-8"));
    // Back up current file so we can restore after comparison
    copyFileSync(TOKENS_JSON, TOKENS_JSON_BAK);
  } catch (e) {
    console.warn(`  [warn] Could not parse existing tokens.json: ${e.message}`);
  }
}

/* ------------------------------------------------------------------ */
/*  2. Run build to generate fresh output                              */
/* ------------------------------------------------------------------ */
try {
  execSync("node scripts/tokens/build-tokens.mjs", {
    cwd: ROOT,
    stdio: "pipe",
  });
} catch (e) {
  console.error("  [error] Token build failed:");
  console.error(e.stderr?.toString() || e.message);
  // Restore backup if we had one
  if (hadPrevious && existsSync(TOKENS_JSON_BAK)) {
    copyFileSync(TOKENS_JSON_BAK, TOKENS_JSON);
    unlinkSync(TOKENS_JSON_BAK);
  }
  process.exit(1);
}

/* ------------------------------------------------------------------ */
/*  3. Read newly generated tokens.json                                */
/* ------------------------------------------------------------------ */
let newTokens = {};
try {
  newTokens = JSON.parse(readFileSync(TOKENS_JSON, "utf-8"));
} catch (e) {
  console.error(`  [error] Could not read new tokens.json: ${e.message}`);
  process.exit(1);
}

// Restore the original file so the diff is non-destructive
if (hadPrevious && existsSync(TOKENS_JSON_BAK)) {
  copyFileSync(TOKENS_JSON_BAK, TOKENS_JSON);
  unlinkSync(TOKENS_JSON_BAK);
}

/* ------------------------------------------------------------------ */
/*  4. Compare old vs new                                              */
/* ------------------------------------------------------------------ */

/**
 * Flatten a nested object into dot-separated key-value pairs.
 */
function flattenObj(obj, prefix = "", acc = {}) {
  for (const [key, val] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof val === "object" && val !== null && !Array.isArray(val)) {
      flattenObj(val, path, acc);
    } else {
      acc[path] = val;
    }
  }
  return acc;
}

const oldFlat = flattenObj(oldTokens);
const newFlat = flattenObj(newTokens);

const allKeys = new Set([...Object.keys(oldFlat), ...Object.keys(newFlat)]);

const added = [];
const removed = [];
const changed = [];

for (const key of [...allKeys].sort()) {
  const inOld = key in oldFlat;
  const inNew = key in newFlat;

  if (!inOld && inNew) {
    added.push({ key, value: newFlat[key] });
  } else if (inOld && !inNew) {
    removed.push({ key, value: oldFlat[key] });
  } else if (String(oldFlat[key]) !== String(newFlat[key])) {
    changed.push({ key, oldValue: oldFlat[key], newValue: newFlat[key] });
  }
}

/* ------------------------------------------------------------------ */
/*  5. Report                                                          */
/* ------------------------------------------------------------------ */
console.log("\n  Token Diff Report");
console.log("  " + "-".repeat(50));

if (!hadPrevious) {
  console.log("\n  No previous tokens.json found — all tokens are new.\n");
  console.log(`  Total tokens: ${Object.keys(newFlat).length}`);
  process.exit(0);
}

if (added.length === 0 && removed.length === 0 && changed.length === 0) {
  console.log("\n  No changes detected.\n");
  process.exit(0);
}

if (added.length > 0) {
  console.log(`\n  ADDED (${added.length}):`);
  for (const { key, value } of added) {
    console.log(`    + ${key}: ${value}`);
  }
}

if (removed.length > 0) {
  console.log(`\n  REMOVED (${removed.length}):`);
  for (const { key, value } of removed) {
    console.log(`    - ${key}: ${value}`);
  }
}

if (changed.length > 0) {
  console.log(`\n  CHANGED (${changed.length}):`);
  for (const { key, oldValue, newValue } of changed) {
    console.log(`    ~ ${key}: ${oldValue} -> ${newValue}`);
  }
}

console.log(
  `\n  Summary: ${added.length} added, ${removed.length} removed, ${changed.length} changed\n`
);
