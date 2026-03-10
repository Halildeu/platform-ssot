#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, '..', '..');
const latestDir = path.join(webRoot, 'test-results', 'releases', 'ui-library', 'latest');
const summaryPath = path.join(latestDir, 'ui-library-release.summary.v1.json');

const main = async () => {
  await mkdir(latestDir, { recursive: true });
  const result = spawnSync('npm', ['run', 'gate:ui-library-release'], {
    cwd: webRoot,
    env: process.env,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 16,
  });
  const summary = {
    version: '1.0',
    status: result.status === 0 ? 'PASS' : 'FAIL',
    generatedAt: new Date().toISOString(),
    command: 'npm run gate:ui-library-release',
    gateSummaryPath: 'web/test-results/releases/ui-library/latest/ui-library-release-gate.summary.v1.json',
  };
  await writeFile(summaryPath, JSON.stringify(summary, null, 2), 'utf8');
  console.log(JSON.stringify(summary));
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

main().catch((error) => {
  console.error('[run-ui-library-release] FAIL');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
