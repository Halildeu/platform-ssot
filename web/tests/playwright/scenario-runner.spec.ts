import fs from 'node:fs';
import path from 'node:path';
import { load as loadYaml } from 'js-yaml';
import { test, expect, type Page } from '@playwright/test';
import { authenticateAndNavigate } from './utils/auth';
import { createTelemetryCollector, type TelemetryAllowlists, type TelemetryResult } from './utils/pw_telemetry';

type ScenarioStep =
  | { goto: string }
  | { click: string }
  | { fill: { selector: string; value: string } | [string, string] }
  | { waitForURL: string }
  | { waitForSelector: string }
  | { expectVisible: string };

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
};

const webRoot = path.resolve(__dirname, '../..');
const defaultTargetsPath = path.resolve(__dirname, 'pw_scenarios.yml');
const outputRoot = path.join(webRoot, 'test-results', 'pw');

const nowStamp = () => new Date().toISOString().replace(/[:.]/g, '-');

const parseSoftMode = () => (process.env.PW_SOFT_MODE ?? '').trim() === '1';

const parseAuthMode = () => (process.env.PW_AUTH_MODE ?? 'none').trim().toLowerCase();

const parseReadonlyEnforce = () => (process.env.PW_READONLY_ENFORCE ?? '').trim() === '1';

const parseReadonlyPathRegex = () => (process.env.PW_READONLY_PATH_REGEX ?? '/api/').trim() || '/api/';

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

const isLocalhostUrl = (value: string) => /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:|\/|$)/i.test(value);

const resolveBaseUrl = (baseURLFromPlaywright: string | undefined, yamlBaseUrl: string | undefined) => {
  const explicit = process.env.PW_BASE_URL?.trim();
  const resolved = explicit || baseURLFromPlaywright || yamlBaseUrl || 'http://localhost:3000';
  const normalized = resolved.replace(/\/+$/, '');

  if (isCiEnv()) {
    // CI'da localhost fallback yasak: baseUrl mutlaka env veya Playwright config üzerinden gelmeli.
    if ((!explicit && !baseURLFromPlaywright) || isLocalhostUrl(normalized)) {
      throw new Error(
        [
          "CI/runner ortamında Playwright baseUrl 'localhost' olamaz.",
          "Lütfen PLAYWRIGHT_BASE_URL (veya PW_BASE_URL) env değişkenini staging URL ile set edin.",
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
  lines.push(`| console.error (allowlist hariç) | ${s.consoleErrors} |`);
  lines.push(`| console.warn (allowlist hariç) | ${s.consoleWarns} |`);
  lines.push(`| pageerror | ${s.pageErrors} |`);
  lines.push(`| xhr/fetch 401 (allowlist hariç) | ${s.network401} |`);
  lines.push(`| xhr/fetch 403 (allowlist hariç) | ${s.network403} |`);
  lines.push(`| xhr/fetch 5xx (allowlist hariç) | ${s.network5xx} |`);
  lines.push(`| xhr/fetch requestfailed (allowlist hariç) | ${s.networkFailures} |`);
  lines.push(`| readonly violations (non-GET/HEAD, allowlist hariç) | ${s.readonlyViolations ?? 0} |`);
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
  if ('fill' in step) {
    const raw = step.fill;
    const selector = Array.isArray(raw) ? raw[0] : raw.selector;
    const value = Array.isArray(raw) ? raw[1] : raw.value;
    await page.locator(selector).fill(value);
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
  console.warn('[pw_runner] unsupported step', step);
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

      const blockedReasons: string[] = [];
      const failReasons: string[] = [];
      const warnReasons: string[] = [];
      let telemetry: TelemetryResult;

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
            if (index === 0 && 'goto' in step && scenario.auth_required && !authenticated) {
              await authenticateAndNavigate(page, root, step.goto, scenario.permissions ?? []);
              authenticated = true;
              continue;
            }
            if (!authenticated && scenario.auth_required) {
              await authenticateAndNavigate(page, root, firstPath, scenario.permissions ?? []);
              authenticated = true;
            }
            await runStep(page, root, step);
          }
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const isAuthError = /TOKEN_NOT_PROVIDED|TOKEN_ENDPOINT_FAILED/i.test(message);
        if (softMode) {
          if (isAuthError) blockedReasons.push(`AUTH_BLOCKED: ${message}`);
          else failReasons.push(message);
        } else {
          throw error;
        }
      } finally {
        telemetry = telemetrySession.stop();
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
      const runResult: ScenarioRunResult = {
        name: scenario.name,
        level: scenario.level,
        outcome,
        failReasons,
        warnReasons,
        blockedReasons,
        telemetry,
        reportPath,
      };
      results.push(runResult);
      writeScenarioReport(runResult);

      if (!softMode && (outcome === 'FAIL' || outcome === 'BLOCKED')) {
        throw new Error([...blockedReasons, ...failReasons].filter(Boolean).join(' | '));
      }
    });
  });
});
