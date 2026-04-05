#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(scriptDir, '..', '..');
const outputDir = path.resolve(webRoot, 'dist/cloudflare-single-domain');

const coreRemotes = [
  { app: 'mfe-access', slug: 'access', enabled: true },
  { app: 'mfe-audit', slug: 'audit', enabled: true },
  { app: 'mfe-reporting', slug: 'reporting', enabled: true },
  { app: 'mfe-users', slug: 'users', enabled: true },
];

const optionalRemotes = [
  { app: 'mfe-suggestions', slug: 'suggestions', envFlag: 'CF_INCLUDE_SUGGESTIONS' },
  { app: 'mfe-ethic', slug: 'ethic', envFlag: 'CF_INCLUDE_ETHIC' },
  { app: 'mfe-schema-explorer', slug: 'schema-explorer', envFlag: 'CF_INCLUDE_SCHEMA_EXPLORER' },
];

function readFlag(name, fallback = false) {
  const raw = process.env[name];
  if (typeof raw !== 'string') return fallback;
  const normalized = raw.trim().toLowerCase();
  return ['1', 'true', 'yes', 'on'].includes(normalized);
}

function trimTrailingSlash(value) {
  return value.replace(/\/+$/, '');
}

function normalizePathPrefix(value) {
  const trimmed = value.trim();
  if (!trimmed || trimmed === '/') return '/';
  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
}

function runBuild(app, env) {
  const result = spawnSync('npm', ['run', 'build', '--prefix', `apps/${app}`], {
    cwd: webRoot,
    env: {
      ...process.env,
      ...env,
    },
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function ensureDir(target) {
  mkdirSync(target, { recursive: true });
}

function copyDirContents(sourceDir, targetDir) {
  ensureDir(targetDir);
  for (const entry of readdirSync(sourceDir)) {
    cpSync(path.join(sourceDir, entry), path.join(targetDir, entry), { recursive: true });
  }
}

function writeManifest(origin, remotes) {
  const manifest = {
    origin,
    gatewayUrl: `${origin}/api`,
    shell: {
      app: 'mfe-shell',
      basePath: '/',
      remoteEntry: `${origin}/remoteEntry.js`,
    },
    remotes: remotes.map(({ app, slug }) => ({
      app,
      slug,
      basePath: `/remotes/${slug}/`,
      remoteEntry: `${origin}/remotes/${slug}/remoteEntry.js`,
    })),
  };

  writeFileSync(
    path.join(outputDir, 'cloudflare-manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  );
}

const publicOrigin = trimTrailingSlash(process.env.CLOUDFLARE_PUBLIC_ORIGIN || 'https://ai.acik.com');
const enabledOptionalRemotes = optionalRemotes.filter(({ envFlag }) => readFlag(envFlag));
const allRemotes = [...coreRemotes, ...enabledOptionalRemotes];

const remoteEntryUrlFor = (slug) => `${publicOrigin}/remotes/${slug}/remoteEntry.js`;

const shellEnv = {
  CLOUDFLARE_SINGLE_DOMAIN_BUILD: '1',
  APP_BASE_PATH: '/',
  VITE_APP_BASE_PATH: '/',
  VITE_GATEWAY_URL: process.env.VITE_GATEWAY_URL || `${publicOrigin}/api`,
  MFE_ACCESS_URL: remoteEntryUrlFor('access'),
  VITE_MFE_ACCESS_URL: remoteEntryUrlFor('access'),
  MFE_AUDIT_URL: remoteEntryUrlFor('audit'),
  VITE_MFE_AUDIT_URL: remoteEntryUrlFor('audit'),
  MFE_REPORTING_URL: remoteEntryUrlFor('reporting'),
  VITE_MFE_REPORTING_URL: remoteEntryUrlFor('reporting'),
  MFE_USERS_URL: remoteEntryUrlFor('users'),
  VITE_MFE_USERS_URL: remoteEntryUrlFor('users'),
  MFE_SUGGESTIONS_URL: remoteEntryUrlFor('suggestions'),
  VITE_MFE_SUGGESTIONS_URL: remoteEntryUrlFor('suggestions'),
  MFE_ETHIC_URL: remoteEntryUrlFor('ethic'),
  VITE_MFE_ETHIC_URL: remoteEntryUrlFor('ethic'),
  MFE_SCHEMA_EXPLORER_URL: remoteEntryUrlFor('schema-explorer'),
  VITE_MFE_SCHEMA_EXPLORER_URL: remoteEntryUrlFor('schema-explorer'),
  VITE_SHELL_ENABLE_ACCESS_REMOTE: '1',
  SHELL_ENABLE_ACCESS_REMOTE: '1',
  VITE_SHELL_ENABLE_AUDIT_REMOTE: '1',
  SHELL_ENABLE_AUDIT_REMOTE: '1',
  VITE_SHELL_ENABLE_USERS_REMOTE: '1',
  SHELL_ENABLE_USERS_REMOTE: '1',
  VITE_SHELL_ENABLE_REPORTING_REMOTE: '1',
  SHELL_ENABLE_REPORTING_REMOTE: '1',
  VITE_SHELL_ENABLE_SUGGESTIONS_REMOTE: enabledOptionalRemotes.some(({ slug }) => slug === 'suggestions') ? '1' : '0',
  SHELL_ENABLE_SUGGESTIONS_REMOTE: enabledOptionalRemotes.some(({ slug }) => slug === 'suggestions') ? '1' : '0',
  VITE_SHELL_ENABLE_ETHIC_REMOTE: enabledOptionalRemotes.some(({ slug }) => slug === 'ethic') ? '1' : '0',
  SHELL_ENABLE_ETHIC_REMOTE: enabledOptionalRemotes.some(({ slug }) => slug === 'ethic') ? '1' : '0',
  VITE_SHELL_ENABLE_SCHEMA_EXPLORER_REMOTE: enabledOptionalRemotes.some(({ slug }) => slug === 'schema-explorer') ? '1' : '0',
  SHELL_ENABLE_SCHEMA_EXPLORER_REMOTE: enabledOptionalRemotes.some(({ slug }) => slug === 'schema-explorer') ? '1' : '0',
};

const shellRemoteUrl = `${publicOrigin}/remoteEntry.js`;
const reportingRemoteUrl = remoteEntryUrlFor('reporting');

rmSync(outputDir, { recursive: true, force: true });
ensureDir(outputDir);

for (const remote of allRemotes) {
  const basePath = normalizePathPrefix(`/remotes/${remote.slug}/`);
  const remoteEnv = {
    CLOUDFLARE_SINGLE_DOMAIN_BUILD: '1',
    APP_BASE_PATH: basePath,
    VITE_APP_BASE_PATH: basePath,
    MFE_SHELL_URL: shellRemoteUrl,
    VITE_MFE_SHELL_URL: shellRemoteUrl,
  };

  if (remote.slug === 'users') {
    remoteEnv.MFE_REPORTING_URL = reportingRemoteUrl;
    remoteEnv.VITE_MFE_REPORTING_URL = reportingRemoteUrl;
  }

  runBuild(remote.app, remoteEnv);
}

runBuild('mfe-shell', shellEnv);

copyDirContents(path.join(webRoot, 'apps/mfe-shell/dist'), outputDir);
for (const remote of allRemotes) {
  const sourceDir = path.join(webRoot, `apps/${remote.app}/dist`);
  if (!existsSync(sourceDir)) {
    throw new Error(`build output missing: ${sourceDir}`);
  }
  copyDirContents(sourceDir, path.join(outputDir, 'remotes', remote.slug));
}

writeManifest(publicOrigin, allRemotes);

console.log(`[cloudflare] assembled single-domain bundle at ${outputDir}`);
