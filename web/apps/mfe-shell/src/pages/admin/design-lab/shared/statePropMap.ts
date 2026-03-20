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
};

/** Set of all valid STATE_PROP_MAP keys — for fast lookup and contract testing. */
export const STATE_PROP_MAP_KEYS = new Set(Object.keys(STATE_PROP_MAP));
