/* eslint-env node */

module.exports = {
  extends: ['stylelint-config-standard'],
  ignoreFiles: [
    '**/node_modules/**',
    '**/node_modules_old/**',
    'node_modules_failed_pnpm_hoisted/**',
  ],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'layer', 'apply', 'variants', 'responsive', 'screen', 'theme', 'source', 'custom-variant', 'utility', 'plugin'],
      },
    ],
    'custom-property-empty-line-before': null,
    'no-invalid-position-at-import-rule': null,
    'no-duplicate-selectors': null,
    'declaration-block-no-duplicate-custom-properties': null,
    'comment-no-empty': null,
    'import-notation': null,
    'color-no-hex': [true, { severity: 'error' }],
    'function-disallowed-list': [
      ['rgb', 'rgba', 'hsl', 'hsla'],
      { severity: 'error' },
    ],
    'declaration-property-value-disallowed-list': [
      {
        '/^(color|background(-color)?|border(-color)?|box-shadow)$/': [
          // Block raw color values but allow: var(), none, inherit, initial,
          // unset, transparent, currentColor, system colors (forced-colors),
          // and shorthand values containing var()
          '/^(?!var\\()(?!none$)(?!inherit$)(?!initial$)(?!unset$)(?!transparent$)(?!currentColor$)(?!revert$)(?![A-Z][a-zA-Z]+$)(?!.*var\\()(?!.*[A-Z][a-zA-Z]+).+/',
        ],
      },
      { severity: 'error' },
    ],
  },
};
