#!/usr/bin/env node
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, '..');
const componentsDir = path.join(packageRoot, 'src', 'components');
const batchSize = Number(process.env.UI_KIT_JEST_BATCH_SIZE || '1');
const nodeOptions = process.env.NODE_OPTIONS
  ? `${process.env.NODE_OPTIONS} --max-old-space-size=8192`
  : '--max-old-space-size=8192';

const componentTests = readdirSync(componentsDir)
  .filter((file) => file.endsWith('.test.tsx'))
  .sort();

if (componentTests.length === 0) {
  console.log('[ui-kit-test-batches] test dosyasi bulunamadi');
  process.exit(0);
}

const chunk = (items, size) => {
  const batches = [];
  for (let index = 0; index < items.length; index += size) {
    batches.push(items.slice(index, index + size));
  }
  return batches;
};

const batches = chunk(componentTests, batchSize);

for (const [batchIndex, batch] of batches.entries()) {
  console.log(`[ui-kit-test-batches] batch ${batchIndex + 1}/${batches.length}: ${batch.join(', ')}`);
  const result = spawnSync(
    'npx',
    ['jest', '--runInBand', '--config', 'jest.config.js', ...batch.map((file) => `src/components/${file}`)],
    {
      cwd: packageRoot,
      env: {
        ...process.env,
        NODE_OPTIONS: nodeOptions,
      },
      stdio: 'inherit',
    },
  );
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log(`[ui-kit-test-batches] tamamlandi batches=${batches.length} tests=${componentTests.length}`);
