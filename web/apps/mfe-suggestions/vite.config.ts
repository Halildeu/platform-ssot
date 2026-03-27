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
      name: 'mfe_suggestions',
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
        './SuggestionsApp': './src/App.tsx',
      },
      /* Dev: shared deps disabled — pnpm workspace hoisting guarantees singletons.
       * Prod: shared enabled for proper chunk deduplication across remotes. */
      shared: mode === 'production' ? {
        react:              { singleton: true, requiredVersion: deps.react },
        'react-dom':        { singleton: true, requiredVersion: deps['react-dom'] },
        'react-router':     { singleton: true, requiredVersion: deps['react-router'] },
        'react-router-dom': { singleton: true, requiredVersion: deps['react-router-dom'] },
        '@reduxjs/toolkit': { singleton: true, requiredVersion: deps['@reduxjs/toolkit'] },
        'react-redux':      { singleton: true, requiredVersion: deps['react-redux'] },
        '@mfe/design-system': { singleton: true, requiredVersion: false },
        clsx:               { singleton: true, requiredVersion: deps.clsx },
        'tailwind-merge':   { singleton: true, requiredVersion: deps['tailwind-merge'] },
      } : {},
    }),
  ],

  resolve: {
    alias: [
      { find: '@mfe/design-system', replacement: path.resolve(__dirname, '../../packages/design-system/src') },
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
      '@reduxjs/toolkit',
      'react-redux',
      'clsx',
      'tailwind-merge',
    ],
    exclude: ['mfe_shell'],
  },

  server: {
    port: 3001,
    strictPort: true,
    cors: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },

  build: {
    target: 'esnext',
    outDir: 'dist',
  },
}));
