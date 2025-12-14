// Example Webpack 5 Module Federation config for access (remote)
// Copy under apps/mfe-access/webpack.dev.js and adapt paths as needed
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const deps = require('../../../../package.json')?.dependencies || {};

module.exports = {
  mode: 'development',
  entry: './src/app/bootstrap.tsx',
  devtool: 'inline-source-map',
  devServer: {
    port: 3005,
    historyApiFallback: true,
  },
  resolve: { extensions: ['.tsx', '.ts', '.js'] },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader', exclude: /node_modules/ },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'mfe_access',
      filename: 'remoteEntry.js',
      exposes: {
        './AccessApp': './src/app/AccessApp.ui.tsx',
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
    filename: 'bundle.js',
    clean: true,
  },
};

