# F4 Bundle Size Report

## Current Sizes (estimated from source)

| Package | Source Files | Est. Bundle (gzip) | Budget |
|---------|-------------|-------------------|--------|
| x-data-grid | 20 files | ~15 KB | < 25 KB |
| x-charts | 18 files | ~12 KB | < 20 KB |
| x-editor | 15 files | ~45 KB (with Tiptap) | < 80 KB |
| x-kanban | 14 files | ~18 KB (with dnd-kit) | < 25 KB |
| x-scheduler | 14 files | ~10 KB | < 15 KB |
| x-form-builder | 12 files | ~8 KB | < 15 KB |

## Monitoring

- **CI compilability**: `pnpm build:x-suite` verifies every package compiles cleanly.
- **Perf gates**: `vitest perf-gates.test.ts` enforces runtime budgets per package (data-grid, charts, scheduler).
- **Bundle analysis**: Planned via `webpack-bundle-analyzer` integration once Module Federation build stabilises.

## Budget Rationale

Budgets are set at roughly 1.5-2x estimated size to absorb feature growth without requiring immediate budget bumps. Any package that exceeds its budget triggers a review before merge.

## Next Steps

1. Integrate `size-limit` or `bundlesize` into CI for automated gzip tracking.
2. Add per-export tree-shake verification (ensure unused exports are eliminated).
3. Establish baseline measurements after first production build.
