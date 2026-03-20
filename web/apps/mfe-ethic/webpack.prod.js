const { merge } = require('webpack-merge');
const { ModuleFederationPlugin } = require('webpack').container;
const commonConfig = require('./webpack.common.js');
const deps = require('./package.json').dependencies;
const path = require('path');

const prodConfig = {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].js', // Benzersiz dosya adı oluşturur
    path: path.resolve(__dirname, '../dist/ethic'), // DOĞRU: Ana dist altına
    publicPath: '/ethic/',                             // Sunucuda /ethic/ dizininden yayınlanacak
    clean: true,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'mfe_ethic',
      filename: 'remoteEntry.js',
      remotes: {
        mfe_shell: 'mfe_shell@/remoteEntry.js',                // Shell ana dizinde!
      },
      exposes: {
        './EthicApp': './src/App.tsx',
      },
      shared: {
        ...deps,
        react: { singleton: true, requiredVersion: deps.react },
        'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
        'react-router': { singleton: true, requiredVersion: deps['react-router'] },
        'react-router-dom': { singleton: true, requiredVersion: deps['react-router-dom'] },
        '@reduxjs/toolkit': { singleton: true, requiredVersion: deps['@reduxjs/toolkit'] },
        'react-redux': { singleton: true, requiredVersion: deps['react-redux'] },
        '@mfe/design-system': { singleton: true, requiredVersion: false },
      },
    }),
  ],
};

module.exports = merge(commonConfig, prodConfig);
