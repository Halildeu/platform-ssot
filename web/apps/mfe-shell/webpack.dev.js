// mfe-shell/webpack.dev.js
const { merge } = require('webpack-merge');
const { ModuleFederationPlugin } = require('webpack').container;
const commonConfig = require('./webpack.common.js');
const deps = require('./package.json').dependencies;
const { buildDevRemotes } = require('./webpack.remotes.js');

const devConfig = {
  mode: 'development',
  output: {
    publicPath: 'http://localhost:3000/',
    crossOriginLoading: 'anonymous',
  },
  devServer: {
    port: 3000,
    historyApiFallback: true,
    hot: true,
    client: {
      overlay: false,
    },
    proxy: [
      {
        context: ['/auth/realms'],
        target: 'http://localhost:8081', // keycloak (for dev token grant)
        changeOrigin: true,
        secure: false,
        pathRewrite: { '^/auth': '' },
      },
      {
        context: ['/api/v1/reports', '/api/v1/dashboards'],
        target: 'http://localhost:8095', // report-service (direct)
        changeOrigin: true,
        secure: false,
      },
      {
        context: ['/api/v1/authz'],
        target: 'http://localhost:8090', // permission-service (direct, bypass gateway)
        changeOrigin: true,
        secure: false,
      },
      {
        context: ['/api/v1/users'],
        target: 'http://localhost:8089', // user-service (direct)
        changeOrigin: true,
        secure: false,
      },
      {
        context: ['/api/services'],
        target: 'http://localhost:8795', // service-manager-api (Docker management)
        changeOrigin: true,
        secure: false,
      },
      {
        context: ['/cockpit-api'],
        target: 'http://localhost:8790', // orchestrator cockpit-serve
        changeOrigin: true,
        secure: false,
        pathRewrite: { '^/cockpit-api': '/api' },
      },
      {
        context: ['/api'],
        target: 'http://localhost:8080', // api-gateway
        changeOrigin: true,
        secure: false,
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'mfe_shell',
      filename: 'remoteEntry.js',
      remotes: buildDevRemotes(),
      exposes: {
        './logic': './src/exposed-logic.ts',
        './services': './src/app/services/shell-services.ts',
        './i18n': './src/app/i18n/index.ts',
      },
      shared: {
        ...deps,
        react:             { singleton: true, requiredVersion: deps.react },
        'react-dom':       { singleton: true, requiredVersion: deps['react-dom'] },
        // STORY-0035: MF Router Shared & Version Pin
        'react-router':    { singleton: true, requiredVersion: deps['react-router'] },
        'react-router-dom':{ singleton: true, requiredVersion: deps['react-router-dom'] },
        '@reduxjs/toolkit':{ singleton: true, requiredVersion: deps['@reduxjs/toolkit'] },
        'react-redux':     { singleton: true, requiredVersion: deps['react-redux'] },
        '@tanstack/react-query': { singleton: true, requiredVersion: deps['@tanstack/react-query'] },
        '@mfe/design-system':      { singleton: true, requiredVersion: false },
        // ➤ Tailwind yardımcıları
        clsx:              { singleton: true, requiredVersion: deps.clsx },
        'tailwind-merge':  { singleton: true, requiredVersion: deps['tailwind-merge'] },
        // ➤ AG Grid tekil paylaşımlar
        'ag-grid-community':  { singleton: true, strictVersion: true, requiredVersion: deps['ag-grid-community'] },
        'ag-grid-enterprise': { singleton: true, strictVersion: true, requiredVersion: deps['ag-grid-enterprise'] },
        'ag-grid-react':      { singleton: true, strictVersion: true, requiredVersion: deps['ag-grid-react'] },
        '@platform/capabilities': { singleton: true, requiredVersion: false },
        '@mfe/shared-http':   { singleton: true, requiredVersion: false },
        '@mfe/i18n-dicts':    { singleton: true, requiredVersion: false },
      },
    }),
  ],
};

module.exports = merge(commonConfig, devConfig);
