import { defineConfig } from 'vitest/config';
import path from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: __dirname,
  resolve: {
    alias: {
      '@mfe/design-system': path.resolve(__dirname, '../design-system/src/index.ts'),
    },
  },
  plugins: [react()],
  test: {
    root: __dirname,
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.*', 'src/**/*.stories.*', 'src/**/index.ts'],
    },
  },
});
