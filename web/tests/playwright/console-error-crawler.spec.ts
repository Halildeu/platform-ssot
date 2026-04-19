import { test, expect } from '@playwright/test';
import type { Page, ConsoleMessage, Response } from '@playwright/test';
import { authenticateAndNavigate } from './utils/auth';

/**
 * Proactive console / network error crawler (QLTY-PROACTIVE-01)
 *
 * Goal: catch frontend errors BEFORE end-users hit them. Walks a sitemap of
 * known MFE routes, captures:
 *   - console.error + console.warn messages (signatures)
 *   - HTTP 4xx/5xx responses (per route)
 * Outputs structured JSON report to `tests/playwright/__artifacts__/console-crawler-<timestamp>.json`
 * and fails the run if ANY route produces console.error OR 5xx.
 *
 * Scope (shell host routes; lazy MFE remotes resolve on navigation):
 *   /home, /admin/reports, /access, /access/roles, /reports, /runtime/theme-matrix
 *
 * Scheduled usage: `npx playwright test tests/playwright/console-error-crawler.spec.ts`
 * CI hook: run on every main deploy + nightly cron.
 */

const ROUTES: Array<{ path: string; permissions: string[]; description: string }> = [
  { path: '/home',                 permissions: ['VIEW_USERS'],                 description: 'Shell homepage' },
  { path: '/admin/reports',        permissions: ['VIEW_USERS', 'REPORTING_MODULE'], description: 'Admin reports landing' },
  { path: '/access',               permissions: ['VIEW_USERS', 'ACCESS_MODULE'],    description: 'Access module landing' },
  { path: '/access/roles',         permissions: ['VIEW_USERS', 'ACCESS_MODULE'],    description: 'Role list grid' },
  { path: '/reports',              permissions: ['VIEW_USERS', 'REPORTING_MODULE'], description: 'Reports landing' },
  { path: '/runtime/theme-matrix', permissions: ['VIEW_USERS', 'ADMIN'],            description: 'Runtime theme matrix' },
];

// Console messages that are known-benign (framework warnings we intentionally ignore).
const CONSOLE_ALLOWLIST_PATTERNS: RegExp[] = [
  /DevTools failed to load source map/i,
  /Download the React DevTools/i,
  /Partial hydration/i, // React 18 framework noise
];

const NETWORK_ALLOWLIST_PATTERNS: RegExp[] = [
  // Lazy-loaded chunk 404 during dev hot-reload (rare in CI) — tolerable
  /\/assets\/.*\.js$/,
];

interface CapturedConsoleMessage {
  type: 'error' | 'warn';
  text: string;
  location?: string;
}

interface CapturedNetworkFailure {
  method: string;
  url: string;
  status: number;
  statusText: string;
}

interface RouteReport {
  path: string;
  description: string;
  navigationStatus: number | null;
  consoleErrors: CapturedConsoleMessage[];
  consoleWarnings: CapturedConsoleMessage[];
  networkFailures: CapturedNetworkFailure[];
  durationMs: number;
}

const matchesAllowlist = (text: string, patterns: RegExp[]): boolean =>
  patterns.some((pattern) => pattern.test(text));

const captureForRoute = async (
  page: Page,
  baseURL: string | undefined,
  route: { path: string; description: string },
): Promise<RouteReport> => {
  const consoleErrors: CapturedConsoleMessage[] = [];
  const consoleWarnings: CapturedConsoleMessage[] = [];
  const networkFailures: CapturedNetworkFailure[] = [];
  let navigationStatus: number | null = null;

  const handleConsole = (msg: ConsoleMessage) => {
    const type = msg.type();
    if (type !== 'error' && type !== 'warning') return;
    const text = msg.text();
    if (matchesAllowlist(text, CONSOLE_ALLOWLIST_PATTERNS)) return;
    const record: CapturedConsoleMessage = {
      type: type === 'error' ? 'error' : 'warn',
      text,
      location: msg.location() ? `${msg.location().url}:${msg.location().lineNumber}` : undefined,
    };
    if (type === 'error') consoleErrors.push(record);
    else consoleWarnings.push(record);
  };

  const handleResponse = (res: Response) => {
    const status = res.status();
    if (status < 400) return;
    const url = res.url();
    if (matchesAllowlist(url, NETWORK_ALLOWLIST_PATTERNS)) return;
    networkFailures.push({
      method: res.request().method(),
      url,
      status,
      statusText: res.statusText(),
    });
  };

  page.on('console', handleConsole);
  page.on('response', handleResponse);

  const started = Date.now();
  try {
    const response = await page.goto(`${baseURL ?? 'http://localhost:3000'}${route.path}`, {
      waitUntil: 'networkidle',
      timeout: 20_000,
    });
    navigationStatus = response?.status() ?? null;
    // Give lazy-loaded MFE + async API calls a chance to settle.
    await page.waitForTimeout(2_000);
  } catch (err) {
    consoleErrors.push({ type: 'error', text: `navigation_failed: ${(err as Error).message}` });
  } finally {
    page.off('console', handleConsole);
    page.off('response', handleResponse);
  }

  return {
    path: route.path,
    description: route.description,
    navigationStatus,
    consoleErrors,
    consoleWarnings,
    networkFailures,
    durationMs: Date.now() - started,
  };
};

test.describe('Console + network error crawler (QLTY-PROACTIVE-01)', () => {
  // Aggregate permissions so a single login covers all routes.
  const allPermissions = Array.from(
    new Set(ROUTES.flatMap((route) => route.permissions)),
  );

  test('walks MFE sitemap and asserts zero console.error + zero 5xx', async ({ page, baseURL }) => {
    test.setTimeout(ROUTES.length * 30_000);

    // One login; subsequent navigations reuse the session.
    await authenticateAndNavigate(page, baseURL, '/', allPermissions);

    const reports: RouteReport[] = [];
    for (const route of ROUTES) {
      const report = await captureForRoute(page, baseURL, route);
      reports.push(report);
    }

    // Structured artifact for observability / Grafana ingestion.
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const summary = {
      generatedAt: new Date().toISOString(),
      baseURL: baseURL ?? 'http://localhost:3000',
      totalRoutes: reports.length,
      routesWithErrors: reports.filter((r) => r.consoleErrors.length > 0 || r.networkFailures.some((f) => f.status >= 500)).length,
      totalConsoleErrors: reports.reduce((sum, r) => sum + r.consoleErrors.length, 0),
      totalConsoleWarnings: reports.reduce((sum, r) => sum + r.consoleWarnings.length, 0),
      totalNetworkFailures: reports.reduce((sum, r) => sum + r.networkFailures.length, 0),
      reports,
    };

    await test.info().attach(`console-crawler-${timestamp}.json`, {
      body: JSON.stringify(summary, null, 2),
      contentType: 'application/json',
    });

    const failingRoutes = reports.filter(
      (r) => r.consoleErrors.length > 0 || r.networkFailures.some((f) => f.status >= 500),
    );

    if (failingRoutes.length > 0) {
      const detail = failingRoutes.map((r) => {
        const errors = r.consoleErrors.map((e) => `  console.error: ${e.text.slice(0, 200)}`).join('\n');
        const netFails = r.networkFailures.filter((f) => f.status >= 500).map((f) => `  ${f.status} ${f.method} ${f.url}`).join('\n');
        return `[${r.path}] ${r.description}\n${errors}\n${netFails}`.trim();
      }).join('\n\n');
      expect(failingRoutes, `Proactive crawler detected console.error or 5xx on ${failingRoutes.length} route(s):\n\n${detail}`).toEqual([]);
    }
  });
});
