#!/usr/bin/env node
import { closeSync, mkdirSync, openSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, '..', '..');
const stamp = new Date().toISOString().replace(/[:.]/g, '-');

const args = process.argv.slice(2);
const getArg = (name, fallback = null) => {
  const idx = args.indexOf(name);
  if (idx === -1) return fallback;
  return args[idx + 1] ?? fallback;
};

const separatorIndex = args.indexOf('--');
if (separatorIndex === -1 || separatorIndex === args.length - 1) {
  console.error('[frontend-stack] Kullanım: node scripts/ops/run-with-frontend-stack.mjs --stack <id> -- <komut> [arg...]');
  process.exit(2);
}

const stackId = getArg('--stack');
const command = args.slice(separatorIndex + 1);
if (!stackId) {
  console.error('[frontend-stack] --stack zorunlu');
  process.exit(2);
}

const defaultLogRoot = path.join(webRoot, 'test-results', 'ops', 'frontend-doctor-stack', stamp);
const logRoot = process.env.FRONTEND_STACK_LOG_DIR
  ? path.resolve(process.env.FRONTEND_STACK_LOG_DIR)
  : defaultLogRoot;
mkdirSync(logRoot, { recursive: true });

const stacks = {
  'shell-only': {
    description: 'Public shell route ve UI Library diagnostics icin yalniz mfe-shell servisini hazirlar.',
    services: [
      {
        name: 'mfe-shell',
        readyUrl: 'http://localhost:3000/login',
        cmd: 'npm',
        args: ['start', '--prefix', 'apps/mfe-shell'],
      },
    ],
  },
  'auth-business-routes': {
    description: 'Auth gerekli business route senaryolari icin shell + access + audit + reporting remotelarini hazirlar.',
    services: [
      {
        name: 'mfe-shell',
        readyUrl: 'http://localhost:3000/login',
        cmd: 'npm',
        args: ['start', '--prefix', 'apps/mfe-shell'],
      },
      {
        name: 'mfe-access',
        readyUrl: 'http://localhost:3005/remoteEntry.js',
        cmd: 'npm',
        args: ['start', '--prefix', 'apps/mfe-access'],
      },
      {
        name: 'mfe-audit',
        readyUrl: 'http://localhost:3006/remoteEntry.js',
        cmd: 'npm',
        args: ['start', '--prefix', 'apps/mfe-audit'],
      },
      {
        name: 'mfe-reporting',
        readyUrl: 'http://localhost:3007/remoteEntry.js',
        cmd: 'npm',
        args: ['start', '--prefix', 'apps/mfe-reporting'],
      },
    ],
  },
};

const activeStack = stacks[stackId];
if (!activeStack) {
  console.error(`[frontend-stack] Bilinmeyen stack: ${stackId}`);
  process.exit(2);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithTimeout = async (url, timeoutMs = 3000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { method: 'GET', signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

const isReady = async (url) => {
  try {
    const response = await fetchWithTimeout(url, 3000);
    return response.ok || (response.status >= 200 && response.status < 500);
  } catch {
    return false;
  }
};

const tailLog = (logPath, lineCount = 40) => {
  try {
    const content = readFileSync(logPath, 'utf8');
    return content.split(/\r?\n/).slice(-lineCount).join('\n');
  } catch {
    return '(log okunamadi)';
  }
};

const startService = (service) => {
  const logPath = path.join(logRoot, `${service.name}.log`);
  const fd = openSync(logPath, 'a');
  const child = spawn(service.cmd, service.args, {
    cwd: webRoot,
    env: process.env,
    detached: true,
    stdio: ['ignore', fd, fd],
  });
  closeSync(fd);
  child.unref();
  return {
    ...service,
    pid: child.pid,
    logPath,
  };
};

const waitForService = async (service) => {
  for (let attempt = 1; attempt <= 90; attempt += 1) {
    if (await isReady(service.readyUrl)) {
      return;
    }
    await sleep(1000);
  }
  const logTail = tailLog(service.logPath);
  throw new Error(
    `[frontend-stack] ${service.name} hazir olmadi (${service.readyUrl}). Son loglar:\n${logTail}`,
  );
};

const killStartedService = async (service) => {
  if (!service.pid) return;
  try {
    process.kill(-service.pid, 'SIGTERM');
  } catch {
    return;
  }
  await sleep(1500);
  try {
    process.kill(-service.pid, 'SIGKILL');
  } catch {
    // noop
  }
};

const runCommand = (cmd, cmdArgs) =>
  new Promise((resolve) => {
    const child = spawn(cmd, cmdArgs, {
      cwd: webRoot,
      env: process.env,
      stdio: 'inherit',
    });
    child.on('exit', (code, signal) => resolve({ code: code ?? 1, signal }));
    child.on('error', (error) => {
      console.error(`[frontend-stack] hedef komut baslatilamadi: ${error.message}`);
      resolve({ code: 1, signal: null });
    });
  });

const main = async () => {
  const startedServices = [];
  const stackSummary = {
    stack_id: stackId,
    description: activeStack.description,
    log_root: logRoot,
    services: [],
    command: command.join(' '),
  };

  try {
    for (const service of activeStack.services) {
      const alreadyReady = await isReady(service.readyUrl);
      if (alreadyReady) {
        stackSummary.services.push({
          name: service.name,
          ready_url: service.readyUrl,
          state: 'reused',
        });
        continue;
      }
      const started = startService(service);
      startedServices.push(started);
      await waitForService(started);
      stackSummary.services.push({
        name: started.name,
        ready_url: started.readyUrl,
        state: 'started',
        pid: started.pid,
        log_path: started.logPath,
      });
    }

    const result = await runCommand(command[0], command.slice(1));
    stackSummary.result = {
      code: result.code,
      signal: result.signal,
    };
    mkdirSync(logRoot, { recursive: true });
    writeFileSync(path.join(logRoot, 'stack-summary.json'), JSON.stringify(stackSummary, null, 2), 'utf8');
    if (result.code !== 0) {
      process.exit(result.code ?? 1);
    }
  } finally {
    for (const service of startedServices.reverse()) {
      await killStartedService(service);
    }
  }
};

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exit(1);
});
