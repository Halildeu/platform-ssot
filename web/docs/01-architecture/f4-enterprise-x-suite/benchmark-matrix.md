# F4 Enterprise X Suite — Benchmark Matrix

## Status: DRAFT | Date: 2026-03-21

## Bundle Size Targets (gzipped, excluding peer deps)

| Package | Target | Peer Deps | Total Estimate |
|---------|--------|-----------|----------------|
| @mfe/x-data-grid | < 50 KB | AG Grid ~300KB | ~350 KB |
| @mfe/x-charts | < 30 KB | AG Charts ~200KB | ~230 KB |
| @mfe/x-scheduler | < 40 KB | none | ~40 KB |
| @mfe/x-kanban | < 25 KB | @dnd-kit ~15KB | ~40 KB |
| @mfe/x-editor | < 45 KB | tiptap ~100KB | ~145 KB |
| @mfe/x-form-builder | < 35 KB | zod ~10KB | ~45 KB |

## Render Performance Targets

| Scenario | Target | Measurement |
|----------|--------|-------------|
| DataGrid: 10K rows first paint | < 200ms | Lighthouse / Performance.mark |
| DataGrid: sort 10K rows | < 100ms | User interaction to visual update |
| DataGrid: filter 10K rows | < 150ms | User interaction to visual update |
| Charts: 1K data points render | < 100ms | Component mount to paint |
| Charts: theme switch | < 50ms | Token change to visual update |
| Scheduler: 500 events/week | < 150ms | Component mount to paint |
| Scheduler: drag event | < 16ms/frame | 60fps during drag |
| Kanban: 100 cards render | < 100ms | Component mount to paint |
| Kanban: drag card | < 16ms/frame | 60fps during drag |
| Editor: 10K word load | < 200ms | Content set to interactive |
| Editor: typing latency | < 50ms | Keypress to character render |
| FormBuilder: 50 fields render | < 100ms | Schema parse to paint |

## Memory Budget

| Package | Idle Memory | Active Memory | Leak Threshold |
|---------|-------------|---------------|----------------|
| x-data-grid (10K rows) | < 50MB | < 100MB | 0 MB/min |
| x-charts (1K points) | < 20MB | < 40MB | 0 MB/min |
| x-scheduler (500 events) | < 15MB | < 30MB | 0 MB/min |
| x-kanban (100 cards) | < 10MB | < 20MB | 0 MB/min |
| x-editor (10K words) | < 20MB | < 40MB | 0 MB/min |
| x-form-builder (50 fields) | < 10MB | < 20MB | 0 MB/min |

## Accessibility Audit Targets

| Package | axe-core Score | WCAG Level | Keyboard Nav | Screen Reader |
|---------|---------------|------------|--------------|---------------|
| All packages | ≥ 95/100 | AA | Full | Announced |

## Competitive Benchmark (render perf comparison)

| Scenario | Our Target | MUI X | AG Grid | Ant Design |
|----------|-----------|-------|---------|------------|
| 10K row grid | < 200ms | ~250ms | ~150ms | ~300ms |
| 1K point chart | < 100ms | ~120ms | ~80ms | ~150ms |
| Theme switch | < 50ms | ~100ms | ~60ms | ~200ms |
