const { merge } = require('webpack-merge');
const { ModuleFederationPlugin } = require('webpack').container;
const commonConfig = require('./webpack.common.js');
const deps = require('./package.json').dependencies;
const path = require('path');

module.exports = merge(commonConfig, {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, '../dist/design-system'),
    publicPath: '/design-system/',
    clean: true,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'mfe_design_system',
      filename: 'remoteEntry.js',
      exposes: {
        './library': './src/index.ts',
      },
      shared: {
        react: { singleton: true, requiredVersion: deps.react },
        'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
      },
    }),
  ],
});
