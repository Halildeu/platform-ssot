# X Suite Migration Guide

## From MUI X Data Grid

### Column Definition Mapping

```typescript
// MUI X
const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'status', headerName: 'Status', type: 'singleSelect',
    valueOptions: ['Active', 'Inactive'] },
];

// @mfe/x-data-grid — uses AG Grid column defs
const columnDefs: ColDef[] = [
  { field: 'name', headerName: 'Name', width: 200, sortable: true, filter: true },
  { field: 'status', headerName: 'Status', cellEditor: 'agSelectCellEditor',
    cellEditorParams: { values: ['Active', 'Inactive'] } },
];
```

### Selection API

- MUI: `onSelectionModelChange` with `selectionModel` prop
- X Suite: AG Grid native `onSelectionChanged` + `api.getSelectedRows()`
- Use `DataGridSelectionBar` for bulk-action UX on top of AG Grid selection

### Export API

- MUI: `apiRef.current.exportDataAsCsv()`
- X Suite: `useGridExport()` hook with `exportCsv()` / `exportExcel()` methods
- Excel export available via `ExcelExportOptions` (header styling, sheet names)

---

## From Recharts

### Data Format Mapping

```typescript
// Recharts — data is an array of objects, series via child components
<LineChart data={data}>
  <Line dataKey="revenue" stroke="#8884d8" />
  <Line dataKey="cost" stroke="#82ca9d" />
</LineChart>

// @mfe/x-charts — AG Charts series-driven API
<ChartContainer
  data={data}
  series={[
    { type: 'line', xKey: 'month', yKey: 'revenue', stroke: '#8884d8' },
    { type: 'line', xKey: 'month', yKey: 'cost', stroke: '#82ca9d' },
  ]}
/>
```

### Theme Integration

- Use `chart-theme-bridge.ts` to inherit the MFE design-system colour tokens
- Responsive sizing via `useChartResize()` or `useResponsiveBreakpoint()`

---

## From react-beautiful-dnd

### DnD Provider Setup

```typescript
// react-beautiful-dnd
<DragDropContext onDragEnd={handleDragEnd}>
  <Droppable droppableId="column-1">
    {(provided) => <div ref={provided.innerRef} {...provided.droppableProps}>...</div>}
  </Droppable>
</DragDropContext>

// @mfe/x-kanban — dnd-kit engine (optional peer dep)
<KanbanBoard
  columns={columns}
  cards={cards}
  onDragEnd={handleDragEnd}
  dndEngine="dnd-kit" // or "built-in" for zero-dependency mode
/>
```

### Sensor Configuration

- dnd-kit sensors (pointer, keyboard, touch) configured via `createDndKitEngine`
- Accessibility: keyboard drag supported out of the box with `useSortableCard`

---

## From FullCalendar

### Event Model Mapping

```typescript
// FullCalendar
{ id: '1', title: 'Meeting', start: '2025-03-21T09:00:00', end: '2025-03-21T10:00:00',
  resourceId: 'room-a', extendedProps: { priority: 'high' } }

// @mfe/x-scheduler — SchedulerEvent type
{ id: '1', title: 'Meeting', start: new Date('2025-03-21T09:00:00'),
  end: new Date('2025-03-21T10:00:00'), resourceId: 'room-a',
  metadata: { priority: 'high' } }
```

### View Configuration

| FullCalendar View | X Scheduler View | Notes |
|-------------------|------------------|-------|
| `dayGridMonth` | `month` | MonthView component |
| `timeGridWeek` | `week` | WeekView component |
| `timeGridDay` | `day` | DayView component |
| `listWeek` | `agenda` | AgendaView component |
| `resourceTimeline` | `resource` | ResourceView component |

### Recurrence

- FullCalendar: `rrule` plugin with iCal RRULE strings
- X Scheduler: `RecurrenceRule` type with `useRecurrence()` hook for expansion

---

## From React Hook Form

### useZodForm Integration Pattern

```typescript
// React Hook Form standalone
const { register, handleSubmit } = useForm({ resolver: zodResolver(schema) });

// @mfe/x-form-builder — useZodForm wraps RHF with schema-driven field generation
const { fields, form, handleSubmit } = useZodForm({
  schema: myZodSchema,
  defaultValues: { name: '', email: '' },
});

// Fields are auto-generated from schema — no manual register() calls
<FormBuilder fields={fields} form={form} onSubmit={handleSubmit(onSave)} />
```

### Key Differences

- `x-form-builder` uses Zod schemas as the single source of truth for validation and field types
- Field rendering is handled by `FieldResolver` — maps Zod types to MFE design-system inputs
- Conditional fields supported via `when` clauses in schema or field config
- React Hook Form is still the underlying engine — `form` object exposes full RHF API
