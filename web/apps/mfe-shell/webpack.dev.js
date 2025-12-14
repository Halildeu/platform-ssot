// mfe-shell/webpack.dev.js
const { merge } = require('webpack-merge');
const { ModuleFederationPlugin } = require('webpack').container;
const commonConfig = require('./webpack.common.js');
const deps = require('./package.json').dependencies;

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
    proxy: [
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
      remotes: {
        mfe_suggestions: 'mfe_suggestions@http://localhost:3001/remoteEntry.js',
        mfe_ethic:       'mfe_ethic@http://localhost:3002/remoteEntry.js',
        mfe_access:      'mfe_access@http://localhost:3005/remoteEntry.js',
        mfe_audit:       'mfe_audit@http://localhost:3006/remoteEntry.js',
        mfe_users:       'mfe_users@http://localhost:3004/remoteEntry.js',
        mfe_reporting:   'mfe_reporting@http://localhost:3007/remoteEntry.js',
      },
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
        'mfe-ui-kit':      { singleton: true, requiredVersion: false },
        // ➤ Tailwind yardımcıları
        clsx:              { singleton: true, requiredVersion: deps.clsx },
        'tailwind-merge':  { singleton: true, requiredVersion: deps['tailwind-merge'] },
        // ➤ AG Grid tekil paylaşımlar
        'ag-grid-community':  { singleton: true, strictVersion: true, requiredVersion: deps['ag-grid-community'] },
        'ag-grid-enterprise': { singleton: true, strictVersion: true, requiredVersion: deps['ag-grid-enterprise'] },
        'ag-grid-react':      { singleton: true, strictVersion: true, requiredVersion: deps['ag-grid-react'] },
        '@mfe/shared-http':   { singleton: true, requiredVersion: false },
      },
    }),
  ],
};

module.exports = merge(commonConfig, devConfig);
