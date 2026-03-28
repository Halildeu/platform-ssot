# @mfe/x-charts — API Contract v1

## Status: DRAFT | Date: 2026-03-21

## 1. Public API Surface

### Components
```tsx
BarChart
  props: { data: ChartData[]; xKey: string; yKey: string | string[]; stacked?: boolean; horizontal?: boolean }

LineChart
  props: { data: ChartData[]; xKey: string; yKey: string | string[]; smooth?: boolean; area?: boolean }

AreaChart
  props: { data: ChartData[]; xKey: string; yKey: string | string[]; stacked?: boolean; gradient?: boolean }

PieChart
  props: { data: ChartData[]; angleKey: string; labelKey: string; donut?: boolean; innerRadius?: number }

ScatterChart
  props: { data: ChartData[]; xKey: string; yKey: string; sizeKey?: string; colorKey?: string }

RadarChart
  props: { data: ChartData[]; angleKey: string; radiusKey: string | string[] }

TreemapChart
  props: { data: TreemapNode[]; valueKey: string; labelKey: string; colorKey?: string }

HeatmapChart
  props: { data: ChartData[]; xKey: string; yKey: string; valueKey: string; colorScale?: ColorScale }

ChartContainer
  props: { width?: number | string; height?: number | string; responsive?: boolean; children: ReactNode }

ChartLegend
  props: { position?: 'top' | 'bottom' | 'left' | 'right'; interactive?: boolean }

ChartTooltip
  props: { formatter?: (value: unknown) => string; shared?: boolean; followCursor?: boolean }
```

### Hooks
- `useChartTheme()` — returns resolved chart color palette and typography from design tokens
- `useChartResize(containerRef)` — returns `{ width, height }` with debounced resize observer

### Utilities
- `createColorScale(domain, range)` — builds a color interpolation function
- `formatChartValue(value, format)` — locale-aware number/date formatting for axes and tooltips

### Type Exports
- `ChartData` (= `Record<string, unknown>`)
- `TreemapNode`, `ColorScale`, `ChartTheme`
- Props interfaces for all chart components
- `ChartContainerProps`, `ChartLegendProps`, `ChartTooltipProps`

### Base
- AG Charts 12.3.1 (Community edition)
- Extends existing chart component patterns in design system

## 2. Theme / Token Integration

### Consumed Tokens
- `--chart-palette-1` through `--chart-palette-12` (categorical color palette)
- `--chart-bg`, `--chart-grid-color`, `--chart-axis-color`
- `--chart-label-color`, `--chart-label-font-size`
- `--chart-tooltip-bg`, `--chart-tooltip-fg`, `--chart-tooltip-border`
- Typography: `--font-family-data`, `--font-size-axis`, `--font-size-legend`

### Dark Mode
- Palette auto-adjusts to darker background via luminance-aware token set
- Grid lines, axis text, and tooltip chrome switch via `[data-theme="dark"]`
- AG Charts `theme: 'ag-default-dark'` base + token overrides

### Density Support
- `compact` — reduced padding, smaller legend items, thinner axis lines
- `comfortable` — default spacing (balanced readability)
- `spacious` — larger labels, wider legend spacing, thicker lines

### Custom Theme Extension
- `theme` prop accepts partial `ChartTheme` override
- Individual color overrides per series via `series[n].color`
- CSS custom property layer for container and tooltip styling

## 3. Access Control

### Granularity
- **Component-level**: entire chart visible/hidden based on dashboard permission
- **Section-level**: legend, tooltip, export action individually controllable

### AccessControlledProps Integration
```tsx
<BarChart
  accessControl={{
    resource: 'dashboard.chart.revenue',
    actions: { export: Permission; drillDown: Permission }
  }}
/>
```

### Policy-Based Visibility States
- `full` — interactive with tooltips, legend click, export, drill-down
- `readonly` — rendered with tooltips but no interactive actions (export, drill-down disabled)
- `disabled` — chart rendered with overlay, no interaction
- `hidden` — component not rendered, space collapsed

## 4. SSR / Client Boundary

### Server-Renderable
- Chart container dimensions and layout shell
- Legend (static text list)
- Skeleton placeholder with correct aspect ratio

### Client-Only (`'use client'`)
- AG Charts canvas rendering engine
- All interactive features: tooltips, legend toggle, zoom, pan
- Resize observer and responsive recalculation
- Animation and transitions

### Hydration Strategy
- SSR renders a sized placeholder `<div>` matching chart dimensions
- AG Charts instance mounts on client, renders into placeholder
- Optional: server can inline a static SVG snapshot for instant visual

### Streaming SSR
- Chart metadata (title, legend labels) can stream
- Data fetch and chart render happen client-side

## 5. Data Model

### Input Data Shape
```typescript
type ChartData = Record<string, unknown>;

interface TreemapNode {
  label: string;
  value: number;
  children?: TreemapNode[];
  color?: string;
}

interface ChartSeriesConfig {
  type: 'bar' | 'line' | 'area' | 'pie' | 'scatter' | 'radar' | 'treemap' | 'heatmap';
  xKey: string;
  yKey: string | string[];
  label?: string;
  color?: string;
}

interface ColorScale {
  type: 'linear' | 'quantize' | 'quantile';
  domain: [number, number];
  range: [string, string];
}
```

### Validation
- Runtime key existence check: warns if `xKey`/`yKey` not found in first data row (dev mode)
- TypeScript generic inference from data array type

### State Management
- **Controlled**: data, highlighted series, zoom range can be externally driven
- **Uncontrolled**: internal AG Charts state for hover, tooltip position
- `onSeriesClick`, `onLegendClick` callbacks for external state sync

### Async Data Loading
- `loading` prop shows skeleton/spinner overlay
- Data can be swapped at any time; AG Charts handles transition animation
- No built-in data fetching — consumer provides data

## 6. Accessibility

### WCAG Target
- **AA** minimum

### Keyboard Navigation
- `Tab` to focus chart container
- Arrow keys to navigate between data points / series
- `Enter` to activate drill-down (if enabled)
- `Escape` to dismiss tooltip
- Legend items focusable and toggleable via `Space`

### Screen Reader Announcements
- Chart type and title announced on focus
- Data summary announced (e.g., "Bar chart showing revenue across 12 months, range $10K to $95K")
- Individual data point value announced on arrow key navigation
- `aria-live="polite"` for data updates

### Focus Management
- Visible focus ring on chart container and legend items
- Focus returns to chart container when tooltip dismissed

### ARIA Attributes
- `role="img"` on chart container with `aria-label` summarizing chart
- `aria-roledescription="chart"` for enhanced semantics
- Hidden data table alternative via `aria-describedby` linking to a `<table>` summary

## 7. Performance Budget

### Bundle Size
- **< 30 KB** gzipped (excluding AG Charts core ~150KB)
- Each chart type tree-shakeable independently
- AG Charts modules loaded per chart type

### Render Targets
- **1,000 data points**: initial render < 100ms
- **10,000 data points** (scatter/heatmap): initial render < 300ms
- **Tooltip display**: < 16ms (single frame)
- **Resize recalculation**: < 50ms

### Memory Budget
- Single chart instance: < 3MB for 1K points
- Canvas cleanup on unmount (no leaked contexts)

### Lazy Loading
- Chart types loaded via dynamic import per component
- Tooltip and legend components loaded with chart
- Export-to-image feature loaded on first use

## 8. Test & Docs Exit Criteria

### Tests
- **30 unit tests** — data transforms, color scale, theme resolution, format utilities
- **8 integration tests** — full chart render per type, responsive resize, theme switching
- **10 visual regression tests** — each chart type default, dark mode variants, density variants

### Contract Tests
- AG Charts series config compatibility verified against v12.3.1 API
- Data shape validation for each chart type

### Documentation
- API reference page with full props table per chart component
- **10 examples** — one per chart type, plus combined dashboard example
- **3 recipes** — real-time updating chart, dashboard grid layout, drill-down pattern
