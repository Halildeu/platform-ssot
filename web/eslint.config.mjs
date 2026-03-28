import js from '@eslint/js';
import css from '@eslint/css';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { rules as semanticThemeRules } from './scripts/lint/eslint-plugin-semantic-theme.mjs';
import { rules as cssVarFallbackRules } from './scripts/lint/eslint-plugin-css-var-fallback.mjs';
import { rules as noAntImportRules } from './scripts/lint/eslint-plugin-no-ant-import.mjs';

export default tseslint.config(
  {
    ignores: [
      'dist',
      'apps/**/dist/**',
      'packages/**/dist/**',
      'storybook-static',
      '.storybook/**',
      'reports',
      'coverage',
      'security-reports',
      'tests/smoke/**/*.mjs',
      'node_modules',
      '**/node_modules/**',
      '**/node_modules_old/**',
      'node_modules_failed_pnpm/**',
      'node_modules_failed_pnpm_hoisted/**',
      '**/webpack.*.js',
      '**/webpack.*.ts',
      '**/tailwind.config.*',
      '**/.stylelintrc.*',
      '**/jest.config.*',
      '**/babel.config.*',
      '**/postcss.config.*',
      'storybook.config.mjs',
      '**/*.stories.{ts,tsx}',
      '**/*.figma.{ts,tsx}',
      'scripts/ops/**',
      // Packages with eslint-disable comments referencing unloaded plugins (react-hooks, jsx-a11y)
      'packages/x-kanban/**',
      'packages/x-editor/**',
    ],
  },
  /* ---- Linter options ---- */
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'warn',
    },
  },
  /* ---- JS/TS rules — scoped to non-CSS files only ---- */
  {
    files: ['**/*.{ts,tsx,js,jsx,mjs}'],
    ...js.configs.recommended,
  },
  ...tseslint.configs.recommended.map((cfg) => ({
    ...cfg,
    files: cfg.files ?? ['**/*.{ts,tsx,js,jsx,mjs}'],
  })),
  {
    files: ['**/*.{ts,tsx,js,jsx,mjs}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
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
    },
    rules: {
      'semantic-theme/no-inline-color-literals': 'warn',
      'css-var-fallback/no-css-var-without-fallback': 'warn',
      'no-ant-import/no-new-ant-import': 'error',
      // Pre-existing issues downgraded to warn — will be fixed incrementally
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-unused-expressions': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-require-imports': 'warn',
      '@typescript-eslint/no-this-alias': 'warn',
      'no-constant-condition': 'warn',
      'no-constant-binary-expression': 'warn',
      'no-prototype-builtins': 'warn',
      'no-empty': 'warn',
      'no-cond-assign': 'warn',
      'no-fallthrough': 'warn',
      'no-redeclare': 'warn',
      'no-undef': 'off', // Too many false positives with TS global types
      'no-empty-pattern': 'warn',
      'no-var': 'warn',
      'no-self-assign': 'warn',
      'no-control-regex': 'warn',
      'no-func-assign': 'warn',
      'no-useless-escape': 'warn',
      'no-case-declarations': 'warn',
      'prefer-const': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-unsafe-function-type': 'warn',
      '@typescript-eslint/triple-slash-reference': 'warn',
      'no-sparse-arrays': 'warn',
      'no-misleading-character-class': 'warn',
      'getter-return': 'warn',
      'no-duplicate-case': 'warn',
      'valid-typeof': 'warn',
      'no-unused-private-class-members': 'warn',
    },
  },
  /* ---- @eslint/css — native CSS linting (ESLint 9+) ---- */
  {
    files: ['**/*.css'],
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/coverage/**',
      /* Auto-generated files — read-only */
      '**/tokens/build/**',
      '**/styles/theme.css',
      '**/styles/generated-theme-inline.css',
      'apps/mfe-shell/src/index.css',
    ],
    plugins: { css },
    language: 'css/css',
    rules: {
      'css/no-invalid-at-rules': 'off', // False positives on Tailwind v4 @theme, @apply, etc.
      'css/no-invalid-properties': 'off', // False positives on CSS custom properties (--var)
      'css/no-duplicate-imports': 'error',
    },
  },
  {
    files: [
      '**/__tests__/**/*.{ts,tsx,js,jsx}',
      '**/*.{spec,test}.{ts,tsx,js,jsx}',
      'cypress/**/*.{ts,tsx,js,jsx}',
      'tests/**/*.{ts,tsx,js,jsx}',
      'docs/tests/**/*.{ts,tsx,js,jsx}',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
);
