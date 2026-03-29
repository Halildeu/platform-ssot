import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: __dirname,
  plugins: [react()],
  resolve: {
    alias: {
      '@mfe/design-system': path.resolve(__dirname, '../../packages/design-system/src'),
      '@mfe/shared-http': path.resolve(__dirname, '../../packages/shared-http/src'),
      '@mfe/i18n-dicts': path.resolve(__dirname, '../../packages/i18n-dicts/src'),
    },
  },
  test: {
    root: __dirname,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
});
