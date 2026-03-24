// webpack.common.js
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const MAX_ENTRYPOINT_SIZE = 25 * 1024 * 1024; // 25 MB
const MAX_ASSET_SIZE = 8 * 1024 * 1024; // 8 MB

// Load .env.local for dev (AG Grid license, auth bypass, etc.)
const envLocalPath = path.resolve(__dirname, '.env.local');
if (fs.existsSync(envLocalPath)) {
  for (const line of fs.readFileSync(envLocalPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq > 0) {
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

const buildRuntimeEnv = () => {
  const allowlist = new Set([
    'NODE_ENV',
    'AUTH_MODE',
    'AG_GRID_LICENSE_KEY',
    'SHELL_SKIP_REMOTE_SERVICES',
    'SHELL_ENABLE_SUGGESTIONS_REMOTE',
    'SHELL_ENABLE_ETHIC_REMOTE',
  ]);
  const payload = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (!allowlist.has(key) && !key.startsWith('VITE_')) {
      continue;
    }
    if (typeof value !== 'string') {
      continue;
    }
    payload[key] = value;
  }
  if (typeof payload.NODE_ENV !== 'string' || payload.NODE_ENV.length === 0) {
    payload.NODE_ENV = process.env.NODE_ENV || 'development';
  }
  return payload;
};

const runtimeEnv = buildRuntimeEnv();

module.exports = {
  entry: './src/index.tsx',

  // Geliştirmede hızlı kaynak haritası; prod'da kapalı
  devtool: process.env.NODE_ENV === 'development' ? 'eval-source-map' : false,

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,          // .js, .jsx, .ts, .tsx
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: 'defaults, not IE 11' }], // opsiyonel ama faydalı
              '@babel/preset-typescript',
              ['@babel/preset-react', { runtime: 'automatic' }],
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: false,
                plugins: [
                  ['@tailwindcss/postcss', {}],
                ],
              },
            },
          },
        ],
      },
      {
        // Görsel / font import'ları için örnek kural (ihtiyacınıza göre kaldırabilirsiniz)
        test: /\.(png|jpe?g|gif|svg|woff2?)$/,
        type: 'asset',
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@platform/capabilities': path.resolve(__dirname, '../../packages/platform-capabilities/src'),
      '@mfe/design-system': path.resolve(__dirname, '../../packages/design-system/src'),
      '@mfe/i18n-dicts': path.resolve(__dirname, '../../packages/i18n-dicts/src'),
      '@mfe/shared-http': path.resolve(__dirname, '../../packages/shared-http/src'),
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      templateParameters: { runtimeEnvJson: JSON.stringify(runtimeEnv) },
    }),
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
