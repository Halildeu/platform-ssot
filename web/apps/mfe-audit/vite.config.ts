import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { federation } from '@module-federation/vite';
import path from 'node:path';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync(path.resolve(__dirname, 'package.json'), 'utf8'));
const deps = pkg.dependencies as Record<string, string>;

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'mfe_audit',
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
        './AuditApp': './src/app/components/AuditApp.tsx',
        './shell-services': './src/app/services/shell-services.ts',
      },
      /* Dev: shared deps disabled — pnpm workspace hoisting guarantees singletons.
       * Prod: shared enabled for proper chunk deduplication across remotes. */
      shared: mode === 'production' ? {
        react:              { singleton: true, requiredVersion: deps.react },
        'react-dom':        { singleton: true, requiredVersion: deps['react-dom'] },
        'react-router':     { singleton: true, requiredVersion: deps['react-router'] },
        'react-router-dom': { singleton: true, requiredVersion: deps['react-router-dom'] },
        '@tanstack/react-query': { singleton: true, requiredVersion: deps['@tanstack/react-query'] },
        '@mfe/design-system': { singleton: true, requiredVersion: false },
        'ag-grid-react':      { singleton: true, requiredVersion: deps['ag-grid-react'] },
        'ag-grid-community':  { singleton: true, requiredVersion: deps['ag-grid-community'] },
        'ag-grid-enterprise': { singleton: true, requiredVersion: deps['ag-grid-enterprise'] },
        '@mfe/shared-http':   { singleton: true, requiredVersion: false },
      } : {},
    }),
  ],

  resolve: {
    alias: [
      { find: '@mfe/design-system', replacement: path.resolve(__dirname, '../../packages/design-system/src') },
      { find: '@mfe/shared-http', replacement: path.resolve(__dirname, '../../packages/shared-http/src') },
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
      'clsx',
      'ag-grid-community',
      'ag-grid-enterprise',
      'ag-grid-react',
    ],
    exclude: ['mfe_shell'],
  },

  server: {
    port: 3006,
    strictPort: true,
    cors: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },

  build: {
    target: 'esnext',
    outDir: 'dist',
  },
}));
