import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: __dirname,
  test: {
    root: __dirname,
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
