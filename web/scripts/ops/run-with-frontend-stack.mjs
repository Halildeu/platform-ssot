#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, '..', '..');
const repoRoot = path.resolve(webRoot, '..');
const nowIsoUtc = () => new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

const args = process.argv.slice(2);
const separatorIndex = args.indexOf('--');
const beforeSeparator = separatorIndex === -1 ? args : args.slice(0, separatorIndex);
const commandArgs = separatorIndex === -1 ? [] : args.slice(separatorIndex + 1);

const getArg = (name, fallback = null) => {
  const index = beforeSeparator.indexOf(name);
  if (index === -1) return fallback;
  return beforeSeparator[index + 1] ?? fallback;
};

const stackId = getArg('--stack');
if (!stackId) {
  console.error('[run-with-frontend-stack] --stack zorunlu');
  process.exit(2);
}
if (commandArgs.length === 0) {
  console.error('[run-with-frontend-stack] calistirilacak komut eksik');
  process.exit(2);
}

const profileMap = {
  'shell-only': 'shell-only',
  'auth-business-routes': 'auth-business-routes',
  'auth-business-routes-live': 'auth-business-routes',
};

const profile = profileMap[stackId];
if (!profile) {
  console.error(`[run-with-frontend-stack] bilinmeyen stack: ${stackId}`);
  process.exit(2);
}

const profileServicesMap = {
  'shell-only': ['shell'],
  full: ['shell', 'suggestions', 'ethic', 'users', 'access', 'audit', 'reporting'],
  core: ['shell', 'suggestions', 'ethic', 'users', 'access', 'audit', 'reporting'],
  remotes: ['shell', 'reporting', 'users', 'access'],
  'auth-business-routes': ['shell', 'users', 'access', 'audit', 'reporting'],
};
const environmentSignatureKeys = [
  'AUTH_MODE',
  'VITE_AUTH_MODE',
  'VITE_ENABLE_FAKE_AUTH',
  'VITE_FAKE_AUTH_PERMISSIONS',
  'VITE_SHELL_SKIP_REMOTE_SERVICES',
  'SHELL_SKIP_REMOTE_SERVICES',
  'VITE_SHELL_ENABLE_SUGGESTIONS_REMOTE',
  'SHELL_ENABLE_SUGGESTIONS_REMOTE',
  'VITE_SHELL_ENABLE_ETHIC_REMOTE',
  'SHELL_ENABLE_ETHIC_REMOTE',
];

const stackEnvMap = {
  'shell-only': {
    AUTH_MODE: 'permitAll',
    VITE_AUTH_MODE: 'permitAll',
    VITE_ENABLE_FAKE_AUTH: '1',
    VITE_FAKE_AUTH_PERMISSIONS: 'THEME_ADMIN',
    VITE_SHELL_SKIP_REMOTE_SERVICES: '1',
    SHELL_SKIP_REMOTE_SERVICES: '1',
  },
  'auth-business-routes': {
    AUTH_MODE: 'permitAll',
    VITE_AUTH_MODE: 'permitAll',
    VITE_ENABLE_FAKE_AUTH: '1',
    VITE_FAKE_AUTH_PERMISSIONS: 'THEME_ADMIN,access-read,audit-read,VIEW_REPORTS,user-read,user-update',
    VITE_SHELL_ENABLE_SUGGESTIONS_REMOTE: '0',
    SHELL_ENABLE_SUGGESTIONS_REMOTE: '0',
    VITE_SHELL_ENABLE_ETHIC_REMOTE: '0',
    SHELL_ENABLE_ETHIC_REMOTE: '0',
  },
  'auth-business-routes-live': {
    VITE_SHELL_ENABLE_SUGGESTIONS_REMOTE: '0',
    SHELL_ENABLE_SUGGESTIONS_REMOTE: '0',
    VITE_SHELL_ENABLE_ETHIC_REMOTE: '0',
    SHELL_ENABLE_ETHIC_REMOTE: '0',
  },
};
const stackEnv = stackEnvMap[stackId] ?? {};
const runtimeSessionFile = path.join(repoRoot, '.cache', 'runtime_guard', 'web_start_session.v1.json');
const runtimeGuardReport = path.join(repoRoot, '.cache', 'reports', 'web_runtime_guard.v1.json');
const reuseRunningStack =
  `${process.env.FRONTEND_STACK_REUSE_RUNNING ?? '1'}`.trim().toLowerCase() !== '0';

const logRoot = process.env.FRONTEND_STACK_LOG_DIR
  ? path.resolve(process.env.FRONTEND_STACK_LOG_DIR)
  : path.join(webRoot, 'test-results', 'diagnostics', 'frontend-stack', stackId);
mkdirSync(logRoot, { recursive: true });
const stackRunReportPath = path.join(logRoot, 'stack-run-report.v1.json');

const ensureParentDir = (filePath) => {
  mkdirSync(path.dirname(filePath), { recursive: true });
};

const readJsonFile = (filePath) => {
  if (!existsSync(filePath)) {
    return null;
  }
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
};

const writeStackRunReport = (payload) => {
  ensureParentDir(stackRunReportPath);
  writeFileSync(
    stackRunReportPath,
    `${JSON.stringify({
      version: 'v1',
      kind: 'frontend-stack-run-report',
      generated_at: nowIsoUtc(),
      stack_id: stackId,
      profile,
      ...payload,
    }, null, 2)}\n`,
    'utf8',
  );
};

const pickEnvironmentSignature = (envLike = {}) => {
  const signature = {};
  for (const key of environmentSignatureKeys) {
    const value = envLike?.[key];
    if (typeof value === 'string' && value.length > 0) {
      signature[key] = value;
    }
  }
  return signature;
};

const isReachable = async (url) => {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5_000) });
    return response.status >= 200 && response.status < 500;
  } catch {
    return false;
  }
};

const getHealthyRunningSession = async () => {
  const session = readJsonFile(runtimeSessionFile);
  const guard = readJsonFile(runtimeGuardReport);

  if (!session) {
    return null;
  }
  if (!guard || guard.status !== 'OK') {
    return null;
  }
  if (Array.isArray(guard.summary?.failed_services) && guard.summary.failed_services.length > 0) {
    return null;
  }
  if (!Array.isArray(session.services) || session.services.length === 0) {
    return null;
  }

  for (const service of session.services) {
    if (service.status !== 'started' || typeof service.check_url !== 'string') {
      return null;
    }
    if (!(await isReachable(service.check_url))) {
      return null;
    }
  }

  return session;
};

const doesSessionMatchStack = (session) => {
  if (!session || session.profile !== profile) {
    return false;
  }
  const expectedServices = profileServicesMap[profile] ?? [];
  if (expectedServices.length === 0) {
    return false;
  }
  if (!Array.isArray(session.services)) {
    return false;
  }
  const activeServices = session.services.filter((service) => expectedServices.includes(service.name));
  if (activeServices.length !== expectedServices.length) {
    return false;
  }
  const expectedEnvironment = pickEnvironmentSignature(stackEnv);
  const sessionEnvironment = pickEnvironmentSignature(session.environment);
  return JSON.stringify(sessionEnvironment) === JSON.stringify(expectedEnvironment);
};

const run = (cmd, cmdArgs, extraEnv = {}) =>
  spawnSync(cmd, cmdArgs, {
    cwd: webRoot,
    env: {
      ...process.env,
      ...extraEnv,
    },
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 16,
  });

const stopServers = () =>
  run('bash', ['./scripts/health/stop-dev-servers.sh'], {
    WEB_RUNTIME_STOP_SILENT: '1',
  });

const startServers = ({
  profileName = profile,
  extraEnv = stackEnv,
  runtimeReportName = 'web-runtime-guard.v1.json',
  backendReportName = 'backend-runtime-guard-wait.v1.json',
} = {}) =>
  run(
    'bash',
    ['./scripts/health/run-dev-servers.sh', '--profile', profileName],
    {
      WEB_RUNTIME_TAIL: '0',
      WEB_RUNTIME_POSTCHECK: '1',
      WEB_RUNTIME_STRICT_WARNINGS: '0',
      WEB_RUNTIME_REPORT: path.join(logRoot, runtimeReportName),
      WEB_BACKEND_GUARD_REPORT: path.join(logRoot, backendReportName),
      ...extraEnv,
    },
  );

const startupLog = path.join(logRoot, 'startup.log');
ensureParentDir(startupLog);
let managedStartup = false;
let previousSession = null;
let startupMode = 'fresh_start';
let shutdownMode = 'pending';
let restoreAttempted = false;
let restoreSucceeded = false;

if (reuseRunningStack) {
  previousSession = await getHealthyRunningSession();
}

if (reuseRunningStack && doesSessionMatchStack(previousSession)) {
  startupMode = 'reused';
  ensureParentDir(startupLog);
  writeFileSync(
    startupLog,
    [
      `$ reuse running stack: ${stackId}`,
      '',
      `session_file=${runtimeSessionFile}`,
      `guard_report=${runtimeGuardReport}`,
      '',
      '[run-with-frontend-stack] mevcut saglikli stack yeniden kullanildi',
    ].join('\n'),
    'utf8',
  );
} else {
  startupMode = 'fresh_start';
  stopServers();
  const startup = startServers();
  ensureParentDir(startupLog);
  writeFileSync(
    startupLog,
    [`$ bash ./scripts/health/run-dev-servers.sh --profile ${profile}`, '', startup.stdout || '', startup.stderr || ''].join('\n'),
    'utf8',
  );

  if (startup.status !== 0) {
    writeStackRunReport({
      status: 'FAILED',
      startup_mode: startupMode,
      shutdown_mode: 'stopped_after_failed_start',
      target_exit_code: null,
      previous_session: previousSession ? {
        session_id: previousSession.session_id ?? null,
        profile: previousSession.profile ?? null,
      } : null,
      paths: {
        startup_log: startupLog,
      },
      startup_exit_code: startup.status ?? 1,
    });
    console.error(`[run-with-frontend-stack] stack baslatilamadi: ${stackId}`);
    process.stderr.write(startup.stderr || startup.stdout || '');
    stopServers();
    process.exit(startup.status ?? 1);
  }
  managedStartup = true;
}

const [targetCmd, ...targetArgs] = commandArgs;
const target = run(targetCmd, targetArgs);
const targetLog = path.join(logRoot, 'target.log');
ensureParentDir(targetLog);
writeFileSync(
  targetLog,
  [`$ ${[targetCmd, ...targetArgs].join(' ')}`, '', target.stdout || '', target.stderr || ''].join('\n'),
  'utf8',
);

const shutdownLog = path.join(logRoot, 'shutdown.log');
ensureParentDir(shutdownLog);
if (managedStartup) {
  const shutdown = stopServers();
  const shutdownLines = [`$ bash ./scripts/health/stop-dev-servers.sh`, '', shutdown.stdout || '', shutdown.stderr || ''];
  if (previousSession && typeof previousSession.profile === 'string' && previousSession.profile.length > 0) {
    restoreAttempted = true;
    const restore = startServers({
      profileName: previousSession.profile,
      extraEnv: pickEnvironmentSignature(previousSession.environment),
      runtimeReportName: 'restore-web-runtime-guard.v1.json',
      backendReportName: 'restore-backend-runtime-guard-wait.v1.json',
    });
    restoreSucceeded = restore.status === 0;
    shutdownMode = restoreSucceeded ? 'restored_previous' : 'restore_failed';
    shutdownLines.push('', `$ bash ./scripts/health/run-dev-servers.sh --profile ${previousSession.profile} # restore`, '', restore.stdout || '', restore.stderr || '');
    ensureParentDir(shutdownLog);
    writeFileSync(shutdownLog, shutdownLines.join('\n'), 'utf8');
    if (restore.status !== 0) {
      writeStackRunReport({
        status: 'FAILED',
        startup_mode: startupMode,
        shutdown_mode: shutdownMode,
        target_exit_code: target.status ?? 1,
        previous_session: {
          session_id: previousSession.session_id ?? null,
          profile: previousSession.profile ?? null,
        },
        current_session: readJsonFile(runtimeSessionFile),
        restore_attempted: restoreAttempted,
        restore_succeeded: restoreSucceeded,
        paths: {
          startup_log: startupLog,
          target_log: targetLog,
          shutdown_log: shutdownLog,
          stack_run_report: stackRunReportPath,
          runtime_session_file: runtimeSessionFile,
          runtime_guard_report: path.join(logRoot, 'restore-web-runtime-guard.v1.json'),
          backend_guard_report: path.join(logRoot, 'restore-backend-runtime-guard-wait.v1.json'),
        },
      });
      console.error('[run-with-frontend-stack] onceki stack geri yuklenemedi');
      process.stdout.write(target.stdout || '');
      process.stderr.write(target.stderr || '');
      process.exit(restore.status ?? 1);
    }
  } else {
    shutdownMode = 'stopped_only';
    ensureParentDir(shutdownLog);
    writeFileSync(shutdownLog, shutdownLines.join('\n'), 'utf8');
  }
} else {
  shutdownMode = 'kept_running';
  ensureParentDir(shutdownLog);
  writeFileSync(
    shutdownLog,
    ['[run-with-frontend-stack] mevcut stack yeniden kullanildigi icin kapatma atlandi'].join('\n'),
    'utf8',
  );
}

writeStackRunReport({
  status: (target.status ?? 1) === 0 ? 'OK' : 'FAILED',
  startup_mode: startupMode,
  shutdown_mode: shutdownMode,
  restore_attempted: restoreAttempted,
  restore_succeeded: restoreSucceeded,
  target_exit_code: target.status ?? 1,
  reuse_running_stack: reuseRunningStack,
  previous_session: previousSession ? {
    session_id: previousSession.session_id ?? null,
    profile: previousSession.profile ?? null,
    environment: pickEnvironmentSignature(previousSession.environment),
  } : null,
  current_session: readJsonFile(runtimeSessionFile),
  paths: {
    startup_log: startupLog,
    target_log: targetLog,
    shutdown_log: shutdownLog,
    stack_run_report: stackRunReportPath,
    runtime_session_file: runtimeSessionFile,
    runtime_guard_report: managedStartup && restoreSucceeded
      ? path.join(logRoot, 'restore-web-runtime-guard.v1.json')
      : managedStartup
        ? path.join(logRoot, 'web-runtime-guard.v1.json')
        : runtimeGuardReport,
    backend_guard_report: managedStartup && restoreSucceeded
      ? path.join(logRoot, 'restore-backend-runtime-guard-wait.v1.json')
      : managedStartup
        ? path.join(logRoot, 'backend-runtime-guard-wait.v1.json')
        : path.join(repoRoot, '.cache', 'reports', 'web_backend_guard_wait.v1.json'),
  },
});

process.stdout.write(target.stdout || '');
process.stderr.write(target.stderr || '');
process.exit(target.status ?? 1);
