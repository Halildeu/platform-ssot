const { merge } = require('webpack-merge');
const { ModuleFederationPlugin } = require('webpack').container;
const commonConfig = require('./webpack.common.js');
const deps = require('./package.json').dependencies;

const prodConfig = {
  mode: 'production',
  output: {
    publicPath: 'auto',
    clean: true,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'mfe_reporting',
      filename: 'remoteEntry.js',
      remotes: {
        mfe_shell: 'mfe_shell@http://localhost:3000/remoteEntry.js',
      },
      exposes: {
        './ReportingApp': './src/App.tsx',
        './grid': './src/grid/index.ts',
        './shell-services': './src/app/services/shell-services.ts',
      },
      shared: {
        ...deps,
        react: { singleton: true, requiredVersion: deps.react },
        'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
        'react-router': { singleton: true, requiredVersion: deps['react-router'] },
        'react-router-dom': { singleton: true, requiredVersion: deps['react-router-dom'] },
        '@tanstack/react-query': { singleton: true, requiredVersion: deps['@tanstack/react-query'] },
        '@platform/capabilities': { singleton: true, requiredVersion: false },
        '@mfe/design-system': { singleton: true, requiredVersion: false },
        '@mfe/shared-http': { singleton: true, requiredVersion: false },
        '@mfe/i18n-dicts': { singleton: true, requiredVersion: false },
      },
    }),
  ],
};

module.exports = merge(commonConfig, prodConfig);
