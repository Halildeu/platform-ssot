const { merge } = require('webpack-merge');
const { ModuleFederationPlugin } = require('webpack').container;
const commonConfig = require('./webpack.common.js');
const deps = require('./package.json').dependencies;

module.exports = merge(commonConfig, {
  mode: 'development',
  output: { publicPath: 'http://localhost:3004/' },
  devServer: {
    port: 3004,
    headers: { 'Access-Control-Allow-Origin': '*' },
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
