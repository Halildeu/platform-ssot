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
  // process.env takes priority over .env.local (same as webpack.common.js)
  const merged = { ...dotEnv, ...process.env };
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

  // All remotes must be declared so MF plugin can resolve their imports
  // at static analysis time. Disabled remotes use a stub entry that returns
  // empty modules — the dynamic import() in shell-services-wiring.ts
  // will catch the error and gracefully skip.
  const STUB = 'data:text/javascript,export default {}; export function configureShellServices(){}';

  return {
    mfe_suggestions: { type: 'module', name: 'mfe_suggestions', entry: enabled.suggestions ? 'http://localhost:3001/remoteEntry.js' : STUB },
    mfe_ethic:       { type: 'module', name: 'mfe_ethic',       entry: enabled.ethic ? 'http://localhost:3002/remoteEntry.js' : STUB },
    mfe_access:      { type: 'module', name: 'mfe_access',      entry: enabled.access ? 'http://localhost:3005/remoteEntry.js' : STUB },
    mfe_audit:       { type: 'module', name: 'mfe_audit',       entry: enabled.audit ? 'http://localhost:3006/remoteEntry.js' : STUB },
    mfe_users:       { type: 'module', name: 'mfe_users',       entry: enabled.users ? 'http://localhost:3004/remoteEntry.js' : STUB },
    mfe_reporting:   { type: 'module', name: 'mfe_reporting',   entry: 'http://localhost:3007/remoteEntry.js' },
  };
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
      /* Inject runtime env into HTML */
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
        dts: false, // Disable DTS download — remote types not needed for POC
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
      alias: [
        { find: '@platform/capabilities', replacement: path.resolve(__dirname, '../../packages/platform-capabilities/src') },
        { find: '@mfe/design-system', replacement: path.resolve(__dirname, '../../packages/design-system/src') },
        { find: '@mfe/i18n-dicts', replacement: path.resolve(__dirname, '../../packages/i18n-dicts/src') },
        { find: '@mfe/shared-http', replacement: path.resolve(__dirname, '../../packages/shared-http/src') },
      ],
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

    /* Pre-bundle ALL deps including monorepo packages — critical for cold-load speed.
     * Without this, Vite serves 250+ individual HTTP requests (one per module).
     * With this, monorepo sources get bundled into optimized chunks like node_modules. */
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-dom/client',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'react-router',
        'react-router-dom',
        '@reduxjs/toolkit',
        '@reduxjs/toolkit/query',
        '@reduxjs/toolkit/query/react',
        'react-redux',
        '@tanstack/react-query',
        '@tanstack/react-query-devtools',
        'clsx',
        'tailwind-merge',
        'axios',
        'zod',
        'keycloak-js',
        'ag-grid-community',
        'ag-grid-enterprise',
        'ag-grid-react',
        '@sentry/react',
        'lucide-react',
        // Monorepo packages — pre-bundle to eliminate @fs waterfall
        '@mfe/design-system',
        '@mfe/shared-http',
        '@mfe/i18n-dicts',
        '@platform/capabilities',
      ],
      /* Exclude MF remotes from optimization */
      exclude: [
        'mfe_suggestions',
        'mfe_ethic',
        'mfe_access',
        'mfe_audit',
        'mfe_users',
        'mfe_reporting',
      ],
    },

    /* Warm up critical modules at server start — eliminates first-load delay */
    warmup: {
      clientFiles: [
        './src/index.tsx',
        './src/app/bootstrap.tsx',
        './src/app/ShellApp.tsx',
        './src/app/layout/ShellLayout.tsx',
        './src/app/router/AppRouter.tsx',
        './src/app/providers/AuthBootstrapper.tsx',
        './src/app/store/store.ts',
        './src/app/theme/theme-context.provider.tsx',
        './src/app/config/query-config.ts',
        './src/app/config/shell-services-wiring.ts',
        './src/app/config/http-config.ts',
        './src/app/i18n/index.ts',
        './src/app/auth/auth-config.ts',
        './src/pages/home/*.tsx',
        '../../packages/design-system/src/index.ts',
        '../../packages/design-system/src/components/index.ts',
        '../../packages/design-system/src/primitives/index.ts',
      ],
    },

    build: {
      target: 'esnext',
      outDir: 'dist',
      sourcemap: mode === 'development',
    },
  };
});
