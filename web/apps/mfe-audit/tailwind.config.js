/** @type {import('tailwindcss').Config} */
const baseConfig = require('../../tailwind.config.js');

module.exports = {
  ...baseConfig,
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui-kit/src/**/*.{js,ts,jsx,tsx}',
  ],
};

