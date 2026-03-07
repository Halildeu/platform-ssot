#!/usr/bin/env node
import { mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, '..', '..');
const repoRoot = path.resolve(webRoot, '..');
const doctorRoot = path.join(webRoot, 'test-results', 'diagnostics', 'frontend-doctor');
const pwRoot = path.join(webRoot, 'test-results', 'pw');
const smokeRoot = path.join(webRoot, 'tests', 'smoke', 'artifacts');

const now = new Date();
const stamp = now.toISOString().replace(/[:.]/g, '-');

const args = process.argv.slice(2);
const getArg = (name, fallback = null) => {
  const idx = args.indexOf(name);
  if (idx === -1) return fallback;
  return args[idx + 1] ?? fallback;
};

const preset = getArg('--preset', 'ui-library');
const presetSlug = preset.replace(/[^a-z0-9_-]+/gi, '-').toLowerCase();
const outDir = path.join(doctorRoot, `${stamp}-${presetSlug}`);
const logDir = path.join(outDir, 'logs');
mkdirSync(logDir, { recursive: true });

const baseUrl = getArg('--base-url', process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000');
const softMode = getArg('--soft-mode', process.env.PW_SOFT_MODE || '0');
const authMode = getArg('--auth-mode', process.env.PW_AUTH_MODE || 'none');
const defaultInjectedToken = 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJwZXJtaXNzaW9ucyI6WyJUSEVNRV9BRE1JTiJdLCJzZXNzaW9uVGltZW91dE1pbnV0ZXMiOjYwfQ.shell';

const presetMap = {
  'ui-library': {
    description: 'UI Library vitrini ve login/gateway smoke denetimi',
    route: '/ui-library',
    stackId: 'shell-only',
    playwrightGrep:
      'ui_library_page|ui_library_navigation_walk|ui_library_foundation_wave_1_walk|ui_library_navigation_wave_2_walk|ui_library_forms_wave_3_walk|ui_library_data_display_wave_4_walk',
    steps: [
      {
        id: 'shell_build',
        label: 'Shell build',
        cmd: 'npm',
        args: ['run', 'build:shell'],
        cwd: webRoot,
      },
      {
        id: 'tailwind_lint',
        label: 'Tailwind lint',
        cmd: 'npm',
        args: ['run', 'lint:tailwind'],
        cwd: webRoot,
      },
      {
        id: 'login_test',
        label: 'Login shell test',
        cmd: 'npm',
        args: ['run', 'test:shell', '--', '--runInBand', 'src/pages/login/LoginPage.ui.test.tsx'],
        cwd: webRoot,
      },
      {
        id: 'playwright_ui_library',
        label: 'Playwright UI Library scenario',
        cmd: 'node',
        args: [
          'scripts/ops/run-with-frontend-stack.mjs',
          '--stack',
          'shell-only',
          '--',
          'npx',
          'playwright',
          'test',
          '--config',
          'tests/playwright/playwright.config.ts',
          'tests/playwright/scenario-runner.spec.ts',
          '--project=chromium',
          '--grep',
          'ui_library_page|ui_library_navigation_walk|ui_library_foundation_wave_1_walk|ui_library_navigation_wave_2_walk|ui_library_forms_wave_3_walk|ui_library_data_display_wave_4_walk',
        ],
        cwd: webRoot,
        env: {
          PLAYWRIGHT_BASE_URL: baseUrl,
          PW_MODE: 'ci',
          PW_SOFT_MODE: softMode,
          PW_AUTH_MODE: authMode,
          FRONTEND_STACK_LOG_DIR: path.join(logDir, 'ui-library-stack'),
        },
      },
      {
        id: 'gateway_smoke',
        label: 'Gateway smoke',
        cmd: 'node',
        args: ['tests/smoke/gateway-smoke.mjs'],
        cwd: webRoot,
      },
    ],
  },
  'shell-public': {
    description: 'Login, runtime theme matrix ve UI Library icin kamuya acik shell route denetimi',
    route: '/login,/runtime/theme-matrix,/ui-library',
    stackId: 'shell-only',
    playwrightGrep:
      'shell_login|runtime_theme_matrix|ui_library_page|ui_library_navigation_walk|ui_library_navigation_wave_2_walk|ui_library_forms_wave_3_walk|ui_library_data_display_wave_4_walk|shell_public_route_walk',
    steps: [
      {
        id: 'shell_build',
        label: 'Shell build',
        cmd: 'npm',
        args: ['run', 'build:shell'],
        cwd: webRoot,
      },
      {
        id: 'tailwind_lint',
        label: 'Tailwind lint',
        cmd: 'npm',
        args: ['run', 'lint:tailwind'],
        cwd: webRoot,
      },
      {
        id: 'login_test',
        label: 'Login shell test',
        cmd: 'npm',
        args: ['run', 'test:shell', '--', '--runInBand', 'src/pages/login/LoginPage.ui.test.tsx'],
        cwd: webRoot,
      },
      {
        id: 'playwright_shell_public',
        label: 'Playwright public shell scenarios',
        cmd: 'node',
        args: [
          'scripts/ops/run-with-frontend-stack.mjs',
          '--stack',
          'shell-only',
          '--',
          'npx',
          'playwright',
          'test',
          '--config',
          'tests/playwright/playwright.config.ts',
          'tests/playwright/scenario-runner.spec.ts',
          '--project=chromium',
          '--grep',
          'shell_login|runtime_theme_matrix|ui_library_page|ui_library_navigation_walk|ui_library_navigation_wave_2_walk|ui_library_forms_wave_3_walk|ui_library_data_display_wave_4_walk|shell_public_route_walk',
        ],
        cwd: webRoot,
        env: {
          PLAYWRIGHT_BASE_URL: baseUrl,
          PW_MODE: 'ci',
          PW_SOFT_MODE: softMode,
          PW_AUTH_MODE: authMode,
          FRONTEND_STACK_LOG_DIR: path.join(logDir, 'shell-public-stack'),
        },
      },
      {
        id: 'gateway_smoke',
        label: 'Gateway smoke',
        cmd: 'node',
        args: ['tests/smoke/gateway-smoke.mjs'],
        cwd: webRoot,
      },
    ],
  },
  'theme-admin': {
    description: 'Auth gerekli admin theme registry route denetimi',
    route: '/admin/themes',
    stackId: 'shell-only',
    playwrightGrep: 'theme_registry_page|theme_admin_navigation_walk',
    steps: [
      {
        id: 'shell_build',
        label: 'Shell build',
        cmd: 'npm',
        args: ['run', 'build:shell'],
        cwd: webRoot,
      },
      {
        id: 'tailwind_lint',
        label: 'Tailwind lint',
        cmd: 'npm',
        args: ['run', 'lint:tailwind'],
        cwd: webRoot,
      },
      {
        id: 'playwright_theme_admin',
        label: 'Playwright theme admin scenario',
        cmd: 'node',
        args: [
          'scripts/ops/run-with-frontend-stack.mjs',
          '--stack',
          'shell-only',
          '--',
          'npx',
          'playwright',
          'test',
          '--config',
          'tests/playwright/playwright.config.ts',
          'tests/playwright/scenario-runner.spec.ts',
          '--project=chromium',
          '--grep',
          'theme_registry_page|theme_admin_navigation_walk',
        ],
        cwd: webRoot,
        env: {
          PLAYWRIGHT_BASE_URL: baseUrl,
          PW_MODE: 'ci',
          PW_SOFT_MODE: softMode,
          PW_AUTH_MODE: authMode === 'none' ? 'token_injection' : authMode,
          PW_TEST_TOKEN: process.env.PW_TEST_TOKEN || defaultInjectedToken,
          PW_MOCK_THEME_REGISTRY: process.env.PW_MOCK_THEME_REGISTRY || '1',
          PW_MOCK_API: process.env.PW_MOCK_API || '1',
          FRONTEND_STACK_LOG_DIR: path.join(logDir, 'theme-admin-stack'),
        },
      },
      {
        id: 'gateway_smoke',
        label: 'Gateway smoke',
        cmd: 'node',
        args: ['tests/smoke/gateway-smoke.mjs'],
        cwd: webRoot,
      },
    ],
  },
  'auth-business-routes': {
    description: 'Auth gerekli access, audit ve reporting business route denetimi',
    route: '/access/roles,/audit/events,/admin/reports/users',
    stackId: 'auth-business-routes',
    playwrightGrep:
      'access_roles_page|access_roles_navigation_walk|audit_events_page|audit_events_navigation_walk|reporting_users_page|reporting_users_navigation_walk',
    steps: [
      {
        id: 'shell_build',
        label: 'Shell build',
        cmd: 'npm',
        args: ['run', 'build:shell'],
        cwd: webRoot,
      },
      {
        id: 'tailwind_lint',
        label: 'Tailwind lint',
        cmd: 'npm',
        args: ['run', 'lint:tailwind'],
        cwd: webRoot,
      },
      {
        id: 'playwright_auth_business_routes',
        label: 'Playwright auth business route scenarios',
        cmd: 'node',
        args: [
          'scripts/ops/run-with-frontend-stack.mjs',
          '--stack',
          'auth-business-routes',
          '--',
          'npx',
          'playwright',
          'test',
          '--config',
          'tests/playwright/playwright.config.ts',
          'tests/playwright/scenario-runner.spec.ts',
          '--project=chromium',
          '--grep',
          'access_roles_page|access_roles_navigation_walk|audit_events_page|audit_events_navigation_walk|reporting_users_page|reporting_users_navigation_walk',
        ],
        cwd: webRoot,
        env: {
          PLAYWRIGHT_BASE_URL: baseUrl,
          PW_MODE: 'ci',
          PW_SOFT_MODE: softMode,
          PW_AUTH_MODE: authMode === 'none' ? 'token_injection' : authMode,
          PW_TEST_TOKEN: process.env.PW_TEST_TOKEN || defaultInjectedToken,
          PW_MOCK_API: process.env.PW_MOCK_API || '1',
          FRONTEND_STACK_LOG_DIR: path.join(logDir, 'auth-business-routes-stack'),
        },
      },
      {
        id: 'gateway_smoke',
        label: 'Gateway smoke',
        cmd: 'node',
        args: ['tests/smoke/gateway-smoke.mjs'],
        cwd: webRoot,
      },
    ],
  },
  'business-journeys': {
    description: 'Gercek kullanici gorevi seviyesinde access/audit/reporting is akisi smoke denetimi',
    route: '/access/roles,/audit/events,/admin/reports/users',
    stackId: 'auth-business-routes',
    playwrightGrep:
      'access_roles_navigation_walk|audit_events_navigation_walk|reporting_users_navigation_walk',
    steps: [
      {
        id: 'shell_build',
        label: 'Shell build',
        cmd: 'npm',
        args: ['run', 'build:shell'],
        cwd: webRoot,
      },
      {
        id: 'tailwind_lint',
        label: 'Tailwind lint',
        cmd: 'npm',
        args: ['run', 'lint:tailwind'],
        cwd: webRoot,
      },
      {
        id: 'playwright_business_journeys',
        label: 'Playwright business journey scenarios',
        cmd: 'node',
        args: [
          'scripts/ops/run-with-frontend-stack.mjs',
          '--stack',
          'auth-business-routes',
          '--',
          'npx',
          'playwright',
          'test',
          '--config',
          'tests/playwright/playwright.config.ts',
          'tests/playwright/scenario-runner.spec.ts',
          '--project=chromium',
          '--grep',
          'access_roles_navigation_walk|audit_events_navigation_walk|reporting_users_navigation_walk',
        ],
        cwd: webRoot,
        env: {
          PLAYWRIGHT_BASE_URL: baseUrl,
          PW_MODE: 'ci',
          PW_SOFT_MODE: softMode,
          PW_AUTH_MODE: authMode === 'none' ? 'token_injection' : authMode,
          PW_TEST_TOKEN: process.env.PW_TEST_TOKEN || defaultInjectedToken,
          PW_MOCK_API: process.env.PW_MOCK_API || '1',
          FRONTEND_STACK_LOG_DIR: path.join(logDir, 'business-journeys-stack'),
        },
      },
      {
        id: 'gateway_smoke',
        label: 'Gateway smoke',
        cmd: 'node',
        args: ['tests/smoke/gateway-smoke.mjs'],
        cwd: webRoot,
      },
    ],
  },
};

if (!presetMap[preset]) {
  console.error(`[frontend-doctor] Unknown preset: ${preset}`);
  process.exit(2);
}

const runFetchCheck = async (url) => {
  const startedAt = new Date().toISOString();
  try {
    const response = await fetch(url, { method: 'GET' });
    return {
      ok: response.ok,
      status: response.status,
      startedAt,
      endedAt: new Date().toISOString(),
      url,
    };
  } catch (error) {
    return {
      ok: false,
      status: null,
      startedAt,
      endedAt: new Date().toISOString(),
      url,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

const runStackFetchCheck = (stackId, url) => {
  const startedAt = new Date().toISOString();
  const fetchLogDir = path.join(logDir, `${stackId}-base-url-check`);
  const result = spawnSync(
    'node',
    [
      'scripts/ops/run-with-frontend-stack.mjs',
      '--stack',
      stackId,
      '--',
      'node',
      'scripts/ops/http-check.mjs',
      '--url',
      url,
    ],
    {
      cwd: webRoot,
      env: {
        ...process.env,
        FRONTEND_STACK_LOG_DIR: fetchLogDir,
      },
      encoding: 'utf8',
      maxBuffer: 1024 * 1024 * 4,
    },
  );

  if (result.stdout) {
    try {
      const payload = JSON.parse(result.stdout.trim());
      return {
        ...payload,
        startedAt: payload.startedAt ?? startedAt,
        endedAt: payload.endedAt ?? new Date().toISOString(),
        logDir: path.relative(repoRoot, fetchLogDir),
      };
    } catch {
      // fallback below
    }
  }

  return {
    ok: result.status === 0,
    status: null,
    startedAt,
    endedAt: new Date().toISOString(),
    url,
    error: (result.stderr || result.stdout || '').trim() || 'stack-fetch-check failed',
    logDir: path.relative(repoRoot, fetchLogDir),
  };
};

const findRecentArtifacts = (rootDir, matcher, sinceMs) => {
  try {
    return readdirSync(rootDir)
      .map((name) => path.join(rootDir, name))
      .filter((fullPath) => matcher(path.basename(fullPath)))
      .filter((fullPath) => statSync(fullPath).mtimeMs >= sinceMs)
      .sort();
  } catch {
    return [];
  }
};

const findRecentArtifactsRecursive = (rootDir, matcher, sinceMs) => {
  const results = [];
  const walk = (dir) => {
    let entries = [];
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }
      if (!matcher(entry.name)) continue;
      try {
        if (statSync(fullPath).mtimeMs >= sinceMs) results.push(fullPath);
      } catch {
        // noop
      }
    }
  };
  walk(rootDir);
  return results.sort();
};

const runStep = (step) => {
  const startedAt = new Date();
  const env = { ...process.env, ...(step.env || {}) };
  const result = spawnSync(step.cmd, step.args, {
    cwd: step.cwd,
    env,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 8,
  });
  const logPath = path.join(logDir, `${step.id}.log`);
  mkdirSync(logDir, { recursive: true });
  const output = [
    `$ ${step.cmd} ${step.args.join(' ')}`,
    '',
    result.stdout || '',
    result.stderr || '',
  ].join('\n');
  writeFileSync(logPath, output, 'utf8');
  return {
    id: step.id,
    label: step.label,
    command: `${step.cmd} ${step.args.join(' ')}`,
    status: result.status === 0 ? 'PASS' : 'FAIL',
    exitCode: result.status,
    signal: result.signal,
    startedAt: startedAt.toISOString(),
    endedAt: new Date().toISOString(),
    logPath: path.relative(repoRoot, logPath),
  };
};

const main = async () => {
  const activePreset = presetMap[preset];
  const doctorStartedMs = Date.now();
  const steps = [];

  for (const step of activePreset.steps) {
    steps.push(runStep(step));
  }

  const baseCheck = activePreset.stackId
    ? runStackFetchCheck(activePreset.stackId, baseUrl)
    : await runFetchCheck(baseUrl);

  const pwArtifacts = findRecentArtifacts(pwRoot, (name) => name.startsWith('pw-') && name.endsWith('.md'), doctorStartedMs - 2000)
    .map((fullPath) => path.relative(repoRoot, fullPath));
  const pwEvidenceArtifacts = findRecentArtifactsRecursive(
    path.join(pwRoot, 'artifacts'),
    (name) => name.endsWith('.png') || name.endsWith('.html') || name.endsWith('.json'),
    doctorStartedMs - 2000,
  ).map((fullPath) => path.relative(repoRoot, fullPath));
  const gatewayArtifact = path.join(smokeRoot, 'gateway-smoke.log');
  const gatewayArtifacts = statSafe(gatewayArtifact, doctorStartedMs - 2000)
    ? [path.relative(repoRoot, gatewayArtifact)]
    : [];

  const failedSteps = steps.filter((step) => step.status !== 'PASS');
  const overallStatus = !baseCheck.ok
    ? 'FAIL'
    : failedSteps.length > 0
      ? 'FAIL'
      : 'PASS';

  const summary = {
    version: '1.0',
    doctor_id: 'frontend-doctor',
    preset,
    base_url: baseUrl,
    route: activePreset.route,
    started_at: now.toISOString(),
    ended_at: new Date().toISOString(),
    overall_status: overallStatus,
    base_url_check: baseCheck,
    steps,
    artifacts: {
      playwright_reports: pwArtifacts,
      playwright_evidence: pwEvidenceArtifacts,
      gateway_smoke: gatewayArtifacts,
      logs_dir: path.relative(repoRoot, logDir),
    },
  };

  const summaryJsonPath = path.join(outDir, 'frontend-doctor.summary.v1.json');
  const summaryMdPath = path.join(outDir, 'frontend-doctor.summary.v1.md');
  mkdirSync(outDir, { recursive: true });
  writeFileSync(summaryJsonPath, JSON.stringify(summary, null, 2), 'utf8');

  const lines = [];
  lines.push('# Frontend Doctor Summary');
  lines.push('');
  lines.push(`- Preset: ${preset}`);
  lines.push(`- Base URL: ${baseUrl}`);
  lines.push(`- Route: ${activePreset.route}`);
  lines.push(`- Overall: ${overallStatus}`);
  lines.push('');
  lines.push('## Base URL Check');
  lines.push(`- ok: ${baseCheck.ok}`);
  lines.push(`- status: ${baseCheck.status ?? 'n/a'}`);
  if (baseCheck.error) lines.push(`- error: ${baseCheck.error}`);
  lines.push('');
  lines.push('## Steps');
  lines.push('| Step | Result | Log |');
  lines.push('|---|---|---|');
  for (const step of steps) {
    lines.push(`| ${step.id} | ${step.status} | ${step.logPath} |`);
  }
  lines.push('');
  lines.push('## Artifacts');
  for (const artifact of pwArtifacts) {
    lines.push(`- ${artifact}`);
  }
  for (const artifact of pwEvidenceArtifacts) {
    lines.push(`- ${artifact}`);
  }
  for (const artifact of gatewayArtifacts) {
    lines.push(`- ${artifact}`);
  }
  writeFileSync(summaryMdPath, lines.join('\n'), 'utf8');

  console.log(JSON.stringify({
    status: overallStatus,
    out_json: path.relative(repoRoot, summaryJsonPath),
    out_md: path.relative(repoRoot, summaryMdPath),
    steps: steps.map((step) => ({ id: step.id, status: step.status })),
  }, null, 2));

  if (overallStatus !== 'PASS') {
    process.exit(1);
  }
};

const statSafe = (filePath, minMtime) => {
  try {
    return statSync(filePath).mtimeMs >= minMtime;
  } catch {
    return false;
  }
};

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exit(1);
});
