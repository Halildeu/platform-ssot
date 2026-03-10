import type { StorybookConfig } from '@storybook/react-webpack5';

import { dirname, resolve } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
* This function is used to resolve the absolute path of a package.
* It is needed in projects that use Yarn PnP or are set up within a monorepo.
*/
function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)))
}
const config: StorybookConfig = {
  "stories": [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    getAbsolutePath('@storybook/addon-webpack5-compiler-swc'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-onboarding')
  ],
  "framework": {
    "name": getAbsolutePath('@storybook/react-webpack5'),
    "options": {}
  },
  webpackFinal: async (config) => {
    if (!config.resolve) {
      config.resolve = {};
    }
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'mfe_shell': resolve(__dirname, '../stories/mocks/mfe_shell'),
    };
    // Storybook docs build tum UI surface'ini tek bundle'da toplar; bundle boyut
    // butceleri app/package gate'lerinde izlendiginden burada webpack hint'lerini kapatiyoruz.
    config.performance = {
      ...(config.performance || {}),
      hints: false,
    };
    return config;
  }
};
export default config;
