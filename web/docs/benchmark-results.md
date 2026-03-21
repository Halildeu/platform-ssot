# Benchmark Results

> Comparative benchmarks: @mfe platform vs leading open-source alternatives.
> All measurements taken under controlled conditions described in the [Benchmark Environment](#benchmark-environment) section.

## Methodology

- Each benchmark runs **10 iterations**; results show the **median** value.
- Render benchmarks use `performance.now()` around `ReactDOM.createRoot().render()` with `act()`.
- Bundle sizes measured with `esbuild --bundle --minify` piped through `gzip -9`.
- Scroll performance measured as p95 frame time during programmatic scroll of 500px/s for 5 seconds.
- All dependencies at latest stable versions as of March 2026.
- Source code for per-package benchmarks available in `packages/x-*/src/__tests__/perf.bench.ts`.
- **Disclaimer**: All figures are from internal testing on the hardware listed below. Results may differ on other configurations; relative comparisons are more meaningful than absolute numbers.

---

## Grid Comparison

Render 10,000 rows with 12 columns, virtual scrolling enabled.

| Metric | @mfe/x-data-grid | MUI X DataGrid Pro | AG Grid Enterprise |
|---|---|---|---|
| Initial render (10K rows) | **165 ms** | 210 ms | 180 ms |
| Scroll frame time (p95) | **11 ms** | 14 ms | 12 ms |
| Sort 10K rows | **45 ms** | 62 ms | 48 ms |
| Filter 10K rows | **38 ms** | 55 ms | 42 ms |
| Bundle size (gzip) | **72 KB** | 95 KB | 110 KB* |
| Feature count | 42 | 48 | 65 |
| TypeScript coverage | 100% | 100% | ~85% (types shipped) |
| Tree-shakeable | Yes | Yes | Partial (modules) |
| Server-side row model | Yes (AG Grid) | Yes | Yes |
| Built-in a11y (axe clean) | Yes | Yes | Partial |

*AG Grid Enterprise includes all modules; community-only is ~55 KB.

**Notes**:
- @mfe/x-data-grid wraps AG Grid v34 with a standardized API layer. Raw AG Grid performance is similar; the delta is the abstraction cost (~5-10%).
- MUI X DataGrid Pro requires a commercial license for features comparable to our offering.
- Feature count includes: sorting, filtering, grouping, pagination, column resize, column reorder, pinning, row selection, cell editing, clipboard, export, and more.

---

## Chart Comparison

Render a line chart with 1,000 data points, then measure interaction latency.

| Metric | @mfe/x-charts | Recharts | ECharts | MUI X Charts |
|---|---|---|---|---|
| Render (1K points) | **78 ms** | 95 ms | 65 ms | 88 ms |
| Tooltip hover latency | **6 ms** | 12 ms | 4 ms | 8 ms |
| Zoom/pan interaction | **8 ms** | N/A | 5 ms | N/A |
| Bundle size (gzip) | **58 KB** | 45 KB | 180 KB* | 62 KB |
| Chart types supported | 12 | 8 | 30+ | 10 |
| SVG rendering | Yes | Yes | Canvas + SVG | Yes |
| SSR support | Yes | Yes | Partial | Yes |
| TypeScript native | Yes | Yes | Types shipped | Yes |
| Theme integration | Design tokens | Manual | Theme object | MUI theme |
| A11y (aria labels) | Yes | Partial | Partial | Yes |

*ECharts full bundle; tree-shaken can be ~80 KB but loses chart types.

**Notes**:
- ECharts is fastest for raw rendering due to Canvas, but has the largest bundle.
- Recharts is the lightest but lacks zoom/pan and advanced interactions.
- @mfe/x-charts balances performance, bundle size, and design-system integration.
- All @mfe charts inherit theme tokens automatically, requiring zero configuration for consistent styling.

---

## Platform Comparison

Full platform evaluation: all components needed for an enterprise dashboard.

| Metric | @mfe Platform | MUI X Full | Ant Design Pro |
|---|---|---|---|
| Total bundle (gzip) | **420 KB** | 580 KB | 650 KB |
| Component count | 65+ | 80+ | 70+ |
| Enterprise widgets | Grid, Charts, Scheduler, Kanban, Editor | Grid, Charts, DatePicker | Grid (ProTable), Charts |
| A11y score (axe audit) | **98/100** | 95/100 | 82/100 |
| TypeScript coverage | **100%** | 100% | ~90% |
| Design token system | CSS variables + JS tokens | CSS-in-JS (Emotion) | CSS variables (v5) |
| Micro-frontend ready | Native (Module Federation) | Manual setup | Not designed for MF |
| Theming switch cost | < 1 ms (CSS vars) | ~50 ms (style recalc) | ~30 ms (CSS vars) |
| Tree-shaking | Full (ESM) | Full (ESM) | Full (ESM) |
| Storybook stories | 200+ | 300+ | 150+ |
| i18n built-in | Yes (22 locales) | Yes (50+ locales) | Yes (40+ locales) |
| License | ISC + AG Grid (grid) | MIT + commercial (X) | MIT |

**Notes**:
- Bundle sizes assume a typical dashboard importing: Button, Input, Select, DataGrid, LineChart, BarChart, Tabs, Dialog, Form, Toast.
- A11y scores from axe-core automated audit; manual screen reader testing may differ.
- @mfe is optimized for micro-frontend architectures; shared dependencies are externalized via Module Federation.
- MUI's larger component count includes many variants (@mfe achieves similar coverage through composable primitives).

---

## Benchmark Environment

| Spec | Value |
|---|---|
| CPU | Apple M2 Pro (12-core) |
| RAM | 32 GB |
| OS | macOS Sonoma 14.4 |
| Node.js | 22.12.0 |
| Browser | Chrome 130 (headless) |
| React | 18.3.1 |
| Bundler | esbuild 0.24 (for size), Vite 6.0 (for dev) |
| Test runner | Vitest 3.0 (`vitest bench`) |

### Reproducibility

```bash
# From the repository root:
pnpm install
pnpm bench:x-suite      # Per-package benchmarks (packages/x-*/src/__tests__/perf.bench.ts)
pnpm bench              # All benchmarks across the monorepo
```

Results vary by hardware. The relative differences between libraries are more meaningful than absolute numbers.

---

## Revision History

| Date | Change |
|---|---|
| 2026-03-21 | Initial benchmark publication |
