# Token Pipeline

## Two Pipelines — Different Purposes

### 1. Runtime Tokens: `npm run tokens:build:theme`
- Script: `scripts/theme/generate-theme-css.mjs`
- Produces: `apps/mfe-shell/src/styles/theme.css` (CSS variables for ThemeProvider)
- When: After changing theme presets or adding new themes
- Consumed by: ThemeProvider at runtime

### 2. Design-Time Tokens: `npm run tokens:build`
- Script: `scripts/tokens/build-tokens.mjs`
- Produces: `packages/design-system/src/tokens/build/` (JSON + CSS + TypeScript + docs)
- When: After changing token source files (color.ts, spacing.ts, etc.)
- Consumed by: Design Lab docs, Figma export, TypeScript autocomplete

### 3. Validation: `npm run tokens:validate`
- Script: `scripts/tokens/validate-tokens.mjs`
- Checks: No duplicates, valid values, no undefined refs
- When: In CI on every PR that touches token files
