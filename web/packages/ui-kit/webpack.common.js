// packages/mfe-ui-kit/webpack.common.js
const path = require('path');

const MAX_ENTRYPOINT_SIZE = 25 * 1024 * 1024; // 25 MB
const MAX_ASSET_SIZE = 8 * 1024 * 1024; // 8 MB

module.exports = {
  // UI-Kit sadece bileşen kütüphanesi ise .ts; JSX kullanıyorsanız .tsx yapın
  entry: './src/index.ts',

  // Geliştirmede kaynak haritası, prod’da kapalı
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
        test: /\.[jt]sx?$/,              // .js, .jsx, .ts, .tsx
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
        use: [
          'style-loader',               // dev için HMR; prod’da MiniCssExtract kullanabilirsiniz
          'css-loader',
          'postcss-loader',             // depo kökündeki postcss.config.js otomatik algılanır
        ],
      },
      {
        // İhtiyacınız varsa: svg/png/font import’ları için örnek kural
        test: /\.(png|jpe?g|gif|svg|woff2?)$/,
        type: 'asset',
      },
    ],
  },
  performance: {
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
    maxEntrypointSize: MAX_ENTRYPOINT_SIZE,
    maxAssetSize: MAX_ASSET_SIZE,
  },
};
