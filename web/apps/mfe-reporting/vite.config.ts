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
const singleton = (name: string, fallback: string | boolean = false) => ({
  singleton: true,
  requiredVersion: deps[name] ?? fallback,
});
const sharedCore = {
  react: singleton('react'),
  'react-dom': singleton('react-dom'),
  'react-router': singleton('react-router'),
  'react-router-dom': singleton('react-router-dom'),
  '@reduxjs/toolkit': singleton('@reduxjs/toolkit'),
  'react-redux': singleton('react-redux'),
  '@tanstack/react-query': singleton('@tanstack/react-query'),
};
const sharedProdOnly = {
  'ag-grid-community': singleton('ag-grid-community'),
  'ag-grid-enterprise': singleton('ag-grid-enterprise'),
  'ag-grid-react': singleton('ag-grid-react'),
  '@platform/capabilities': singleton('@platform/capabilities', false),
  '@mfe/design-system': singleton('@mfe/design-system', false),
  '@mfe/shared-http': singleton('@mfe/shared-http', false),
  '@mfe/i18n-dicts': singleton('@mfe/i18n-dicts', false),
};

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
        dts: false,
        remotes: {
          mfe_shell: { type: 'module', name: 'mfe_shell', entry: 'http://localhost:3000/remoteEntry.js' },
        },
        exposes: {
          './ReportingApp': './src/App.tsx',
          './grid': './src/grid/index.ts',
          './shell-services': './src/app/services/shell-services.ts',
        },
        shared: {
          ...sharedCore,
          ...(mode === 'production' ? sharedProdOnly : {}),
        },
      }),
    ],

    resolve: {
      alias: [
        { find: '@platform/capabilities', replacement: path.resolve(__dirname, '../../packages/platform-capabilities/src') },
        { find: '@mfe/design-system', replacement: path.resolve(__dirname, '../../packages/design-system/src') },
        { find: '@mfe/shared-http', replacement: path.resolve(__dirname, '../../packages/shared-http/src') },
        { find: '@mfe/i18n-dicts', replacement: path.resolve(__dirname, '../../packages/i18n-dicts/src') },
        { find: '@tanstack/react-query', replacement: path.resolve(__dirname, 'node_modules/@tanstack/react-query/build/modern/index.js') },
      ],
    },

    server: {
      host: '127.0.0.1',
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
        'axios',
        'clsx',
        'ag-grid-community',
        'ag-grid-enterprise',
        'ag-grid-react',
      ],
      exclude: ['mfe_shell', '@tanstack/react-query'],
    },

    build: {
      target: 'esnext',
      outDir: 'dist',
      sourcemap: mode === 'development',
    },
  };
});
