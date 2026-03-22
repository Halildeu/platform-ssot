import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'browser',
    browser: {
      enabled: true,
      provider: 'playwright',
      instances: [
        { browser: 'chromium' },
      ],
    },
    include: ['src/**/*.browser.test.{ts,tsx}', 'src/**/*.visual.test.{ts,tsx}'],
  },
});
