import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  root: __dirname,
  resolve: {
    alias: {
      '@mfe/x-charts': path.resolve(__dirname, '../x-charts/src/index.ts'),
    },
  },
  test: {
    root: __dirname,
    include: ['src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
    globals: true,
    environment: 'jsdom',
    css: false,
    setupFiles: ['./src/__tests__/setup.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.stryker-tmp/**',
      '**/*.browser.test.{ts,tsx}',
      '**/*.visual.test.{ts,tsx}',
      '**/*depth*.test.{ts,tsx}',
      '**/*-depth.test.{ts,tsx}',
    ],
    coverage: {
      provider: 'v8',
      thresholds: {
        statements: 75,
        branches: 65,
        functions: 70,
        lines: 75,
      },
    },
  },
});
