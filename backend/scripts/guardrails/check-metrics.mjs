#!/usr/bin/env node
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = path.resolve(new URL('.', import.meta.url).pathname, '..', '..', '..');
const target = path.join(repoRoot, 'backend', 'scripts', 'ci', 'canary', 'guardrail-check.mjs');
const result = spawnSync(process.execPath, [target, ...process.argv.slice(2)], {
  cwd: repoRoot,
  stdio: 'inherit',
  env: process.env,
});
process.exit(result.status ?? 1);
