/** @type {import('tailwindcss').Config} */
const baseConfig = require('../../tailwind.config.js');

module.exports = {
  ...baseConfig,
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/design-system/src/**/*.{js,ts,jsx,tsx}',
  ],
};

