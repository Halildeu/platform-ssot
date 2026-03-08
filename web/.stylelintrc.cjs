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
        ignoreAtRules: ['tailwind', 'layer', 'apply', 'variants', 'responsive', 'screen'],
      },
    ],
    'custom-property-empty-line-before': null,
    'no-invalid-position-at-import-rule': null,
    'import-notation': null,
    'color-no-hex': [true, { severity: 'error' }],
    'function-disallowed-list': [
      ['rgb', 'rgba', 'hsl', 'hsla'],
      { severity: 'error' },
    ],
    'declaration-property-value-disallowed-list': [
      {
        '/^(color|background(-color)?|border(-color)?|box-shadow)$/': [
          '/^(?!var\\().+/',
        ],
      },
      { severity: 'error' },
    ],
  },
};
