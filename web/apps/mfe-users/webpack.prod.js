const { merge } = require('webpack-merge');
const { ModuleFederationPlugin } = require('webpack').container;
const commonConfig = require('./webpack.common.js');
const deps = require('./package.json').dependencies;
const path = require('path');

const prodConfig = {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, '../dist/users'),
    publicPath: '/users/',
    clean: true,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'mfe_users',
      filename: 'remoteEntry.js',
      remotes: {
        mfe_shell: 'mfe_shell@/remoteEntry.js',
        mfe_reporting: 'mfe_reporting@/reports/remoteEntry.js',
      },
      exposes: {
        './UsersApp': './src/app/UsersApp.ui.tsx',
        './shell-services': './src/app/services/shell-services.ts',
      },
      shared: {
        ...deps,
        react: { singleton: true, requiredVersion: deps.react },
        'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
        'react-redux': { singleton: true, requiredVersion: deps['react-redux'] },
        '@reduxjs/toolkit': { singleton: true, requiredVersion: deps['@reduxjs/toolkit'] },
        '@tanstack/react-query': {
          singleton: true,
          requiredVersion: deps['@tanstack/react-query'],
        },
        antd: { singleton: true, requiredVersion: deps.antd },
        'ag-grid-react': { singleton: true, requiredVersion: deps['ag-grid-react'] },
        'ag-grid-community': { singleton: true, requiredVersion: deps['ag-grid-community'] },
        'ag-grid-enterprise': { singleton: true, requiredVersion: deps['ag-grid-enterprise'] },
        'react-router': { singleton: true, requiredVersion: deps['react-router'] },
        'react-router-dom': { singleton: true, requiredVersion: deps['react-router-dom'] },
        'mfe-ui-kit': { singleton: true, requiredVersion: false },
        '@mfe/shared-http': { singleton: true, requiredVersion: false },
      },
    }),
  ],
};

module.exports = merge(commonConfig, prodConfig);
