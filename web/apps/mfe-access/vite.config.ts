import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { federation } from '@module-federation/vite';
import path from 'node:path';
import { readFileSync } from 'node:fs';

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
  'ag-grid-react': singleton('ag-grid-react'),
  'ag-grid-community': singleton('ag-grid-community'),
  'ag-grid-enterprise': singleton('ag-grid-enterprise'),
  '@mfe/design-system': singleton('@mfe/design-system', false),
  '@mfe/shared-http': singleton('@mfe/shared-http', false),
};

const isTest = !!process.env['VITEST'];

export default defineConfig(({ mode }) => ({
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
          entry: 'http://localhost:3000/remoteEntry.js',
        },
      },
      exposes: {
        './AccessApp': './src/app/AccessApp.ui.tsx',
        './shell-services': './src/app/services/shell-services.ts',
      },
      shared: {
        ...sharedCore,
        ...(mode === 'production' ? sharedProdOnly : {}),
      },
    })]),
  ],

  resolve: {
    alias: [
      { find: '@mfe/design-system', replacement: path.resolve(__dirname, '../../packages/design-system/src') },
      { find: '@mfe/shared-http', replacement: path.resolve(__dirname, '../../packages/shared-http/src') },
      { find: 'mfe_shell/i18n', replacement: path.resolve(__dirname, '../mfe-shell/src/app/i18n/index.ts') },
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
      '@tanstack/react-query',
      'axios',
      'ag-grid-community',
      'ag-grid-enterprise',
      'ag-grid-react',
    ],
    exclude: ['mfe_shell'],
  },

  server: {
    host: '127.0.0.1',
    port: 3005,
    strictPort: true,
    cors: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },

  build: {
    target: 'esnext',
    outDir: 'dist',
    rolldownOptions: {
      external: [/^mfe_shell\//],
    },
  },

  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
}));
