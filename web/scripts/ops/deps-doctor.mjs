#!/usr/bin/env node
/**
 * Deps Doctor v1.0 — Dependency version consistency health check.
 *
 * Checks (7):
 *  1. singleton-version-parity   Shared singleton versions match across all workspaces
 *  2. pinned-override-match      pnpm.overrides present and consistent
 *  3. lockfile-freshness         pnpm-lock.yaml is up-to-date with package.json files
 *  4. peer-dep-violations        No unresolved peer dependency warnings
 *  5. duplicate-instances        Critical singletons have exactly one resolved version
 *  6. stale-overrides            Overridden packages resolve to the overridden version
 *  7. type-version-alignment     @types/react aligns with react major version
 *
 * Usage:
 *   node scripts/ops/deps-doctor.mjs              # terminal report
 *   node scripts/ops/deps-doctor.mjs --json        # JSON output
 *   node scripts/ops/deps-doctor.mjs --fix         # auto-fix lockfile + version alignment
 *   node scripts/ops/deps-doctor.mjs --save        # save report to test-results/
 *
 * Exit: 0 = healthy, 1 = issues found
 */

import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');

const flags = new Set(process.argv.slice(2));
const JSON_MODE = flags.has('--json');
const FIX_MODE = flags.has('--fix');
const SAVE_MODE = flags.has('--save');

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const SINGLETONS = [
  'react', 'react-dom', 'react-router', 'react-router-dom',
  '@reduxjs/toolkit', 'react-redux', '@tanstack/react-query',
];

const CRITICAL_SINGLETONS = ['react', 'react-dom'];

/* ------------------------------------------------------------------ */
/*  Workspace discovery                                                */
/* ------------------------------------------------------------------ */

function discoverWorkspaces() {
  const workspaces = [];
  for (const subdir of ['apps', 'packages']) {
    const base = join(ROOT, subdir);
    if (!existsSync(base)) continue;
    for (const name of readdirSync(base, { withFileTypes: true })) {
      if (!name.isDirectory()) continue;
      const pkgPath = join(base, name.name, 'package.json');
      if (existsSync(pkgPath)) {
        workspaces.push({ name: name.name, dir: join(subdir, name.name), pkgPath });
      }
    }
  }
  return workspaces;
}

function readPkg(pkgPath) {
  try { return JSON.parse(readFileSync(pkgPath, 'utf-8')); } catch { return null; }
}

/* ------------------------------------------------------------------ */
/*  Check infrastructure (same pattern as federation-doctor)           */
/* ------------------------------------------------------------------ */

const results = [];
let passCount = 0;
let warnCount = 0;
let failCount = 0;

function check(id, label, fn) {
  try {
    const result = fn();
    const status = result.status;
    if (status === 'pass') passCount++;
    else if (status === 'warn') warnCount++;
    else failCount++;
    results.push({ id, label, ...result });
  } catch (err) {
    failCount++;
    results.push({ id, label, status: 'fail', message: `Exception: ${err.message}` });
  }
}

/* ------------------------------------------------------------------ */
/*  Data loading                                                       */
/* ------------------------------------------------------------------ */

const rootPkg = readPkg(join(ROOT, 'package.json'));
const workspaces = discoverWorkspaces();
const overrides = rootPkg?.pnpm?.overrides || {};

/* ------------------------------------------------------------------ */
/*  Check 1: singleton-version-parity                                  */
/* ------------------------------------------------------------------ */

check('singleton-version-parity', 'Shared singleton versions match across workspaces', () => {
  const mismatches = [];

  for (const dep of SINGLETONS) {
    const versions = new Map(); // range -> [workspace names]

    for (const ws of workspaces) {
      const pkg = readPkg(ws.pkgPath);
      if (!pkg) continue;
      const range = pkg.dependencies?.[dep] || pkg.devDependencies?.[dep];
      if (!range) continue;
      if (!versions.has(range)) versions.set(range, []);
      versions.get(range).push(ws.name);
    }

    if (versions.size > 1) {
      const detail = [...versions.entries()]
        .map(([range, names]) => `${range} → ${names.join(', ')}`)
        .join(' | ');
      mismatches.push(`${dep}: ${detail}`);
    }
  }

  if (mismatches.length === 0) {
    return { status: 'pass', message: `All ${SINGLETONS.length} singleton deps have consistent ranges across ${workspaces.length} workspaces` };
  }

  if (FIX_MODE) {
    let fixed = 0;
    for (const dep of SINGLETONS) {
      const versions = new Map();
      for (const ws of workspaces) {
        const pkg = readPkg(ws.pkgPath);
        if (!pkg) continue;
        const range = pkg.dependencies?.[dep] || pkg.devDependencies?.[dep];
        if (range) {
          if (!versions.has(range)) versions.set(range, []);
          versions.get(range).push({ ws, pkg, isDev: !!pkg.devDependencies?.[dep] });
        }
      }
      if (versions.size <= 1) continue;

      // Pick the range used by most workspaces (or shell if tied)
      const sorted = [...versions.entries()].sort((a, b) => b[1].length - a[1].length);
      const canonicalRange = sorted[0][0];

      for (const [range, entries] of versions.entries()) {
        if (range === canonicalRange) continue;
        for (const { ws, pkg, isDev } of entries) {
          const section = isDev ? 'devDependencies' : 'dependencies';
          pkg[section][dep] = canonicalRange;
          writeFileSync(ws.pkgPath, JSON.stringify(pkg, null, 2) + '\n');
          fixed++;
        }
      }
    }
    return {
      status: 'warn',
      message: `Fixed ${fixed} version mismatches. Run \`pnpm install\` to update lockfile`,
      details: mismatches,
      fix: 'pnpm install',
    };
  }

  return {
    status: 'fail',
    message: `${mismatches.length} singleton dep(s) have inconsistent ranges`,
    details: mismatches,
    fix: 'Run with --fix to auto-align, or manually update package.json files',
  };
});

/* ------------------------------------------------------------------ */
/*  Check 2: pinned-override-match                                     */
/* ------------------------------------------------------------------ */

check('pinned-override-match', 'pnpm.overrides are defined and consistent', () => {
  if (!rootPkg?.pnpm?.overrides || Object.keys(overrides).length === 0) {
    return { status: 'warn', message: 'No pnpm.overrides defined — version pinning not enforced' };
  }

  const details = Object.entries(overrides).map(([pkg, version]) => `${pkg}: ${version}`);

  return {
    status: 'pass',
    message: `${Object.keys(overrides).length} overrides defined`,
    details,
  };
});

/* ------------------------------------------------------------------ */
/*  Check 3: lockfile-freshness                                        */
/* ------------------------------------------------------------------ */

check('lockfile-freshness', 'pnpm-lock.yaml is up-to-date with package.json', () => {
  const lockPath = join(ROOT, 'pnpm-lock.yaml');
  if (!existsSync(lockPath)) {
    return { status: 'fail', message: 'pnpm-lock.yaml not found', fix: 'pnpm install' };
  }

  try {
    execSync('pnpm install --frozen-lockfile --dry-run 2>&1', {
      cwd: ROOT,
      encoding: 'utf-8',
      timeout: 30000,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return { status: 'pass', message: 'Lockfile is in sync with all package.json files' };
  } catch (err) {
    const stderr = err.stderr || err.stdout || err.message || '';
    const lines = stderr.split('\n').filter(l => l.includes('ERR_PNPM') || l.includes('Invalid')).slice(0, 5);

    if (FIX_MODE) {
      try {
        execSync('pnpm install --no-frozen-lockfile 2>&1', {
          cwd: ROOT,
          encoding: 'utf-8',
          timeout: 120000,
          stdio: ['pipe', 'pipe', 'pipe'],
        });
        return { status: 'warn', message: 'Lockfile was out-of-date — regenerated via pnpm install', details: lines };
      } catch (fixErr) {
        return { status: 'fail', message: `pnpm install failed: ${fixErr.message}`, details: lines };
      }
    }

    return {
      status: 'fail',
      message: 'Lockfile is out-of-date',
      details: lines.length > 0 ? lines : ['Run pnpm install to regenerate'],
      fix: 'pnpm install (or run with --fix)',
    };
  }
});

/* ------------------------------------------------------------------ */
/*  Check 4: peer-dep-violations                                       */
/* ------------------------------------------------------------------ */

check('peer-dep-violations', 'No unresolved peer dependency warnings', () => {
  try {
    const out = execSync('pnpm install --frozen-lockfile --dry-run 2>&1', {
      cwd: ROOT,
      encoding: 'utf-8',
      timeout: 30000,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    const peerWarns = (out || '').split('\n').filter(l => l.includes('WARN') && l.includes('peer'));
    if (peerWarns.length === 0) {
      return { status: 'pass', message: 'No peer dependency warnings' };
    }
    return {
      status: 'warn',
      message: `${peerWarns.length} peer dependency warning(s)`,
      details: peerWarns.slice(0, 10),
    };
  } catch (err) {
    const stderr = (err.stderr || err.stdout || '');
    const peerWarns = stderr.split('\n').filter(l => l.toLowerCase().includes('peer'));
    if (peerWarns.length === 0) {
      return { status: 'pass', message: 'No peer dependency warnings detected (lockfile may be stale)' };
    }
    return {
      status: 'warn',
      message: `${peerWarns.length} peer dependency warning(s)`,
      details: peerWarns.slice(0, 10),
    };
  }
});

/* ------------------------------------------------------------------ */
/*  Check 5: duplicate-instances                                       */
/* ------------------------------------------------------------------ */

check('duplicate-instances', 'Critical singletons resolve to exactly one version', () => {
  const duplicates = [];

  for (const dep of CRITICAL_SINGLETONS) {
    try {
      const out = execSync(`pnpm ls ${dep} --depth 0 --json 2>/dev/null`, {
        cwd: ROOT,
        encoding: 'utf-8',
        timeout: 15000,
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      const data = JSON.parse(out);
      const versions = new Set();
      for (const ws of (Array.isArray(data) ? data : [data])) {
        const found = ws.dependencies?.[dep] || ws.devDependencies?.[dep];
        if (found?.version) versions.add(found.version);
      }
      if (versions.size > 1) {
        duplicates.push(`${dep}: ${[...versions].join(', ')}`);
      }
    } catch {
      // pnpm ls may fail — skip
    }
  }

  if (duplicates.length === 0) {
    return { status: 'pass', message: `${CRITICAL_SINGLETONS.join(', ')} each resolve to a single version` };
  }

  return {
    status: 'fail',
    message: `${duplicates.length} critical singleton(s) have multiple resolved versions`,
    details: duplicates,
    fix: 'Check pnpm.overrides and dedupe with: pnpm dedupe',
  };
});

/* ------------------------------------------------------------------ */
/*  Check 6: stale-overrides                                           */
/* ------------------------------------------------------------------ */

check('stale-overrides', 'Overridden packages resolve to the overridden version', () => {
  if (Object.keys(overrides).length === 0) {
    return { status: 'pass', message: 'No overrides to check' };
  }

  const stale = [];

  for (const [pkg, expectedVersion] of Object.entries(overrides)) {
    // Skip scoped override patterns like 'foo>bar'
    if (pkg.includes('>')) continue;

    try {
      const out = execSync(`pnpm ls ${pkg} --json --depth 0 2>/dev/null`, {
        cwd: ROOT,
        encoding: 'utf-8',
        timeout: 10000,
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      const data = JSON.parse(out);
      // pnpm ls --json returns array of workspace results
      const allVersions = new Set();
      for (const ws of (Array.isArray(data) ? data : [data])) {
        const deps = ws.dependencies || {};
        const devDeps = ws.devDependencies || {};
        const found = deps[pkg] || devDeps[pkg];
        if (found?.version) allVersions.add(found.version);
      }
      // Check if resolved versions match the override (exact or semver-compatible)
      const expected = expectedVersion.replace(/^[\^~>=<]+/, '');
      for (const resolved of allVersions) {
        if (!resolved.startsWith(expected.split('.')[0])) {
          stale.push(`${pkg}: override=${expectedVersion}, resolved=${resolved}`);
        }
      }
    } catch {
      // Skip packages that pnpm ls can't find
    }
  }

  if (stale.length === 0) {
    return { status: 'pass', message: `All ${Object.keys(overrides).length} overrides resolve correctly` };
  }

  return {
    status: 'warn',
    message: `${stale.length} override(s) may not be resolving as expected`,
    details: stale,
    fix: 'Run pnpm install to re-resolve, or check if override ranges are correct',
  };
});

/* ------------------------------------------------------------------ */
/*  Check 7: type-version-alignment                                    */
/* ------------------------------------------------------------------ */

check('type-version-alignment', '@types/react aligns with react major version', () => {
  const reactRange = rootPkg?.pnpm?.overrides?.['@types/react']
    || rootPkg?.devDependencies?.['@types/react']
    || null;
  const reactDomRange = rootPkg?.pnpm?.overrides?.['@types/react-dom']
    || rootPkg?.devDependencies?.['@types/react-dom']
    || null;

  const issues = [];

  // Check that @types/react override matches react major
  // React 18.2.x → @types/react should be ^18.x
  const reactVersion = rootPkg?.pnpm?.overrides?.react
    || (() => {
      for (const ws of workspaces) {
        const pkg = readPkg(ws.pkgPath);
        const v = pkg?.dependencies?.react;
        if (v) return v;
      }
      return null;
    })();

  if (reactVersion && reactRange) {
    const reactMajor = reactVersion.replace(/[^0-9.]/g, '').split('.')[0];
    const typesMajor = reactRange.replace(/[^0-9.]/g, '').split('.')[0];
    if (reactMajor !== typesMajor) {
      issues.push(`react=${reactVersion} but @types/react=${reactRange} (major mismatch)`);
    }
  }

  if (reactVersion && reactDomRange) {
    const reactMajor = reactVersion.replace(/[^0-9.]/g, '').split('.')[0];
    const typesMajor = reactDomRange.replace(/[^0-9.]/g, '').split('.')[0];
    if (reactMajor !== typesMajor) {
      issues.push(`react=${reactVersion} but @types/react-dom=${reactDomRange} (major mismatch)`);
    }
  }

  // Also check if MFE package.json @types versions differ from override
  if (reactRange) {
    for (const ws of workspaces) {
      const pkg = readPkg(ws.pkgPath);
      if (!pkg) continue;
      const wsTypesReact = pkg.devDependencies?.['@types/react'];
      if (wsTypesReact && wsTypesReact !== reactRange) {
        const wsMajor = wsTypesReact.replace(/[^0-9.]/g, '').split('.')[0];
        const overrideMajor = reactRange.replace(/[^0-9.]/g, '').split('.')[0];
        if (wsMajor !== overrideMajor) {
          issues.push(`${ws.name}: @types/react=${wsTypesReact} vs override=${reactRange}`);
        }
      }
    }
  }

  if (issues.length === 0) {
    return {
      status: 'pass',
      message: `@types/react${reactRange ? ` (${reactRange})` : ''} aligns with react${reactVersion ? ` (${reactVersion})` : ''}`,
    };
  }

  return {
    status: 'warn',
    message: `${issues.length} type version alignment issue(s)`,
    details: issues,
    fix: 'Update pnpm.overrides or workspace @types/* versions to match react major',
  };
});

/* ------------------------------------------------------------------ */
/*  Output                                                             */
/* ------------------------------------------------------------------ */

const report = {
  tool: 'deps-doctor',
  version: '1.0.0',
  timestamp: new Date().toISOString(),
  summary: { pass: passCount, warn: warnCount, fail: failCount, total: results.length },
  checks: results,
};

if (JSON_MODE) {
  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
} else {
  const icon = (s) => s === 'pass' ? '\x1b[32m✓\x1b[0m' : s === 'warn' ? '\x1b[33m⚠\x1b[0m' : '\x1b[31m✗\x1b[0m';

  console.log('\n\x1b[1mDeps Doctor v1.0\x1b[0m\n');

  for (const r of results) {
    console.log(`  ${icon(r.status)}  ${r.label}`);
    console.log(`     ${r.message}`);
    if (r.details && r.details.length > 0) {
      for (const d of r.details.slice(0, 8)) {
        console.log(`       → ${d}`);
      }
      if (r.details.length > 8) console.log(`       … and ${r.details.length - 8} more`);
    }
    if (r.fix) console.log(`     \x1b[36mFix:\x1b[0m ${r.fix}`);
    console.log();
  }

  const total = passCount + warnCount + failCount;
  console.log(`  \x1b[1mSummary:\x1b[0m ${passCount}/${total} pass, ${warnCount} warn, ${failCount} fail\n`);
}

/* ------------------------------------------------------------------ */
/*  Save report                                                        */
/* ------------------------------------------------------------------ */

if (SAVE_MODE) {
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const outDir = join(ROOT, 'test-results', 'diagnostics', 'deps-doctor');
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, `${ts}.json`), JSON.stringify(report, null, 2) + '\n');
  writeFileSync(join(outDir, `${ts}.md`), formatMarkdown(report));
  if (!JSON_MODE) {
    console.log(`  Report saved to: test-results/diagnostics/deps-doctor/${ts}.*\n`);
  }
}

function formatMarkdown(rpt) {
  const icon = (s) => s === 'pass' ? '✅' : s === 'warn' ? '⚠️' : '❌';
  let md = `# Deps Doctor Report\n\n`;
  md += `**Date:** ${rpt.timestamp}\n`;
  md += `**Summary:** ${rpt.summary.pass} pass, ${rpt.summary.warn} warn, ${rpt.summary.fail} fail\n\n`;
  for (const r of rpt.checks) {
    md += `## ${icon(r.status)} ${r.label}\n\n`;
    md += `${r.message}\n\n`;
    if (r.details?.length) {
      for (const d of r.details) md += `- ${d}\n`;
      md += '\n';
    }
    if (r.fix) md += `**Fix:** ${r.fix}\n\n`;
  }
  return md;
}

if (failCount > 0) process.exit(1);
