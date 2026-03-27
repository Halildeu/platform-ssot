/// <reference types="vite/client" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';
import path from 'node:path';
import { readFileSync } from 'node:fs';

/* ------------------------------------------------------------------ */
/*  Read package.json deps for MF shared config                        */
/* ------------------------------------------------------------------ */

const pkg = JSON.parse(readFileSync(path.resolve(__dirname, 'package.json'), 'utf8'));
const deps = pkg.dependencies as Record<string, string>;

/* ------------------------------------------------------------------ */
/*  Vite Config                                                         */
/* ------------------------------------------------------------------ */

export default defineConfig(({ mode }) => {
  return {
    root: __dirname,
    publicDir: 'public',

    plugins: [
      react(),
      federation({
        name: 'mfe_reporting',
        filename: 'remoteEntry.js',
        remotes: {
          mfe_shell: { type: 'module', name: 'mfe_shell', entry: 'http://localhost:3000/remoteEntry.js' },
        },
        exposes: {
          './ReportingApp': './src/App.tsx',
          './grid': './src/grid/index.ts',
          './shell-services': './src/app/services/shell-services.ts',
        },
        /* Dev: shared deps disabled — pnpm workspace hoisting guarantees singletons.
         * Prod: shared enabled for proper chunk deduplication across remotes. */
        shared: mode === 'production' ? {
          react: { singleton: true, requiredVersion: deps.react },
          'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
          'react-router': { singleton: true, requiredVersion: deps['react-router'] },
          'react-router-dom': { singleton: true, requiredVersion: deps['react-router-dom'] },
          '@tanstack/react-query': { singleton: true, requiredVersion: deps['@tanstack/react-query'] },
          'ag-grid-community': { singleton: true, requiredVersion: deps['ag-grid-community'] },
          'ag-grid-enterprise': { singleton: true, requiredVersion: deps['ag-grid-enterprise'] },
          'ag-grid-react': { singleton: true, requiredVersion: deps['ag-grid-react'] },
          '@platform/capabilities': { singleton: true, requiredVersion: false },
          '@mfe/design-system': { singleton: true, requiredVersion: false },
          '@mfe/shared-http': { singleton: true, requiredVersion: false },
          '@mfe/i18n-dicts': { singleton: true, requiredVersion: false },
        } : {},
      }),
    ],

    resolve: {
      alias: [
        { find: '@platform/capabilities', replacement: path.resolve(__dirname, '../../packages/platform-capabilities/src') },
        { find: '@mfe/design-system', replacement: path.resolve(__dirname, '../../packages/design-system/src') },
        { find: '@mfe/shared-http', replacement: path.resolve(__dirname, '../../packages/shared-http/src') },
      ],
    },

    server: {
      port: 3007,
      strictPort: true,
      headers: { 'Access-Control-Allow-Origin': '*' },
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
        '@tanstack/react-query',
        'axios',
        'clsx',
        'ag-grid-community',
        'ag-grid-enterprise',
        'ag-grid-react',
      ],
      exclude: ['mfe_shell'],
    },

    build: {
      target: 'esnext',
      outDir: 'dist',
      sourcemap: mode === 'development',
    },
  };
});
