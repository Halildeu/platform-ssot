const path = require('path');

module.exports = {
  plugins: {
    'postcss-import': {
      path: [
        path.resolve(__dirname),
        path.resolve(__dirname, 'packages/design-system/src'),
      ],
    },
    tailwindcss: {},
    autoprefixer: {},
  },
};
