/**
 * useDashboardState — State management for dashboard builder.
 */

import { useReducer, useCallback, useEffect, useMemo } from 'react';
import type { DashboardDefinition, DashboardWidget, LayoutItem, DashboardFilter, WidgetType } from '../types';

const STORAGE_KEY = 'dashboard-builder-state';

type Action =
  | { type: 'SET_TITLE'; title: string }
  | { type: 'ADD_WIDGET'; widget: DashboardWidget; layout: LayoutItem }
  | { type: 'REMOVE_WIDGET'; widgetId: string }
  | { type: 'UPDATE_WIDGET'; widget: DashboardWidget }
  | { type: 'UPDATE_LAYOUT'; layout: LayoutItem[] }
  | { type: 'ADD_FILTER'; filter: DashboardFilter }
  | { type: 'REMOVE_FILTER'; filterId: string }
  | { type: 'LOAD'; dashboard: DashboardDefinition }
  | { type: 'RESET' };

const INITIAL: DashboardDefinition = {
  id: '',
  title: '',
  layout: [],
  widgets: [],
  filters: [],
  version: 1,
};

function reducer(state: DashboardDefinition, action: Action): DashboardDefinition {
  switch (action.type) {
    case 'SET_TITLE':
      return { ...state, title: action.title };
    case 'ADD_WIDGET':
      return {
        ...state,
        widgets: [...state.widgets, action.widget],
        layout: [...state.layout, action.layout],
      };
    case 'REMOVE_WIDGET':
      return {
        ...state,
        widgets: state.widgets.filter((w) => w.id !== action.widgetId),
        layout: state.layout.filter((l) => l.widgetId !== action.widgetId),
      };
    case 'UPDATE_WIDGET':
      return {
        ...state,
        widgets: state.widgets.map((w) => w.id === action.widget.id ? action.widget : w),
      };
    case 'UPDATE_LAYOUT':
      return { ...state, layout: action.layout };
    case 'ADD_FILTER':
      return { ...state, filters: [...state.filters, action.filter] };
    case 'REMOVE_FILTER':
      return { ...state, filters: state.filters.filter((f) => f.id !== action.filterId) };
    case 'LOAD':
      return action.dashboard;
    case 'RESET':
      return { ...INITIAL };
    default:
      return state;
  }
}

function loadSaved(): DashboardDefinition {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...INITIAL, ...JSON.parse(raw) } : INITIAL;
  } catch {
    return INITIAL;
  }
}

export function useDashboardState() {
  const [state, dispatch] = useReducer(reducer, undefined, loadSaved);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* */ }
  }, [state]);

  const addWidget = useCallback((type: WidgetType, title?: string) => {
    const id = `widget-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const maxY = state.layout.reduce((max, l) => Math.max(max, l.y + l.h), 0);
    dispatch({
      type: 'ADD_WIDGET',
      widget: { id, type, title },
      layout: { widgetId: id, x: 0, y: maxY, w: 6, h: 4, minW: 2, minH: 2 },
    });
  }, [state.layout]);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* */ }
  }, []);

  return { state, dispatch, addWidget, reset };
}
