#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(scriptDir, '..', '..');
const outputDir = path.resolve(webRoot, 'dist/ubuntu-single-domain');

const coreRemotes = [
  { app: 'mfe-access', slug: 'access' },
  { app: 'mfe-audit', slug: 'audit' },
  { app: 'mfe-reporting', slug: 'reporting' },
  { app: 'mfe-users', slug: 'users' },
];

function trimTrailingSlash(value) {
  return value.replace(/\/+$/, '');
}

function normalizeOriginValue(value) {
  if (typeof value !== 'string') {
    return '';
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }
  return trimTrailingSlash(trimmed);
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
    path.join(outputDir, 'single-domain-manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  );
}

const PROD_PUBLIC_ORIGIN = 'https://ai.acik.com';
const STAGE_PUBLIC_ORIGIN = 'https://testai.acik.com';
const deployEnv = (process.env.DEPLOY_ENV || process.env.WEB_DEPLOY_ENV || '').trim().toLowerCase();
const isStageLikeDeploy = ['stage', 'staging', 'test'].includes(deployEnv);

function resolvePublicOrigin(...candidates) {
  for (const candidate of candidates) {
    const normalized = normalizeOriginValue(candidate);
    if (!normalized) {
      continue;
    }
    if (isStageLikeDeploy && normalized === PROD_PUBLIC_ORIGIN) {
      continue;
    }
    return normalized;
  }

  return isStageLikeDeploy ? STAGE_PUBLIC_ORIGIN : PROD_PUBLIC_ORIGIN;
}

function resolveKeycloakPublicUrl(publicOrigin, ...candidates) {
  for (const candidate of candidates) {
    const normalized = normalizeOriginValue(candidate);
    if (!normalized) {
      continue;
    }
    if (isStageLikeDeploy && normalized === PROD_PUBLIC_ORIGIN) {
      continue;
    }
    return normalized;
  }

  return publicOrigin;
}

function resolveKeycloakRealm(...candidates) {
  for (const candidate of candidates) {
    const normalized = String(candidate ?? '').trim();
    if (!normalized) {
      continue;
    }
    if (isStageLikeDeploy && normalized === 'serban') {
      continue;
    }
    return normalized;
  }

  return isStageLikeDeploy ? 'platform-test' : 'serban';
}

const publicOrigin = resolvePublicOrigin(
  process.env.WEB_PUBLIC_ORIGIN ||
    process.env.VITE_FRONTEND_PUBLIC_ORIGIN ||
    process.env.FRONTEND_PUBLIC_ORIGIN ||
    PROD_PUBLIC_ORIGIN,
);
const remoteEntryUrlFor = (slug) => `${publicOrigin}/remotes/${slug}/remoteEntry.js`;
const authMode =
  process.env.VITE_AUTH_MODE || process.env.AUTH_MODE || process.env.WEB_AUTH_MODE || 'keycloak';
const keycloakUrl = resolveKeycloakPublicUrl(
  publicOrigin,
  process.env.VITE_KEYCLOAK_URL ||
    process.env.KEYCLOAK_URL ||
    process.env.KEYCLOAK_PUBLIC_URL ||
    process.env.WEB_KEYCLOAK_PUBLIC_URL ||
    publicOrigin,
);
const keycloakRealm = resolveKeycloakRealm(
  process.env.VITE_KEYCLOAK_REALM ||
  process.env.KEYCLOAK_REALM ||
  process.env.WEB_KEYCLOAK_REALM ||
  'serban',
);
const keycloakClientId =
  process.env.VITE_KEYCLOAK_CLIENT_ID ||
  process.env.KEYCLOAK_CLIENT_ID ||
  process.env.WEB_KEYCLOAK_CLIENT_ID ||
  'frontend';

const shellEnv = {
  SINGLE_DOMAIN_BUILD: '1',
  APP_BASE_PATH: '/',
  VITE_APP_BASE_PATH: '/',
  AUTH_MODE: authMode,
  VITE_AUTH_MODE: authMode,
  VITE_GATEWAY_URL: process.env.VITE_GATEWAY_URL || `${publicOrigin}/api`,
  FRONTEND_PUBLIC_ORIGIN:
    process.env.FRONTEND_PUBLIC_ORIGIN || process.env.WEB_PUBLIC_ORIGIN || publicOrigin,
  VITE_FRONTEND_PUBLIC_ORIGIN:
    process.env.VITE_FRONTEND_PUBLIC_ORIGIN || process.env.WEB_PUBLIC_ORIGIN || publicOrigin,
  KEYCLOAK_URL: keycloakUrl,
  VITE_KEYCLOAK_URL: keycloakUrl,
  KEYCLOAK_REALM: keycloakRealm,
  VITE_KEYCLOAK_REALM: keycloakRealm,
  KEYCLOAK_CLIENT_ID: keycloakClientId,
  VITE_KEYCLOAK_CLIENT_ID: keycloakClientId,
  MFE_ACCESS_URL: remoteEntryUrlFor('access'),
  VITE_MFE_ACCESS_URL: remoteEntryUrlFor('access'),
  MFE_AUDIT_URL: remoteEntryUrlFor('audit'),
  VITE_MFE_AUDIT_URL: remoteEntryUrlFor('audit'),
  MFE_REPORTING_URL: remoteEntryUrlFor('reporting'),
  VITE_MFE_REPORTING_URL: remoteEntryUrlFor('reporting'),
  MFE_USERS_URL: remoteEntryUrlFor('users'),
  VITE_MFE_USERS_URL: remoteEntryUrlFor('users'),
  VITE_SHELL_ENABLE_ACCESS_REMOTE: '1',
  SHELL_ENABLE_ACCESS_REMOTE: '1',
  VITE_SHELL_ENABLE_AUDIT_REMOTE: '1',
  SHELL_ENABLE_AUDIT_REMOTE: '1',
  VITE_SHELL_ENABLE_USERS_REMOTE: '1',
  SHELL_ENABLE_USERS_REMOTE: '1',
  VITE_SHELL_ENABLE_REPORTING_REMOTE: '1',
  SHELL_ENABLE_REPORTING_REMOTE: '1',
  VITE_SHELL_ENABLE_SUGGESTIONS_REMOTE: '0',
  SHELL_ENABLE_SUGGESTIONS_REMOTE: '0',
  VITE_SHELL_ENABLE_ETHIC_REMOTE: '0',
  SHELL_ENABLE_ETHIC_REMOTE: '0',
  VITE_SHELL_ENABLE_SCHEMA_EXPLORER_REMOTE: '0',
  SHELL_ENABLE_SCHEMA_EXPLORER_REMOTE: '0',
};

const shellRemoteUrl = `${publicOrigin}/remoteEntry.js`;
const reportingRemoteUrl = remoteEntryUrlFor('reporting');

rmSync(outputDir, { recursive: true, force: true });
ensureDir(outputDir);

for (const remote of coreRemotes) {
  const basePath = normalizePathPrefix(`/remotes/${remote.slug}/`);
  const remoteEnv = {
    SINGLE_DOMAIN_BUILD: '1',
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
for (const remote of coreRemotes) {
  const sourceDir = path.join(webRoot, `apps/${remote.app}/dist`);
  if (!existsSync(sourceDir)) {
    throw new Error(`build output missing: ${sourceDir}`);
  }
  copyDirContents(sourceDir, path.join(outputDir, 'remotes', remote.slug));
}

writeManifest(publicOrigin, coreRemotes);

console.log(`[ubuntu] assembled single-domain bundle at ${outputDir}`);
