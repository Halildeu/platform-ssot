#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, '..', '..');
const repoRoot = path.resolve(webRoot, '..');

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
  'shell-only': 'full',
  'auth-business-routes': 'auth-business-routes',
};

const profile = profileMap[stackId];
if (!profile) {
  console.error(`[run-with-frontend-stack] bilinmeyen stack: ${stackId}`);
  process.exit(2);
}

const stackEnvMap = {
  'shell-only': {
    AUTH_MODE: 'permitAll',
    VITE_AUTH_MODE: 'permitAll',
    VITE_ENABLE_FAKE_AUTH: '1',
    VITE_FAKE_AUTH_PERMISSIONS: 'THEME_ADMIN',
  },
  'auth-business-routes': {
    AUTH_MODE: 'permitAll',
    VITE_AUTH_MODE: 'permitAll',
    VITE_ENABLE_FAKE_AUTH: '1',
    VITE_FAKE_AUTH_PERMISSIONS: 'THEME_ADMIN,access-read,audit-read,VIEW_REPORTS,user-read,user-update',
  },
};
const stackEnv = stackEnvMap[stackId] ?? {};

const logRoot = process.env.FRONTEND_STACK_LOG_DIR
  ? path.resolve(process.env.FRONTEND_STACK_LOG_DIR)
  : path.join(webRoot, 'test-results', 'diagnostics', 'frontend-stack', stackId);
mkdirSync(logRoot, { recursive: true });

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

const startServers = () =>
  run(
    'bash',
    ['./scripts/health/run-dev-servers.sh', '--profile', profile],
    {
      WEB_RUNTIME_TAIL: '0',
      WEB_RUNTIME_POSTCHECK: '1',
      WEB_RUNTIME_STRICT_WARNINGS: '0',
      WEB_RUNTIME_REPORT: path.join(logRoot, 'web-runtime-guard.v1.json'),
      ...stackEnv,
    },
  );

stopServers();
const startup = startServers();
const startupLog = path.join(logRoot, 'startup.log');
writeFileSync(
  startupLog,
  [`$ bash ./scripts/health/run-dev-servers.sh --profile ${profile}`, '', startup.stdout || '', startup.stderr || ''].join('\n'),
  'utf8',
);

if (startup.status !== 0) {
  console.error(`[run-with-frontend-stack] stack baslatilamadi: ${stackId}`);
  process.stderr.write(startup.stderr || startup.stdout || '');
  stopServers();
  process.exit(startup.status ?? 1);
}

const [targetCmd, ...targetArgs] = commandArgs;
const target = run(targetCmd, targetArgs);
const targetLog = path.join(logRoot, 'target.log');
mkdirSync(logRoot, { recursive: true });
writeFileSync(
  targetLog,
  [`$ ${[targetCmd, ...targetArgs].join(' ')}`, '', target.stdout || '', target.stderr || ''].join('\n'),
  'utf8',
);

const shutdown = stopServers();
const shutdownLog = path.join(logRoot, 'shutdown.log');
mkdirSync(logRoot, { recursive: true });
writeFileSync(
  shutdownLog,
  [`$ bash ./scripts/health/stop-dev-servers.sh`, '', shutdown.stdout || '', shutdown.stderr || ''].join('\n'),
  'utf8',
);

process.stdout.write(target.stdout || '');
process.stderr.write(target.stderr || '');
process.exit(target.status ?? 1);
