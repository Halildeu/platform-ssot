#!/usr/bin/env node
/**
 * Compatibility CI Matrix
 *
 * Validates the design-system package works across different environments:
 *   1. Node version check (engines field or >= 18)
 *   2. React 18 SSR compatibility (renderToString with Button, Input, Select)
 *   3. ESM import test
 *   4. CJS require test
 *   5. TypeScript types test (tsc --noEmit)
 *   6. Subpath exports resolution test
 *   7. React 19 compatibility (peerDeps + deprecated API scan)
 *
 * Usage: node scripts/ci/compat-matrix.mjs
 */
import { execSync, spawnSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  readdirSync,
  rmSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_DIR = join(__dirname, "..", "..");

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const results = [];

function record(name, pass, detail = "") {
  results.push({ name, pass, detail });
  const icon = pass ? "\u2713" : "\u2717";
  console.log(`  ${icon} ${name}${detail ? ` — ${detail}` : ""}`);
}

function run(cmd, opts = {}) {
  return execSync(cmd, { encoding: "utf-8", stdio: "pipe", ...opts }).trim();
}

function runSafe(cmd, opts = {}) {
  try {
    return { ok: true, output: run(cmd, opts) };
  } catch (e) {
    return { ok: false, output: e.stderr || e.stdout || e.message };
  }
}

/**
 * Create stub modules for optional peer deps (@mfe/shared-http, @mfe/shared-types)
 * so that the packed bundle can resolve them at runtime.
 * Pattern taken from consumer-smoke.mjs.
 */
function createPeerStubs(tmpDir) {
  const mfeDir = join(tmpDir, "node_modules", "@mfe");
  for (const pkg of ["shared-http", "shared-types"]) {
    const stubDir = join(mfeDir, pkg);
    mkdirSync(stubDir, { recursive: true });
    writeFileSync(
      join(stubDir, "package.json"),
      JSON.stringify({
        name: `@mfe/${pkg}`,
        version: "0.0.0-stub",
        main: "./index.cjs",
        exports: {
          ".": {
            import: "./index.mjs",
            require: "./index.cjs",
          },
        },
      })
    );
    writeFileSync(
      join(stubDir, "index.mjs"),
      [
        `const handler = { get: (_, prop) => prop === '__esModule' ? true : () => {} };`,
        `const stub = new Proxy({}, handler);`,
        `export default stub;`,
        `export const api = stub;`,
        `export const GridVariant = {};`,
        `export const GridVariantState = {};`,
      ].join("\n") + "\n"
    );
    writeFileSync(
      join(stubDir, "index.cjs"),
      `module.exports = new Proxy({}, { get: (_, prop) => prop === '__esModule' ? true : () => {} });\n`
    );
  }
}

/* ------------------------------------------------------------------ */
/*  1. Node version check                                              */
/* ------------------------------------------------------------------ */

function checkNodeVersion() {
  console.log("\n1. Node version check");

  const pkg = JSON.parse(readFileSync(join(PKG_DIR, "package.json"), "utf-8"));
  const currentVersion = process.versions.node;
  const major = parseInt(currentVersion.split(".")[0], 10);

  let requiredRange = ">=18";
  if (pkg.engines && pkg.engines.node) {
    requiredRange = pkg.engines.node;
  }

  // Simple check: extract minimum major version from range
  const minMajorMatch = requiredRange.match(/(\d+)/);
  const minMajor = minMajorMatch ? parseInt(minMajorMatch[1], 10) : 18;

  const pass = major >= minMajor;
  record(
    "Node version",
    pass,
    `current=${currentVersion}, required=${requiredRange}`
  );
  return pass;
}

/* ------------------------------------------------------------------ */
/*  2. React 18 SSR compatibility                                      */
/* ------------------------------------------------------------------ */

function checkReact18Compat(tmpDir, tarballPath) {
  console.log("\n2. React 18 SSR compatibility");

  writeFileSync(
    join(tmpDir, "test-react18-ssr.mjs"),
    `
import React from 'react';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const ReactDOMServer = require('react-dom/server');

import { Button, Input, Select } from '@mfe/design-system/primitives';

const errors = [];

function assertRender(name, element) {
  try {
    const html = ReactDOMServer.renderToString(element);
    if (!html || html.length === 0) {
      errors.push(name + ': rendered empty string');
    } else {
      console.log('  OK ' + name + ' (' + html.length + ' chars)');
    }
  } catch (e) {
    errors.push(name + ': ' + e.message);
  }
}

assertRender('Button', React.createElement(Button, null, 'Click me'));
assertRender('Input', React.createElement(Input, { placeholder: 'Email' }));
assertRender('Select', React.createElement(Select, {
  options: [{ value: '1', label: 'One' }, { value: '2', label: 'Two' }]
}));

if (errors.length > 0) {
  console.error('FAILURES:');
  errors.forEach(e => console.error('  ' + e));
  process.exit(1);
}
console.log('All React 18 SSR checks passed');
`
  );

  const { ok, output } = runSafe("node test-react18-ssr.mjs", { cwd: tmpDir });
  record("React 18 renderToString (Button, Input, Select)", ok, ok ? "" : output.substring(0, 200));
  return ok;
}

/* ------------------------------------------------------------------ */
/*  3. ESM import test                                                 */
/* ------------------------------------------------------------------ */

function checkESMImport(tmpDir) {
  console.log("\n3. ESM import test");

  writeFileSync(
    join(tmpDir, "test-esm.mjs"),
    `
import { Button } from '@mfe/design-system/primitives';

// React components can be functions or objects (forwardRef returns an object)
if (typeof Button !== 'function' && typeof Button !== 'object') {
  console.error('typeof Button = ' + typeof Button);
  process.exit(1);
}
console.log('ESM import OK — typeof Button = ' + typeof Button);
`
  );

  const { ok, output } = runSafe("node test-esm.mjs", { cwd: tmpDir });
  record("ESM import (@mfe/design-system/primitives)", ok, ok ? "" : output.substring(0, 200));
  return ok;
}

/* ------------------------------------------------------------------ */
/*  4. CJS require test                                                */
/* ------------------------------------------------------------------ */

function checkCJSRequire(tmpDir) {
  console.log("\n4. CJS require test");

  writeFileSync(
    join(tmpDir, "test-cjs.cjs"),
    `
const primitives = require('@mfe/design-system/primitives');

// React components can be functions or objects (forwardRef returns an object)
if (typeof primitives.Button !== 'function' && typeof primitives.Button !== 'object') {
  console.error('typeof Button = ' + typeof primitives.Button);
  process.exit(1);
}
console.log('CJS require OK — typeof Button = ' + typeof primitives.Button);
`
  );

  const { ok, output } = runSafe("node test-cjs.cjs", { cwd: tmpDir });
  record("CJS require (@mfe/design-system/primitives)", ok, ok ? "" : output.substring(0, 200));
  return ok;
}

/* ------------------------------------------------------------------ */
/*  5. TypeScript types test                                           */
/* ------------------------------------------------------------------ */

function checkTypeScriptTypes(tmpDir) {
  console.log("\n5. TypeScript types test");

  // Check if tsc is available (use project root where typescript is installed)
  const tscCheck = spawnSync("npx", ["tsc", "--version"], {
    cwd: PKG_DIR,
    encoding: "utf-8",
    stdio: "pipe",
  });

  if (tscCheck.status !== 0) {
    record("TypeScript types (tsc --noEmit)", true, "SKIPPED — tsc not available");
    return true;
  }

  // Write test file inside the project so tsc can resolve node_modules
  const testFile = join(PKG_DIR, "__compat-type-check.ts");
  writeFileSync(
    testFile,
    `
import type { FC } from 'react';

// Verify the type declarations resolve from dist
type ButtonType = typeof import('./dist/primitives/index').Button;
type InputType = typeof import('./dist/primitives/index').Input;
type SelectType = typeof import('./dist/primitives/index').Select;

// Basic type checks
const _checkButton: ButtonType extends FC<any> ? true : never = true;
const _checkInput: InputType extends FC<any> ? true : never = true;
`
  );

  try {
    const { ok, output } = runSafe("npx tsc --noEmit --strict --skipLibCheck --moduleResolution bundler --module esnext --target es2020 --jsx react-jsx __compat-type-check.ts", { cwd: PKG_DIR });
    record("TypeScript types (tsc --noEmit)", ok, ok ? "" : output.substring(0, 200));
    return ok;
  } finally {
    try { rmSync(testFile, { force: true }); } catch {}
  }
}

/* ------------------------------------------------------------------ */
/*  6. Subpath exports resolution test                                 */
/* ------------------------------------------------------------------ */

function checkSubpathExports(tmpDir) {
  console.log("\n6. Subpath exports resolution");

  const subpaths = [
    "@mfe/design-system",
    "@mfe/design-system/primitives",
    "@mfe/design-system/components",
    "@mfe/design-system/tokens",
    "@mfe/design-system/patterns",
    "@mfe/design-system/headless",
    "@mfe/design-system/icons",
    "@mfe/design-system/advanced",
  ];

  // ESM resolution test
  const esmTestLines = subpaths
    .map(
      (sp, i) =>
        `try { await import('${sp}'); results.push({ path: '${sp}', ok: true }); } catch(e) { results.push({ path: '${sp}', ok: false, err: e.message }); }`
    )
    .join("\n");

  writeFileSync(
    join(tmpDir, "test-subpaths.mjs"),
    `
const results = [];
${esmTestLines}

const failures = results.filter(r => !r.ok);
results.forEach(r => {
  console.log((r.ok ? '  OK ' : '  FAIL ') + r.path + (r.err ? ' — ' + r.err.substring(0, 120) : ''));
});

if (failures.length > 0) {
  console.error(failures.length + ' subpath(s) failed');
  process.exit(1);
}
console.log('All subpath exports resolved');
`
  );

  const { ok, output } = runSafe("node test-subpaths.mjs", { cwd: tmpDir });

  // Record individual results
  let allPass = ok;
  if (ok) {
    subpaths.forEach((sp) => record(`Subpath: ${sp}`, true));
  } else {
    // Parse output to determine which passed/failed
    subpaths.forEach((sp) => {
      const spPass = output.includes(`OK ${sp}`);
      record(`Subpath: ${sp}`, spPass);
      if (!spPass) allPass = false;
    });
  }
  return allPass;
}

/* ------------------------------------------------------------------ */
/*  7. React 19 compatibility                                          */
/* ------------------------------------------------------------------ */

function checkReact19Compat() {
  console.log("\n7. React 19 compatibility");

  const pkg = JSON.parse(readFileSync(join(PKG_DIR, "package.json"), "utf-8"));
  let allPass = true;

  // 7a. Check peerDependencies accept React 19
  const reactPeer = (pkg.peerDependencies && pkg.peerDependencies.react) || "";
  const reactDomPeer =
    (pkg.peerDependencies && pkg.peerDependencies["react-dom"]) || "";

  const acceptsReact19 = /\^19|19\./.test(reactPeer) || reactPeer === "*";
  const acceptsReactDom19 =
    /\^19|19\./.test(reactDomPeer) || reactDomPeer === "*";

  record(
    "peerDeps accept React 19",
    acceptsReact19 && acceptsReactDom19,
    `react: "${reactPeer}", react-dom: "${reactDomPeer}"`
  );
  if (!acceptsReact19 || !acceptsReactDom19) allPass = false;

  // 7b. Scan source for React 19 deprecated / removed APIs
  const srcDir = join(PKG_DIR, "src");
  const deprecatedPatterns = [
    {
      name: "ReactDOM.render (removed in 19)",
      regex: /ReactDOM\.render\s*\(/,
    },
    {
      name: "ReactDOM.unmountComponentAtNode (removed in 19)",
      regex: /ReactDOM\.unmountComponentAtNode\s*\(/,
    },
    {
      name: "ReactDOM.findDOMNode (removed in 19)",
      regex: /findDOMNode\s*\(/,
    },
    {
      name: "defaultProps on function components (deprecated in 19)",
      regex: /\.defaultProps\s*=/,
    },
    {
      name: "String refs (removed in 19)",
      regex: /ref\s*=\s*["'][a-zA-Z]/,
    },
    {
      name: "Legacy context API (removed in 19)",
      regex: /childContextTypes|getChildContext\b|\.contextTypes\s*=/,
    },
  ];

  // Collect all source files recursively
  function collectFiles(dir, ext) {
    const files = [];
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== "node_modules") {
        files.push(...collectFiles(full, ext));
      } else if (ext.some((e) => entry.name.endsWith(e))) {
        files.push(full);
      }
    }
    return files;
  }

  const sourceFiles = existsSync(srcDir)
    ? collectFiles(srcDir, [".ts", ".tsx", ".js", ".jsx"])
    : [];

  // Exclude test files from the scan
  const prodFiles = sourceFiles.filter(
    (f) => !f.includes("__tests__") && !f.includes(".test.") && !f.includes(".spec.")
  );

  const findings = [];

  for (const pattern of deprecatedPatterns) {
    const matches = [];
    for (const file of prodFiles) {
      const content = readFileSync(file, "utf-8");
      if (pattern.regex.test(content)) {
        matches.push(file.replace(PKG_DIR + "/", ""));
      }
    }
    const pass = matches.length === 0;
    record(
      `No ${pattern.name}`,
      pass,
      pass ? "" : `found in ${matches.length} file(s): ${matches.slice(0, 3).join(", ")}`
    );
    if (!pass) {
      allPass = false;
      findings.push({ pattern: pattern.name, files: matches });
    }
  }

  if (findings.length > 0) {
    console.log("\n  React 19 incompatibility details:");
    for (const f of findings) {
      console.log(`    ${f.pattern}:`);
      f.files.forEach((file) => console.log(`      - ${file}`));
    }
  }

  return allPass;
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

async function main() {
  console.log("Compatibility CI Matrix");
  console.log("=======================\n");

  let allPass = true;

  // 1. Node version
  if (!checkNodeVersion()) allPass = false;

  // Pack and set up temp dir for remaining tests
  console.log("\nPacking design-system...");
  const tarball = run("npm pack --json", { cwd: PKG_DIR });
  const tarballInfo = JSON.parse(tarball);
  const tarballPath = join(PKG_DIR, tarballInfo[0].filename);

  const tmpDir = mkdtempSync(join(tmpdir(), "ds-compat-"));
  console.log(`Temp dir: ${tmpDir}`);

  try {
    // Set up temp project
    writeFileSync(
      join(tmpDir, "package.json"),
      JSON.stringify({
        name: "compat-matrix-test",
        private: true,
        type: "module",
      })
    );

    console.log("Installing from tarball + react@18...");
    run(`npm install ${tarballPath} react@18 react-dom@18 --no-save`, {
      cwd: tmpDir,
    });

    // Create stubs for optional peer deps
    createPeerStubs(tmpDir);

    // 2. React 18 SSR
    if (!checkReact18Compat(tmpDir, tarballPath)) allPass = false;

    // 3. ESM import
    if (!checkESMImport(tmpDir)) allPass = false;

    // 4. CJS require
    if (!checkCJSRequire(tmpDir)) allPass = false;

    // 5. TypeScript types
    if (!checkTypeScriptTypes(tmpDir)) allPass = false;

    // 6. Subpath exports
    if (!checkSubpathExports(tmpDir)) allPass = false;

    // 7. React 19 compatibility (runs against source, not tmpDir)
    if (!checkReact19Compat()) allPass = false;
  } finally {
    // Cleanup
    rmSync(tmpDir, { recursive: true, force: true });
    rmSync(tarballPath, { force: true });
  }

  // Print matrix table
  console.log("\n\n=== Compatibility Matrix ===\n");
  console.log(
    "| # | Check".padEnd(52) + "| Status  | Detail"
  );
  console.log("|---|" + "-".repeat(48) + "|---------|" + "-".repeat(40));
  results.forEach((r, i) => {
    const num = String(i + 1).padStart(2);
    const name = r.name.padEnd(47);
    const status = r.pass ? " PASS  " : " FAIL  ";
    const detail = (r.detail || "").substring(0, 38);
    console.log(`| ${num}| ${name}| ${status}| ${detail}`);
  });
  console.log("");

  const passCount = results.filter((r) => r.pass).length;
  const failCount = results.filter((r) => !r.pass).length;
  console.log(`Total: ${passCount} passed, ${failCount} failed out of ${results.length} checks`);

  if (!allPass) {
    console.error("\nCompatibility matrix FAILED");
    process.exit(1);
  }

  console.log("\nCompatibility matrix PASSED");
}

main().catch((err) => {
  console.error("\nCompatibility matrix FAILED:", err.message);
  process.exit(1);
});
