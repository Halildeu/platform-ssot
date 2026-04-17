import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { federation } from '@module-federation/vite';
import path from 'node:path';
import { readFileSync } from 'node:fs';

function readEnvString(keys: string[], fallback: string): string {
  for (const key of keys) {
    const value = process.env[key];
    if (typeof value !== 'string') continue;
    const normalized = value.trim();
    if (normalized.length > 0) {
      return normalized;
    }
  }
  return fallback;
}

function normalizeBasePath(value: string): string {
  const normalized = value.trim();
  if (!normalized || normalized === '/') {
    return '/';
  }
  const withLeadingSlash = normalized.startsWith('/') ? normalized : `/${normalized}`;
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
}

const pkg = JSON.parse(readFileSync(path.resolve(__dirname, 'package.json'), 'utf8'));
const deps = pkg.dependencies as Record<string, string>;
const singleton = (
  shareKey: string,
  versionKey: string = shareKey,
  fallback: string | boolean = false,
  extra: Record<string, boolean | string> = {},
) => ({
  singleton: true,
  strictVersion: true,
  requiredVersion: deps[versionKey] ?? fallback,
  ...extra,
});

const HOST_ONLY_STUB_VERSION = '0.0.0';
const hostOnly = (shareKey: string, versionKey: string = shareKey, fallback: string | boolean = false) =>
  singleton(shareKey, versionKey, fallback, { import: false, version: HOST_ONLY_STUB_VERSION });

const sharedCore = {
  react: hostOnly('react'),
  'react-dom': hostOnly('react-dom'),
  'react-router': hostOnly('react-router'),
  'react-router-dom': hostOnly('react-router-dom'),
  '@reduxjs/toolkit': hostOnly('@reduxjs/toolkit'),
  'react-redux': hostOnly('react-redux'),
  '@tanstack/react-query': singleton('@tanstack/react-query'),
};
const sharedProdOnly = {
  'ag-grid-react': singleton('ag-grid-react'),
  'ag-grid-community': singleton('ag-grid-community'),
  'ag-grid-enterprise': singleton('ag-grid-enterprise'),
  '@mfe/design-system': { singleton: true, requiredVersion: false as const },
  '@mfe/shared-http': { singleton: true, requiredVersion: false as const },
  // PR E (Codex CNS thread 019d99ba Tur 11): `@mfe/auth` MF singleton.
  // hostOnly pattern kullanılmıyor çünkü mfe-access kendi auth bundle'ını da
  // import edebilir (hostOnly'de remote kendi instance'ı yok). Shell+remote aynı
  // PermissionProvider context instance'ını paylaşır → `usePermissions().authz`
  // remote'da da populate olur.
  '@mfe/auth': { singleton: true, requiredVersion: false as const },
};

const isTest = !!process.env['VITEST'];

export default defineConfig(({ mode }) => {
  const appBasePath = normalizeBasePath(readEnvString(['APP_BASE_PATH', 'VITE_APP_BASE_PATH'], '/'));
  const shellRemoteEntry = readEnvString(['MFE_SHELL_URL', 'VITE_MFE_SHELL_URL'], 'http://localhost:3000/remoteEntry.js');

  return ({
    base: appBasePath,
    plugins: [
      react(),
      tailwindcss(),
      ...(isTest ? [] : [federation({
        name: 'mfe_access',
        filename: 'remoteEntry.js',
        dts: false,
        remotes: {
          mfe_shell: {
            type: 'module',
            name: 'mfe_shell',
            entry: shellRemoteEntry,
          },
        },
        exposes: {
          './AccessApp': './src/app/AccessApp.ui.tsx',
          './shell-services': './src/app/services/shell-services.ts',
        },
        shared: {
          /* Always share the full set — remove isSingleDomainBuild conditional
           * to prevent duplicate React instances in single-domain builds. */
          ...sharedCore,
          ...(mode === 'production' ? sharedProdOnly : {}),
        },
      })]),
    ],

  resolve: {
    alias: [
      { find: '@mfe/design-system', replacement: path.resolve(__dirname, '../../packages/design-system/src') },
      { find: '@mfe/shared-http', replacement: path.resolve(__dirname, '../../packages/shared-http/src') },
      // mfe_shell/i18n: only alias in test mode — in dev/prod, MF remote handles it.
      // Alias + MF plugin conflict: plugin rewrites to __moduleExports (enforce: pre)
      // then alias resolves to raw TS file that doesn't have __moduleExports → crash.
      ...(isTest ? [{ find: 'mfe_shell/i18n', replacement: path.resolve(__dirname, '../mfe-shell/src/app/i18n/index.ts') }] : []),
      { find: '@tanstack/react-query', replacement: path.resolve(__dirname, 'node_modules/@tanstack/react-query/build/modern/index.js') },
    ],
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'react-router',
      'react-router-dom',
      'axios',
      'ag-grid-community',
      'ag-grid-enterprise',
      'ag-grid-react',
    ],
    exclude: ['mfe_shell', '@tanstack/react-query'],
  },

  server: {
    host: '127.0.0.1',
    port: 3005,
    strictPort: true,
    cors: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    proxy: {
      '/api/v1/users': { target: 'http://localhost:8089', changeOrigin: true, secure: false },
      '/api/v1/roles': { target: 'http://localhost:8090', changeOrigin: true, secure: false },
      '/api/v1/authz': { target: 'http://localhost:8090', changeOrigin: true, secure: false },
    },
  },

  build: {
    target: 'esnext',
    outDir: 'dist',
    // NOTE: `rolldownOptions.external: [/^mfe_shell\//]` intentionally removed.
    // @module-federation/vite zaten shell expose'larını ("mfe_shell/*") federation
    // rewrite üzerinden handle ediyor. External regex browser'a çıplak
    // `mfe_shell/i18n` specifier'ı sızdırıp runtime'da
    // "Failed to resolve module specifier" hatası üretiyordu (Codex CNS thread
    // 019d97c7 Tur 7 kök neden). Release gate Playwright E2E staging'de bu bug'ı
    // yakaladı (mfe-access boot fail).
  },

  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    },
  });
});
