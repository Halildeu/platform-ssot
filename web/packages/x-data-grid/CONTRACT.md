# @mfe/x-data-grid — API Contract v1

## Status: DRAFT | Date: 2026-03-21

## 1. Public API Surface

### Components
```tsx
DataGrid<TRow>
  props: {
    columns: ColDef<TRow>[];
    rows?: TRow[];
    serverDataSource?: ServerDataSourceConfig;
    selection?: 'single' | 'multiple' | 'none';
    pagination?: PaginationConfig;
    toolbar?: boolean | ToolbarConfig;
    filterChips?: boolean;
    density?: 'compact' | 'comfortable' | 'spacious';
    loading?: boolean;
    onRowClick?: (row: TRow) => void;
    onSelectionChange?: (rows: TRow[]) => void;
  }

DataGridToolbar
  props: { search?: boolean; export?: boolean; columnToggle?: boolean; customActions?: ReactNode }

DataGridFilterChips
  props: { filters: FilterModel[]; onRemove: (id: string) => void; onClearAll: () => void }

DataGridPagination
  props: { pageSize?: number; pageSizeOptions?: number[]; total: number }

DataGridSelectionBar
  props: { count: number; actions: SelectionAction[]; onClearSelection: () => void }

ServerDataSource
  props: { endpoint: string; params?: Record<string, unknown>; transform?: (raw: unknown) => TRow[] }
```

### Hooks
- `useDataGrid(config)` — returns grid API ref, state, and imperative methods (refresh, export, selectAll)
- `useServerDataSource(config)` — manages server-side row model, caching, and request deduplication
- `useColumnBuilder<TRow>()` — fluent API for building type-safe ColDef arrays

### Utilities
- `createColumnDef<TRow>(field, overrides)` — shorthand column factory
- `mapFilterModelToQueryParams(model)` — converts AG Grid filter model to REST query params
- `exportToCsv(gridApi, options)` — CSV export helper

### Type Exports
- `DataGridProps<TRow>`, `ColumnDef<TRow>`, `ServerDataSourceConfig`
- `FilterModel`, `SortModel`, `PaginationConfig`
- `SelectionAction`, `ToolbarConfig`
- `DataGridApi<TRow>` (imperative handle)

### Base
- AG Grid 34.3.1 (Community + Enterprise features via license)
- Extends `EntityGridTemplate` layout pattern

## 2. Theme / Token Integration

### Consumed Tokens
- `--grid-header-bg`, `--grid-header-fg`
- `--grid-row-bg`, `--grid-row-alt-bg`, `--grid-row-hover-bg`
- `--grid-border-color`, `--grid-cell-padding`
- `--grid-selection-bg`, `--grid-selection-fg`
- Typography: `--font-family-data`, `--font-size-cell`, `--font-size-header`
- Spacing: `--spacing-cell-compact`, `--spacing-cell-comfortable`, `--spacing-cell-spacious`

### Dark Mode
- Full dark mode support via AG Grid `ag-theme-alpine-dark` base + token overrides
- All custom overlays (toolbar, filter chips, selection bar) respond to `[data-theme="dark"]`

### Density Support
- `compact` — 32px row height, condensed padding
- `comfortable` — 40px row height (default)
- `spacious` — 52px row height, generous padding
- Density propagated to toolbar and pagination sub-components

### Custom Theme Extension
- `themeOverrides` prop accepts partial token map
- AG Grid `theme` param passthrough for advanced customization
- CSS custom property layer sits above AG Grid defaults

## 3. Access Control

### Granularity
- **Column-level**: show/hide, readonly per column based on permission key
- **Row-level**: action buttons (edit/delete) gated per row via `rowPermission(row) => PermissionSet`
- **Cell-level**: individual cell editability via `cellEditable(params) => boolean`

### AccessControlledProps Integration
```tsx
<DataGrid
  accessControl={{
    resource: 'entity.grid',
    columnPermissions: Record<string, Permission>;
    rowPermission: (row: TRow) => PermissionSet;
  }}
/>
```

### Policy-Based Visibility States
- `full` — interactive, editable where configured
- `readonly` — visible but all edit/selection disabled
- `disabled` — rendered but greyed out, no interaction
- `hidden` — column or row removed from DOM entirely

## 4. SSR / Client Boundary

### Server-Renderable
- Column definitions and initial configuration
- Toolbar layout (static parts)
- Skeleton/loading placeholder

### Client-Only (`'use client'`)
- AG Grid instance (canvas-based rendering)
- All interactive features: sorting, filtering, row selection, drag
- Server data source subscription and caching
- Toolbar search input and filter chip interactions

### Hydration Strategy
- Shell renders SSR skeleton with correct dimensions
- AG Grid mounts on client hydration, replaces skeleton
- No flash-of-unstyled-content via matched dimensions

### Streaming SSR
- Initial column metadata can stream
- Grid data fetch begins on client mount (not during SSR)

## 5. Data Model

### Input Data Shape
```typescript
interface DataGridConfig<TRow extends Record<string, unknown>> {
  columns: ColDef<TRow>[];
  rows?: TRow[];                              // client-side row model
  serverDataSource?: ServerDataSourceConfig;   // server-side row model
  getRowId: (row: TRow) => string;
}

interface ServerDataSourceConfig {
  endpoint: string;
  method?: 'GET' | 'POST';
  getRows: (params: IServerSideGetRowsParams) => Promise<ServerSideGetRowsResult>;
  cacheBlockSize?: number;
  maxConcurrentRequests?: number;
}
```

### Validation
- Column definitions validated at dev-time via TypeScript generics
- Runtime validation of `getRowId` uniqueness in development mode

### State Management
- **Controlled**: `rows`, `selection`, `filterModel`, `sortModel` can be externally driven
- **Uncontrolled**: internal AG Grid state with optional `onStateChange` callback
- Hybrid mode supported (e.g., controlled filters + uncontrolled sort)

### Async Data Loading
- Server-side row model with infinite scroll or pagination
- Request deduplication and stale-while-revalidate caching
- Abort controller integration for cancelled requests

## 6. Accessibility

### WCAG Target
- **AA** minimum, AAA for keyboard navigation

### Keyboard Navigation
- Arrow keys for cell-to-cell navigation
- `Enter` to edit cell, `Escape` to cancel
- `Space` to toggle row selection
- `Tab` moves to next interactive element (toolbar -> grid -> pagination)
- `Ctrl+A` select all rows
- Column header sort via `Enter`/`Space`

### Screen Reader Announcements
- Row count and column count announced on grid focus
- Sort state announced on column header activation
- Selection count announced on change
- Filter state announced when chips added/removed
- Loading/error states announced via `aria-live="polite"`

### Focus Management
- Focus trapped within grid during keyboard navigation
- Focus returns to trigger element when closing overlays (column menu, filter panel)
- Visible focus indicator on all interactive elements

### ARIA Attributes
- `role="grid"` on container, `role="row"`, `role="gridcell"`
- `aria-sort` on sortable column headers
- `aria-selected` on selectable rows
- `aria-colcount`, `aria-rowcount` for virtual scroll context
- `aria-describedby` for toolbar filter summary

## 7. Performance Budget

### Bundle Size
- **< 50 KB** gzipped (excluding AG Grid core ~200KB)
- Tree-shakeable: unused features not included in bundle
- AG Grid modules loaded on demand (enterprise features lazy)

### Render Targets
- **10,000 rows**: initial render < 200ms (virtual scroll)
- **Sort/filter 10K rows**: < 100ms (server-side), < 300ms (client-side)
- **Column resize**: < 16ms (single frame)

### Memory Budget
- Base grid instance: < 5MB for 10K rows
- Server-side cache: configurable, default 5 blocks of 100 rows
- Detached row cleanup on scroll

### Lazy Loading
- AG Grid enterprise modules loaded via dynamic import
- Export functionality loaded on first use
- Column menu and filter panel loaded on first open

## 8. Test & Docs Exit Criteria

### Tests
- **40 unit tests** — column builder, data transforms, filter mapping, selection logic
- **10 integration tests** — full grid render with toolbar, server data source flow, pagination
- **5 visual regression tests** — default grid, dark mode, density variants, selection bar, loading state

### Contract Tests
- AG Grid ColDef compatibility verified against v34.3.1 API
- Server data source request/response shape contract

### Documentation
- API reference page with full props table
- **8 examples** — basic, server-side, selection, filtering, custom toolbar, column builder, theming, access control
- **3 recipes** — master-detail pattern, editable grid, bulk actions workflow
