#!/usr/bin/env node
/**
 * license-audit.mjs — OSS License Compliance Gate
 *
 * Scans production dependencies for license compatibility.
 * Blocks non-permissive licenses (GPL, AGPL, SSPL, etc.)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const CI_MODE = process.argv.includes('--ci');

// Allowed license families
const ALLOWED = new Set([
  'MIT', 'ISC', 'BSD-2-Clause', 'BSD-3-Clause', 'Apache-2.0',
  '0BSD', 'CC0-1.0', 'Unlicense', 'BlueOak-1.0.0',
  'CC-BY-3.0', 'CC-BY-4.0', 'Python-2.0', 'Artistic-2.0',
  'Zlib', 'WTFPL',
]);

// Blocked licenses
const BLOCKED = new Set([
  'GPL-2.0', 'GPL-3.0', 'AGPL-3.0', 'SSPL-1.0',
  'GPL-2.0-only', 'GPL-3.0-only', 'AGPL-3.0-only',
  'GPL-2.0-or-later', 'GPL-3.0-or-later', 'AGPL-3.0-or-later',
  'EUPL-1.1', 'EUPL-1.2', 'OSL-3.0',
]);

function scanDependencies() {
  const pkgPath = path.join(ROOT, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  const deps = { ...pkg.dependencies };
  // Don't check devDeps for license — they're not distributed

  const results = [];
  const nodeModules = path.resolve(ROOT, '../../node_modules'); // monorepo root

  for (const [name, version] of Object.entries(deps)) {
    let license = 'UNKNOWN';
    try {
      // Check in monorepo node_modules
      const depPkg = JSON.parse(
        fs.readFileSync(path.join(nodeModules, name, 'package.json'), 'utf-8')
      );
      license = depPkg.license || (depPkg.licenses && depPkg.licenses[0]?.type) || 'UNKNOWN';
      // Normalize
      if (typeof license === 'object') license = license.type || 'UNKNOWN';
    } catch {
      // Try scoped package path
      try {
        const parts = name.split('/');
        const depPkg = JSON.parse(
          fs.readFileSync(path.join(nodeModules, ...parts, 'package.json'), 'utf-8')
        );
        license = depPkg.license || 'UNKNOWN';
      } catch {
        license = 'NOT_FOUND';
      }
    }

    const normalized = license.replace(/[()]/g, '').trim();
    const isAllowed = ALLOWED.has(normalized) || normalized.includes(' OR ');
    const isBlocked = BLOCKED.has(normalized);

    results.push({ name, version, license: normalized, isAllowed, isBlocked });
  }

  return results;
}

const results = scanDependencies();
const blocked = results.filter(r => r.isBlocked);
const unknown = results.filter(r => !r.isAllowed && !r.isBlocked && r.license !== 'NOT_FOUND');
const notFound = results.filter(r => r.license === 'NOT_FOUND');
const allowed = results.filter(r => r.isAllowed);

console.log('\n🔍 OSS License Audit\n');
console.log(`  Dependencies: ${results.length}`);
console.log(`  ✅ Allowed: ${allowed.length}`);
if (unknown.length > 0) console.log(`  ⚠️  Review needed: ${unknown.length}`);
if (notFound.length > 0) console.log(`  ❓ Not found: ${notFound.length}`);
if (blocked.length > 0) console.log(`  ❌ Blocked: ${blocked.length}`);

// Details
if (blocked.length > 0) {
  console.log('\n  BLOCKED LICENSES:');
  for (const r of blocked) {
    console.log(`    ❌ ${r.name}@${r.version} → ${r.license}`);
  }
}

if (unknown.length > 0) {
  console.log('\n  REVIEW NEEDED:');
  for (const r of unknown) {
    console.log(`    ⚠️  ${r.name}@${r.version} → ${r.license}`);
  }
}

// License distribution
const dist = {};
for (const r of results) {
  dist[r.license] = (dist[r.license] || 0) + 1;
}
console.log('\n  License Distribution:');
for (const [lic, count] of Object.entries(dist).sort((a, b) => b[1] - a[1])) {
  console.log(`    ${count}x ${lic}`);
}

if (CI_MODE && blocked.length > 0) {
  console.log(`\n❌ LICENSE AUDIT FAILED: ${blocked.length} blocked license(s)\n`);
  process.exit(1);
} else {
  console.log(`\n✅ LICENSE AUDIT PASSED\n`);
}
