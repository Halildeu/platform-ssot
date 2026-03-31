/// <reference types="vite/client" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
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
  '@tanstack/react-query': singleton('@tanstack/react-query'),
};
const sharedProdOnly = {};

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      federation({
        name: 'mfe_schema_explorer',
        filename: 'remoteEntry.js',
        dts: false,
        remotes: {
          mfe_shell: { type: 'module', name: 'mfe_shell', entry: 'http://localhost:3000/remoteEntry.js' },
        },
        exposes: {
          './SchemaExplorerApp': './src/App.tsx',
        },
        shared: {
          ...sharedCore,
          ...(mode === 'production' ? sharedProdOnly : {}),
        },
      }),
    ],

    resolve: {
      alias: [
        { find: '@tanstack/react-query', replacement: path.resolve(__dirname, 'node_modules/@tanstack/react-query/build/modern/index.js') },
      ],
    },

    server: {
      host: '127.0.0.1',
      port: 3008,
      strictPort: true,
      headers: { 'Access-Control-Allow-Origin': '*' },
      proxy: {
        '/api/v1/schema': {
          target: 'http://localhost:8096',
          changeOrigin: true,
        },
      },
    },

    optimizeDeps: {
      include: [
        'react', 'react-dom', 'react-dom/client',
        'react/jsx-runtime', 'react/jsx-dev-runtime',
        'react-router', 'react-router-dom',
        'axios', 'clsx',
        'cytoscape', 'cytoscape-fcose',
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
