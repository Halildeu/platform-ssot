// webpack.common.js
const HtmlWebpackPlugin = require('html-webpack-plugin');

const MAX_ENTRYPOINT_SIZE = 25 * 1024 * 1024; // 25 MB
const MAX_ASSET_SIZE = 8 * 1024 * 1024; // 8 MB

module.exports = {
  entry: './src/index.tsx',

  // Geliştirmede hızlı kaynak haritası, prod’da kapalı
  devtool: process.env.NODE_ENV === 'development' ? 'eval-source-map' : false,

  module: {
    rules: [
      {
        // .js, .jsx, .ts, .tsx dosyaları
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,                    // yeniden derlemeyi hızlandırır
            presets: [
              ['@babel/preset-env', { targets: 'defaults, not IE 11' }],
              '@babel/preset-typescript',
              ['@babel/preset-react', { runtime: 'automatic' }],
            ],
          },
        },
      },
      {
        // Tailwind + PostCSS zinciri
        test: /\.css$/,
        use: [
          'style-loader',                           // dev: HMR; prod’da MiniCssExtract tercih edilir
          'css-loader',
          'postcss-loader',                        // kökteki postcss.config.js otomatik algılanır
        ],
      },
      {
        // İhtiyacınıza göre: svg/png/font import’ları
        test: /\.(png|jpe?g|gif|svg|woff2?)$/,
        type: 'asset',
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
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
