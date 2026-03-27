/// <reference types="vite/client" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';
import path from 'node:path';
import { readFileSync, existsSync } from 'node:fs';

/* ------------------------------------------------------------------ */
/*  Env helpers — replaces webpack's DefinePlugin                      */
/* ------------------------------------------------------------------ */

function loadShellDotEnvLocal(): Record<string, string> {
  const envPath = path.resolve(__dirname, '../mfe-shell/.env.local');
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

function buildRuntimeEnv(mode: string): Record<string, string> {
  const dotEnv = loadShellDotEnvLocal();
  const merged = { ...dotEnv, ...process.env };
  const allowlist = new Set(['NODE_ENV', 'AUTH_MODE', 'AG_GRID_LICENSE_KEY', 'VITE_AG_GRID_LICENSE_KEY']);
  const payload: Record<string, string> = {};
  for (const [key, value] of Object.entries(merged)) {
    if (!allowlist.has(key) && !key.startsWith('VITE_')) continue;
    if (typeof value === 'string') payload[key] = value;
  }
  payload.NODE_ENV ??= mode;
  return payload;
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
      react(),
      federation({
        name: 'mfe_users',
        filename: 'remoteEntry.js',
        remotes: {
          mfe_shell: { type: 'module', name: 'mfe_shell', entry: 'http://localhost:3000/remoteEntry.js' },
          mfe_reporting: { type: 'module', name: 'mfe_reporting', entry: 'http://localhost:3007/remoteEntry.js' },
        },
        exposes: {
          './UsersApp': './src/app/UsersApp.ui.tsx',
          './shell-services': './src/app/services/shell-services.ts',
        },
        shared: {
          react: { singleton: true, requiredVersion: deps.react },
          'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
          'react-redux': { singleton: true, requiredVersion: deps['react-redux'] },
          '@reduxjs/toolkit': { singleton: true, requiredVersion: deps['@reduxjs/toolkit'] },
          '@tanstack/react-query': { singleton: true, requiredVersion: deps['@tanstack/react-query'] },
          'ag-grid-react': { singleton: true, requiredVersion: deps['ag-grid-react'] },
          'ag-grid-community': { singleton: true, requiredVersion: deps['ag-grid-community'] },
          'ag-grid-enterprise': { singleton: true, requiredVersion: deps['ag-grid-enterprise'] },
          'react-router': { singleton: true, requiredVersion: deps['react-router'] },
          'react-router-dom': { singleton: true, requiredVersion: deps['react-router-dom'] },
          '@mfe/design-system': { singleton: true, requiredVersion: false },
          '@mfe/shared-http': { singleton: true, requiredVersion: false },
          '@mfe/i18n-dicts': { singleton: true, requiredVersion: false },
        },
      }),
    ],

    resolve: {
      alias: [
        { find: '@mfe/design-system', replacement: path.resolve(__dirname, '../../packages/design-system/src') },
        { find: '@mfe/shared-http', replacement: path.resolve(__dirname, '../../packages/shared-http/src') },
      ],
    },

    define: {
      'process.env': JSON.stringify(runtimeEnv),
    },

    server: {
      port: 3004,
      strictPort: true,
      headers: { 'Access-Control-Allow-Origin': '*' },
      proxy: {
        '/api/auth': { target: 'http://localhost:8088', changeOrigin: true, secure: false },
        '/api': { target: 'http://localhost:8080', changeOrigin: true, secure: false },
      },
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
        '@reduxjs/toolkit',
        'react-redux',
        '@tanstack/react-query',
        'axios',
        'ag-grid-community',
        'ag-grid-enterprise',
        'ag-grid-react',
      ],
      exclude: ['mfe_shell', 'mfe_reporting'],
    },

    build: {
      target: 'esnext',
      outDir: 'dist',
      sourcemap: mode === 'development',
    },
  };
});
