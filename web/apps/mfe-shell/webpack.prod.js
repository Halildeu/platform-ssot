const { merge } = require('webpack-merge');
const { ModuleFederationPlugin } = require('webpack').container;
const commonConfig = require('./webpack.common.js');
const deps = require('./package.json').dependencies;
const path = require('path');

const prodConfig = {
  mode: 'production',
    output: {
      filename: '[name].[contenthash].js', // Benzersiz dosya adı oluşturur
      path: path.resolve(__dirname, '../dist'),
      publicPath: '/',
      clean: false,
    },
  plugins: [
    new ModuleFederationPlugin({
      name: 'mfe_shell',
      remotes: {
        mfe_suggestions: 'mfe_suggestions@/suggestions/remoteEntry.js',
        mfe_ethic: 'mfe_ethic@/ethic/remoteEntry.js',
        mfe_access: 'mfe_access@/access/remoteEntry.js',
        mfe_audit: 'mfe_audit@/audit/remoteEntry.js',
        mfe_users: 'mfe_users@/users/remoteEntry.js',
        mfe_reporting: 'mfe_reporting@/reports/remoteEntry.js',
      },
      exposes: {
        './logic': './src/exposed-logic.ts',
        './services': './src/app/services/shell-services.ts',
        './i18n': './src/app/i18n/index.ts',
      },
      shared: {
        ...deps,
        react: { singleton: true, requiredVersion: deps.react },
        'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
        'react-router': {
          singleton: true,
          requiredVersion: deps['react-router'],
        },
        'react-router-dom': {
          singleton: true,
          requiredVersion: deps['react-router-dom'],
        },
        '@reduxjs/toolkit': {
          singleton: true,
          requiredVersion: deps['@reduxjs/toolkit'],
        },
        'react-redux': {
          singleton: true,
          requiredVersion: deps['react-redux'],
        },
        '@tanstack/react-query': {
          singleton: true,
          requiredVersion: deps['@tanstack/react-query'],
        },
        'mfe-ui-kit': { singleton: true, requiredVersion: false },
        // ➤ AG Grid tekil paylaşımlar (prod)
        'ag-grid-community':  { singleton: true, strictVersion: true, requiredVersion: deps['ag-grid-community'] },
        'ag-grid-enterprise': { singleton: true, strictVersion: true, requiredVersion: deps['ag-grid-enterprise'] },
        'ag-grid-react':      { singleton: true, strictVersion: true, requiredVersion: deps['ag-grid-react'] },
        '@mfe/shared-http':   { singleton: true, requiredVersion: false },
      },
    }),
  ],
};

module.exports = merge(commonConfig, prodConfig);
