# Performance SLA

> Service-level targets for @mfe platform rendering, bundle size, and page-load metrics.
> All numbers are **upper bounds** — actual values should be consistently below these thresholds.

## Render Performance

| Category | Component(s) | Target | Budget |
|---|---|---|---|
| Core primitives | Button, Text, Badge, Card | < 16 ms | 1 frame at 60 fps |
| Form components | Select, Input, Checkbox, Radio, Switch | < 25 ms | Input must feel instant |
| Chart render | @mfe/x-charts (1 K data points) | < 100 ms | Perceived as immediate |
| Data Grid initial | @mfe/x-data-grid (10 K rows, virtual) | < 200 ms | First meaningful paint of rows |
| Data Grid scroll | Virtual scroll frame budget | < 16 ms | No dropped frames during scroll |
| Scheduler view | Day / Week / Month switch | < 50 ms | Tab-switch feel |
| Kanban drag | Per-frame drag operation | < 8 ms | Butter-smooth drag at 120 fps |
| Editor keystroke | Rich-text editor input latency | < 16 ms | No perceived lag while typing |

## Bundle Size

| Package | Target (gzip) | Notes |
|---|---|---|
| `@mfe/design-system` | < 250 KB | Core tokens, primitives, layout |
| Each `@mfe/x-*` package | < 100 KB | Data Grid, Charts, Scheduler, etc. |
| Total platform (all packages) | < 800 KB | Tree-shaken production build |

## Page Load

| Metric | Target | Condition |
|---|---|---|
| First Contentful Paint (FCP) | < 1.5 s | 4G throttle, mid-range device |
| Time to Interactive (TTI) | < 3.0 s | 4G throttle, mid-range device |
| Largest Contentful Paint (LCP) | < 2.5 s | Standard Lighthouse conditions |
| Cumulative Layout Shift (CLS) | < 0.1 | No layout jumps after initial paint |
| Interaction to Next Paint (INP) | < 200 ms | p75 across all interactions |

## Measurement Methodology

### Vitest Bench (Component Render)

Every component package includes `*.bench.ts` files executed via `vitest bench`.

```bash
pnpm vitest bench --reporter=verbose
```

Benchmarks run in CI on every PR. Results are compared against the thresholds above; the gate fails if any component exceeds its budget.

### Lighthouse CI (Page Load)

Lighthouse CI runs against the docs app and a representative shell app:

```bash
lhci autorun --config=.lighthouserc.json
```

Configuration asserts:
- FCP <= 1500
- TTI <= 3000
- LCP <= 2500
- CLS <= 0.1

### Real Device Testing

Quarterly manual testing on:
- **Low-end Android**: Samsung A14 (4 GB RAM, Snapdragon 680)
- **Mid-range iOS**: iPhone SE 3rd gen
- **Desktop baseline**: Intel i5-1235U, 8 GB RAM, Chrome stable

Results are recorded in the quality dashboard and compared against SLA targets.

### Bundle Tracking

`size-limit` runs on every PR:

```jsonc
// .size-limit.json (excerpt)
[
  { "path": "packages/design-system/dist/index.mjs", "limit": "250 KB", "gzip": true },
  { "path": "packages/x-data-grid/dist/index.mjs", "limit": "100 KB", "gzip": true },
  { "path": "packages/x-charts/dist/index.mjs", "limit": "100 KB", "gzip": true }
]
```

## Enforcement

- **PR gate**: `benchmark-gate.yml` blocks merge if any target is exceeded.
- **Nightly regression**: Scheduled workflow runs full benchmark suite and posts to Slack on regression.
- **Release checklist**: Performance SLA review is a mandatory step before every minor/major release.

## Revision History

| Date | Change |
|---|---|
| 2026-03-21 | Initial SLA definition |
