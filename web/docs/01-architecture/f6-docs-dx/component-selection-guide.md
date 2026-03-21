# Component Selection Guide

Use this decision tree to find the right component for your use case. Each entry links to the relevant component documentation and package.

---

## "I need to display data in a table"

| Requirement | Component | Package |
|-------------|-----------|---------|
| Simple read-only table | `TableSimple` | `design-system` |
| Sortable / filterable table | `EntityGridTemplate` | `x-data-grid` |
| Server-side paginated | `EntityGridTemplate` + `ServerDataSource` | `x-data-grid` |
| Master-detail (expand row) | `MasterDetailGrid` | `x-data-grid` |
| Tree / hierarchy | `TreeDataGrid` | `x-data-grid` |
| Pivot / grouping | `PivotGrid` | `x-data-grid` |
| Inline cell editing | `EditableGrid` | `x-data-grid` |

**Quick decision:** If you only need to display a few rows without interactivity, use `TableSimple`. For anything involving filtering, sorting, pagination, or editing, reach for `x-data-grid` components.

---

## "I need charts"

| Requirement | Component | Package |
|-------------|-----------|---------|
| Single bar / line / pie | `BarChart` / `LineChart` / `PieChart` | `x-charts` |
| Dashboard with KPIs | `KPICard` + `ChartDashboard` | `x-charts` |
| Inline sparkline | `SparklineChart` | `x-charts` |
| Interactive (zoom / pan) | Use `useChartInteractions` hook | `x-charts` |
| Real-time streaming data | Use `useRealTimeData` hook | `x-charts` |
| Funnel / waterfall | `FunnelChart` / `WaterfallChart` | `x-charts` |

**Quick decision:** Start with the named chart component for your visualization type. Add interaction hooks only when the user needs to explore the data.

---

## "I need a form"

| Requirement | Component | Package |
|-------------|-----------|---------|
| Simple form (few fields) | Design-system form primitives (`TextField`, `Select`, etc.) | `design-system` |
| Schema-driven form | `FormRenderer` | `x-form-builder` |
| Multi-step wizard | `MultiStepForm` | `x-form-builder` |
| Zod validation | `useZodForm` hook | `x-form-builder` |
| Conditional field visibility | `useConditionalLogic` hook | `x-form-builder` |
| Drag-and-drop form designer | `FormDesigner` | `x-form-builder` |

**Quick decision:** For fewer than 5 fields, use design-system primitives directly. For dynamic or configurable forms, use `x-form-builder`.

---

## "I need rich text editing"

| Requirement | Component | Package |
|-------------|-----------|---------|
| Basic formatting (bold, italic, lists) | `RichTextEditor` | `x-editor` |
| Slash commands (`/heading`, `/image`) | `SlashCommandMenu` extension | `x-editor` |
| @mentions | `MentionList` extension | `x-editor` |
| Collaborative editing | `CollaborativeEditor` | `x-editor` |
| Markdown source mode | Toggle via `useEditorMode` | `x-editor` |

**Quick decision:** Always start with `RichTextEditor` and add extensions as needed. Extensions are tree-shakeable.

---

## "I need task / project management"

| Requirement | Component | Package |
|-------------|-----------|---------|
| Kanban board | `KanbanBoard` | `x-kanban` |
| With swimlanes | `KanbanSwimlane` | `x-kanban` |
| With column metrics | `KanbanMetrics` | `x-kanban` |
| Drag-and-drop cards | Built into `KanbanBoard` | `x-kanban` |

---

## "I need a calendar / scheduler"

| Requirement | Component | Package |
|-------------|-----------|---------|
| Event calendar (day/week/month) | `Scheduler` | `x-scheduler` |
| Agenda / list view | `AgendaView` | `x-scheduler` |
| Resource booking (rooms, people) | `ResourceView` | `x-scheduler` |
| Timeline (Gantt-style) | `TimelineView` | `x-scheduler` |
| Recurring events | `useRecurrence` hook | `x-scheduler` |

---

## "I need a full page template"

| Requirement | Component | Package |
|-------------|-----------|---------|
| Dashboard page | `DashboardPageTemplate` | `blocks` |
| CRUD list + detail | `CrudPageTemplate` | `blocks` |
| Settings page | `SettingsPageTemplate` | `blocks` |
| Custom composition | `PageBuilder` | `blocks` |
| Login / auth pages | `AuthPageTemplate` | `blocks` |

**Quick decision:** Use a page template when starting a new route. Customize via slot props rather than building from scratch.

---

## Cross-Cutting Concerns

| Concern | Solution |
|---------|----------|
| Theming / dark mode | All components respect `ThemeProvider` tokens |
| i18n / localization | Pass locale via `I18nProvider`; all labels accept translation keys |
| Accessibility | Every component ships with ARIA roles and keyboard navigation |
| Server components | Data-fetching wrappers are RSC-compatible; interactive parts use `"use client"` |
| Performance | Heavy components (`DataGrid`, `Scheduler`) lazy-load by default |
