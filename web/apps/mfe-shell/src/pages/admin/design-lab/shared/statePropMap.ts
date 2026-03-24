/**
 * STATE_PROP_MAP — Single source of truth for state-to-prop mappings.
 *
 * Used by:
 * - ComponentDetail.tsx (StateDemoSection) to render live state previews
 * - state-preview-contract.test.ts to validate doc previewStates alignment
 *
 * Each key is a state name (matching doc.previewStates entries),
 * and the value is the props object to pass to PlaygroundPreview.
 */
export const STATE_PROP_MAP: Record<string, Record<string, unknown>> = {
  /* ---- Access / interaction states ---- */
  disabled: { disabled: true, access: "disabled" },
  loading: { loading: true, isLoading: true },
  readonly: { readOnly: true, access: "readonly" },
  readOnly: { readOnly: true, access: "readonly" },
  full: {},
  hidden: { access: "hidden" },

  /* ---- Validation states ---- */
  error: { error: true, status: "error" },
  success: { status: "success" },
  warning: { status: "warning" },
  invalid: { error: true, invalid: true },

  /* ---- Layout states ---- */
  fullWidth: { fullWidth: true },
  compact: { size: "compact", density: "compact" },

  /* ---- Data states ---- */
  "empty data state": { rows: [], items: [] },
  empty: { rows: [], items: [] },
  "loading rows": { loading: true },
  "row striping": { striped: true },
  "sticky header scroll context": { stickyHeader: true },
  "access-aware visibility": { access: "readonly" },
  "row emphasis and truncation": { density: "compact", striped: true },

  /* ---- Filter / selection states ---- */
  "filter shell visibility": { filters: undefined },
  "summary strip visibility": { summaryItems: [] },
  "result list fallback": { items: [] },

  /* ---- Component-specific states ---- */
  pending: { status: "pending" },
  approved: { status: "approved" },
  rejected: { status: "rejected" },
  blocked: { status: "blocked" },
  drafted: { status: "drafted" },
  executed: { status: "executed" },
  observed: { status: "observed" },
  open: { open: true },
  closed: { open: false },
  expanded: { defaultValue: "a1" },
  collapsed: {},
  selected: { selected: true },
  indeterminate: { indeterminate: true },
  checked: { checked: true },
  focused: {},
  hover: {},
  active: { active: true },
  striped: { striped: true },
  bordered: { bordered: true },

  /* ---- Theme ---- */
  "dark-theme": { "data-theme": "dark" },

  /* ---- Defaults / identity states ---- */
  default: {},
  normal: {},
  standard: {},
  idle: {},
  visible: {},
  flat: {},

  /* ---- Visibility / display modes ---- */
  "visible-full": { visible: true },
  "visible-with-selection": { visible: true, selected: true },
  elevated: { elevated: true },
  ghost: { variant: "ghost" },
  outlined: { variant: "outlined" },
  "simple-pill": { variant: "pill" },

  /* ---- Navigation / page states ---- */
  "current-page": { current: true },
  external: { external: true },
  "first-page": { page: 1 },
  "middle-page": { page: 5 },
  "last-page": { page: -1 },
  "first-step": { current: 0 },
  "middle-step": { current: 1 },
  "last-step": { current: -1 },
  "final-step": { current: -1 },

  /* ---- Form / input states ---- */
  filled: { value: "sample" },
  "filled-form": { values: { name: "Sample" } },
  "empty-form": { values: {} },
  "simple-form": { mode: "simple" },
  "complex-form": { mode: "complex" },
  "text-field": { type: "text" },
  "select-field": { type: "select" },
  "validation-error": { error: true, status: "error" },
  "with-validation-error": { error: true },
  "with-error": { error: true },
  "with-errors": { errors: true },

  /* ---- Data / content states ---- */
  populated: { items: [{ id: "1" }] },
  "populated-feed": { items: [{ id: "1" }] },
  "data-loaded": { loading: false },
  loaded: { loading: false },
  "no-data": { data: [] },
  "empty-data": { data: [] },
  "empty-results": { results: [] },
  "empty-state": { items: [] },
  "empty-timeline": { items: [] },
  "empty-feed": { items: [] },
  "empty-fields": { fields: [] },
  "empty-schema": { schema: null },
  "empty-board": { columns: [] },
  "empty-column": { items: [] },
  "empty-dashboard": { widgets: [] },
  "filtered-empty": { items: [], filtered: true },
  "filtered-results": { filtered: true },
  "filtered-feed": { filtered: true },
  "no-citations": { citations: [] },
  "flat-data": { treeData: false },
  "with-total": { showTotal: true },
  "with-sparkline": { showSparkline: true },
  "with-items": { items: [{ id: "1" }] },
  "with-content": { children: "Content" },
  "with-actions": { actions: [{ label: "Action" }] },
  "with-icon": { icon: true },
  "with-cards": { layout: "cards" },
  "with-filters": { showFilters: true },
  "with-search": { showSearch: true },
  "with-comments": { comments: [{ id: "1" }] },
  "with-citations": { citations: [{ id: "1" }] },

  /* ---- Loading / progress states ---- */
  "loading-state": { loading: true },
  "loading-detail": { detailLoading: true },
  "loading-overlay": { loading: true, overlay: true },
  "loading-widgets": { loading: true },
  computing: { computing: true },
  "uploading-progress": { uploading: true },
  "interactive-progress": { interactive: true },

  /* ---- Error states ---- */
  "error-state": { error: true },
  "error-caught": { error: true },

  /* ---- Selection / interaction states ---- */
  "single-selected": { selection: "single" },
  "multi-selected": { selection: "multiple" },
  "multi-select": { multiple: true },
  "batch-selection": { batchSelect: true },
  "range-selection": { rangeSelection: true },
  "selected-row": { selectedRow: true },

  /* ---- Expand / collapse states ---- */
  "collapsed-all": { defaultExpanded: false },
  "single-expanded": { expandMode: "single" },
  "multi-expanded": { expandMode: "multiple" },
  "expanded-rows": { expandedRows: true },
  "expanded-tree": { expandAll: true },
  "collapsed-path": { collapsed: true },

  /* ---- Orientation / layout states ---- */
  horizontal: { orientation: "horizontal" },
  "horizontal-bottom": { orientation: "horizontal", position: "bottom" },
  "horizontal-layout": { layout: "horizontal" },
  vertical: { orientation: "vertical" },
  "vertical-right": { orientation: "vertical", position: "right" },
  "vertical-manual": { orientation: "vertical", mode: "manual" },
  "grid-layout": { layout: "grid" },
  "grid-view": { view: "grid" },
  "list-layout": { layout: "list" },
  "list-view": { view: "list" },
  "single-column": { columns: 1 },
  "multi-column": { columns: 3 },
  "detail-open": { detailOpen: true },
  "master-only": { detailOpen: false },
  "summary-view": { view: "summary" },
  "detailed-view": { view: "detailed" },

  /* ---- Drag & drop states ---- */
  dragging: { dragging: true },
  "drag-over": { dragOver: true },
  reordering: { reordering: true },
  "dragging-card": { dragging: true },
  "dragging-over": { dragOver: true },

  /* ---- Edit / CRUD modes ---- */
  "edit-mode": { mode: "edit" },
  "view-mode": { mode: "view" },
  "create-mode": { mode: "create" },
  "readonly-review": { readOnly: true },
  "readonly-walkthrough": { readOnly: true, walkthrough: true },
  "editable-authoring": { editable: true },

  /* ---- Scroll / overflow states ---- */
  "scroll-viewport": { scrollable: true },
  "scrollable-overflow": { overflow: "scroll" },
  "overflow-collapsed": { overflow: "collapsed" },
  "sticky-navigation": { stickyNav: true },
  wrap: { wrap: true },
  "auto-wrap": { wrap: "auto" },

  /* ---- Chart / visualization states ---- */
  "bar-mode": { type: "bar" },
  "area-mode": { type: "area" },
  "line-default": { type: "line" },
  "donut-default": { donut: true },
  "bubble-mode": { type: "bubble" },
  "multi-series": { series: [{ name: "A" }, { name: "B" }] },
  "single-series": { series: [{ name: "A" }] },
  "with-hidden-series": { hiddenSeries: ["B"] },
  "stacked-queue": { stacked: true },
  "progress-mode": { mode: "progress" },
  "trend-up": { trend: "up" },
  "trend-down": { trend: "down" },
  "increase-decrease": { showChange: true },
  "custom-gradient": { gradient: true },

  /* ---- Calendar / date states ---- */
  "day-view": { view: "day" },
  "week-view": { view: "week" },
  "month-view": { view: "month" },
  "day-selected": { selectedDate: "2024-01-15" },
  "week-selected": { selectedWeek: 3 },
  "month-selected": { selectedMonth: 1 },
  "daily-agenda": { view: "daily-agenda" },
  "weekly-agenda": { view: "weekly-agenda" },
  "single-resource": { resources: 1 },
  "multi-resource": { resources: 3 },
  "with-recurrence": { recurrence: true },

  /* ---- Severity / level states ---- */
  info: { severity: "info" },
  critical: { severity: "critical" },
  high: { level: "high" },
  medium: { level: "medium" },
  low: { level: "low" },
  "severity-variants": {},

  /* ---- Filter / grouping states ---- */
  "single-filter": { filterMode: "single" },
  "multi-filter": { filterMode: "multi" },
  "single-level-group": { groupLevels: 1 },
  "multi-level-group": { groupLevels: 2 },
  "grouped-results": { grouped: true },
  ungrouped: { grouped: false },

  /* ---- AG Grid specific states ---- */
  "default-grid": {},
  "server-mode-loading": { rowModelType: "serverSide", loading: true },
  "client-mode-default": { rowModelType: "clientSide" },
  "cell-editing": { editType: "cell" },
  "row-editing": { editType: "row" },
  "cell-merge": { cellMerge: true },
  "row-context": { contextMenu: "row" },
  "column-context": { contextMenu: "column" },
  "pivot-enabled": { pivotMode: true },

  /* ---- Tree / hierarchy states ---- */
  nested: { nested: true },
  "deep-nesting": { depth: 4 },
  "hierarchical-depth": { depth: 3 },
  "with-indent-guides": { indentGuides: true },

  /* ---- AI / authoring specific states ---- */
  "focused-authoring": { mode: "focused" },
  "command-assisted": { mode: "command" },
  "recommendation-populated": { recommendations: [{ id: "1" }] },
  "guided-active": { guided: true },
  "scope-guardrail": { scopeGuardrail: true },
  "evidence-first": { mode: "evidence" },
  "checkpoint-first": { mode: "checkpoint" },
  "with-active-formats": { formats: ["bold", "italic"] },
  "with-edit-links": { editLinks: true },

  /* ---- Approval / workflow states ---- */
  "wip-exceeded": { wipExceeded: true },
  "multi-swimlane": { swimlanes: 2 },

  /* ---- Tooltip / description states ---- */
  "tooltip-description": { tooltip: true },
  "custom-content": { customContent: true },
  "custom-type-registered": { customType: true },
  "default-types": {},

  /* ---- Badge / indicator states ---- */
  "badge-indicator": { badge: true },
  hoverable: { hoverable: true },

  /* ---- Navigation rail states ---- */
  "compact-icon-rail": { compact: true },

  /* ---- Auto-play / carousel states ---- */
  "auto-play": { autoPlay: true },

  /* ---- Speed dial states ---- */
  "speed-dial-open": { open: true },

  /* ---- Dashboard states ---- */
  "multi-widget": { widgets: [{ id: "1" }, { id: "2" }] },

  /* ---- User list states ---- */
  "user-list": { type: "user" },

  /* ---- Aggregation states ---- */
  "with-aggregation": { aggregation: true },

  /* ---- Max / limit states ---- */
  "max-reached": { maxReached: true },

  /* ---- Flow builder states ---- */
  "empty-canvas": { nodes: [], edges: [] },
  "sample-flow": { preset: "sample" },
  "read-only": { readOnly: true },
};

/** Set of all valid STATE_PROP_MAP keys — for fast lookup and contract testing. */
export const STATE_PROP_MAP_KEYS = new Set(Object.keys(STATE_PROP_MAP));
