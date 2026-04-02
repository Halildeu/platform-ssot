/**
 * useBuilderState — Wizard state management for Report Builder.
 *
 * Manages all wizard steps' data in a single reducer.
 * Auto-persists to localStorage for crash recovery.
 */

import { useReducer, useCallback, useEffect, useMemo } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface JoinDef {
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
  joinType: 'inner' | 'left';
}

export interface LookupDef {
  fkColumn: string;
  lookupTable: string;
  lookupPk: string;
  displayColumn: string;
}

export interface ColumnDef {
  field: string;
  headerName: string;
  columnType: string;
  width?: number;
  config?: Record<string, unknown>;
  included: boolean;
}

export interface FilterDef {
  field: string;
  type: 'text' | 'number' | 'date' | 'set';
  label: string;
  defaultValue?: unknown;
  setValues?: string[];
}

export interface BuilderState {
  step: number;
  dataSourceId: string;
  schema: string;
  primaryTable: string;
  availableColumns: ColumnDef[];
  selectedColumns: ColumnDef[];
  relatedTables: string[];
  joins: JoinDef[];
  lookups: LookupDef[];
  filters: FilterDef[];
  reportTitle: string;
  reportDescription: string;
  reportCategory: string;
  isDirty: boolean;
}

const INITIAL_STATE: BuilderState = {
  step: 0,
  dataSourceId: '',
  schema: '',
  primaryTable: '',
  availableColumns: [],
  selectedColumns: [],
  relatedTables: [],
  joins: [],
  lookups: [],
  filters: [],
  reportTitle: '',
  reportDescription: '',
  reportCategory: '',
  isDirty: false,
};

const STORAGE_KEY = 'report-builder-state';

/* ------------------------------------------------------------------ */
/*  Actions                                                            */
/* ------------------------------------------------------------------ */

type BuilderAction =
  | { type: 'SET_STEP'; step: number }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_DATA_SOURCE'; dataSourceId: string }
  | { type: 'SET_SCHEMA'; schema: string }
  | { type: 'SET_PRIMARY_TABLE'; table: string; columns: ColumnDef[] }
  | { type: 'TOGGLE_COLUMN'; field: string }
  | { type: 'SET_COLUMN_TYPE'; field: string; columnType: string; config?: Record<string, unknown> }
  | { type: 'ADD_RELATED_TABLE'; table: string; join: JoinDef; columns: ColumnDef[] }
  | { type: 'REMOVE_RELATED_TABLE'; table: string }
  | { type: 'ADD_LOOKUP'; lookup: LookupDef }
  | { type: 'REMOVE_LOOKUP'; fkColumn: string }
  | { type: 'SET_FILTERS'; filters: FilterDef[] }
  | { type: 'SET_REPORT_META'; title?: string; description?: string; category?: string }
  | { type: 'RESET' };

/* ------------------------------------------------------------------ */
/*  Reducer                                                            */
/* ------------------------------------------------------------------ */

function builderReducer(state: BuilderState, action: BuilderAction): BuilderState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.step };
    case 'NEXT_STEP':
      return { ...state, step: Math.min(state.step + 1, 7) };
    case 'PREV_STEP':
      return { ...state, step: Math.max(state.step - 1, 0) };
    case 'SET_DATA_SOURCE':
      return { ...state, dataSourceId: action.dataSourceId, isDirty: true };
    case 'SET_SCHEMA':
      return { ...state, schema: action.schema, isDirty: true };
    case 'SET_PRIMARY_TABLE':
      return {
        ...state,
        primaryTable: action.table,
        availableColumns: action.columns,
        selectedColumns: action.columns.filter((c) => c.included),
        relatedTables: [],
        joins: [],
        isDirty: true,
      };
    case 'TOGGLE_COLUMN': {
      const updated = state.availableColumns.map((c) =>
        c.field === action.field ? { ...c, included: !c.included } : c,
      );
      return {
        ...state,
        availableColumns: updated,
        selectedColumns: updated.filter((c) => c.included),
        isDirty: true,
      };
    }
    case 'SET_COLUMN_TYPE': {
      const updateCol = (cols: ColumnDef[]) =>
        cols.map((c) =>
          c.field === action.field
            ? { ...c, columnType: action.columnType, config: action.config }
            : c,
        );
      return {
        ...state,
        availableColumns: updateCol(state.availableColumns),
        selectedColumns: updateCol(state.selectedColumns),
        isDirty: true,
      };
    }
    case 'ADD_RELATED_TABLE':
      return {
        ...state,
        relatedTables: [...state.relatedTables, action.table],
        joins: [...state.joins, action.join],
        availableColumns: [...state.availableColumns, ...action.columns],
        isDirty: true,
      };
    case 'REMOVE_RELATED_TABLE': {
      const removedFields = new Set(
        state.availableColumns
          .filter((c) => c.field.startsWith(`${action.table}.`))
          .map((c) => c.field),
      );
      return {
        ...state,
        relatedTables: state.relatedTables.filter((t) => t !== action.table),
        joins: state.joins.filter((j) => j.toTable !== action.table && j.fromTable !== action.table),
        availableColumns: state.availableColumns.filter((c) => !removedFields.has(c.field)),
        selectedColumns: state.selectedColumns.filter((c) => !removedFields.has(c.field)),
        isDirty: true,
      };
    }
    case 'ADD_LOOKUP':
      return { ...state, lookups: [...state.lookups, action.lookup], isDirty: true };
    case 'REMOVE_LOOKUP':
      return { ...state, lookups: state.lookups.filter((l) => l.fkColumn !== action.fkColumn), isDirty: true };
    case 'SET_FILTERS':
      return { ...state, filters: action.filters, isDirty: true };
    case 'SET_REPORT_META':
      return {
        ...state,
        reportTitle: action.title ?? state.reportTitle,
        reportDescription: action.description ?? state.reportDescription,
        reportCategory: action.category ?? state.reportCategory,
        isDirty: true,
      };
    case 'RESET':
      return { ...INITIAL_STATE };
    default:
      return state;
  }
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

function loadSavedState(): BuilderState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    return { ...INITIAL_STATE, ...JSON.parse(raw) };
  } catch {
    return INITIAL_STATE;
  }
}

export function useBuilderState() {
  const [state, dispatch] = useReducer(builderReducer, undefined, loadSavedState);

  /* Auto-save to localStorage */
  useEffect(() => {
    if (state.isDirty) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
    }
  }, [state]);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }, []);

  const canProceed = useMemo(() => {
    switch (state.step) {
      case 0: return Boolean(state.schema);
      case 1: return Boolean(state.primaryTable);
      case 2: return state.selectedColumns.length > 0;
      case 3: return true; // related tables optional
      case 4: return true; // lookups optional
      case 5: return true; // column types optional
      case 6: return true; // filters optional
      case 7: return Boolean(state.reportTitle);
      default: return false;
    }
  }, [state]);

  return {
    state,
    dispatch,
    reset,
    canProceed,
    totalSteps: 8,
  };
}
