/**
 * ESLint flat config — package-level override for @mfe/design-system.
 *
 * Uses a lightweight tsconfig.eslint.json scoped to this package only,
 * instead of the monorepo-wide tsconfig that causes OOM on large repos.
 */
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { rules as semanticThemeRules } from '../../scripts/lint/eslint-plugin-semantic-theme.mjs';
import { rules as cssVarFallbackRules } from '../../scripts/lint/eslint-plugin-css-var-fallback.mjs';
import { rules as noAntImportRules } from '../../scripts/lint/eslint-plugin-no-ant-import.mjs';
import { rules as authoringContractRules } from '../../scripts/lint/eslint-plugin-authoring-contract.mjs';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'scripts/**',
      'src/__visual__/**',
      '**/*.stories.ts',
      '**/*.stories.tsx',
      'webpack.*.js',
      '*.config.ts',
      '*.config.js',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.eslint.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      'semantic-theme': { rules: semanticThemeRules },
      'css-var-fallback': { rules: cssVarFallbackRules },
      'no-ant-import': { rules: noAntImportRules },
      'authoring-contract': { rules: authoringContractRules },
    },
    rules: {
      'semantic-theme/no-inline-color-literals': 'error',
      // CSS var fallback is OFF for the design-system: the ThemeProvider guarantees
      // all CSS custom properties are injected. This rule is for consumer apps.
      'css-var-fallback/no-css-var-without-fallback': 'off',
      'no-ant-import/no-new-ant-import': 'error',
      'authoring-contract/no-self-package-imports': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // ── Layer Boundary Rules ──
      // tokens/ → MUST NOT import React or any component
      // internal/ (headless) → MUST NOT import primitives/, components/, patterns/
      // advanced/ → MUST NOT import components/ (only internal/ and tokens/)
      // These rules enforce single-direction dependency flow.
      'no-restricted-imports': 'off', // base rule off, TS version below
    },
  },
  {
    files: [
      'src/primitives/**/*.tsx',
      'src/components/**/*.tsx',
      'src/patterns/**/*.tsx',
    ],
    ignores: [
      'src/**/__tests__/**',
      'src/**/*.stories.tsx',
    ],
    rules: {
      'authoring-contract/require-display-name': 'error',
      'authoring-contract/require-forward-ref-by-profile': 'error',
    },
  },
  // Layer boundary: tokens/ must not import React
  {
    files: ['src/tokens/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['react', 'react-dom', '../primitives/*', '../components/*', '../patterns/*', '../advanced/*', '../internal/*', '../providers/*'],
          message: 'tokens/ is a pure data layer — no React or component imports allowed.',
        }],
      }],
    },
  },
  // Layer boundary: internal/ (headless) must not import styled components
  {
    files: ['src/internal/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['../primitives/*', '../../primitives/*', '../components/*', '../../components/*', '../patterns/*', '../../patterns/*', '../advanced/*', '../../advanced/*'],
          message: 'internal/ (headless) must not import styled components. Dependency flows downward only.',
        }],
      }],
    },
  },
  // Layer boundary: advanced/ must not import components/ or patterns/
  {
    files: ['src/advanced/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['../components/*', '../../components/*', '../patterns/*', '../../patterns/*'],
          message: 'advanced/ (x-suite) must not import components/ or patterns/. Use internal/ and tokens/ only.',
        }],
      }],
    },
  },
  {
    files: [
      'src/**/__tests__/**/*.{ts,tsx}',
      'src/**/*.test.{ts,tsx}',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },
);
