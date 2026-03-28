#!/usr/bin/env node
/**
 * Federation Doctor v1.0 — Module Federation health check.
 *
 * Checks (6):
 *  1. circular-remote-deps      Circular remote dependency detection
 *  2. remote-entry-reachable    remoteEntry.js HTTP accessibility
 *  3. import-matches-expose     Import/expose alignment
 *  4. shared-deps-consistency   Shared dependency parity with shell
 *  5. port-conflict             Port collision detection
 *  6. env-flag-consistency      Shell enable/disable flag validation
 *
 * Usage:
 *   node scripts/ops/federation-doctor.mjs [--json]
 *
 * Exit: 0 = healthy, 1 = issues found
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import http from 'node:http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');

const flags = new Set(process.argv.slice(2));
const JSON_MODE = flags.has('--json');

/* ------------------------------------------------------------------ */
/*  MFE Registry                                                       */
/* ------------------------------------------------------------------ */

const MFE_REGISTRY = [
  { name: 'mfe_shell',       dir: 'apps/mfe-shell',       port: 3000 },
  { name: 'mfe_suggestions', dir: 'apps/mfe-suggestions', port: 3001 },
  { name: 'mfe_ethic',       dir: 'apps/mfe-ethic',       port: 3002 },
  { name: 'mfe_users',       dir: 'apps/mfe-users',       port: 3004 },
  { name: 'mfe_access',      dir: 'apps/mfe-access',      port: 3005 },
  { name: 'mfe_audit',       dir: 'apps/mfe-audit',       port: 3006 },
  { name: 'mfe_reporting',   dir: 'apps/mfe-reporting',   port: 3007 },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
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

async function checkAsync(id, label, fn) {
  try {
    const result = await fn();
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

function readSafe(filePath) {
  try { return readFileSync(filePath, 'utf-8'); } catch { return ''; }
}

function httpGet(url, timeoutMs = 3000) {
  return new Promise((resolve) => {
    const req = http.get(url, { timeout: timeoutMs }, (res) => {
      resolve(res.statusCode);
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
  });
}

/** Parse remotes block from vite.config.ts content */
function parseRemotes(configContent) {
  const remotes = [];
  // Match remote entries like: mfe_shell: { ... entry: 'http://...' }
  // or mfe_xxx: { type: 'module', name: 'mfe_xxx', entry: '...' }
  const remotePattern = /(\w+):\s*\{\s*type:\s*['"]module['"]\s*,\s*name:\s*['"]([\w]+)['"]\s*,\s*entry:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = remotePattern.exec(configContent)) !== null) {
    remotes.push({ key: m[1], name: m[2], entry: m[3] });
  }
  // Also match shorthand: mfe_xxx: { type: 'module', name: 'mfe_xxx', entry: ... }
  // single-line pattern
  const singleLine = /(\w+):\s*\{[^}]*name:\s*['"]([\w]+)['"],[^}]*entry:\s*['"]([^'"]+)['"]/g;
  while ((m = singleLine.exec(configContent)) !== null) {
    if (!remotes.find(r => r.key === m[1])) {
      remotes.push({ key: m[1], name: m[2], entry: m[3] });
    }
  }
  return remotes;
}

/** Parse exposes block from vite.config.ts content */
function parseExposes(configContent) {
  const exposes = [];
  const exposePattern = /['"]\.\/(\w+)['"]\s*:\s*['"]\.\/(.*?)['"]/g;
  let m;
  while ((m = exposePattern.exec(configContent)) !== null) {
    exposes.push({ moduleKey: `./${m[1]}`, path: `./${m[2]}` });
  }
  return exposes;
}

/** Parse server port from vite.config.ts */
function parsePort(configContent) {
  const m = configContent.match(/port:\s*(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

/** Parse shared deps from vite.config.ts */
function parseSharedCore(configContent) {
  const deps = new Set();
  // Match singleton('package-name') calls in sharedCore block
  const coreBlock = configContent.match(/const sharedCore\s*=\s*\{([\s\S]*?)\};/);
  if (coreBlock) {
    const singletonPattern = /['"]([^'"]+)['"]\s*:\s*singleton\(/g;
    let m;
    while ((m = singletonPattern.exec(coreBlock[1])) !== null) {
      deps.add(m[1]);
    }
  }
  return deps;
}

/** Find all mfe_xxx/yyy imports in source files */
function findRemoteImports(srcDir) {
  const imports = [];
  if (!existsSync(srcDir)) return imports;

  try {
    const output = execSync(
      `grep -rn "from 'mfe_" "${srcDir}" --include="*.ts" --include="*.tsx" 2>/dev/null || true`,
      { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
    );
    for (const line of output.split('\n').filter(Boolean)) {
      const m = line.match(/from\s+['"](mfe_\w+)\/(\w+)['"]/);
      if (m) {
        const isTypeOnly = line.includes('import type');
        imports.push({
          file: line.split(':')[0],
          remoteName: m[1],
          moduleKey: `./${m[2]}`,
          typeOnly: isTypeOnly,
        });
      }
    }
  } catch { /* grep not found or error */ }

  return imports;
}

/* ------------------------------------------------------------------ */
/*  Load all configs                                                    */
/* ------------------------------------------------------------------ */

const mfeConfigs = new Map();
for (const mfe of MFE_REGISTRY) {
  const configPath = join(ROOT, mfe.dir, 'vite.config.ts');
  const content = readSafe(configPath);
  mfeConfigs.set(mfe.name, {
    ...mfe,
    configPath,
    content,
    remotes: parseRemotes(content),
    exposes: parseExposes(content),
    port: parsePort(content) ?? mfe.port,
    sharedCore: parseSharedCore(content),
  });
}

/* ------------------------------------------------------------------ */
/*  Check 1: Circular Remote Dependencies                              */
/* ------------------------------------------------------------------ */

check('circular-remote-deps', 'Circular remote dependency detection', () => {
  // Build edge list with imported module keys
  const edges = []; // { from, to }
  for (const [name, cfg] of mfeConfigs) {
    for (const remote of cfg.remotes) {
      edges.push({ from: name, to: remote.name });
    }
  }

  // Find bi-directional remote relationships
  const biDirectional = [];
  const seen = new Set();
  for (const e1 of edges) {
    for (const e2 of edges) {
      if (e1.from === e2.to && e1.to === e2.from) {
        const key = [e1.from, e1.to].sort().join(' <-> ');
        if (!seen.has(key)) {
          seen.add(key);

          // Check what each side actually imports from the other
          const aDir = join(ROOT, mfeConfigs.get(e1.from).dir, 'src');
          const bDir = join(ROOT, mfeConfigs.get(e1.to).dir, 'src');
          const aImports = findRemoteImports(aDir).filter(i => i.remoteName === e1.to).map(i => i.moduleKey);
          const bImports = findRemoteImports(bDir).filter(i => i.remoteName === e1.from).map(i => i.moduleKey);
          const aUniq = [...new Set(aImports)];
          const bUniq = [...new Set(bImports)];

          // Same module imported both ways = true circular = FAIL
          const overlap = aUniq.filter(m => bUniq.includes(m));
          const isTrueCircular = overlap.length > 0;

          biDirectional.push({
            pair: key,
            aModules: aUniq,
            bModules: bUniq,
            overlap,
            isTrueCircular,
          });
        }
      }
    }
  }

  if (biDirectional.length === 0) {
    return { status: 'pass', message: `No circular dependencies among ${edges.length} remote edges` };
  }

  const trueCycles = biDirectional.filter(c => c.isTrueCircular);
  const hostRemote = biDirectional.filter(c => !c.isTrueCircular);

  if (trueCycles.length > 0) {
    return {
      status: 'fail',
      message: `${trueCycles.length} true circular dependency (same module imported both ways)`,
      details: trueCycles.map(c => `${c.pair} — overlapping modules: ${c.overlap.join(', ')}`),
      fix: 'Break the cycle: move shared code to a @mfe/* package or remove the reverse remote import',
    };
  }

  // Different modules = host/remote pattern (acceptable)
  return {
    status: 'pass',
    message: `${hostRemote.length} bi-directional remote(s) detected (different modules, no true cycle)`,
    details: hostRemote.map(c => {
      const [a, b] = c.pair.split(' <-> ');
      return `${c.pair}: ${a} imports [${c.bModules.join(', ')}], ${b} imports [${c.aModules.join(', ')}]`;
    }),
  };
});

/* ------------------------------------------------------------------ */
/*  Check 3: Import matches Expose                                     */
/* ------------------------------------------------------------------ */

check('import-matches-expose', 'Remote import/expose alignment', () => {
  const mismatches = [];

  for (const [name, cfg] of mfeConfigs) {
    const srcDir = join(ROOT, cfg.dir, 'src');
    const imports = findRemoteImports(srcDir);

    for (const imp of imports) {
      const targetCfg = mfeConfigs.get(imp.remoteName);
      if (!targetCfg) {
        mismatches.push(`${relative(ROOT, imp.file)}: imports '${imp.remoteName}/${imp.moduleKey}' but ${imp.remoteName} not in registry`);
        continue;
      }
      const exposed = targetCfg.exposes.find(e => e.moduleKey === imp.moduleKey);
      if (!exposed && !imp.typeOnly) {
        mismatches.push(`${relative(ROOT, imp.file)}: imports '${imp.remoteName}/${imp.moduleKey.slice(2)}' but ${imp.remoteName} does not expose '${imp.moduleKey}'`);
      }
    }
  }

  if (mismatches.length === 0) {
    return { status: 'pass', message: 'All remote imports match exposed modules' };
  }

  return {
    status: 'fail',
    message: `${mismatches.length} import/expose mismatch(es)`,
    details: mismatches.slice(0, 10),
    fix: 'Add missing module to exposes in the target MFE vite.config.ts, or remove the import',
  };
});

/* ------------------------------------------------------------------ */
/*  Check 4: Shared Dependencies Consistency                           */
/* ------------------------------------------------------------------ */

check('shared-deps-consistency', 'Shared dependency parity with shell', () => {
  const shellCfg = mfeConfigs.get('mfe_shell');
  if (!shellCfg || shellCfg.sharedCore.size === 0) {
    return { status: 'warn', message: 'Could not parse shell sharedCore block' };
  }

  const drifts = [];
  for (const [name, cfg] of mfeConfigs) {
    if (name === 'mfe_shell') continue;
    if (cfg.sharedCore.size === 0) continue;

    for (const dep of shellCfg.sharedCore) {
      if (!cfg.sharedCore.has(dep)) {
        drifts.push(`${name} missing shared singleton: ${dep}`);
      }
    }
  }

  if (drifts.length === 0) {
    return { status: 'pass', message: `All remotes share ${shellCfg.sharedCore.size} core singletons with shell` };
  }

  return {
    status: 'warn',
    message: `${drifts.length} shared dependency drift(s)`,
    details: drifts.slice(0, 10),
    fix: 'Align sharedCore in remote vite.config.ts with shell',
  };
});

/* ------------------------------------------------------------------ */
/*  Check 5: Port Conflict                                             */
/* ------------------------------------------------------------------ */

check('port-conflict', 'Port collision detection', () => {
  const portMap = new Map(); // port -> [name]
  for (const [name, cfg] of mfeConfigs) {
    if (!cfg.port) continue;
    if (!portMap.has(cfg.port)) portMap.set(cfg.port, []);
    portMap.get(cfg.port).push(name);
  }

  const conflicts = [];
  for (const [port, names] of portMap) {
    if (names.length > 1) {
      conflicts.push(`Port ${port}: ${names.join(', ')}`);
    }
  }

  if (conflicts.length === 0) {
    return { status: 'pass', message: `${portMap.size} unique ports, no conflicts` };
  }

  return {
    status: 'fail',
    message: `${conflicts.length} port conflict(s)`,
    details: conflicts,
    fix: 'Change server.port in the conflicting MFE vite.config.ts',
  };
});

/* ------------------------------------------------------------------ */
/*  Check 6: Environment Flag Consistency                              */
/* ------------------------------------------------------------------ */

check('env-flag-consistency', 'Shell enable/disable flag validation', () => {
  const shellCfg = mfeConfigs.get('mfe_shell');
  if (!shellCfg) return { status: 'warn', message: 'Shell config not found' };

  // Collect unique flag names from shell config
  const flagSet = new Set();
  const flagPattern = /SHELL_ENABLE_(\w+)_REMOTE/g;
  let m;
  while ((m = flagPattern.exec(shellCfg.content)) !== null) {
    flagSet.add(m[1].toLowerCase());
  }

  // All non-shell MFEs that shell references (via mfe_xxx patterns in return block)
  const mfePattern = /mfe_(\w+):\s*\{/g;
  const referencedRemotes = new Set();
  while ((m = mfePattern.exec(shellCfg.content)) !== null) {
    if (m[1] !== 'shell') referencedRemotes.add(m[1]);
  }

  const issues = [];
  for (const remote of referencedRemotes) {
    if (!flagSet.has(remote)) {
      issues.push(`${remote}: no SHELL_ENABLE_*_REMOTE flag (always enabled or hardcoded)`);
    }
  }

  if (issues.length === 0) {
    return { status: 'pass', message: `${flagSet.size} env flags found for ${referencedRemotes.size} remotes` };
  }

  return {
    status: 'warn',
    message: `${issues.length} remote(s) without env toggle`,
    details: issues,
  };
});

/* ------------------------------------------------------------------ */
/*  Check 2: Remote Entry Reachable (async)                            */
/* ------------------------------------------------------------------ */

await checkAsync('remote-entry-reachable', 'remoteEntry.js HTTP accessibility', async () => {
  const statuses = [];
  const down = [];

  for (const mfe of MFE_REGISTRY) {
    const url = `http://127.0.0.1:${mfe.port}/remoteEntry.js`;
    const status = await httpGet(url);
    statuses.push({ name: mfe.name, port: mfe.port, httpStatus: status });
    if (status !== 200) {
      down.push(`${mfe.name} (:${mfe.port}) — ${status === null ? 'unreachable' : `HTTP ${status}`}`);
    }
  }

  if (down.length === 0) {
    return { status: 'pass', message: `All ${MFE_REGISTRY.length} remoteEntry endpoints responding` };
  }

  return {
    status: 'warn',
    message: `${down.length}/${MFE_REGISTRY.length} remote(s) not reachable`,
    details: down,
    fix: 'Start the MFE dev server: pnpm start in the MFE directory',
  };
});

/* ------------------------------------------------------------------ */
/*  Output                                                             */
/* ------------------------------------------------------------------ */

const report = {
  tool: 'federation-doctor',
  version: '1.0.0',
  timestamp: new Date().toISOString(),
  summary: { pass: passCount, warn: warnCount, fail: failCount, total: results.length },
  checks: results,
};

if (JSON_MODE) {
  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
} else {
  const icon = (s) => s === 'pass' ? '\x1b[32m✓\x1b[0m' : s === 'warn' ? '\x1b[33m⚠\x1b[0m' : '\x1b[31m✗\x1b[0m';

  console.log('\n\x1b[1mFederation Doctor v1.0\x1b[0m\n');

  for (const r of results) {
    console.log(`  ${icon(r.status)}  ${r.label}`);
    console.log(`     ${r.message}`);
    if (r.details && r.details.length > 0) {
      for (const d of r.details.slice(0, 5)) {
        console.log(`       → ${d}`);
      }
      if (r.details.length > 5) console.log(`       … and ${r.details.length - 5} more`);
    }
    if (r.fix) console.log(`     \x1b[36mFix:\x1b[0m ${r.fix}`);
    console.log();
  }

  const total = passCount + warnCount + failCount;
  console.log(`  \x1b[1mSummary:\x1b[0m ${passCount}/${total} pass, ${warnCount} warn, ${failCount} fail\n`);
}

if (failCount > 0) process.exit(1);
