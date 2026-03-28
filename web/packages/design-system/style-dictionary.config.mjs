/**
 * Style Dictionary v4 — DTCG token pipeline
 *
 * Reads DTCG-format JSON from tokens/dtcg/ and outputs:
 *   - dist/tokens/variables.css  (CSS custom properties)
 *   - dist/tokens/_variables.scss (SCSS variables)
 *   - dist/tokens/tokens.ts       (ES6 JS constants)
 *
 * Prerequisites:
 *   pnpm add -D style-dictionary
 *
 * Usage:
 *   node style-dictionary.config.mjs
 */
import StyleDictionary from 'style-dictionary';

const sd = new StyleDictionary({
  source: ['tokens/dtcg/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/tokens/',
      files: [{
        destination: 'variables.css',
        format: 'css/variables',
        options: { outputReferences: true }
      }]
    },
    scss: {
      transformGroup: 'scss',
      buildPath: 'dist/tokens/',
      files: [{
        destination: '_variables.scss',
        format: 'scss/variables'
      }]
    },
    ts: {
      transformGroup: 'js',
      buildPath: 'dist/tokens/',
      files: [{
        destination: 'tokens.ts',
        format: 'javascript/es6'
      }]
    }
  }
});

await sd.buildAllPlatforms();
