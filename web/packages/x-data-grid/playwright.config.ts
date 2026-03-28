import { defineConfig, devices } from '@playwright/test';

/* ---------------------------------------------------------------------------
 * Wave 2.3 — Playwright E2E Configuration for @mfe/x-data-grid
 *
 * Runs against a local dev server that mounts the grid test harness.
 * The test page must expose window.__TEST_GRID__ with { api, setRowData }.
 * -----------------------------------------------------------------------*/

export default defineConfig({
  testDir: './src/__tests__/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  timeout: 30_000,

  reporter: process.env.CI ? 'github' : 'html',

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // Chrome-only flag needed for performance.memory in scroll tests
    launchOptions: {
      args: ['--enable-precise-memory-info'],
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Start the dev server before running tests (CI and local). */
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
