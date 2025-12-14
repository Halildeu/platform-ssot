// Example Webpack 5 Module Federation config for shell (host) - production
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const deps = require('../../../../package.json')?.dependencies || {};

module.exports = {
  mode: 'production',
  entry: './src/index.tsx',
  resolve: { extensions: ['.tsx', '.ts', '.js'] },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader', exclude: /node_modules/ },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'mfe_shell',
      remotes: {
        mfe_users: 'mfe_users@/users/remoteEntry.js',
        mfe_access: 'mfe_access@/access/remoteEntry.js',
        mfe_reporting: 'mfe_reporting@/reporting/remoteEntry.js',
      },
      shared: {
        react: { singleton: true, requiredVersion: deps.react },
        'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
        'react-router': { singleton: true, requiredVersion: deps['react-router'] || '^6' },
        'react-router-dom': { singleton: true, requiredVersion: deps['react-router-dom'] || '^6' },
      },
    }),
    new HtmlWebpackPlugin({ template: './public/index.html' }),
  ],
  output: {
    publicPath: 'auto',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true,
  },
};

