#!/usr/bin/env node
/**
 * Vite Doctor v1.0 — Vite migration health check.
 *
 * Detects webpack remnants, stale imports, and CSS syntax issues
 * that can break Tailwind CSS v4 / @tailwindcss/vite.
 *
 * Checks (8):
 *  1. no-webpack-configs       Webpack config files in apps/packages
 *  2. no-webpack-deps          Webpack dependencies in package.json
 *  3. storybook-vite-types     Storybook type imports use react-vite
 *  4. css-import-syntax        CSS @import uses bare specifier (no url())
 *  5. css-import-order         CSS @import precedes @layer/@theme/@source
 *  6. no-babel-config          No .babelrc or babel.config.* files
 *  7. vite-config-exists       Every apps/mfe-* has vite.config.ts
 *  8. no-webpack-comments      No stale webpack references in configs
 *
 * Usage:
 *   node scripts/ops/vite-doctor.mjs [--json] [--fix]
 *
 * Exit: 0 = healthy, 1 = issues found
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');

const flags = new Set(process.argv.slice(2));
const JSON_MODE = flags.has('--json');
const FIX_MODE = flags.has('--fix');

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

function readSafe(filePath) {
  try { return readFileSync(filePath, 'utf-8'); } catch { return ''; }
}

/** Recursively find files matching a pattern */
function findFiles(dir, test, opts = {}) {
  const { exclude = [] } = opts;
  const found = [];
  if (!existsSync(dir)) return found;

  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    const rel = relative(ROOT, fullPath);

    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') continue;
    if (exclude.some(ex => rel.startsWith(ex))) continue;

    if (entry.isDirectory()) {
      found.push(...findFiles(fullPath, test, opts));
    } else if (test(entry.name, rel)) {
      found.push(rel);
    }
  }
  return found;
}

/** Find all CSS files in apps/ */
function findCssFiles() {
  return findFiles(join(ROOT, 'apps'), (name) => name.endsWith('.css'));
}

/* ------------------------------------------------------------------ */
/*  Check 1: No webpack config files                                   */
/* ------------------------------------------------------------------ */

check('no-webpack-configs', 'Webpack config files in apps/packages', () => {
  const webpackFiles = findFiles(ROOT, (name) => /^webpack\.\w+\.(js|ts|mjs|cjs)$/.test(name), {
    exclude: ['docs/', 'node_modules/', '.storybook/'],
  });

  if (webpackFiles.length === 0) {
    return { status: 'pass', message: 'No webpack config files found in source directories' };
  }

  return {
    status: 'fail',
    message: `${webpackFiles.length} webpack config file(s) found`,
    details: webpackFiles.slice(0, 10),
    fix: 'Remove webpack config files — build is now handled by Vite',
  };
});

/* ------------------------------------------------------------------ */
/*  Check 2: No webpack dependencies                                   */
/* ------------------------------------------------------------------ */

check('no-webpack-deps', 'Webpack dependencies in package.json', () => {
  const WEBPACK_PKGS = ['webpack', 'webpack-cli', 'webpack-dev-server', 'html-webpack-plugin',
    '@module-federation/webpack', 'css-loader', 'style-loader', 'babel-loader',
    'ts-loader', 'file-loader', 'url-loader', 'mini-css-extract-plugin'];

  const pkgFiles = findFiles(ROOT, (name) => name === 'package.json', {
    exclude: ['node_modules/', '.git/'],
  });

  const issues = [];
  for (const rel of pkgFiles) {
    const content = readSafe(join(ROOT, rel));
    let pkg;
    try { pkg = JSON.parse(content); } catch { continue; }

    const allDeps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
      ...pkg.peerDependencies,
    };

    for (const wpPkg of WEBPACK_PKGS) {
      if (allDeps[wpPkg]) {
        issues.push(`${rel}: ${wpPkg}@${allDeps[wpPkg]}`);
      }
    }
  }

  if (issues.length === 0) {
    return { status: 'pass', message: `No webpack dependencies in ${pkgFiles.length} package.json files` };
  }

  return {
    status: 'fail',
    message: `${issues.length} webpack dependency reference(s)`,
    details: issues.slice(0, 10),
    fix: 'Remove webpack packages from dependencies — Vite handles bundling',
  };
});

/* ------------------------------------------------------------------ */
/*  Check 3: Storybook type imports use react-vite                     */
/* ------------------------------------------------------------------ */

check('storybook-vite-types', 'Storybook type imports use @storybook/react-vite', () => {
  const storyFiles = findFiles(ROOT, (name) => name.endsWith('.stories.ts') || name.endsWith('.stories.tsx'), {
    exclude: ['node_modules/', 'dist/'],
  });

  const wp5Imports = [];
  for (const rel of storyFiles) {
    const content = readSafe(join(ROOT, rel));
    if (content.includes('@storybook/react-webpack5')) {
      wp5Imports.push(rel);
    }
  }

  if (wp5Imports.length === 0) {
    return { status: 'pass', message: `All ${storyFiles.length} story files use correct Storybook type imports` };
  }

  if (FIX_MODE) {
    let fixed = 0;
    for (const rel of wp5Imports) {
      const fullPath = join(ROOT, rel);
      const content = readFileSync(fullPath, 'utf-8');
      const updated = content.replace(/@storybook\/react-webpack5/g, '@storybook/react-vite');
      writeFileSync(fullPath, updated, 'utf-8');
      fixed++;
    }
    return {
      status: 'pass',
      message: `Fixed ${fixed} story file(s): react-webpack5 → react-vite`,
      details: wp5Imports.slice(0, 10),
    };
  }

  return {
    status: 'warn',
    message: `${wp5Imports.length} story file(s) import from @storybook/react-webpack5`,
    details: wp5Imports.slice(0, 10),
    fix: 'Run with --fix to auto-replace, or change to @storybook/react-vite',
  };
});

/* ------------------------------------------------------------------ */
/*  Check 4: CSS @import syntax (no url() wrapper)                     */
/* ------------------------------------------------------------------ */

check('css-import-syntax', 'CSS @import uses bare specifier (TW4 compatible)', () => {
  const cssFiles = findCssFiles();
  const issues = [];
  const fixable = [];

  for (const rel of cssFiles) {
    const fullPath = join(ROOT, rel);
    const content = readSafe(fullPath);
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Match @import url("...") or @import url('...')
      const m = line.match(/@import\s+url\(\s*['"]([^'"]+)['"]\s*\)/);
      if (m) {
        issues.push(`${rel}:${i + 1}: @import url("${m[1]}") → @import "${m[1]}"`);
        fixable.push({ file: fullPath, lineIndex: i, from: m[0], to: `@import "${m[1]}"` });
      }
    }
  }

  if (issues.length === 0) {
    return { status: 'pass', message: `All ${cssFiles.length} CSS files use correct @import syntax` };
  }

  if (FIX_MODE) {
    const fileMap = new Map();
    for (const f of fixable) {
      if (!fileMap.has(f.file)) fileMap.set(f.file, readFileSync(f.file, 'utf-8'));
      fileMap.set(f.file, fileMap.get(f.file).replace(f.from, f.to));
    }
    for (const [filePath, content] of fileMap) {
      writeFileSync(filePath, content, 'utf-8');
    }
    return {
      status: 'pass',
      message: `Fixed ${fixable.length} @import url() → @import bare specifier`,
      details: issues.slice(0, 10),
    };
  }

  return {
    status: 'fail',
    message: `${issues.length} CSS @import(s) use url() wrapper — breaks @tailwindcss/vite`,
    details: issues.slice(0, 10),
    fix: 'Run with --fix to auto-replace, or change @import url("x") to @import "x"',
  };
});

/* ------------------------------------------------------------------ */
/*  Check 5: CSS @import order                                         */
/* ------------------------------------------------------------------ */

check('css-import-order', 'CSS @import precedes @layer/@theme/@source', () => {
  const cssFiles = findCssFiles();
  const issues = [];

  for (const rel of cssFiles) {
    const content = readSafe(join(ROOT, rel));
    const lines = content.split('\n');

    let lastImportLine = -1;
    let firstNonImportDirective = -1;

    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      if (!trimmed || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('//')) continue;

      if (trimmed.startsWith('@import')) {
        if (firstNonImportDirective !== -1 && i > firstNonImportDirective) {
          issues.push(`${rel}:${i + 1}: @import after @layer/@theme/@source (line ${firstNonImportDirective + 1})`);
          break; // one issue per file is enough
        }
        lastImportLine = i;
      } else if (/^@(layer|theme|source|custom-variant)\b/.test(trimmed)) {
        if (firstNonImportDirective === -1) firstNonImportDirective = i;
      }
    }
  }

  if (issues.length === 0) {
    return { status: 'pass', message: 'All CSS @import statements precede other directives' };
  }

  return {
    status: 'fail',
    message: `${issues.length} CSS file(s) have @import after @layer/@theme`,
    details: issues.slice(0, 10),
    fix: 'Move all @import statements to the top of the CSS file, before @layer/@theme/@source',
  };
});

/* ------------------------------------------------------------------ */
/*  Check 6: No Babel config files                                     */
/* ------------------------------------------------------------------ */

check('no-babel-config', 'No Babel config files (Vite built-in JSX)', () => {
  const babelFiles = findFiles(ROOT, (name) => {
    return name === '.babelrc' || name === '.babelrc.js' || name === '.babelrc.json'
      || name.startsWith('babel.config');
  }, {
    exclude: ['node_modules/', 'dist/'],
  });

  if (babelFiles.length === 0) {
    return { status: 'pass', message: 'No Babel config files — Vite handles JSX natively' };
  }

  return {
    status: 'warn',
    message: `${babelFiles.length} Babel config file(s) found`,
    details: babelFiles.slice(0, 10),
    fix: 'Remove Babel configs — Vite uses esbuild/SWC for JSX transformation',
  };
});

/* ------------------------------------------------------------------ */
/*  Check 7: Vite config exists for all MFE apps                       */
/* ------------------------------------------------------------------ */

check('vite-config-exists', 'Every apps/mfe-* has vite.config.ts', () => {
  const appsDir = join(ROOT, 'apps');
  if (!existsSync(appsDir)) return { status: 'warn', message: 'apps/ directory not found' };

  const mfeDirs = readdirSync(appsDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && d.name.startsWith('mfe-'))
    .map(d => d.name);

  const missing = [];
  for (const dir of mfeDirs) {
    const viteConfig = join(appsDir, dir, 'vite.config.ts');
    if (!existsSync(viteConfig)) {
      missing.push(`apps/${dir}/vite.config.ts`);
    }
  }

  if (missing.length === 0) {
    return { status: 'pass', message: `All ${mfeDirs.length} MFE apps have vite.config.ts` };
  }

  return {
    status: 'fail',
    message: `${missing.length} MFE app(s) missing vite.config.ts`,
    details: missing,
    fix: 'Create vite.config.ts for each MFE app (use an existing one as template)',
  };
});

/* ------------------------------------------------------------------ */
/*  Check 8: No stale webpack references in config comments            */
/* ------------------------------------------------------------------ */

check('no-webpack-comments', 'No stale webpack references in config files', () => {
  const WEBPACK_REFS = ['webpack.common.js', 'webpack.dev.js', 'webpack.prod.js',
    'DefinePlugin', 'HtmlWebpackPlugin', 'ModuleFederationPlugin',
    'webpack-dev-server', 'InjectRuntimeEnv'];

  const configFiles = findFiles(ROOT, (name) => {
    return name === 'vite.config.ts' || name === 'vite.config.js'
      || (name.endsWith('.ts') && name.includes('config'));
  }, {
    exclude: ['node_modules/', 'dist/', 'docs/', 'scripts/'],
  });

  const issues = [];
  for (const rel of configFiles) {
    const content = readSafe(join(ROOT, rel));
    for (const ref of WEBPACK_REFS) {
      if (content.includes(ref)) {
        // Find which line
        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes(ref)) {
            const isComment = lines[i].trim().startsWith('//') || lines[i].trim().startsWith('/*') || lines[i].trim().startsWith('*');
            if (isComment) {
              issues.push(`${rel}:${i + 1}: comment references "${ref}"`);
            }
            break;
          }
        }
      }
    }
  }

  if (issues.length === 0) {
    return { status: 'pass', message: `No stale webpack references in ${configFiles.length} config files` };
  }

  return {
    status: 'warn',
    message: `${issues.length} stale webpack reference(s) in comments`,
    details: issues.slice(0, 10),
    fix: 'Remove or update comments that reference webpack — migration is complete',
  };
});

/* ------------------------------------------------------------------ */
/*  Output                                                             */
/* ------------------------------------------------------------------ */

const report = {
  tool: 'vite-doctor',
  version: '1.0.0',
  timestamp: new Date().toISOString(),
  summary: { pass: passCount, warn: warnCount, fail: failCount, total: results.length },
  checks: results,
};

if (JSON_MODE) {
  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
} else {
  const icon = (s) => s === 'pass' ? '\x1b[32m✓\x1b[0m' : s === 'warn' ? '\x1b[33m⚠\x1b[0m' : '\x1b[31m✗\x1b[0m';

  console.log('\n\x1b[1mVite Doctor v1.0\x1b[0m\n');

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
