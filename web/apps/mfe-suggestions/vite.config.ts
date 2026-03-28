import { defineConfig } from 'vite';
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
};
const sharedProdOnly = {
  '@mfe/design-system': singleton('@mfe/design-system', false),
  clsx: singleton('clsx'),
  'tailwind-merge': singleton('tailwind-merge'),
};

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'mfe_suggestions',
      filename: 'remoteEntry.js',
      dts: false,
      remotes: {},
      exposes: {
        './SuggestionsApp': './src/App.tsx',
      },
      shared: {
        ...sharedCore,
        ...(mode === 'production' ? sharedProdOnly : {}),
      },
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
    exclude: [],
  },

  server: {
    host: '127.0.0.1',
    port: 3001,
    strictPort: true,
    cors: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },

  build: {
    target: 'esnext',
    outDir: 'dist',
    // MF remote imports resolved at runtime via Module Federation container.
    // Mark as external so rolldown doesn't try to resolve named exports statically.
    rolldownOptions: {},
  },
}));
