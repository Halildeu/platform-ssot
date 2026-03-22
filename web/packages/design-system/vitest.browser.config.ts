import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import path from 'path';

export default defineConfig({
  test: {
    name: 'browser',
    root: path.resolve(__dirname),
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [
        { browser: 'chromium' },
      ],
    },
    include: ['src/**/*.browser.test.{ts,tsx}', 'src/**/*.visual.test.{ts,tsx}'],
  },
});
