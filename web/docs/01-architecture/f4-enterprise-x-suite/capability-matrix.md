# F4 Enterprise X Suite — Capability Matrix

| Meta        | Value      |
|-------------|------------|
| **Date**    | 2026-03-21 |
| **Status**  | DRAFT      |

---

## 1. Package Overview Table

> Each cell format: **Current** / _Target_

| Package | API Surface | Theme/Token Integration | Access Control | SSR/Client Boundary | Data Model | Accessibility | Perf Budget | Test/Docs Exit |
|---------|-------------|------------------------|----------------|---------------------|------------|---------------|-------------|----------------|
| **@mfe/x-data-grid** | **3 components, 2 hooks** (`EntityGridTemplate`, `AgGridServer`, `useGridState`) / _8 components, 6 hooks_ — add `DataGrid`, `ColumnDef`, `Toolbar`, `FilterPanel`, `useColumnResize`, `useRowSelection`, `usePagination`, `useServerModel` | **AG Grid theme bridge, partial token mapping** / _Full design-token coverage, dark mode, 3 density levels (compact, standard, comfortable)_ | **No policy integration** / _Row-level visibility via permission-service, column hide by policy, cell-level mask for PII_ | **Client-only (`"use client"`)** / _Server component wrapper for initial data fetch, client island for interaction, streaming pagination_ | **`any[]` rows, loose column defs** / _Typed `RowModel<T>`, Zod column schema, server-side filter/sort/group contract_ | **Keyboard nav from AG Grid** / _WCAG 2.1 AA, aria-grid role, live region announcements, focus management_ | **~180 kB gzipped (AG Grid)** / _< 200 kB gzip, < 16 ms render 1k rows, < 50 MB memory 10k rows_ | **12 unit tests, 0 doc pages** / _60 unit + 20 integration tests, 8 doc pages, 5 live examples_ |
| **@mfe/x-charts** | **4 chart wrappers** (`BarChart`, `LineChart`, `PieChart`, `AreaChart`) / _10 components, 4 hooks_ — add `ScatterChart`, `RadarChart`, `GaugeChart`, `Sparkline`, `ComboChart`, `Heatmap`, `useChartTheme`, `useTooltip`, `useZoom`, `useLegend` | **AG Charts theme bridge exists** / _Full token mapping, dark mode auto-switch, density-aware spacing, brand palette presets_ | **No policy integration** / _Series-level visibility by role, data-point masking for confidential metrics_ | **Client-only** / _SSR-safe placeholder + hydration, streaming data update via RSC payload_ | **`{ label, value }[]` per series** / _Typed `Series<T>`, time-series adapter, aggregate adapter, Zod schema_ | **Partial — tooltips keyboard-inaccessible** / _WCAG 2.1 AA, keyboard-navigable data points, aria descriptions per series, high-contrast mode_ | **~90 kB gzipped (AG Charts)** / _< 100 kB gzip, < 50 ms render 500 points, < 30 MB memory_ | **8 unit tests, 0 doc pages** / _40 unit + 10 integration tests, 6 doc pages, 10 live examples_ |
| **@mfe/x-scheduler** | **1 component** (`Calendar`) / _12 components, 5 hooks_ — add `Scheduler`, `DayView`, `WeekView`, `MonthView`, `TimelineView`, `ResourceView`, `EventCard`, `RecurrenceEditor`, `useSchedulerState`, `useDragDrop`, `useRecurrence`, `useResourceAllocation`, `useConflictDetection` | **None** / _Full token coverage, dark mode, density, color-coded event categories from palette_ | **None** / _Calendar-level visibility by role, event-level read/write by policy, resource-level access_ | **Client-only** / _Server component for initial month data, client island for drag-drop interaction_ | **Basic date range only** / _iCal-compatible event model, RRULE recurrence, resource schema, Zod validation_ | **Minimal** / _WCAG 2.1 AA, keyboard date navigation, aria-live for event changes, screen reader event summaries_ | **~15 kB gzipped** / _< 80 kB gzip, < 100 ms render month view, < 40 MB memory 1k events_ | **2 unit tests, 0 doc pages** / _50 unit + 15 integration tests, 8 doc pages, 6 live examples_ |
| **@mfe/x-kanban** | **Drag-drop in SmartDashboard** / _8 components, 4 hooks_ — add `Board`, `Column`, `Card`, `CardEditor`, `SwimLane`, `WIPIndicator`, `useBoard`, `useDragDrop`, `useWIPLimit`, `useCardFilter` | **None** / _Full token coverage, dark mode, density, card color by status from palette_ | **None** / _Board-level visibility by role, column-level edit by policy, card-level field masking_ | **Client-only** / _Server component for board data, client island for drag-drop_ | **Implicit from dashboard widgets** / _Typed `Board<T>`, `Column`, `Card<T>` models, Zod schema, WIP limits, swimlane grouping_ | **None** / _WCAG 2.1 AA, keyboard drag-drop, aria-live column updates, focus management across columns_ | **~5 kB gzipped (dnd-kit portion)** / _< 60 kB gzip, < 50 ms render 100 cards, < 20 MB memory_ | **0 tests, 0 doc pages** / _35 unit + 10 integration tests, 6 doc pages, 4 live examples_ |
| **@mfe/x-editor** | **Nothing** / _10 components, 5 hooks_ — `Editor`, `Toolbar`, `BubbleMenu`, `FloatingMenu`, `SlashCommand`, `MentionList`, `TableEditor`, `ImageBlock`, `CodeBlock`, `CollabCursor`, `useEditor`, `useCollaboration`, `useMention`, `useSlashCommand`, `useImageUpload` | **None** / _Full token coverage, dark mode, density, toolbar/bubble theming from palette_ | **None** / _Document-level access by policy, block-level edit locks, mention resolution via permission-service_ | **N/A** / _SSR read-only render, client island for editing, Y.js collab over WebSocket_ | **N/A** / _ProseMirror document model, JSON serialization, Zod content schema, Markdown import/export_ | **N/A** / _WCAG 2.1 AA, full keyboard editing, aria-live for collab changes, screen reader block navigation_ | **N/A** / _< 120 kB gzip (Tiptap core + extensions), < 100 ms init, < 60 MB memory large docs_ | **0 tests, 0 doc pages** / _50 unit + 15 integration tests, 8 doc pages, 8 live examples_ |
| **@mfe/x-form-builder** | **AdaptiveForm component** / _12 components, 6 hooks_ — add `FormDesigner`, `FieldPalette`, `FormRenderer`, `FieldRenderer`, `ConditionalLogic`, `ValidationPanel`, `PreviewMode`, `SchemaEditor`, `FormVersionHistory`, `useFormSchema`, `useFieldDependency`, `useConditionalVisibility`, `useValidation`, `useFormVersion`, `useDesignerDragDrop` | **Partial via AdaptiveForm** / _Full token coverage, dark mode, density, field chrome and label theming_ | **Field-level show/hide in AdaptiveForm** / _Form-level access by policy, field-level read/write/hide by role, section-level visibility_ | **Client-only** / _Server component for schema fetch, client island for form interaction, progressive hydration for large forms_ | **Proprietary AdaptiveForm schema** / _JSON Schema draft-2020-12, Zod runtime validation, conditional logic DSL, version-controlled schema_ | **Partial — labels associated** / _WCAG 2.1 AA, full keyboard form navigation, error announcements, field group management_ | **~25 kB gzipped** / _< 100 kB gzip (renderer), < 250 kB gzip (designer), < 50 ms render 50 fields_ | **5 unit tests, 0 doc pages** / _45 unit + 12 integration tests, 8 doc pages, 6 live examples_ |

---

## 2. Competitive Comparison

### X-Data-Grid vs Competitors

| Feature | MUI X DataGrid Pro | AG Grid (our base) | Ant Design ProTable | TanStack Table |
|---------|-------------------|-------------------|--------------------| --------------|
| **Architecture** | Monolithic component | Full-featured enterprise grid | Table + search/filter HOC | Headless — logic only, no UI |
| **Server-side ops** | Native server mode, lazy loading | Full server-side model (SSRM, infinite) | Built-in request/response pattern | Manual — bring your own fetcher |
| **Tree data / grouping** | Built-in tree data, row grouping | Row grouping, tree data, pivoting | Nested sub-tables only | Expanding rows, grouping API |
| **Column pinning** | Left/right pinning | Left/right pinning + floating filters | Fixed columns left/right | Headless — implement yourself |
| **Excel export** | CSV + Excel via plugin | Native Excel export, clipboard | CSV only | None — bring your own |
| **Virtualization** | Row + column virtualization | Row + column virtualization (DOM) | Ant virtual list adapter | @tanstack/virtual integration |
| **Theming** | MUI theme system | CSS custom properties, theme API | Ant Design tokens | N/A — headless |
| **Bundle size** | ~110 kB gzip (Pro) | ~180 kB gzip (Enterprise) | ~60 kB gzip | ~15 kB gzip |
| **Our strategy** | — | **Primary engine** — wrap with recipe layer for column presets, toolbar, and permission-service integration. AG Grid 34.3 already activated. | Borrow search + filter UX patterns for our toolbar recipe. | Use for lightweight table use cases where full grid is overkill. |

### X-Charts vs Competitors

| Feature | MUI X Charts | Recharts | Nivo | AG Charts (our base) |
|---------|-------------|----------|------|---------------------|
| **Chart types** | 8 types (line, bar, pie, scatter, gauge, heatmap, radar, treemap) | 11 composable types | 25+ types including chord, sunburst | 16 types including financial |
| **Composition model** | Slot-based, MUI integration | Declarative JSX composition | Configuration objects | Configuration objects |
| **Theme integration** | MUI theme natively | Manual via props | Built-in theme system | Theme API, CSS custom properties |
| **SSR support** | Partial (SVG) | SVG — SSR-friendly | Full SSR via static rendering | Canvas — client-only |
| **Responsive** | Built-in responsive container | ResponsiveContainer wrapper | Built-in responsive | Built-in responsive |
| **Animations** | CSS transitions | Smooth transitions via D3 | Motion via react-spring | Built-in animation engine |
| **Bundle size** | ~50 kB gzip | ~45 kB gzip | ~40 kB gzip per chart | ~90 kB gzip |
| **Our strategy** | — | — | — | **Primary engine** — theme bridge exists, extend with 6 missing chart types, add empty/loading/error states, and token-mapped palettes. |

### X-Scheduler vs Competitors

| Feature | FullCalendar | React Big Calendar | KendoReact Scheduler |
|---------|-------------|-------------------|---------------------|
| **Views** | Day, week, month, timeline, resource, list | Day, week, month, agenda | Day, week, month, timeline, agenda |
| **Drag-drop** | Built-in event drag, resize, external drop | Built-in drag + resize | Built-in drag + resize |
| **Resource management** | Resource columns, resource timeline | No native resource view | Resource grouping, timeline |
| **Recurrence** | RRULE plugin | No native recurrence | Built-in recurrence editor |
| **Theming** | CSS variables, theme system | CSS-based, manual | KendoReact theme system |
| **Virtual scrolling** | Timeline virtual scrolling | None | Virtual timeline scrolling |
| **Bundle size** | ~95 kB gzip (core + plugins) | ~25 kB gzip | ~120 kB gzip |
| **License** | MIT (core) / Commercial (premium) | MIT | Commercial |
| **Our strategy** | **Reference architecture** — model our API surface after FullCalendar's view system. Build on top of date-fns and dnd-kit. Implement RRULE support independently. | Borrow simple API patterns for basic calendar use cases. | Reference for enterprise timeline and resource patterns. |

### X-Kanban vs Competitors

| Feature | React-Trello | @atlaskit/board | Custom (dnd-kit) |
|---------|-------------|----------------|-----------------|
| **Board model** | JSON board config | Jira board abstraction | Build your own |
| **Drag-drop engine** | react-dnd | Pragmatic drag and drop | dnd-kit (accessible, modern) |
| **WIP limits** | None | Jira WIP limits | Build your own |
| **Swimlanes** | Lane-based model | Swimlane support | Build your own |
| **Customization** | Component overrides | Limited — Jira-specific | Maximum flexibility |
| **Virtual scrolling** | None | None | @dnd-kit/sortable supports virtual |
| **Bundle size** | ~30 kB gzip | ~80 kB gzip | ~15 kB gzip |
| **Our strategy** | — | Reference for Jira-style UX patterns (swimlanes, WIP indicators, card detail). | **Build foundation** — use dnd-kit as drag-drop engine. Maximum control over card rendering, accessibility, and permission integration. |

### X-Editor vs Competitors

| Feature | Tiptap (our choice) | Lexical (Meta) | Slate | Quill |
|---------|--------------------| --------------|-------|-------|
| **Foundation** | ProseMirror | Custom model | Custom model | Delta OT model |
| **Extensibility** | Extension API — nodes, marks, plugins | Plugin system, custom nodes | Plugin system, custom elements | Limited module system |
| **Collaboration** | Y.js integration (Hocuspocus) | @lexical/yjs adapter | slate-yjs community | No native collab |
| **Schema enforcement** | ProseMirror schema — strict | Flexible node transforms | Loose schema | Fixed schema |
| **Mobile support** | Good (ProseMirror) | Good (Meta investment) | Fragile on mobile | Good |
| **Table editing** | @tiptap/extension-table | @lexical/table | Community plugin | No tables |
| **Slash commands** | @tiptap/suggestion | Custom via plugin | Custom implementation | No native support |
| **Bundle size** | ~80 kB gzip (core + common extensions) | ~50 kB gzip | ~60 kB gzip | ~40 kB gzip |
| **Our strategy** | **Primary engine** — Tiptap provides the best extension API and Y.js collab story. Build custom extensions for mention resolution (permission-service), image upload (our CDN), and code blocks (Shiki). | Evaluate as future option if Tiptap maintenance stalls. | — | — |

### X-FormBuilder vs Competitors

| Feature | React JSON Schema Form (RJSF) | Formio | Ant Design ProForm | Our AdaptiveForm |
|---------|-------------------------------|--------|-------------------|-----------------|
| **Schema standard** | JSON Schema draft-07/2020-12 | Custom + JSON Schema mapping | Schema-driven config | Proprietary schema |
| **Visual designer** | None — schema-only | Full drag-drop designer | No designer | No designer |
| **Conditional logic** | JSON Schema if/then/else | Custom conditional system | dependency field config | Basic show/hide rules |
| **Validation** | AJV — JSON Schema validation | Built-in + custom validators | Ant Form rules | Custom validators |
| **Field types** | Standard HTML + custom widgets | 30+ field types | 15+ field types | 12 field types |
| **Version control** | None | Form versioning + revisions | None | None |
| **Multi-step forms** | None natively | Multi-page wizard | StepsForm component | None |
| **Bundle size** | ~45 kB gzip | ~150 kB gzip | ~60 kB gzip | ~25 kB gzip |
| **Our strategy** | **Schema standard** — adopt JSON Schema 2020-12 as our canonical schema format. Use AJV for runtime validation, Zod for TypeScript types. | Reference for visual designer UX — drag-drop field palette, preview mode, version history. | Borrow StepsForm pattern for multi-step wizard flows. | **Migration base** — evolve AdaptiveForm into the new renderer. Map proprietary schema to JSON Schema. |

---

## 3. Gap Analysis

| Package | What We Have | What We Need | Gap Size | Key Risks |
|---------|-------------|-------------|----------|-----------|
| **@mfe/x-data-grid** | `EntityGridTemplate` + `AgGridServer` + AG Grid 34.3 activated, basic column defs, server-side data fetching | Recipe layer (column presets, toolbar, filter panel), permission-service row/column visibility, typed models, Zod schema, SSR wrapper, comprehensive tests + docs | **S** | Low risk — AG Grid does the heavy lifting. Main work is the recipe/wrapper layer and permission integration. |
| **@mfe/x-charts** | 4 chart wrappers (`Bar`, `Line`, `Pie`, `Area`) + AG Charts 12.3, basic theme bridge | 6 additional chart types (`Scatter`, `Radar`, `Gauge`, `Sparkline`, `Combo`, `Heatmap`), empty/loading/error states, full token mapping, dark mode, typed series models, accessibility pass | **M** | Medium risk — AG Charts covers the rendering engine, but adding 6 new types plus states is meaningful scope. Theme bridge needs hardening. |
| **@mfe/x-scheduler** | `Calendar` component (month view only, no drag-drop, no recurrence) | Full scheduler with day/week/month/timeline/resource views, drag-drop, RRULE recurrence, resource allocation, conflict detection, iCal model, accessibility | **XL** | High risk — near-greenfield build. No existing drag-drop or recurrence infrastructure. Resource view and conflict detection are complex domain problems. |
| **@mfe/x-kanban** | `SmartDashboard` with basic drag-drop between widget zones | Typed board/column/card model, dnd-kit integration, swimlanes, WIP limits, card editor, permission-based column access, keyboard drag-drop | **L** | Medium-high risk — SmartDashboard drag-drop is widget-oriented, not card-oriented. Need new data model and interaction patterns. dnd-kit integration is well-documented but swimlane + WIP logic is custom. |
| **@mfe/x-editor** | Nothing — no editor component, no ProseMirror/Tiptap dependency | Full Tiptap-based editor with toolbar, bubble menu, slash commands, mentions, table editing, image upload, code blocks, Y.js collaboration, SSR read-only render | **XL** | High risk — pure greenfield. Tiptap integration is well-documented but collaboration (Y.js + Hocuspocus) adds significant infrastructure. Mention resolution via permission-service is a custom integration point. |
| **@mfe/x-form-builder** | `AdaptiveForm` component with proprietary schema, 12 field types, basic show/hide conditional logic, partial accessibility | JSON Schema 2020-12 adoption, visual form designer with drag-drop palette, schema editor, conditional logic DSL, form versioning, multi-step wizard, AJV + Zod validation, field-level permission integration | **L** | Medium-high risk — AdaptiveForm provides a migration base for the renderer, but the visual designer is new scope. Schema migration from proprietary to JSON Schema is a data migration project. Version control adds backend requirements. |

### Gap Summary

```
S  ██░░░░░░░░  x-data-grid      — Recipe wrapper over mature AG Grid base
M  ████░░░░░░  x-charts         — Extend existing chart bridge with new types + states
L  ██████░░░░  x-kanban         — New board model, partial drag-drop reuse
L  ██████░░░░  x-form-builder   — Schema migration + new designer over AdaptiveForm base
XL ████████░░  x-scheduler      — Near-greenfield, complex domain
XL ████████░░  x-editor         — Pure greenfield, collab infrastructure needed
```

### Recommended Build Order

1. **@mfe/x-data-grid** (S) — highest ROI, every page uses grids, AG Grid base is solid
2. **@mfe/x-charts** (M) — extends existing bridge, high visibility in dashboards
3. **@mfe/x-form-builder** (L) — AdaptiveForm migration provides head start, forms are everywhere
4. **@mfe/x-kanban** (L) — needed for project/task management modules
5. **@mfe/x-scheduler** (XL) — complex but bounded domain, can start after kanban drag-drop patterns settle
6. **@mfe/x-editor** (XL) — largest scope, defer until collaboration infrastructure decisions are final
