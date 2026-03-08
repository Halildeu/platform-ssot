const { merge } = require('webpack-merge');
const { ModuleFederationPlugin } = require('webpack').container;
const commonConfig = require('./webpack.common.js');
const deps = require('./package.json').dependencies;

const devConfig = {
  mode: 'development',
  output: {
    publicPath: 'http://localhost:3004/',
  },
  devServer: {
    port: 3004,
    headers: { 'Access-Control-Allow-Origin': '*' },
    proxy: [
      {
        context: ['/api/auth'],
        target: 'http://localhost:8088',
        changeOrigin: true,
        secure: false,
        logLevel: 'warn',
      },
      {
        context: ['/api'],
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        logLevel: 'warn',
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'mfe_users',
      filename: 'remoteEntry.js',
      remotes: {
        mfe_shell: 'mfe_shell@http://localhost:3000/remoteEntry.js',
        mfe_reporting: 'mfe_reporting@http://localhost:3007/remoteEntry.js',
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
        '@mfe/i18n-dicts': { singleton: true, requiredVersion: false },
      },
    }),
  ],
};

module.exports = merge(commonConfig, devConfig);
