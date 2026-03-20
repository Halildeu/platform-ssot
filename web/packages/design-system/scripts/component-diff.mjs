#!/usr/bin/env node

/**
 * component-diff.mjs
 *
 * Compares the public API surface (exported names) of the design system
 * between two git refs by reading src/index.ts at each ref.
 *
 * Usage:
 *   node scripts/component-diff.mjs <base-ref> <head-ref>
 *   node scripts/component-diff.mjs main HEAD
 *   node scripts/component-diff.mjs v1.0.0 v2.0.0
 */

import { execSync } from "node:child_process";
import path from "node:path";

// ── helpers ──────────────────────────────────────────────────────────────────

/** Resolve the repo-root-relative path to src/index.ts. */
function indexPath() {
  const repoRoot = execSync("git rev-parse --show-toplevel", {
    encoding: "utf-8",
  }).trim();

  const scriptDir = path.resolve(new URL(".", import.meta.url).pathname);
  const pkgDir = path.resolve(scriptDir, "..");
  const rel = path.relative(repoRoot, path.join(pkgDir, "src/index.ts"));

  // git show needs forward-slash paths
  return rel.replace(/\\/g, "/");
}

/** Read file contents at a given git ref. */
function readAtRef(ref, filePath) {
  try {
    return execSync(`git show ${ref}:${filePath}`, {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });
  } catch {
    return null;
  }
}

/**
 * Extract all exported names from a TypeScript index file's text.
 *
 * Handles:
 *   export { Foo }                  → Foo
 *   export { Foo as Bar }          → Bar
 *   export { Foo, Bar, Baz }       → Foo, Bar, Baz
 *   export { default as Foo }      → Foo
 *   export type { SomeType }       → SomeType
 *   export * from "./module"       → (recorded as wildcard re-export)
 *   export const NAME = ...        → NAME
 *   export function name(...)      → name
 *   export default ...             → default
 */
function extractExports(source) {
  const names = new Set();
  const wildcardReexports = [];

  for (const line of source.split("\n")) {
    const trimmed = line.trim();

    // Skip comments
    if (trimmed.startsWith("//") || trimmed.startsWith("/*")) continue;

    // export * from "./path"
    const wildcardMatch = trimmed.match(
      /^export\s+\*\s+from\s+["']([^"']+)["']/,
    );
    if (wildcardMatch) {
      wildcardReexports.push(wildcardMatch[1]);
      continue;
    }

    // export { A, B as C, default as D } from ...
    // export type { X, Y } from ...
    const namedMatch = trimmed.match(
      /^export\s+(?:type\s+)?\{([^}]+)\}/,
    );
    if (namedMatch) {
      const inner = namedMatch[1];
      for (const part of inner.split(",")) {
        const clean = part.trim();
        if (!clean) continue;
        // "Foo as Bar" → take Bar;  "Foo" → take Foo
        const asMatch = clean.match(/(\w+)\s+as\s+(\w+)/);
        if (asMatch) {
          names.add(asMatch[2]);
        } else {
          const word = clean.match(/^(\w+)/);
          if (word) names.add(word[1]);
        }
      }
      continue;
    }

    // export const / let / var NAME
    const constMatch = trimmed.match(
      /^export\s+(?:const|let|var)\s+(\w+)/,
    );
    if (constMatch) {
      names.add(constMatch[1]);
      continue;
    }

    // export function NAME / export class NAME / export enum NAME
    const fnMatch = trimmed.match(
      /^export\s+(?:async\s+)?(?:function|class|enum|interface|type)\s+(\w+)/,
    );
    if (fnMatch) {
      names.add(fnMatch[1]);
      continue;
    }

    // export default
    if (/^export\s+default\s/.test(trimmed)) {
      names.add("default");
      continue;
    }
  }

  return { names, wildcardReexports };
}

// ── main ─────────────────────────────────────────────────────────────────────

function main() {
  const [, , baseRef, headRef] = process.argv;

  if (!baseRef || !headRef) {
    console.error(
      "Usage: node scripts/component-diff.mjs <base-ref> <head-ref>",
    );
    console.error("Example: node scripts/component-diff.mjs main HEAD");
    process.exit(1);
  }

  const idxPath = indexPath();

  const baseSource = readAtRef(baseRef, idxPath);
  if (baseSource === null) {
    console.error(
      `Error: could not read ${idxPath} at ref "${baseRef}". ` +
        `Make sure the ref exists and the file is tracked.`,
    );
    process.exit(1);
  }

  const headSource = readAtRef(headRef, idxPath);
  if (headSource === null) {
    console.error(
      `Error: could not read ${idxPath} at ref "${headRef}". ` +
        `Make sure the ref exists and the file is tracked.`,
    );
    process.exit(1);
  }

  const base = extractExports(baseSource);
  const head = extractExports(headSource);

  const added = [...head.names].filter((n) => !base.names.has(n)).sort();
  const removed = [...base.names].filter((n) => !head.names.has(n)).sort();
  const unchanged = [...base.names].filter((n) => head.names.has(n)).sort();

  // Wildcard re-exports that changed
  const baseWild = new Set(base.wildcardReexports);
  const headWild = new Set(head.wildcardReexports);
  const addedWild = [...headWild].filter((w) => !baseWild.has(w)).sort();
  const removedWild = [...baseWild].filter((w) => !headWild.has(w)).sort();

  // ── Output markdown ──────────────────────────────────────────────────
  const lines = [];

  lines.push(`# API Surface Diff: ${baseRef} \u2192 ${headRef}`);
  lines.push("");

  lines.push(`## Added Exports (${added.length})`);
  lines.push("");
  if (added.length === 0) {
    lines.push("_(none)_");
  } else {
    for (const n of added) lines.push(`- ${n}`);
  }
  lines.push("");

  lines.push(`## Removed Exports (${removed.length})`);
  lines.push("");
  if (removed.length === 0) {
    lines.push("_(none)_");
  } else {
    for (const n of removed) lines.push(`- ${n}`);
  }
  lines.push("");

  if (addedWild.length || removedWild.length) {
    lines.push("## Wildcard Re-export Changes");
    lines.push("");
    if (addedWild.length) {
      lines.push("**Added:**");
      for (const w of addedWild) lines.push(`- \`export * from "${w}"\``);
      lines.push("");
    }
    if (removedWild.length) {
      lines.push("**Removed:**");
      for (const w of removedWild) lines.push(`- \`export * from "${w}"\``);
      lines.push("");
    }
  }

  lines.push(`## Unchanged Exports (${unchanged.length})`);
  lines.push("");
  if (unchanged.length === 0) {
    lines.push("_(none)_");
  } else {
    for (const n of unchanged) lines.push(`- ${n}`);
  }
  lines.push("");

  lines.push("## Changed (needs manual review)");
  lines.push("");
  lines.push(
    "Exports that exist in both refs may have changed signatures or behavior.",
  );
  lines.push(
    "Run `git diff " +
      baseRef +
      ".." +
      headRef +
      " -- src/` for a full diff.",
  );
  lines.push("");

  console.log(lines.join("\n"));
}

main();
