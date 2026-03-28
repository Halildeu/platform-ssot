/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  // ── Plugin Resolution (pnpm monorepo) ──
  plugins: [
    '@stryker-mutator/vitest-runner',
  ],

  // ── Test Runner ──
  testRunner: 'vitest',
  vitest: {
    configFile: 'vitest.config.ts',
  },

  // ── Mutation Targets ──
  // Start with enterprise (newest, most likely shallow) then expand
  mutate: [
    'src/enterprise/**/*.tsx',
    '!src/enterprise/**/__tests__/**',
    '!src/enterprise/**/index.ts',
    '!src/enterprise/**/types.ts',
  ],

  // ── Mutation Operators ──
  // Focus on meaningful mutations, skip cosmetic ones
  mutator: {
    excludedMutations: [
      'StringLiteral',     // CSS class changes = noise
      'ObjectLiteral',     // Default props = noise
    ],
  },

  // ── Performance ──
  concurrency: 4,
  timeoutMS: 30000,
  incremental: true,  // Only re-test changed files
  incrementalFile: '.stryker-cache/incremental.json',

  // ── Reporting ──
  reporters: ['html', 'clear-text', 'progress'],
  htmlReporter: {
    fileName: 'reports/mutation/index.html',
  },

  // ── Thresholds ──
  // Current baseline: 8.98% (enterprise only)
  // Target: raise to 30% via deeper tests, then enforce
  thresholds: {
    high: 80,     // Green: 80%+ mutations killed
    low: 50,      // Yellow: 50-80%
    break: 40,    // CI fails below 40%
  },

  // ── Coverage Analysis ──
  coverageAnalysis: 'perTest',  // Map each test to the mutants it can kill

  // ── Ignore Patterns ──
  ignorePatterns: [
    'dist',
    'node_modules',
    '.stryker-cache',
    'reports',
    '**/*.stories.*',
    '**/*.visual.*',
    '**/*.browser.*',
  ],
};
