const { merge } = require('webpack-merge');
const { ModuleFederationPlugin } = require('webpack').container;
const commonConfig = require('./webpack.common.js');
const deps = require('./package.json').dependencies;

const devConfig = {
  mode: 'development',
  output: {
    publicPath: 'http://localhost:3005/',
    crossOriginLoading: 'anonymous'
  },
  devServer: {
    port: 3005,
    historyApiFallback: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    client: {
      overlay: false,
    },
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'mfe_access',
      filename: 'remoteEntry.js',
      remotes: {
        mfe_shell: 'mfe_shell@http://localhost:3000/remoteEntry.js'
      },
      exposes: {
        './AccessApp': './src/app/AccessApp.ui.tsx',
        './shell-services': './src/app/services/shell-services.ts'
      },
      shared: {
        ...deps,
        react: { singleton: true, requiredVersion: deps.react },
        'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
        'react-router': { singleton: true, requiredVersion: deps['react-router'] },
        'react-router-dom': { singleton: true, requiredVersion: deps['react-router-dom'] },
        '@tanstack/react-query': { singleton: true, requiredVersion: deps['@tanstack/react-query'] },
        '@tanstack/react-query-devtools': { singleton: true, requiredVersion: deps['@tanstack/react-query-devtools'] },
        'ag-grid-react': { singleton: true, requiredVersion: deps['ag-grid-react'] },
        'ag-grid-community': { singleton: true, requiredVersion: deps['ag-grid-community'] },
        'ag-grid-enterprise': { singleton: true, requiredVersion: deps['ag-grid-enterprise'] },
        '@mfe/design-system': { singleton: true, requiredVersion: false },
        '@mfe/shared-http': { singleton: true, requiredVersion: false }
      }
    })
  ]
};

module.exports = merge(commonConfig, devConfig);
