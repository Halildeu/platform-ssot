// mfe-ui-kit/webpack.dev.js
const { merge } = require('webpack-merge');
const { ModuleFederationPlugin } = require('webpack').container;
const commonConfig = require('./webpack.common.js');
const deps = require('./package.json').dependencies;
const sharedDeps = { ...deps };
delete sharedDeps.clsx;
delete sharedDeps['tailwind-merge'];

const devConfig = {
  mode: 'development',

  output: {
    publicPath: 'http://localhost:3003/',
  },

  devServer: {
    port: 3003,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },

  plugins: [
    new ModuleFederationPlugin({
      name: 'mfe_ui_kit',
      filename: 'remoteEntry.js',

      exposes: {
        './library': './src/index.ts',
        './Button': './src/components/Button.tsx',
      },

      shared: {
        ...sharedDeps,
        react:       { singleton: true, requiredVersion: deps.react },
        'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
        '@tanstack/react-query': { singleton: true, requiredVersion: false },
        '@mfe/shared-http': { singleton: true, requiredVersion: false },
      },
    }),
  ],
};

module.exports = merge(commonConfig, devConfig);
