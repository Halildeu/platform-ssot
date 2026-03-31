#!/usr/bin/env node
/**
 * taxonomy-check.mjs
 *
 * Validates that every catalog entry's taxonomyGroupId + taxonomySubgroup
 * exist in the canonical taxonomy JSON. Catches typos and orphan entries
 * that would silently disappear from the Design Lab sidebar.
 *
 * Usage:
 *   node scripts/ci/taxonomy-check.mjs [--ci]
 *
 * Exit codes:
 *   0 = all entries valid
 *   1 = orphan entries found (--ci mode)
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../..");
const SHELL_ROOT = resolve(ROOT, "../../apps/mfe-shell/src/pages/admin");

const ciMode = process.argv.includes("--ci");

/* ------------------------------------------------------------------ */
/*  Load taxonomy JSON                                                 */
/* ------------------------------------------------------------------ */

const taxonomyPath = resolve(SHELL_ROOT, "design-lab.taxonomy.v1.json");
let taxonomy;
try {
  taxonomy = JSON.parse(readFileSync(taxonomyPath, "utf-8"));
} catch (e) {
  console.error(`❌ Cannot read taxonomy JSON: ${taxonomyPath}`);
  console.error(e.message);
  process.exit(1);
}

// Build lookup: groupId → Set<subgroupLabel>
const groupSubgroups = new Map();
for (const group of taxonomy.groups ?? []) {
  groupSubgroups.set(group.id, new Set(group.subgroups ?? []));
}

/* ------------------------------------------------------------------ */
/*  Load catalog entries                                               */
/* ------------------------------------------------------------------ */

// Dynamic import of TS catalog is not possible in plain Node,
// so we parse the .doc.ts files directly for taxonomyGroupId/taxonomySubgroup.
import { globSync } from "fs";
let entryFiles;
try {
  // Node 22+ has globSync on fs
  const { globSync: gs } = await import("node:fs");
  entryFiles = gs(resolve(ROOT, "src/catalog/component-docs/entries/*.doc.ts"));
} catch {
  // Fallback: manual glob
  const { readdirSync } = await import("node:fs");
  const dir = resolve(ROOT, "src/catalog/component-docs/entries");
  entryFiles = readdirSync(dir)
    .filter((f) => f.endsWith(".doc.ts"))
    .map((f) => resolve(dir, f));
}

/* ------------------------------------------------------------------ */
/*  Check each entry                                                   */
/* ------------------------------------------------------------------ */

const orphans = [];

for (const file of entryFiles) {
  const content = readFileSync(file, "utf-8");

  // Extract taxonomyGroupId
  const groupMatch = content.match(/taxonomyGroupId:\s*["']([^"']+)["']/);
  const subgroupMatch = content.match(/taxonomySubgroup:\s*["']([^"']+)["']/);

  if (!groupMatch || !subgroupMatch) continue; // skip entries without taxonomy fields

  const groupId = groupMatch[1];
  const subgroup = subgroupMatch[1];
  const name = file.split("/").pop().replace(".doc.ts", "");

  const validGroup = groupSubgroups.has(groupId);
  const validSubgroup = validGroup && groupSubgroups.get(groupId).has(subgroup);

  if (!validGroup) {
    orphans.push({
      name,
      issue: `taxonomyGroupId "${groupId}" not found in taxonomy JSON`,
      groupId,
      subgroup,
    });
  } else if (!validSubgroup) {
    orphans.push({
      name,
      issue: `taxonomySubgroup "${subgroup}" not found in group "${groupId}"`,
      groupId,
      subgroup,
      availableSubgroups: [...groupSubgroups.get(groupId)],
    });
  }
}

/* ------------------------------------------------------------------ */
/*  Report                                                             */
/* ------------------------------------------------------------------ */

if (orphans.length === 0) {
  console.log(`✅ All ${entryFiles.length} catalog entries have valid taxonomy mappings.`);
  process.exit(0);
}

console.log(`\n⚠️  ${orphans.length} catalog entries have invalid taxonomy mappings:\n`);

for (const o of orphans) {
  console.log(`  ❌ ${o.name}`);
  console.log(`     ${o.issue}`);
  if (o.availableSubgroups) {
    console.log(`     Available subgroups: ${o.availableSubgroups.join(", ")}`);
  }
  console.log();
}

console.log(
  "Fix: update taxonomyGroupId/taxonomySubgroup in the .doc.ts file,",
  "or add the missing subgroup to design-lab.taxonomy.v1.json.\n",
);

process.exit(ciMode ? 1 : 0);
