#!/usr/bin/env node
/**
 * Consumer Smoke Test
 *
 * Packs the package, installs it in a temp directory,
 * and verifies that import/require actually works.
 */
import { execSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_DIR = join(__dirname, "..", "..");

async function main() {
  console.log("Consumer Smoke Test\n");

  // 1. Pack the package
  console.log("Packing...");
  const tarball = execSync("npm pack --json", {
    cwd: PKG_DIR,
    encoding: "utf-8",
  });
  const tarballInfo = JSON.parse(tarball);
  const tarballPath = join(PKG_DIR, tarballInfo[0].filename);

  // 2. Create temp directory
  const tmpDir = mkdtempSync(join(tmpdir(), "ds-smoke-"));
  console.log(`Temp dir: ${tmpDir}`);

  try {
    // 3. Create minimal package.json
    writeFileSync(
      join(tmpDir, "package.json"),
      JSON.stringify({
        name: "smoke-test",
        private: true,
        type: "module",
      })
    );

    // 4. Install from tarball (with react peer deps for render tests)
    console.log("Installing from tarball...");
    execSync(`npm install ${tarballPath} react@18 react-dom@18 --no-save`, {
      cwd: tmpDir,
      stdio: "pipe",
    });

    // 4b. Create stubs for optional peer deps (@mfe/shared-http, @mfe/shared-types)
    //     These are marked optional in peerDependenciesMeta but are imported
    //     at the bundle level, so we need placeholder modules.
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
      // ESM stub — named exports via Proxy so any `import { x }` succeeds
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
      // CJS stub
      writeFileSync(
        join(stubDir, "index.cjs"),
        `module.exports = new Proxy({}, { get: (_, prop) => prop === '__esModule' ? true : () => {} });\n`
      );
    }

    // 5. Test types existence and main/module field resolution
    // This is the critical test: files referenced by package.json must exist.
    console.log("Checking types and main entry...");
    writeFileSync(
      join(tmpDir, "test-types.mjs"),
      `
      import { existsSync } from 'fs';
      import { readFile } from 'fs/promises';
      import { join, dirname } from 'path';
      import { fileURLToPath } from 'url';

      const __dirname = dirname(fileURLToPath(import.meta.url));
      const pkgDir = join(__dirname, 'node_modules', '@mfe', 'design-system');
      const dtsPath = join(pkgDir, 'dist', 'index.d.ts');

      if (!existsSync(dtsPath)) throw new Error('Types file missing: ' + dtsPath);
      console.log('Types file exists');

      // Check main field resolves
      const pkg = JSON.parse(await readFile(join(pkgDir, 'package.json'), 'utf-8'));
      const mainPath = join(pkgDir, pkg.main);
      if (!existsSync(mainPath)) throw new Error('Main file missing: ' + mainPath);
      console.log('Main entry exists:', pkg.main);

      // Check module field resolves
      const modulePath = join(pkgDir, pkg.module);
      if (!existsSync(modulePath)) throw new Error('Module file missing: ' + modulePath);
      console.log('Module entry exists:', pkg.module);

      // Check all export subpath files exist
      const errors = [];
      for (const [subpath, conditions] of Object.entries(pkg.exports || {})) {
        if (typeof conditions === 'string') {
          const p = join(pkgDir, conditions);
          if (!existsSync(p)) errors.push(subpath + ' -> ' + conditions);
        } else {
          for (const [cond, target] of Object.entries(conditions)) {
            const p = join(pkgDir, target);
            if (!existsSync(p)) errors.push(subpath + ' [' + cond + '] -> ' + target);
          }
        }
      }
      if (errors.length > 0) {
        throw new Error('Missing export files:\\n  ' + errors.join('\\n  '));
      }
      console.log('All export subpath files exist');
    `
    );

    execSync("node test-types.mjs", { cwd: tmpDir, stdio: "inherit" });

    // 6. React render test — SSR renderToString for key components
    console.log("\nRunning React render smoke test...");
    writeFileSync(
      join(tmpDir, "test-render.mjs"),
      `
      import React from 'react';
      import { createRequire } from 'module';
      const require = createRequire(import.meta.url);
      const ReactDOMServer = require('react-dom/server');

      // ---- Subpath imports (tree-shakeable, no heavy deps like ag-grid) ----
      import {
        Button, Input, Select, Checkbox, Switch,
        Badge, Alert, Spinner, Card, Skeleton,
        Tooltip, Modal, Drawer,
      } from '@mfe/design-system/primitives';

      import {
        Tabs, Accordion,
      } from '@mfe/design-system/components';

      import { spacing } from '@mfe/design-system/tokens';

      const errors = [];

      function assertRender(name, element, expectedSubstring) {
        try {
          const html = ReactDOMServer.renderToString(element);
          if (!html || html.length === 0) {
            errors.push(name + ': rendered empty string');
          } else if (expectedSubstring && !html.includes(expectedSubstring)) {
            errors.push(name + ': missing expected "' + expectedSubstring + '" in output: ' + html.substring(0, 200));
          } else {
            console.log('  ✓ ' + name);
          }
        } catch (e) {
          errors.push(name + ': render threw — ' + e.message);
        }
      }

      function assertIsComponent(name, value) {
        if (typeof value !== 'function' && typeof value !== 'object') {
          errors.push(name + ': expected function or object, got ' + typeof value);
        } else {
          console.log('  ✓ ' + name + ' (typeof=' + typeof value + ')');
        }
      }

      console.log('Rendering primitives via renderToString...');

      // Simple primitives that render straightforward HTML
      assertRender('Button',   React.createElement(Button, null, 'Click'),   '<button');
      assertRender('Input',    React.createElement(Input, { placeholder: 'x' }), '<input');
      assertRender('Select',   React.createElement(Select, { options: [{ value: '1', label: 'One' }] }), '<select');
      assertRender('Checkbox', React.createElement(Checkbox, null), '<input');
      assertRender('Switch',   React.createElement(Switch, null), null);
      assertRender('Badge',    React.createElement(Badge, null, 'New'), null);
      assertRender('Alert',    React.createElement(Alert, { body: 'msg' }), 'role="alert"');
      assertRender('Spinner',  React.createElement(Spinner, null), null);
      assertRender('Card',     React.createElement(Card, null, 'Content'), null);
      assertRender('Skeleton', React.createElement(Skeleton, null), null);
      assertRender('Tooltip',  React.createElement(Tooltip, { content: 'tip' }, React.createElement('span', null, 'hover')), '<span');

      // Portal-based components — verify they are valid component exports
      // (Modal and Drawer use ReactDOM.createPortal which needs a DOM environment)
      assertIsComponent('Modal', Modal);
      assertIsComponent('Drawer', Drawer);

      console.log('\\nRendering composed components via renderToString...');

      assertRender('Tabs', React.createElement(Tabs, {
        items: [{ key: 't1', label: 'Tab 1', content: 'Content 1' }]
      }), null);

      assertRender('Accordion', React.createElement(Accordion, {
        items: [{ value: 'a1', title: 'Section 1', content: 'Body 1' }]
      }), null);

      // ---- Subpath import validation ----
      console.log('\\nValidating subpath token imports...');

      if (typeof spacing !== 'object' || spacing === null) {
        errors.push('tokens/spacing: expected object, got ' + typeof spacing);
      } else {
        console.log('  ✓ tokens/spacing (keys=' + Object.keys(spacing).length + ')');
      }

      if (errors.length > 0) {
        console.error('\\nRender test failures:');
        errors.forEach(e => console.error('  ✗ ' + e));
        process.exit(1);
      }
      console.log('\\nAll render checks passed');
    `
    );

    execSync("node test-render.mjs", { cwd: tmpDir, stdio: "inherit" });

    // 7. CJS require test
    console.log("\nRunning CJS require test...");
    writeFileSync(
      join(tmpDir, "test-cjs.cjs"),
      `
      // CJS require test for subpath entries (no heavy deps needed)
      const primitives = require('@mfe/design-system/primitives');
      const components = require('@mfe/design-system/components');
      const tokens = require('@mfe/design-system/tokens');

      const errors = [];

      const primNames = [
        'Button', 'Input', 'Select', 'Checkbox', 'Switch',
        'Badge', 'Alert', 'Spinner', 'Card', 'Skeleton',
        'Tooltip', 'Modal', 'Drawer',
      ];

      const compNames = ['Tabs', 'Accordion'];

      console.log('Checking primitives CJS exports...');
      for (const name of primNames) {
        const val = primitives[name];
        if (typeof val !== 'function' && typeof val !== 'object') {
          errors.push('primitives/' + name + ': expected function or object, got ' + typeof val);
        } else {
          console.log('  ✓ ' + name + ' (typeof=' + typeof val + ')');
        }
      }

      console.log('\\nChecking components CJS exports...');
      for (const name of compNames) {
        const val = components[name];
        if (typeof val !== 'function' && typeof val !== 'object') {
          errors.push('components/' + name + ': expected function or object, got ' + typeof val);
        } else {
          console.log('  ✓ ' + name + ' (typeof=' + typeof val + ')');
        }
      }

      console.log('\\nChecking tokens CJS exports...');
      if (typeof tokens.spacing !== 'object' || tokens.spacing === null) {
        errors.push('tokens/spacing: expected object, got ' + typeof tokens.spacing);
      } else {
        console.log('  ✓ spacing (keys=' + Object.keys(tokens.spacing).length + ')');
      }

      if (errors.length > 0) {
        console.error('\\nCJS require test failures:');
        errors.forEach(e => console.error('  ✗ ' + e));
        process.exit(1);
      }
      console.log('\\nAll CJS require checks passed');
    `
    );

    execSync("node test-cjs.cjs", { cwd: tmpDir, stdio: "inherit" });

    console.log("\nConsumer smoke test PASSED");
  } finally {
    // Cleanup
    rmSync(tmpDir, { recursive: true, force: true });
    rmSync(tarballPath, { force: true });
  }
}

main().catch((err) => {
  console.error("\nConsumer smoke test FAILED:", err.message);
  process.exit(1);
});
