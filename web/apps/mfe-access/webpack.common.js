const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const MAX_ENTRYPOINT_SIZE = 25 * 1024 * 1024; // 25 MB
const MAX_ASSET_SIZE = 8 * 1024 * 1024; // 8 MB

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
              ['@babel/preset-react', { runtime: 'automatic' }]
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff2?)$/,
        type: 'asset'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@mfe/design-system': path.resolve(__dirname, '../../packages/design-system/src'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './public/index.html' })
  ],
  performance: {
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
    maxEntrypointSize: MAX_ENTRYPOINT_SIZE,
    maxAssetSize: MAX_ASSET_SIZE,
  }
};
