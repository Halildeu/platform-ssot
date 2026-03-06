import fs from 'node:fs';
import path from 'node:path';
import { load as loadYaml } from 'js-yaml';
import { test, expect, type Page, type Route } from '@playwright/test';
import { authenticateAndNavigate } from './utils/auth';
import {
  createTelemetryCollector,
  type TelemetryAllowlists,
  type TelemetryResourceFailureEntry,
  type TelemetryResult,
  type TelemetryRuntimeOverlayEntry,
  type TelemetryUnhandledRejectionEntry,
} from './utils/pw_telemetry';

type ScenarioStep =
  | { goto: string }
  | { click: string }
  | { clickFirst: string }
  | { fill: { selector: string; value: string } | [string, string] }
  | { select: { selector: string; value: string } | [string, string] }
  | { waitForURL: string }
  | { waitForSelector: string }
  | { expectVisible: string }
  | { waitForLoadState: 'load' | 'domcontentloaded' | 'networkidle' };

type ExpectedStatusMatrix = Record<string, number[]>;

type ScenarioConfig = {
  name: string;
  level: 1 | 2;
  baseUrl?: string;
  auth_required?: boolean;
  permissions?: string[];
  steps: ScenarioStep[];
  expected_status_matrix?: ExpectedStatusMatrix;
  expected_network_errors_allowlist?: string[];
  fail_on_console_error?: boolean;
  warn_on_console_warn?: boolean;
  console_warn_allowlist?: string[];
  console_error_allowlist?: string[];
  network_allowlist?: Array<{ url?: string; status?: string; method?: string }>;
  readonly_allowlist?: Array<{ url?: string; method?: string }>;
};

type ScenariosFile = {
  version: number;
  baseUrl?: string;
  defaults?: Omit<ScenarioConfig, 'name' | 'level' | 'steps'>;
  scenarios: ScenarioConfig[];
};

type ScenarioOutcome = 'PASS' | 'WARN' | 'FAIL' | 'BLOCKED';

type ScenarioRunResult = {
  name: string;
  level: number;
  outcome: ScenarioOutcome;
  failReasons: string[];
  warnReasons: string[];
  blockedReasons: string[];
  telemetry: TelemetryResult;
  reportPath: string;
  artifacts: {
    screenshotPath?: string;
    htmlPath?: string;
    stepJournalPath?: string;
  };
};

const webRoot = path.resolve(__dirname, '../..');
const defaultTargetsPath = path.resolve(__dirname, 'pw_scenarios.yml');
const outputRoot = path.join(webRoot, 'test-results', 'pw');

const nowStamp = () => new Date().toISOString().replace(/[:.]/g, '-');

const parseSoftMode = () => (process.env.PW_SOFT_MODE ?? '').trim() === '1';

const parseAuthMode = () => (process.env.PW_AUTH_MODE ?? 'none').trim().toLowerCase();

const parseReadonlyEnforce = () => (process.env.PW_READONLY_ENFORCE ?? '').trim() === '1';

const parseReadonlyPathRegex = () => (process.env.PW_READONLY_PATH_REGEX ?? '/api/').trim() || '/api/';

const parseMockThemeRegistry = () => {
  const raw = (process.env.PW_MOCK_THEME_REGISTRY ?? '1').trim().toLowerCase();
  if (raw === '0' || raw === 'false' || raw === 'no') return false;
  return raw === '1' || raw === 'true' || raw === 'yes';
};

const parseMockApi = () => (process.env.PW_MOCK_API ?? '').trim() === '1';

const hasInjectedToken = () => Boolean((process.env.PW_TEST_TOKEN ?? '').trim());

const hasTokenEndpointConfig = () =>
  Boolean((process.env.KEYCLOAK_TOKEN_URL ?? '').trim()) &&
  Boolean((process.env.KEYCLOAK_CLIENT_ID ?? '').trim()) &&
  Boolean((process.env.KEYCLOAK_CLIENT_SECRET ?? '').trim());

const parseReadonlyAllowlistFromEnv = (softMode: boolean): TelemetryAllowlists['readonly_allowlist'] => {
  const raw = (process.env.PW_READONLY_ALLOWLIST_JSON ?? '').trim();
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      throw new Error('PW_READONLY_ALLOWLIST_JSON array olmalı');
    }
    return parsed
      .filter((item): item is { url?: string; method?: string } => Boolean(item) && typeof item === 'object')
      .map((item) => ({
        url: item.url,
        method: item.method,
      }));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (softMode) {
      // Soft mode: allowlist parse hatası job kırmasın, sadece ignore et.
      // (Hard mode'da bu bir misconfig sayılır.)
      console.warn(`[pw-runner] readonly_allowlist parse edilemedi, ignore edildi: ${message}`);
      return [];
    }
    throw new Error(`PW_READONLY_ALLOWLIST_JSON invalid: ${message}`);
  }
};

const safeName = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const readYamlTargets = (targetsPath: string): ScenariosFile => {
  const raw = fs.readFileSync(targetsPath, 'utf8');
  const parsed = loadYaml(raw) as unknown;
  if (!parsed || typeof parsed !== 'object') {
    throw new Error(`YAML hedefleri okunamadı: ${targetsPath}`);
  }
  const config = parsed as ScenariosFile;
  if (!Array.isArray(config.scenarios)) {
    throw new Error(`YAML 'scenarios' listesi bulunamadı: ${targetsPath}`);
  }
  return config;
};

const parseMode = () => (process.env.PW_MODE ?? 'ci').trim().toLowerCase();

const isCiEnv = () => Boolean(process.env.CI) || Boolean(process.env.GITHUB_ACTIONS);

const allowLocalhostInCi = () => {
  const raw = (process.env.PW_ALLOW_LOCALHOST ?? '').trim().toLowerCase();
  return raw === '1' || raw === 'true' || raw === 'yes';
};

const isLocalhostUrl = (value: string) => /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:|\/|$)/i.test(value);

const resolveBaseUrl = (baseURLFromPlaywright: string | undefined, yamlBaseUrl: string | undefined) => {
  const explicit = process.env.PW_BASE_URL?.trim();
  const resolved = explicit || baseURLFromPlaywright || yamlBaseUrl || 'http://localhost:3000';
  const normalized = resolved.replace(/\/+$/, '');

  if (isCiEnv()) {
    const allowLocalhost = allowLocalhostInCi();
    // CI'da localhost default olarak yasak; yalnızca self-hosted lokal koşum için PW_ALLOW_LOCALHOST=1 ile açılabilir.
    if ((!explicit && !baseURLFromPlaywright && !allowLocalhost) || (isLocalhostUrl(normalized) && !allowLocalhost)) {
      throw new Error(
        [
          "CI/runner ortamında Playwright baseUrl 'localhost' olamaz.",
          "Lütfen PLAYWRIGHT_BASE_URL (veya PW_BASE_URL) env değişkenini staging URL ile set edin.",
          "Self-hosted lokal koşum için PW_ALLOW_LOCALHOST=1 kullanabilirsiniz.",
          `Resolved baseUrl=${normalized}`,
        ].join(' '),
      );
    }
  }

  return normalized;
};

const toRegex = (pattern: string) => new RegExp(pattern);

const isAllowedByStatusMatrix = (matrix: ExpectedStatusMatrix | undefined, url: string, status?: number) => {
  if (!matrix || status === undefined) return false;
  for (const [pattern, allowedStatuses] of Object.entries(matrix)) {
    const regex = toRegex(pattern);
    if (!regex.test(url)) continue;
    return allowedStatuses.includes(status);
  }
  return false;
};

const mergeAllowlists = (
  defaults: ScenariosFile['defaults'] | undefined,
  scenario: ScenarioConfig,
  extraReadonlyAllowlist: TelemetryAllowlists['readonly_allowlist'],
): TelemetryAllowlists => {
  const defaultsNetwork = (defaults?.network_allowlist ?? []).map((rule) => ({
    url: rule.url,
    status: rule.status,
    method: rule.method,
  }));
  const scenarioNetwork = (scenario.network_allowlist ?? []).map((rule) => ({
    url: rule.url,
    status: rule.status,
    method: rule.method,
  }));

  const extraNetworkAllowlist = (scenario.expected_network_errors_allowlist ?? []).map((pattern) => ({
    url: pattern,
  }));

  const defaultsReadonly = (defaults?.readonly_allowlist ?? []).map((rule) => ({
    url: rule.url,
    method: rule.method,
  }));
  const scenarioReadonly = (scenario.readonly_allowlist ?? []).map((rule) => ({
    url: rule.url,
    method: rule.method,
  }));

  return {
    console_error_allowlist: [...(defaults?.console_error_allowlist ?? []), ...(scenario.console_error_allowlist ?? [])],
    console_warn_allowlist: [...(defaults?.console_warn_allowlist ?? []), ...(scenario.console_warn_allowlist ?? [])],
    network_allowlist: [...defaultsNetwork, ...scenarioNetwork, ...extraNetworkAllowlist],
    readonly_allowlist: [...defaultsReadonly, ...scenarioReadonly, ...(extraReadonlyAllowlist ?? [])],
  };
};

const ensureOutputDir = () => {
  fs.mkdirSync(outputRoot, { recursive: true });
};

type ScenarioStepJournalEntry = {
  index: number;
  label: string;
  status: 'PASS' | 'FAIL';
  error?: string;
};

const describeStep = (step: ScenarioStep) => {
  if ('goto' in step) return `goto:${step.goto}`;
  if ('click' in step) return `click:${step.click}`;
  if ('clickFirst' in step) return `clickFirst:${step.clickFirst}`;
  if ('fill' in step) {
    const raw = step.fill;
    const selector = Array.isArray(raw) ? raw[0] : raw.selector;
    return `fill:${selector}`;
  }
  if ('select' in step) {
    const raw = step.select;
    const selector = Array.isArray(raw) ? raw[0] : raw.selector;
    return `select:${selector}`;
  }
  if ('waitForURL' in step) return `waitForURL:${step.waitForURL}`;
  if ('waitForSelector' in step) return `waitForSelector:${step.waitForSelector}`;
  if ('expectVisible' in step) return `expectVisible:${step.expectVisible}`;
  if ('waitForLoadState' in step) return `waitForLoadState:${step.waitForLoadState}`;
  return 'unknown-step';
};

const installBrowserRuntimeObservers = async (page: Page) => {
  await page.addInitScript(() => {
    const win = window as typeof window & {
      __pwRuntimeObserverInstalled?: boolean;
      __pwResourceFailures?: Array<{
        ts: string;
        url: string;
        tagName?: string;
        resourceType?: string;
        message?: string;
      }>;
      __pwUnhandledRejections?: Array<{ ts: string; message: string; stack?: string }>;
    };

    if (win.__pwRuntimeObserverInstalled) return;
    win.__pwRuntimeObserverInstalled = true;
    win.__pwResourceFailures = [];
    win.__pwUnhandledRejections = [];

    window.addEventListener(
      'error',
      (event) => {
        const target = event.target as (HTMLElement & { src?: string; href?: string; currentSrc?: string }) | null;
        if (!target || target === window) return;
        const url = String(target.currentSrc || target.src || target.href || window.location.href || '');
        const tagName = String(target.tagName || '').toLowerCase();
        if (!url && !tagName) return;
        win.__pwResourceFailures?.push({
          ts: new Date().toISOString(),
          url,
          tagName,
          resourceType: tagName,
          message: event.message || `resource_error:${tagName || 'unknown'}`,
        });
      },
      true,
    );

    window.addEventListener('unhandledrejection', (event) => {
      const reason = event.reason as { message?: string; stack?: string } | string | undefined;
      const message =
        typeof reason === 'string'
          ? reason
          : typeof reason?.message === 'string'
            ? reason.message
            : String(reason ?? 'Unhandled promise rejection');
      const stack = typeof reason === 'object' && reason && typeof reason.stack === 'string' ? reason.stack : undefined;
      win.__pwUnhandledRejections?.push({
        ts: new Date().toISOString(),
        message,
        stack,
      });
    });
  });
};

const collectBrowserRuntimeObservers = async (
  page: Page,
): Promise<{
  resourceFailures: TelemetryResourceFailureEntry[];
  unhandledRejections: TelemetryUnhandledRejectionEntry[];
}> => {
  try {
    return await page.evaluate(() => {
      const win = window as typeof window & {
        __pwResourceFailures?: TelemetryResourceFailureEntry[];
        __pwUnhandledRejections?: TelemetryUnhandledRejectionEntry[];
      };
      return {
        resourceFailures: [...(win.__pwResourceFailures ?? [])],
        unhandledRejections: [...(win.__pwUnhandledRejections ?? [])],
      };
    });
  } catch {
    return {
      resourceFailures: [],
      unhandledRejections: [],
    };
  }
};

const detectRuntimeOverlays = async (page: Page): Promise<TelemetryRuntimeOverlayEntry[]> => {
  try {
    return await page.evaluate(() => {
      const candidates: Array<{ detector: string; selector: string }> = [
        { detector: 'webpack_dev_server_overlay', selector: '#webpack-dev-server-client-overlay' },
        { detector: 'webpack_dev_server_overlay_iframe', selector: 'iframe[src*="webpack-dev-server"], iframe[id*="webpack"]' },
        { detector: 'vite_error_overlay', selector: 'vite-error-overlay' },
        { detector: 'nextjs_overlay', selector: 'nextjs-portal, [data-nextjs-dialog-overlay]' },
      ];

      const isVisible = (element: Element | null) => {
        if (!element) return false;
        const rect = (element as HTMLElement).getBoundingClientRect?.();
        const style = window.getComputedStyle(element as HTMLElement);
        return Boolean(rect && rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none');
      };

      const overlays: TelemetryRuntimeOverlayEntry[] = [];
      for (const candidate of candidates) {
        const element = document.querySelector(candidate.selector);
        if (!isVisible(element)) continue;
        overlays.push({
          ts: new Date().toISOString(),
          detector: candidate.detector,
          snippet: ((element as HTMLElement | null)?.innerText || (element as HTMLElement | null)?.textContent || candidate.selector)
            .trim()
            .replace(/\s+/g, ' ')
            .slice(0, 240),
        });
      }

      const bodyText = (document.body?.innerText || '').replace(/\s+/g, ' ').trim();
      const overlayHints = [/uncaught runtime errors?:/i, /\bscript error\b/i, /element type is invalid/i];
      if (bodyText && overlayHints.some((pattern) => pattern.test(bodyText))) {
        overlays.push({
          ts: new Date().toISOString(),
          detector: 'body_text_runtime_overlay',
          snippet: bodyText.slice(0, 240),
        });
      }

      return overlays;
    });
  } catch {
    return [];
  }
};

const captureScenarioArtifacts = async (page: Page, scenarioName: string, stamp: string) => {
  ensureOutputDir();
  const artifactsDir = path.join(outputRoot, 'artifacts', `${safeName(scenarioName)}-${stamp}`);
  fs.mkdirSync(artifactsDir, { recursive: true });
  const screenshotPath = path.join(artifactsDir, 'final.png');
  const htmlPath = path.join(artifactsDir, 'final.html');

  try {
    await page.screenshot({ path: screenshotPath, fullPage: true });
  } catch {
    // noop
  }

  try {
    fs.writeFileSync(htmlPath, await page.content(), 'utf8');
  } catch {
    // noop
  }

  return {
    screenshotPath: fs.existsSync(screenshotPath) ? screenshotPath : undefined,
    htmlPath: fs.existsSync(htmlPath) ? htmlPath : undefined,
  };
};

const filterAllowedResourceFailures = (
  entries: TelemetryResourceFailureEntry[],
  allowlists: TelemetryAllowlists,
) => {
  const patterns = [
    ...(allowlists.console_error_allowlist ?? []),
    ...((allowlists.network_allowlist ?? []).flatMap((rule) => (rule.url ? [rule.url] : []))),
  ].map((pattern) => new RegExp(pattern));
  if (patterns.length === 0) return entries;
  return entries.filter((entry) => {
    const probe = `${entry.url} ${entry.message ?? ''} ${entry.tagName ?? ''}`;
    return !patterns.some((regex) => regex.test(entry.url) || regex.test(probe));
  });
};

const writeScenarioReport = (result: ScenarioRunResult) => {
  ensureOutputDir();
  const lines: string[] = [];
  lines.push(`# Playwright Senaryo Raporu: ${result.name}`);
  lines.push('');
  lines.push(`- Zaman: ${result.telemetry.startedAt} → ${result.telemetry.endedAt}`);
  lines.push(`- Sonuç: ${result.outcome}`);
  lines.push(`- Seviye: ${result.level}`);
  lines.push('');

  if (result.blockedReasons.length > 0) {
    lines.push('## BLOCKED Nedenleri');
    result.blockedReasons.forEach((reason) => lines.push(`- ${reason}`));
    lines.push('');
  }

  if (result.failReasons.length > 0) {
    lines.push('## FAIL Nedenleri');
    result.failReasons.forEach((reason) => lines.push(`- ${reason}`));
    lines.push('');
  }

  if (result.warnReasons.length > 0) {
    lines.push('## WARN Notları');
    result.warnReasons.forEach((reason) => lines.push(`- ${reason}`));
    lines.push('');
  }

  lines.push('## Telemetry Özeti');
  lines.push('');
  lines.push('| Metrik | Count |');
  lines.push('|---|---:|');
  const s = result.telemetry.summary;
  const mockedCount = result.telemetry.network.filter((item) => item.headers?.['x-pw-mocked'] === '1').length;
  lines.push(`| console.error (allowlist hariç) | ${s.consoleErrors} |`);
  lines.push(`| console.warn (allowlist hariç) | ${s.consoleWarns} |`);
  lines.push(`| pageerror | ${s.pageErrors} |`);
  lines.push(`| xhr/fetch 401 (allowlist hariç) | ${s.network401} |`);
  lines.push(`| xhr/fetch 403 (allowlist hariç) | ${s.network403} |`);
  lines.push(`| xhr/fetch 5xx (allowlist hariç) | ${s.network5xx} |`);
  lines.push(`| xhr/fetch requestfailed (allowlist hariç) | ${s.networkFailures} |`);
  lines.push(`| resource load failure | ${s.resourceFailures ?? 0} |`);
  lines.push(`| xhr/fetch mocked (x-pw-mocked=1) | ${mockedCount} |`);
  lines.push(`| readonly violations (non-GET/HEAD, allowlist hariç) | ${s.readonlyViolations ?? 0} |`);
  lines.push(`| unhandled rejection | ${s.unhandledRejections ?? 0} |`);
  lines.push(`| runtime overlay | ${s.runtimeOverlays ?? 0} |`);
  lines.push('');

  const consoleErrors = result.telemetry.consoleErrors.filter((item) => !item.allowed).slice(0, 10);
  const consoleWarns = result.telemetry.consoleWarns.filter((item) => !item.allowed).slice(0, 10);
  const networkIssues = result.telemetry.network.filter((item) => {
    if (item.allowed) return false;
    if (item.failureText) return true;
    const status = item.status ?? 0;
    return status === 401 || status === 403 || status >= 500;
  }).slice(0, 20);

  if (consoleErrors.length > 0) {
    lines.push('## Console Errors (ilk 10)');
    consoleErrors.forEach((item) => {
      const loc = item.location?.url
        ? ` (${item.location.url}:${item.location.lineNumber ?? 0}:${item.location.columnNumber ?? 0})`
        : '';
      lines.push(`- ${item.text}${loc}`);
    });
    lines.push('');
  }

  if (consoleWarns.length > 0) {
    lines.push('## Console Warns (ilk 10)');
    consoleWarns.forEach((item) => {
      const loc = item.location?.url
        ? ` (${item.location.url}:${item.location.lineNumber ?? 0}:${item.location.columnNumber ?? 0})`
        : '';
      lines.push(`- ${item.text}${loc}`);
    });
    lines.push('');
  }

  if (result.telemetry.pageErrors.length > 0) {
    lines.push('## Uncaught Exceptions (pageerror)');
    result.telemetry.pageErrors.slice(0, 10).forEach((item) => {
      lines.push(`- ${item.message}`);
      if (item.stack) {
        lines.push('');
        lines.push('```');
        lines.push(item.stack);
        lines.push('```');
      }
    });
    lines.push('');
  }

  if (networkIssues.length > 0) {
    lines.push('## Network Issues (xhr/fetch, allowlist hariç)');
    networkIssues.forEach((item) => {
      const status = item.status === undefined ? 'n/a' : String(item.status);
      const auth = item.hasAuthHeader ? 'auth' : 'no-auth';
      const failure = item.failureText ? ` failure=${item.failureText}` : '';
      lines.push(`- ${item.method} ${status} (${auth}) ${item.url}${failure}`);
    });
    lines.push('');
  }

  const readonlyViolations = result.telemetry.readonlyViolations.slice(0, 20);
  if (readonlyViolations.length > 0) {
    lines.push('## Readonly Violations (xhr/fetch, allowlist hariç)');
    readonlyViolations.forEach((item) => {
      const status = item.status === undefined ? 'n/a' : String(item.status);
      lines.push(`- ${item.method} ${status} ${item.url}`);
    });
    lines.push('');
  }

  const resourceFailures = result.telemetry.resourceFailures.slice(0, 20);
  if (resourceFailures.length > 0) {
    lines.push('## Resource Failures');
    resourceFailures.forEach((item) => {
      lines.push(`- ${item.tagName ?? item.resourceType ?? 'resource'} ${item.url} ${item.message ? `(${item.message})` : ''}`.trim());
    });
    lines.push('');
  }

  const unhandledRejections = result.telemetry.unhandledRejections.slice(0, 10);
  if (unhandledRejections.length > 0) {
    lines.push('## Unhandled Rejections');
    unhandledRejections.forEach((item) => {
      lines.push(`- ${item.message}`);
      if (item.stack) {
        lines.push('');
        lines.push('```');
        lines.push(item.stack);
        lines.push('```');
      }
    });
    lines.push('');
  }

  const runtimeOverlays = result.telemetry.runtimeOverlays.slice(0, 10);
  if (runtimeOverlays.length > 0) {
    lines.push('## Runtime Overlays');
    runtimeOverlays.forEach((item) => {
      lines.push(`- ${item.detector}: ${item.snippet}`);
    });
    lines.push('');
  }

  const artifactLines = [result.artifacts.screenshotPath, result.artifacts.htmlPath, result.artifacts.stepJournalPath]
    .filter(Boolean)
    .map((artifact) => path.relative(webRoot, artifact as string));
  if (artifactLines.length > 0) {
    lines.push('## Evidence Artifacts');
    artifactLines.forEach((artifact) => lines.push(`- ${artifact}`));
    lines.push('');
  }

  fs.writeFileSync(result.reportPath, lines.join('\n'), 'utf8');
};

const writeSummaryReport = (stamp: string, results: ScenarioRunResult[]) => {
  ensureOutputDir();
  const summaryPath = path.join(outputRoot, `pw-summary-${stamp}.md`);
  const lines: string[] = [];
  lines.push('# Playwright Senaryo Özeti');
  lines.push('');
  lines.push(`- Zaman: ${stamp}`);
  lines.push(`- Senaryo sayısı: ${results.length}`);
  lines.push('');
  lines.push('| Senaryo | Seviye | Sonuç | Rapor |');
  lines.push('|---|---:|---|---|');
  results.forEach((r) => {
    const rel = path.relative(webRoot, r.reportPath);
    lines.push(`| ${r.name} | ${r.level} | ${r.outcome} | ${rel} |`);
  });
  lines.push('');

  const failScenarios = results.filter((r) => r.outcome === 'FAIL');
  if (failScenarios.length > 0) {
    lines.push('## Action Required');
    failScenarios.forEach((r) => {
      r.failReasons.forEach((reason) => lines.push(`- ${r.name}: ${reason}`));
    });
    lines.push('');
  }

  const blockedScenarios = results.filter((r) => r.outcome === 'BLOCKED');
  if (blockedScenarios.length > 0) {
    lines.push('## Blocked');
    blockedScenarios.forEach((r) => {
      r.blockedReasons.forEach((reason) => lines.push(`- ${r.name}: ${reason}`));
    });
    lines.push('');
  }

  const topConsoleErrors = results
    .flatMap((r) => r.telemetry.consoleErrors.filter((item) => !item.allowed).map((item) => ({ r, item })))
    .slice(0, 10);
  if (topConsoleErrors.length > 0) {
    lines.push('## İlk 10 console.error');
    topConsoleErrors.forEach(({ r, item }) => {
      lines.push(`- ${r.name}: ${item.text}`);
    });
    lines.push('');
  }

  const topNetworkIssues = results
    .flatMap((r) => r.telemetry.network.filter((item) => {
      if (item.allowed) return false;
      if (item.failureText) return true;
      const status = item.status ?? 0;
      return status === 401 || status === 403 || status >= 500;
    }).map((item) => ({ r, item })))
    .slice(0, 10);
  if (topNetworkIssues.length > 0) {
    lines.push('## İlk 10 network issue (xhr/fetch)');
    topNetworkIssues.forEach(({ r, item }) => {
      const status = item.status === undefined ? 'n/a' : String(item.status);
      lines.push(`- ${r.name}: ${item.method} ${status} ${item.url}`);
    });
    lines.push('');
  }

  const topResourceFailures = results
    .flatMap((r) => r.telemetry.resourceFailures.map((item) => ({ r, item })))
    .slice(0, 10);
  if (topResourceFailures.length > 0) {
    lines.push('## İlk 10 resource failure');
    topResourceFailures.forEach(({ r, item }) => {
      lines.push(`- ${r.name}: ${item.tagName ?? item.resourceType ?? 'resource'} ${item.url}`);
    });
    lines.push('');
  }

  const topOverlays = results
    .flatMap((r) => r.telemetry.runtimeOverlays.map((item) => ({ r, item })))
    .slice(0, 10);
  if (topOverlays.length > 0) {
    lines.push('## İlk 10 runtime overlay');
    topOverlays.forEach(({ r, item }) => {
      lines.push(`- ${r.name}: ${item.detector} ${item.snippet}`);
    });
    lines.push('');
  }

  fs.writeFileSync(summaryPath, lines.join('\n'), 'utf8');
};

const runStep = async (
  page: Page,
  root: string,
  step: ScenarioStep,
) => {
  if ('goto' in step) {
    const target = step.goto.startsWith('http') ? step.goto : `${root}${step.goto}`;
    await page.goto(target, { waitUntil: 'domcontentloaded' });
    return;
  }
  if ('click' in step) {
    await page.locator(step.click).click();
    return;
  }
  if ('clickFirst' in step) {
    await page.locator(step.clickFirst).first().click();
    return;
  }
  if ('fill' in step) {
    const raw = step.fill;
    const selector = Array.isArray(raw) ? raw[0] : raw.selector;
    const value = Array.isArray(raw) ? raw[1] : raw.value;
    await page.locator(selector).fill(value);
    return;
  }
  if ('select' in step) {
    const raw = step.select;
    const selector = Array.isArray(raw) ? raw[0] : raw.selector;
    const value = Array.isArray(raw) ? raw[1] : raw.value;
    await page.locator(selector).selectOption(value);
    return;
  }
  if ('waitForURL' in step) {
    await page.waitForURL(step.waitForURL);
    return;
  }
  if ('waitForSelector' in step) {
    await page.waitForSelector(step.waitForSelector, { state: 'visible' });
    return;
  }
  if ('expectVisible' in step) {
    await expect(page.locator(step.expectVisible)).toBeVisible();
    return;
  }
  if ('waitForLoadState' in step) {
    await page.waitForLoadState(step.waitForLoadState);
    return;
  }
  console.warn('[pw_runner] unsupported step', step);
};

const mockJson = async (route: Route, body: unknown) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    headers: {
      'x-pw-mocked': '1',
      'cache-control': 'no-store',
    },
    body: JSON.stringify(body),
  });
};

const mockThemeRegistryEntries = [
  {
    id: 'reg-surface-page-bg',
    key: 'surface.page.bg',
    label: 'Page Background',
    groupName: 'surface',
    controlType: 'COLOR',
    editableBy: 'ADMIN_ONLY',
    cssVars: ['--surface-page-bg'],
    description: 'Shell ana sayfa zemini.',
  },
  {
    id: 'reg-text-primary',
    key: 'text.primary',
    label: 'Primary Text',
    groupName: 'text',
    controlType: 'COLOR',
    editableBy: 'ADMIN_ONLY',
    cssVars: ['--text-primary'],
    description: 'Birincil metin rengi.',
  },
  {
    id: 'reg-accent-primary',
    key: 'accent.primary',
    label: 'Primary Accent',
    groupName: 'accent',
    controlType: 'COLOR',
    editableBy: 'ADMIN_ONLY',
    cssVars: ['--accent-primary'],
    description: 'Ana vurgu rengi.',
  },
];

const mockThemeSummaries = [
  {
    id: 'pw-light',
    name: 'Global Light',
    type: 'GLOBAL',
    appearance: 'light',
    surfaceTone: 'ultra-2',
    activeFlag: true,
    visibility: 'VISIBLE',
    axes: {
      accent: 'neutral',
      density: 'comfortable',
      radius: 'rounded',
      elevation: 'raised',
      motion: 'standard',
    },
  },
  {
    id: 'pw-ocean',
    name: 'Global Ocean',
    type: 'GLOBAL',
    appearance: 'light',
    surfaceTone: 'mid-2',
    activeFlag: true,
    visibility: 'VISIBLE',
    axes: {
      accent: 'ocean',
      density: 'comfortable',
      radius: 'rounded',
      elevation: 'raised',
      motion: 'standard',
    },
  },
  {
    id: 'pw-graphite',
    name: 'Global Graphite',
    type: 'GLOBAL',
    appearance: 'dark',
    surfaceTone: 'deep-2',
    activeFlag: false,
    visibility: 'VISIBLE',
    axes: {
      accent: 'graphite',
      density: 'compact',
      radius: 'sharp',
      elevation: 'flat',
      motion: 'reduced',
    },
  },
];

const mockThemeDetailsById = Object.fromEntries(
  mockThemeSummaries.map((theme) => [
    theme.id,
    {
      ...theme,
      overrides:
        theme.id === 'pw-ocean'
          ? {
              'accent.primary': '#0ea5e9',
              'surface.page.bg': '#f5fbff',
            }
          : theme.id === 'pw-graphite'
            ? {
                'accent.primary': '#475569',
                'surface.page.bg': '#0f172a',
              }
            : {
                'accent.primary': '#f97316',
                'surface.page.bg': '#fffaf5',
              },
    },
  ]),
);

const mockAccessRoleItems = [
  {
    id: 'role-ops-admin',
    name: 'Operasyon Admin',
    description: 'Tum modullerde yonetim yetkisine sahip rol.',
    memberCount: 8,
    systemRole: true,
    lastModifiedAt: '2025-10-15T09:12:00Z',
    lastModifiedBy: 'melisa.erden',
    permissions: ['VIEW_USERS', 'MANAGE_USERS', 'VIEW_AUDIT', 'EDIT_SECURITY'],
    policies: [
      {
        moduleKey: 'USER_MANAGEMENT',
        moduleLabel: 'Kullanici Yonetimi',
        level: 'MANAGE',
        lastUpdatedAt: '2025-09-30T11:20:00Z',
        updatedBy: 'melisa.erden',
      },
      {
        moduleKey: 'AUDIT_TRAIL',
        moduleLabel: 'Audit Kayitlari',
        level: 'VIEW',
        lastUpdatedAt: '2025-10-02T10:05:00Z',
        updatedBy: 'melisa.erden',
      },
    ],
  },
  {
    id: 'role-analytics',
    name: 'Raporlama Analisti',
    description: 'Rapor ve icgoru uretimi icin erisimler.',
    memberCount: 6,
    systemRole: false,
    lastModifiedAt: '2025-10-01T11:37:00Z',
    lastModifiedBy: 'eda.aksoy',
    permissions: ['VIEW_REPORTS', 'VIEW_AUDIT'],
    policies: [
      {
        moduleKey: 'REPORTING',
        moduleLabel: 'Raporlama',
        level: 'MANAGE',
        lastUpdatedAt: '2025-10-01T11:37:00Z',
        updatedBy: 'eda.aksoy',
      },
    ],
  },
];

const mockPermissionItems = [
  {
    id: 'VIEW_USERS',
    code: 'VIEW_USERS',
    moduleKey: 'USER_MANAGEMENT',
    moduleLabel: 'Kullanici Yonetimi',
  },
  {
    id: 'MANAGE_USERS',
    code: 'MANAGE_USERS',
    moduleKey: 'USER_MANAGEMENT',
    moduleLabel: 'Kullanici Yonetimi',
  },
  {
    id: 'VIEW_AUDIT',
    code: 'VIEW_AUDIT',
    moduleKey: 'AUDIT_TRAIL',
    moduleLabel: 'Audit Kayitlari',
  },
];

const mockAuditEvents = Array.from({ length: 12 }).map((_, index) => ({
  id: `pw-audit-${index + 1}`,
  timestamp: new Date(Date.now() - index * 60_000).toISOString(),
  userEmail: `user${(index % 3) + 1}@example.com`,
  service: index % 2 === 0 ? 'permission-service' : 'auth-service',
  action: index % 2 === 0 ? 'ROLE_ASSIGNED' : 'ROLE_REVOKED',
  level: index % 3 === 0 ? 'ERROR' : index % 3 === 1 ? 'WARN' : 'INFO',
  details: 'Playwright mock audit event',
  metadata: { scope: index % 2 === 0 ? 'global' : 'project', actorId: 2000 + index },
  before: index % 2 === 0 ? null : { permissions: ['VIEW_USERS'] },
  after: index % 2 === 0 ? { permissions: ['VIEW_USERS', 'MANAGE_USERS'] } : null,
  correlationId: `pw-corr-${Math.floor(index / 3)}`,
}));

const mockUsersReportItems = [
  {
    id: 'user-1',
    fullName: 'Ayse Yilmaz',
    email: 'ayse@example.com',
    role: 'Admin',
    status: 'ACTIVE',
    lastLoginAt: '2026-03-05T09:15:00Z',
    createdAt: '2025-11-01T08:00:00Z',
  },
  {
    id: 'user-2',
    fullName: 'Mehmet Demir',
    email: 'mehmet@example.com',
    role: 'Analyst',
    status: 'INVITED',
    lastLoginAt: null,
    createdAt: '2025-12-10T13:30:00Z',
  },
  {
    id: 'user-3',
    fullName: 'Elif Kaya',
    email: 'elif@example.com',
    role: 'Reporter',
    status: 'SUSPENDED',
    lastLoginAt: '2026-03-04T17:45:00Z',
    createdAt: '2025-09-18T10:20:00Z',
  },
];

const installThemeRegistryMock = async (page: Page) => {
  await page.route(/\/api\/v1\/theme-registry(?:\?.*)?$/i, async (route, request) => {
    if (request.method() !== 'GET') {
      await route.continue();
      return;
    }
    await mockJson(route, mockThemeRegistryEntries);
  });
};

const installApiMocks = async (page: Page) => {
  await page.route(/\/api\/v1\/me\/theme\/resolved(?:\?.*)?$/i, async (route, request) => {
    if (request.method() !== 'GET') {
      await route.continue();
      return;
    }
    await mockJson(route, { themeId: 'pw-default', type: 'GLOBAL', appearance: 'light', tokens: {} });
  });

  await page.route(/\/audit\/events\/live(?:\?.*)?$/i, async (route, request) => {
    if (request.method() !== 'GET' || !['fetch', 'xhr'].includes(request.resourceType())) {
      await route.continue();
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'text/event-stream',
      headers: {
        'x-pw-mocked': '1',
        'cache-control': 'no-store',
      },
      body: `data: ${JSON.stringify(mockAuditEvents[0])}\n\n`,
    });
  });

  await page.route(/(?:\/api)?\/v1\/roles(?:\?.*)?$/i, async (route, request) => {
    if (request.method() !== 'GET') {
      await route.continue();
      return;
    }
    await mockJson(route, { items: mockAccessRoleItems, total: mockAccessRoleItems.length });
  });

  await page.route(/(?:\/api)?\/v1\/roles\/[^/?]+(?:\?.*)?$/i, async (route, request) => {
    if (request.method() !== 'GET') {
      await route.continue();
      return;
    }
    const url = new URL(request.url());
    const match = url.pathname.match(/(?:\/api)?\/v1\/roles\/([^/?]+)$/i);
    const roleId = decodeURIComponent(match?.[1] ?? '');
    const role = mockAccessRoleItems.find((item) => item.id === roleId) ?? mockAccessRoleItems[0];
    await mockJson(route, role);
  });

  await page.route(/(?:\/api)?\/v1\/permissions(?:\?.*)?$/i, async (route, request) => {
    if (request.method() !== 'GET') {
      await route.continue();
      return;
    }
    await mockJson(route, { items: mockPermissionItems, total: mockPermissionItems.length });
  });

  await page.route(/\/audit\/events(?:\?.*)?$/i, async (route, request) => {
    if (request.method() !== 'GET' || !['fetch', 'xhr'].includes(request.resourceType())) {
      await route.continue();
      return;
    }
    const url = new URL(request.url());
    const pageNumber = Number(url.searchParams.get('page') ?? 0) || 0;
    const pageSize = Number(url.searchParams.get('size') ?? 200) || 200;
    const userEmail = (url.searchParams.get('filter[userEmail]') ?? '').toLowerCase();
    const service = (url.searchParams.get('filter[service]') ?? '').toLowerCase();
    const level = (url.searchParams.get('filter[level]') ?? '').toUpperCase();
    const filtered = mockAuditEvents.filter((item) => {
      if (userEmail && !item.userEmail.toLowerCase().includes(userEmail)) return false;
      if (service && !item.service.toLowerCase().includes(service)) return false;
      if (level && item.level !== level) return false;
      return true;
    });
    const start = pageNumber * pageSize;
    const items = filtered.slice(start, start + pageSize);
    await mockJson(route, { events: items, total: filtered.length, page: pageNumber });
  });

  await page.route(/(?:\/api)?\/v1\/users(?:\?.*)?$/i, async (route, request) => {
    if (request.method() !== 'GET') {
      await route.continue();
      return;
    }
    const url = new URL(request.url());
    const pageNumber = Number(url.searchParams.get('page') ?? 1) || 1;
    const pageSize = Number(url.searchParams.get('pageSize') ?? 20) || 20;
    const search = (url.searchParams.get('search') ?? '').toLowerCase();
    const status = (url.searchParams.get('status') ?? '').toUpperCase();
    const filtered = mockUsersReportItems.filter((item) => {
      if (
        search &&
        ![item.fullName, item.email, item.role, item.id].some((field) =>
          String(field ?? '').toLowerCase().includes(search),
        )
      ) {
        return false;
      }
      if (status && item.status !== status) {
        return false;
      }
      return true;
    });
    const start = Math.max(pageNumber - 1, 0) * pageSize;
    const items = filtered.slice(start, start + pageSize);
    await mockJson(route, { items, total: filtered.length, page: pageNumber, pageSize });
  });

  await page.route(/\/manifest\/v1\/manifest\.json(?:\?.*)?$/i, async (route, request) => {
    if (request.method() !== 'GET') {
      await route.continue();
      return;
    }
    await mockJson(route, { pages: {} });
  });

  await page.route(/\/manifest\/v1\/page-(users|access)\.layout\.json(?:\?.*)?$/i, async (route, request) => {
    if (request.method() !== 'GET') {
      await route.continue();
      return;
    }
    await mockJson(route, {});
  });

  await page.route(/\/api\/v1\/themes(?:\?.*)?$/i, async (route, request) => {
    if (request.method() !== 'GET') {
      await route.continue();
      return;
    }
    await mockJson(route, mockThemeSummaries);
  });

  await page.route(/\/api\/v1\/themes\/[^/?]+(?:\?.*)?$/i, async (route, request) => {
    const url = new URL(request.url());
    const match = url.pathname.match(/\/api\/v1\/themes\/([^/?]+)$/i);
    const themeId = match?.[1] ?? '';
    if (request.method() !== 'GET') {
      await route.continue();
      return;
    }
    await mockJson(route, mockThemeDetailsById[themeId] ?? mockThemeDetailsById['pw-light']);
  });
};

const evaluateOutcome = (
  scenario: ScenarioConfig,
  defaults: ScenariosFile['defaults'] | undefined,
  telemetry: TelemetryResult,
) => {
  const failReasons: string[] = [];
  const warnReasons: string[] = [];

  const failOnConsoleError = scenario.fail_on_console_error ?? defaults?.fail_on_console_error ?? true;
  const warnOnConsoleWarn = scenario.warn_on_console_warn ?? defaults?.warn_on_console_warn ?? true;

  if (telemetry.pageErrors.length > 0) {
    failReasons.push(`Uncaught exception (pageerror): ${telemetry.pageErrors.length}`);
  }
  if (failOnConsoleError && telemetry.summary.consoleErrors > 0) {
    failReasons.push(`console.error: ${telemetry.summary.consoleErrors}`);
  }
  if (warnOnConsoleWarn && telemetry.summary.consoleWarns > 0) {
    warnReasons.push(`console.warn: ${telemetry.summary.consoleWarns}`);
  }
  if (telemetry.summary.networkFailures > 0) {
    failReasons.push(`xhr/fetch requestfailed: ${telemetry.summary.networkFailures}`);
  }
  if (telemetry.summary.network5xx > 0) {
    failReasons.push(`xhr/fetch 5xx: ${telemetry.summary.network5xx}`);
  }
  if ((telemetry.summary.resourceFailures ?? 0) > 0) {
    failReasons.push(`resource load failure: ${telemetry.summary.resourceFailures}`);
  }
  if ((telemetry.summary.unhandledRejections ?? 0) > 0) {
    failReasons.push(`unhandled rejection: ${telemetry.summary.unhandledRejections}`);
  }
  if ((telemetry.summary.runtimeOverlays ?? 0) > 0) {
    failReasons.push(`runtime overlay: ${telemetry.summary.runtimeOverlays}`);
  }

  const matrix = scenario.expected_status_matrix;
  const authRequired = Boolean(scenario.auth_required);
  const authFailures = telemetry.network.filter((item) => {
    if (item.allowed) return false;
    if (item.status !== 401 && item.status !== 403) return false;
    if (isAllowedByStatusMatrix(matrix, item.url, item.status)) return false;
    return true;
  });

  authFailures.forEach((item) => {
    const line = `${item.method} ${item.url}`;
    if (!authRequired) {
      warnReasons.push(`${item.status}: ${line}`);
      return;
    }
    if (item.status === 401 && item.hasAuthHeader) {
      failReasons.push(`401 (token varken): ${line}`);
      return;
    }
    failReasons.push(`${item.status}: ${line}`);
  });

  return { failReasons, warnReasons };
};

test.describe('Playwright YAML scenario runner', () => {
  const softMode = parseSoftMode();
  const authMode = parseAuthMode();
  const readonlyEnforce = parseReadonlyEnforce();
  const readonlyPathRegex = parseReadonlyPathRegex();
  const mockThemeRegistry = parseMockThemeRegistry();
  const mockApi = parseMockApi();
  const readonlyAllowlistEnv = parseReadonlyAllowlistFromEnv(softMode);

  if (!softMode) {
    test.describe.configure({ mode: 'serial' });
  }

  const stamp = nowStamp();
  const targetsPath = path.resolve(webRoot, process.env.PW_TARGETS ?? path.relative(webRoot, defaultTargetsPath));
  const mode = parseMode();
  const config = readYamlTargets(targetsPath);
  const selectedScenarios = config.scenarios.filter((scenario) => (mode === 'nightly' ? true : scenario.level === 1));
  const results: ScenarioRunResult[] = [];

  test.afterAll(() => {
    writeSummaryReport(stamp, results);
  });

  selectedScenarios.forEach((scenario) => {
    test(scenario.name, async ({ page, baseURL }) => {
      const root = resolveBaseUrl(baseURL, scenario.baseUrl ?? config.baseUrl);
      const allowlists = mergeAllowlists(config.defaults, scenario, readonlyAllowlistEnv);
      const telemetrySession = createTelemetryCollector(page, allowlists, { readonlyEnforce, readonlyPathRegex });
      await installBrowserRuntimeObservers(page);

      const blockedReasons: string[] = [];
      const failReasons: string[] = [];
      const warnReasons: string[] = [];
      let telemetry: TelemetryResult;
      const stepJournal: ScenarioStepJournalEntry[] = [];

      if (mockThemeRegistry) {
        await installThemeRegistryMock(page);
      }
      if (mockApi) {
        await installApiMocks(page);
      }

      const authRequired = Boolean(scenario.auth_required);
      if (authRequired) {
        if (authMode === 'none') {
          blockedReasons.push('AUTH_NOT_CONFIGURED');
        } else if (authMode === 'token_injection') {
          // Token kaynağı:
          // - PW_TEST_TOKEN (manuel override)
          // - Keycloak token endpoint (client credentials) (KEYCLOAK_* env)
          if (!hasInjectedToken() && !hasTokenEndpointConfig()) {
            if (softMode) blockedReasons.push('AUTH_BLOCKED: TOKEN_NOT_PROVIDED');
            else throw new Error('TOKEN_NOT_PROVIDED');
          }
        } else {
          blockedReasons.push(`UNSUPPORTED_AUTH_MODE: ${authMode}`);
        }
      }

      try {
        if (blockedReasons.length === 0) {
          let authenticated = false;
          const firstGoto = scenario.steps.find((step): step is { goto: string } => 'goto' in step);
          const firstPath = firstGoto?.goto ?? '/';

          for (const [index, step] of scenario.steps.entries()) {
            const label = describeStep(step);
            try {
              if (index === 0 && 'goto' in step && scenario.auth_required && !authenticated) {
                await authenticateAndNavigate(page, root, step.goto, scenario.permissions ?? []);
                authenticated = true;
                stepJournal.push({ index, label, status: 'PASS' });
                continue;
              }
              if (!authenticated && scenario.auth_required) {
                await authenticateAndNavigate(page, root, firstPath, scenario.permissions ?? []);
                authenticated = true;
              }
              await runStep(page, root, step);
              stepJournal.push({ index, label, status: 'PASS' });
            } catch (error) {
              const message = error instanceof Error ? error.message : String(error);
              stepJournal.push({ index, label, status: 'FAIL', error: message });
              throw new Error(`STEP_FAILED[${index}] ${label}: ${message}`);
            }
          }
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const isAuthError = /TOKEN_NOT_PROVIDED|TOKEN_ENDPOINT_FAILED/i.test(message);
        if (isAuthError) blockedReasons.push(`AUTH_BLOCKED: ${message}`);
        else failReasons.push(message);
      } finally {
        const runtimeObserverData = await collectBrowserRuntimeObservers(page);
        const runtimeOverlays = await detectRuntimeOverlays(page);
        telemetry = telemetrySession.stop();
        telemetry.resourceFailures = filterAllowedResourceFailures(runtimeObserverData.resourceFailures, allowlists);
        telemetry.unhandledRejections = runtimeObserverData.unhandledRejections;
        telemetry.runtimeOverlays = runtimeOverlays;
        telemetry.summary.resourceFailures = telemetry.resourceFailures.length;
        telemetry.summary.unhandledRejections = runtimeObserverData.unhandledRejections.length;
        telemetry.summary.runtimeOverlays = runtimeOverlays.length;
      }

      const core = evaluateOutcome(scenario, config.defaults, telemetry);
      failReasons.push(...core.failReasons);
      warnReasons.push(...core.warnReasons);

      if (readonlyEnforce && (telemetry.readonlyViolations?.length ?? 0) > 0) {
        const count = telemetry.readonlyViolations?.length ?? 0;
        if (softMode) {
          warnReasons.push(`readonly ihlali (/api/ write): ${count}`);
        } else {
          failReasons.push(`readonly ihlali (/api/ write): ${count}`);
        }
      }

      const outcome: ScenarioOutcome =
        blockedReasons.length > 0
          ? 'BLOCKED'
          : failReasons.length > 0
            ? 'FAIL'
            : warnReasons.length > 0
              ? 'WARN'
              : 'PASS';
      const reportPath = path.join(outputRoot, `pw-scenario-${safeName(scenario.name)}-${stamp}.md`);
      const artifactBaseDir = path.join(outputRoot, 'artifacts', `${safeName(scenario.name)}-${stamp}`);
      fs.mkdirSync(artifactBaseDir, { recursive: true });
      const evidenceArtifacts = await captureScenarioArtifacts(page, scenario.name, stamp);
      const stepJournalPath = path.join(artifactBaseDir, 'step-journal.json');
      fs.writeFileSync(stepJournalPath, JSON.stringify(stepJournal, null, 2), 'utf8');
      const runResult: ScenarioRunResult = {
        name: scenario.name,
        level: scenario.level,
        outcome,
        failReasons,
        warnReasons,
        blockedReasons,
        telemetry,
        reportPath,
        artifacts: {
          screenshotPath: evidenceArtifacts.screenshotPath,
          htmlPath: evidenceArtifacts.htmlPath,
          stepJournalPath,
        },
      };
      results.push(runResult);
      writeScenarioReport(runResult);

      if (!softMode && (outcome === 'FAIL' || outcome === 'BLOCKED')) {
        throw new Error([...blockedReasons, ...failReasons].filter(Boolean).join(' | '));
      }
    });
  });
});
