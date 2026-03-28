# Vite 8 DevTools

## Build Analysis
```bash
pnpm build:analyze
```
Opens Rolldown build analysis dashboard showing:
- Bundle size breakdown
- Dependency graph
- Chunk splitting visualization

## Dev Server Inspection
```bash
pnpm dev:inspect
```
Enables Node.js inspector for Vite dev server debugging.

## Trace Debugging (Playwright)
```bash
pnpm test:e2e -- --trace on
```
Generates trace files in `test-results/` for failure analysis.
Open with: `npx playwright show-trace trace.zip`
