import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@mfe/design-system': path.resolve(__dirname, '../../packages/design-system/src'),
      '@mfe/i18n-dicts': path.resolve(__dirname, '../../packages/i18n-dicts/src'),
      '@mfe/shared-http': path.resolve(__dirname, '../../packages/shared-http/src'),
      '@platform/capabilities': path.resolve(__dirname, '../../packages/platform-capabilities/src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,

  },
});
