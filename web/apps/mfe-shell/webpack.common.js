// webpack.common.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const MAX_ENTRYPOINT_SIZE = 25 * 1024 * 1024; // 25 MB
const MAX_ASSET_SIZE = 8 * 1024 * 1024; // 8 MB

module.exports = {
  entry: './src/index.tsx',

  // Geliştirmede hızlı kaynak haritası; prod’da kapalı
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
          'style-loader',             // dev: HMR; prod’da MiniCssExtract kullanabilirsiniz
          'css-loader',
          'postcss-loader',           // kökteki postcss.config.js otomatik bulunur
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
      '@mfe/i18n-dicts': path.resolve(__dirname, '../../packages/i18n-dicts/src'),
      '@mfe/shared-http': path.resolve(__dirname, '../../packages/shared-http/src'),
    },
  },

  plugins: [
    new HtmlWebpackPlugin({ template: './public/index.html' }),
  ],
  performance: {
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
    maxEntrypointSize: MAX_ENTRYPOINT_SIZE,
    maxAssetSize: MAX_ASSET_SIZE,
  },
};
