/// <reference types="vite/client" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { federation } from '@module-federation/vite';
import path from 'node:path';
import { readFileSync, existsSync } from 'node:fs';

/* ------------------------------------------------------------------ */
/*  Env helpers — replaces webpack's DefinePlugin + InjectRuntimeEnv   */
/* ------------------------------------------------------------------ */

/** Load .env.local manually (Vite's loadEnv only reads VITE_ prefixed) */
function loadDotEnvLocal(): Record<string, string> {
  const envPath = path.resolve(__dirname, '.env.local');
  if (!existsSync(envPath)) return {};
  const result: Record<string, string> = {};
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq > 0) {
      result[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
    }
  }
  return result;
}

/** Build runtime env payload (same allowlist as webpack.common.js) */
function buildRuntimeEnv(mode: string): Record<string, string> {
  const dotEnv = loadDotEnvLocal();
  const merged = { ...process.env, ...dotEnv };
  const allowlist = new Set([
    'NODE_ENV', 'AUTH_MODE', 'AG_GRID_LICENSE_KEY',
    'SHELL_SKIP_REMOTE_SERVICES',
    'SHELL_ENABLE_SUGGESTIONS_REMOTE', 'SHELL_ENABLE_ETHIC_REMOTE',
  ]);
  const payload: Record<string, string> = {};
  for (const [key, value] of Object.entries(merged)) {
    if (!allowlist.has(key) && !key.startsWith('VITE_')) continue;
    if (typeof value === 'string') payload[key] = value;
  }
  payload.NODE_ENV ??= mode;
  return payload;
}

/* ------------------------------------------------------------------ */
/*  Remote helpers — replaces webpack.remotes.js                       */
/* ------------------------------------------------------------------ */

function readEnvBoolean(keys: string[], fallback = true): boolean {
  const dotEnv = loadDotEnvLocal();
  for (const key of keys) {
    const value = dotEnv[key] ?? process.env[key];
    if (typeof value !== 'string' || value.length === 0) continue;
    const n = value.trim().toLowerCase();
    return n === '1' || n === 'true' || n === 'yes' || n === 'on';
  }
  return fallback;
}

function buildRemotes() {
  const enabled = {
    suggestions: readEnvBoolean(['VITE_SHELL_ENABLE_SUGGESTIONS_REMOTE', 'SHELL_ENABLE_SUGGESTIONS_REMOTE']),
    ethic: readEnvBoolean(['VITE_SHELL_ENABLE_ETHIC_REMOTE', 'SHELL_ENABLE_ETHIC_REMOTE']),
    access: readEnvBoolean(['VITE_SHELL_ENABLE_ACCESS_REMOTE', 'SHELL_ENABLE_ACCESS_REMOTE']),
    audit: readEnvBoolean(['VITE_SHELL_ENABLE_AUDIT_REMOTE', 'SHELL_ENABLE_AUDIT_REMOTE']),
    users: readEnvBoolean(['VITE_SHELL_ENABLE_USERS_REMOTE', 'SHELL_ENABLE_USERS_REMOTE']),
  };

  const remotes: Record<string, { type: string; name: string; entry: string }> = {};

  // Optional remotes — only include if enabled
  if (enabled.suggestions) remotes.mfe_suggestions = { type: 'module', name: 'mfe_suggestions', entry: 'http://localhost:3001/remoteEntry.js' };
  if (enabled.ethic) remotes.mfe_ethic = { type: 'module', name: 'mfe_ethic', entry: 'http://localhost:3002/remoteEntry.js' };
  if (enabled.access) remotes.mfe_access = { type: 'module', name: 'mfe_access', entry: 'http://localhost:3005/remoteEntry.js' };
  if (enabled.audit) remotes.mfe_audit = { type: 'module', name: 'mfe_audit', entry: 'http://localhost:3006/remoteEntry.js' };
  if (enabled.users) remotes.mfe_users = { type: 'module', name: 'mfe_users', entry: 'http://localhost:3004/remoteEntry.js' };

  // Reporting is always required
  remotes.mfe_reporting = { type: 'module', name: 'mfe_reporting', entry: 'http://localhost:3007/remoteEntry.js' };

  return remotes;
}

/* ------------------------------------------------------------------ */
/*  Read package.json deps for MF shared config                        */
/* ------------------------------------------------------------------ */

const pkg = JSON.parse(readFileSync(path.resolve(__dirname, 'package.json'), 'utf8'));
const deps = pkg.dependencies as Record<string, string>;

/* ------------------------------------------------------------------ */
/*  Vite Config                                                         */
/* ------------------------------------------------------------------ */

export default defineConfig(({ mode }) => {
  const runtimeEnv = buildRuntimeEnv(mode);

  return {
    root: __dirname,
    publicDir: 'public',

    plugins: [
      /* Inject runtime env into HTML — replaces HtmlWebpackPlugin InjectRuntimeEnv hook */
      {
        name: 'inject-runtime-env',
        transformIndexHtml(html) {
          return html.replace(
            'window.__env__ = window.__env__ || {};',
            `window.__env__ = Object.assign({}, ${JSON.stringify(runtimeEnv)});`,
          );
        },
      },
      react(),
      tailwindcss(),
      federation({
        name: 'mfe_shell',
        filename: 'remoteEntry.js',
        remotes: buildRemotes(),
        exposes: {
          './logic': './src/exposed-logic.ts',
          './services': './src/app/services/shell-services.ts',
          './i18n': './src/app/i18n/index.ts',
        },
        shared: {
          react:                { singleton: true, requiredVersion: deps.react },
          'react-dom':          { singleton: true, requiredVersion: deps['react-dom'] },
          'react-router':       { singleton: true, requiredVersion: deps['react-router'] },
          'react-router-dom':   { singleton: true, requiredVersion: deps['react-router-dom'] },
          '@reduxjs/toolkit':   { singleton: true, requiredVersion: deps['@reduxjs/toolkit'] },
          'react-redux':        { singleton: true, requiredVersion: deps['react-redux'] },
          '@tanstack/react-query': { singleton: true, requiredVersion: deps['@tanstack/react-query'] },
          '@mfe/design-system': { singleton: true, requiredVersion: false },
          clsx:                 { singleton: true, requiredVersion: deps.clsx },
          'tailwind-merge':     { singleton: true, requiredVersion: deps['tailwind-merge'] },
          'ag-grid-community':  { singleton: true, requiredVersion: deps['ag-grid-community'] },
          'ag-grid-enterprise': { singleton: true, requiredVersion: deps['ag-grid-enterprise'] },
          'ag-grid-react':      { singleton: true, requiredVersion: deps['ag-grid-react'] },
          '@platform/capabilities': { singleton: true, requiredVersion: false },
          '@mfe/shared-http':   { singleton: true, requiredVersion: false },
          '@mfe/i18n-dicts':    { singleton: true, requiredVersion: false },
        },
      }),
    ],

    resolve: {
      alias: {
        '@platform/capabilities': path.resolve(__dirname, '../../packages/platform-capabilities/src'),
        '@mfe/design-system': path.resolve(__dirname, '../../packages/design-system/src'),
        '@mfe/i18n-dicts': path.resolve(__dirname, '../../packages/i18n-dicts/src'),
        '@mfe/shared-http': path.resolve(__dirname, '../../packages/shared-http/src'),
      },
    },

    /* Env injection — replaces DefinePlugin + InjectRuntimeEnv */
    define: {
      'process.env': JSON.stringify(runtimeEnv),
    },

    server: {
      port: 3000,
      strictPort: true,
      proxy: {
        '/auth/realms': {
          target: 'http://localhost:8081',
          changeOrigin: true,
          secure: false,
          rewrite: (p) => p.replace(/^\/auth/, ''),
        },
        '/api/v1/reports': { target: 'http://localhost:8095', changeOrigin: true, secure: false },
        '/api/v1/dashboards': { target: 'http://localhost:8095', changeOrigin: true, secure: false },
        '/api/v1/authz': { target: 'http://localhost:8090', changeOrigin: true, secure: false },
        '/api/v1/users': { target: 'http://localhost:8089', changeOrigin: true, secure: false },
        '/api/services': { target: 'http://localhost:8795', changeOrigin: true, secure: false },
        '/cockpit-api': {
          target: 'http://localhost:8790',
          changeOrigin: true,
          secure: false,
          rewrite: (p) => p.replace(/^\/cockpit-api/, '/api'),
        },
        '/api': { target: 'http://localhost:8080', changeOrigin: true, secure: false },
      },
    },

    build: {
      target: 'esnext',
      outDir: 'dist',
      sourcemap: mode === 'development',
    },
  };
});
