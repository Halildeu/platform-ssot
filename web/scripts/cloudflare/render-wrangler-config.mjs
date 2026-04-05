#!/usr/bin/env node

import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(scriptDir, '..', '..');

function readRequired(name) {
  const value = process.env[name];
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${name} is required`);
  }
  return value.trim();
}

function readOptional(name, fallback = '') {
  const value = process.env[name];
  if (typeof value !== 'string' || value.trim().length === 0) {
    return fallback;
  }
  return value.trim();
}

function splitCsv(value) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

const workerName = readRequired('CLOUDFLARE_WORKER_NAME');
const accountId = readRequired('CLOUDFLARE_ACCOUNT_ID');
const zoneName = readRequired('CLOUDFLARE_ZONE_NAME');
const routePatternsRaw = readOptional('CLOUDFLARE_ROUTE_PATTERNS') || readRequired('CLOUDFLARE_ROUTE_PATTERN');
const routePatterns = splitCsv(routePatternsRaw);
const compatibilityDate = readOptional('CLOUDFLARE_COMPATIBILITY_DATE', '2026-04-06');
const backendOrigin = readRequired('CLOUDFLARE_BACKEND_ORIGIN');
const publicOrigin = readOptional('CLOUDFLARE_PUBLIC_ORIGIN', 'https://ai.acik.com');
const outPath = path.resolve(
  webRoot,
  readOptional('CLOUDFLARE_WRANGLER_OUT', 'deploy/cloudflare/wrangler.ai-acik-com.generated.jsonc'),
);

const config = {
  $schema: 'node_modules/wrangler/config-schema.json',
  name: workerName,
  main: './deploy/cloudflare/worker.mjs',
  compatibility_date: compatibilityDate,
  workers_dev: false,
  account_id: accountId,
  assets: {
    directory: './dist/cloudflare-single-domain',
    binding: 'ASSETS',
    run_worker_first: true,
  },
  routes: routePatterns.map((pattern) => ({
    pattern,
    zone_name: zoneName,
  })),
  vars: {
    BACKEND_ORIGIN: backendOrigin,
    PUBLIC_ORIGIN: publicOrigin,
  },
};

mkdirSync(path.dirname(outPath), { recursive: true });
writeFileSync(outPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
console.log(`[cloudflare] wrote wrangler config to ${outPath}`);
