const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const deps = require('./package.json').dependencies;

module.exports = {
  mode: 'development',
  entry: './src/index.tsx', // GÜNCELLENDİ: Giriş noktası .tsx oldu.
  output: {
    publicPath: 'http://localhost:3001/',
  },
  devServer: {
    port: 3001,
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/, // GÜNCELLENDİ: .ts ve .tsx eklendi.
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-typescript', // GÜNCELLENDİ: TypeScript preset'i eklendi.
              [
                '@babel/preset-react',
                {
                  'runtime': 'automatic'
                }
              ]
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'mfe_suggestions',
      filename: 'remoteEntry.js',
      remotes: {
      'mfe_shell': 'mfe_shell@http://localhost:3000/remoteEntry.js',
      'mfe_ui_kit': 'mfe_ui_kit@http://localhost:3003/remoteEntry.js',
},
      exposes: {
        './SuggestionsApp': './src/App.tsx', // GÜNCELLENDİ: Dosya uzantısı .tsx oldu.
      },
      shared: {
        ...deps,
        react: { singleton: true, requiredVersion: deps.react },
        'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
        'react-router-dom': {
          singleton: true,
          requiredVersion: deps['react-router-dom'],
        },
        '@reduxjs/toolkit': { singleton: true, requiredVersion: deps['@reduxjs/toolkit'] },
        'react-redux': { singleton: true, requiredVersion: deps['react-redux'] },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'], // GÜNCELLENDİ: .ts ve .tsx eklendi.
  },
};