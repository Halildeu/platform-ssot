const { merge } = require('webpack-merge');
const { ModuleFederationPlugin } = require('webpack').container;
const commonConfig = require('./webpack.common.js');
const deps = require('./package.json').dependencies;

const prodConfig = {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].js',
    publicPath: 'auto',
    clean: true
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'mfe_audit',
      filename: 'remoteEntry.js',
      remotes: {
        mfe_shell: `promise new Promise((resolve) => {
          const remoteGlobal = 'mfe_shell';
          const remoteUrl = '/remoteEntry.js';

          const provideFallback = () => {
            const proxy = {
              get: (request) =>
                Promise.resolve(() => {
                  if (request === './services') {
                    return {
                      getShellServices: () => ({
                        telemetry: { emit: () => {} },
                        notify: { push: () => {} }
                      })
                    };
                  }
                  throw new Error('mfe_shell stub: unknown module ' + request);
                }),
              init: () => Promise.resolve()
            };
            resolve(proxy);
          };

          if (window[remoteGlobal]) {
            resolve(window[remoteGlobal]);
            return;
          }

          const script = document.createElement('script');
          script.src = remoteUrl;
          script.type = 'text/javascript';
          script.async = true;
          script.onload = () => {
            if (window[remoteGlobal]) {
              resolve(window[remoteGlobal]);
            } else {
              provideFallback();
            }
          };
          script.onerror = () => {
            if (process.env.NODE_ENV !== 'production') {
              // eslint-disable-next-line no-console
              console.warn('[mfe-audit] shell remote failed to load, using stub');
            }
            provideFallback();
          };
          document.head.appendChild(script);
        })`
      },
      exposes: {
        './AuditApp': './src/app/components/AuditApp.tsx',
        './shell-services': './src/app/services/shell-services.ts'
      },
      shared: {
        ...deps,
        react: { singleton: true, requiredVersion: deps.react },
        'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
        'react-router': { singleton: true, requiredVersion: deps['react-router'] },
        'react-router-dom': { singleton: true, requiredVersion: deps['react-router-dom'] },
        'mfe-ui-kit': { singleton: true, requiredVersion: false },
        'ag-grid-react': { singleton: true, requiredVersion: deps['ag-grid-react'] },
        'ag-grid-community': { singleton: true, requiredVersion: deps['ag-grid-community'] },
        'ag-grid-enterprise': { singleton: true, requiredVersion: deps['ag-grid-enterprise'] },
        '@mfe/shared-http': { singleton: true, requiredVersion: false }
      }
    })
  ]
};

module.exports = merge(commonConfig, prodConfig);
