#!/usr/bin/env node
import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, '..', '..');
const sourceDir = path.join(webRoot, 'packages', 'dist', 'design-system');
const targetDir = path.join(webRoot, 'dist', 'design-system');
const latestDir = path.join(webRoot, 'test-results', 'releases', 'ui-library', 'latest');
const summaryPath = path.join(latestDir, 'publish-bundle.summary.v1.json');

const main = async () => {
  await mkdir(latestDir, { recursive: true });
  await rm(targetDir, { recursive: true, force: true });
  await mkdir(path.dirname(targetDir), { recursive: true });
  await cp(sourceDir, targetDir, { recursive: true });

  const summary = {
    version: '1.0',
    status: 'PASS',
    sourceDir: path.relative(webRoot, sourceDir),
    targetDir: path.relative(webRoot, targetDir),
    generatedAt: new Date().toISOString(),
  };
  await writeFile(summaryPath, JSON.stringify(summary, null, 2), 'utf8');
  console.log(JSON.stringify(summary));
};

main().catch((error) => {
  console.error('[publish-ui-library-bundle] FAIL');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
