import js from '@eslint/js';
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
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
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
      'semantic-theme/no-inline-color-literals': 'error',
      'css-var-fallback/no-css-var-without-fallback': 'error',
      'no-ant-import/no-new-ant-import': 'error',
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
