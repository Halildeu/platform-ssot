/**
 * Tests for the no-css-var-without-fallback ESLint rule.
 *
 * Uses ESLint's RuleTester internally, wrapped in vitest for CI compatibility.
 */

import { describe, test } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { RuleTester } = require('eslint');

import { rules } from '../eslint-plugin-css-var-fallback.mjs';

const rule = rules['no-css-var-without-fallback'];

describe('no-css-var-without-fallback', () => {
  test('valid and invalid cases pass RuleTester', () => {
    const ruleTester = new RuleTester({
      languageOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        parserOptions: {
          ecmaFeatures: { jsx: true },
        },
      },
    });

    ruleTester.run('no-css-var-without-fallback', rule, {
      valid: [
        // --- With fallback (hex) ---
        {
          code: 'const c = "var(--action-primary, #1a73e8)";',
          filename: 'src/components/Button.tsx',
        },

        // --- With fallback (named color) ---
        {
          code: 'const c = "var(--bg-surface, transparent)";',
          filename: 'src/components/Card.tsx',
        },

        // --- With fallback (nested var) ---
        {
          code: 'const c = "var(--action-primary, var(--fallback-color))";',
          filename: 'src/components/Button.tsx',
        },

        // --- Template literal with fallback ---
        {
          code: 'const c = `color: var(--text-primary, #000)`;',
          filename: 'src/components/Text.tsx',
        },

        // --- No CSS var usage at all ---
        {
          code: 'const c = "color: red";',
          filename: 'src/components/Text.tsx',
        },

        // --- Test file (exempt) ---
        {
          code: 'const c = "var(--action-primary)";',
          filename: 'src/components/__tests__/Button.test.tsx',
        },

        // --- Spec file (exempt) ---
        {
          code: 'const c = "var(--action-primary)";',
          filename: 'src/components/Button.spec.ts',
        },

        // --- Token definition file (exempt) ---
        {
          code: 'const c = "var(--action-primary)";',
          filename: 'src/styles/token-bridge.css',
        },

        // --- Theme file (exempt) ---
        {
          code: 'const c = "var(--action-primary)";',
          filename: 'src/styles/theme.css',
        },

        // --- Property defined in same file ---
        {
          code: `
            const tokens = "--action-primary: #1a73e8;";
            const c = "var(--action-primary)";
          `,
          filename: 'src/components/Button.tsx',
        },

        // --- Exempt property via options ---
        {
          code: 'const c = "var(--brand-always-available)";',
          filename: 'src/components/Button.tsx',
          options: [{ exemptProperties: ['--brand-always-available'] }],
        },

        // --- Stories file (exempt) ---
        {
          code: 'const c = "var(--action-primary)";',
          filename: 'src/components/Button.stories.tsx',
        },

        // --- Multiple vars all with fallbacks ---
        {
          code: 'const c = "background: var(--bg, #fff); color: var(--fg, #000)";',
          filename: 'src/components/Layout.tsx',
        },

        // --- Extra exempt file pattern via options ---
        {
          code: 'const c = "var(--action-primary)";',
          filename: 'src/fixtures/mock-styles.ts',
          options: [{ exemptFilePatterns: ['fixtures/'] }],
        },
      ],

      invalid: [
        // --- Simple string literal without fallback ---
        {
          code: 'const c = "var(--action-primary)";',
          filename: 'src/components/Button.tsx',
          errors: [{ messageId: 'missingFallback' }],
        },

        // --- Template literal without fallback ---
        {
          code: 'const c = `color: var(--text-muted)`;',
          filename: 'src/components/Text.tsx',
          errors: [{ messageId: 'missingFallback' }],
        },

        // --- JSX style attribute ---
        {
          code: '<div style={{ color: "var(--text-primary)" }} />;',
          filename: 'src/components/Heading.tsx',
          errors: [{ messageId: 'missingFallback' }],
        },

        // --- Multiple violations in one string ---
        {
          code: 'const c = "background: var(--bg-surface); color: var(--text-color)";',
          filename: 'src/components/Card.tsx',
          errors: [
            { messageId: 'missingFallback', data: { propName: '--bg-surface' } },
            { messageId: 'missingFallback', data: { propName: '--text-color' } },
          ],
        },

        // --- Mix: one with fallback, one without ---
        {
          code: 'const c = "background: var(--bg, #fff); color: var(--fg)";',
          filename: 'src/components/Layout.tsx',
          errors: [
            { messageId: 'missingFallback', data: { propName: '--fg' } },
          ],
        },

        // --- Template literal with expression parts ---
        {
          code: 'const c = `border: 1px solid var(--border-color)`;',
          filename: 'src/components/Card.tsx',
          errors: [{ messageId: 'missingFallback' }],
        },

        // --- Non-test file with test-like name but not matching pattern ---
        {
          code: 'const c = "var(--action-primary)";',
          filename: 'src/components/TestButton.tsx',
          errors: [{ messageId: 'missingFallback' }],
        },
      ],
    });
  });
});
