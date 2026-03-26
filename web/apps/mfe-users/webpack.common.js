const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const MAX_ENTRYPOINT_SIZE = 25 * 1024 * 1024; // 25 MB
const MAX_ASSET_SIZE = 8 * 1024 * 1024; // 8 MB

// Load env from shell's .env.local (AG Grid license, auth config)
const shellEnvPath = path.resolve(__dirname, '../mfe-shell/.env.local');
if (fs.existsSync(shellEnvPath)) {
  const lines = fs.readFileSync(shellEnvPath, 'utf-8').split('\n');
  for (const line of lines) {
    const eqIdx = line.indexOf('=');
    if (eqIdx < 1) continue;
    const key = line.substring(0, eqIdx).trim();
    const val = line.substring(eqIdx + 1).trim();
    if (key && val && !process.env[key]) process.env[key] = val;
  }
}

const runtimeEnv = {};
const FORWARD_KEYS = ['AG_GRID_LICENSE_KEY', 'VITE_AG_GRID_LICENSE_KEY', 'NODE_ENV', 'AUTH_MODE'];
for (const key of FORWARD_KEYS) {
  if (process.env[key]) runtimeEnv[key] = process.env[key];
}
runtimeEnv.NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
  entry: './src/app/index.tsx',
  devtool: process.env.NODE_ENV === 'development' ? 'eval-source-map' : false,
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: [
              ['@babel/preset-env', { targets: 'defaults, not IE 11' }],
              '@babel/preset-typescript',
              ['@babel/preset-react', { runtime: 'automatic' }],
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff2?)$/,
        type: 'asset',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@mfe/design-system': path.resolve(__dirname, '../../packages/design-system/src'),
      '@mfe/shared-http': path.resolve(__dirname, '../../packages/shared-http/src'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './public/index.html' }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(runtimeEnv),
    }),
  ],
  performance: {
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
    maxEntrypointSize: MAX_ENTRYPOINT_SIZE,
    maxAssetSize: MAX_ASSET_SIZE,
  },
};
