const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const MAX_ENTRYPOINT_SIZE = 25 * 1024 * 1024;
const MAX_ASSET_SIZE = 8 * 1024 * 1024;

// Load AG Grid license from shell's .env.local (single source of truth)
const shellEnvPath = path.resolve(__dirname, '../../apps/mfe-shell/.env.local');
if (fs.existsSync(shellEnvPath)) {
  const lines = fs.readFileSync(shellEnvPath, 'utf-8').split('\n');
  for (const line of lines) {
    const [key, ...rest] = line.split('=');
    const val = rest.join('=').trim();
    if (key && val && !process.env[key.trim()]) {
      process.env[key.trim()] = val;
    }
  }
}

// Build runtime env for DefinePlugin
const runtimeEnv = {};
const FORWARD_KEYS = ['AG_GRID_LICENSE_KEY', 'VITE_AG_GRID_LICENSE_KEY', 'NODE_ENV', 'AUTH_MODE'];
for (const key of FORWARD_KEYS) {
  if (process.env[key]) runtimeEnv[key] = process.env[key];
}
runtimeEnv.NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
  entry: './src/index.ts',
  devtool: process.env.NODE_ENV === 'development' ? 'eval-source-map' : false,
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@mfe/shared-http': path.resolve(__dirname, '../shared-http/src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
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
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(runtimeEnv),
      'window.__env__': JSON.stringify(runtimeEnv),
    }),
  ],
  performance: {
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
    maxEntrypointSize: MAX_ENTRYPOINT_SIZE,
    maxAssetSize: MAX_ASSET_SIZE,
  },
};
