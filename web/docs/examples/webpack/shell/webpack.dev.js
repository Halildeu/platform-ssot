// Example Webpack 5 Module Federation config for shell (host)
// Copy under apps/mfe-shell/webpack.dev.js and adapt paths as needed
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const deps = require('../../../../package.json')?.dependencies || {};

module.exports = {
  mode: 'development',
  entry: './src/index.tsx',
  devtool: 'inline-source-map',
  devServer: {
    port: 3000,
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
      name: 'mfe_shell',
      remotes: {
        mfe_users: 'mfe_users@http://localhost:3004/remoteEntry.js',
        mfe_access: 'mfe_access@http://localhost:3005/remoteEntry.js',
        mfe_reporting: 'mfe_reporting@http://localhost:3007/remoteEntry.js',
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

