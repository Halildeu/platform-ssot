/**
 * DashboardBuilder — Drag & drop multi-widget dashboard editor.
 *
 * Uses CSS Grid for layout. Widgets can be charts, grids, KPI cards,
 * filters, or text blocks.
 */

import React, { useCallback, useState } from 'react';
import { Plus, Save, RotateCcw, GripVertical, X, Settings2, BarChart3, Table2, Hash, Filter, Type } from 'lucide-react';
import { useDashboardState } from './hooks/useDashboardState';
import type { DashboardWidget, WidgetType } from './types';
import { WIDGET_TYPE_LABELS } from './types';

const WIDGET_ICONS: Record<WidgetType, React.ReactNode> = {
  chart: <BarChart3 className="h-4 w-4" />,
  grid: <Table2 className="h-4 w-4" />,
  kpi: <Hash className="h-4 w-4" />,
  filter: <Filter className="h-4 w-4" />,
  text: <Type className="h-4 w-4" />,
};

const showToast = (type: 'success' | 'error', text: string) => {
  try { window.dispatchEvent(new CustomEvent('app:toast', { detail: { type, text } })); } catch { /* */ }
};

export const DashboardBuilder: React.FC = () => {
  const { state, dispatch, addWidget, reset } = useDashboardState();
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [addMenuOpen, setAddMenuOpen] = useState(false);

  const handleSave = useCallback(async () => {
    if (!state.title.trim()) {
      showToast('error', 'Dashboard başlığı gerekli');
      return;
    }
    try {
      const res = await fetch('/v1/dashboards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      showToast('success', `"${state.title}" dashboard kaydedildi.`);
      reset();
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Kaydedilemedi.');
    }
  }, [state, reset]);

  const handleAddWidget = useCallback((type: WidgetType) => {
    addWidget(type, `Yeni ${WIDGET_TYPE_LABELS[type]}`);
    setAddMenuOpen(false);
  }, [addWidget]);

  const handleRemoveWidget = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_WIDGET', widgetId: id });
    if (selectedWidget === id) setSelectedWidget(null);
  }, [dispatch, selectedWidget]);

  const selectedWidgetData = state.widgets.find((w) => w.id === selectedWidget);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex-1">
          <input
            type="text"
            value={state.title}
            onChange={(e) => dispatch({ type: 'SET_TITLE', title: e.target.value })}
            placeholder="Dashboard Başlığı"
            className="w-full text-2xl font-bold text-text-primary bg-transparent border-0 outline-none placeholder:text-text-disabled"
          />
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 rounded-lg border border-border-subtle px-3 py-1.5 text-xs text-text-secondary hover:bg-surface-muted">
            <RotateCcw className="h-3.5 w-3.5" /> Sıfırla
          </button>
          <button type="button" onClick={handleSave} className="inline-flex items-center gap-1.5 rounded-lg bg-action-primary px-4 py-1.5 text-xs font-medium text-action-primary-text hover:opacity-90">
            <Save className="h-3.5 w-3.5" /> Kaydet
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex items-center gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => setAddMenuOpen(!addMenuOpen)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border-subtle px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface-muted"
          >
            <Plus className="h-4 w-4" /> Widget Ekle
          </button>
          {addMenuOpen && (
            <div className="absolute left-0 top-full z-10 mt-1 w-48 rounded-xl border border-border-subtle bg-surface-default p-1 shadow-lg">
              {(Object.keys(WIDGET_TYPE_LABELS) as WidgetType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleAddWidget(type)}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-primary hover:bg-surface-muted"
                >
                  {WIDGET_ICONS[type]}
                  {WIDGET_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          )}
        </div>
        <span className="text-xs text-text-tertiary">{state.widgets.length} widget</span>
      </div>

      {/* Canvas + Properties */}
      <div className="flex gap-4">
        {/* Canvas */}
        <div className="min-w-0 flex-1">
          {state.widgets.length === 0 ? (
            <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-border-subtle">
              <div className="text-center">
                <Plus className="mx-auto mb-2 h-8 w-8 text-text-tertiary" />
                <p className="text-sm text-text-secondary">Widget ekleyerek başlayın</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-3">
              {state.widgets.map((widget) => {
                const layout = state.layout.find((l) => l.widgetId === widget.id);
                const isSelected = selectedWidget === widget.id;
                return (
                  <div
                    key={widget.id}
                    onClick={() => setSelectedWidget(widget.id)}
                    className={`rounded-xl border p-4 transition cursor-pointer ${
                      isSelected
                        ? 'border-action-primary bg-action-primary/5 shadow-md'
                        : 'border-border-subtle bg-surface-default hover:border-action-primary/30'
                    }`}
                    style={{
                      gridColumn: `span ${layout?.w ?? 6}`,
                      minHeight: `${(layout?.h ?? 4) * 40}px`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-text-tertiary cursor-grab" />
                        {WIDGET_ICONS[widget.type]}
                        <span className="text-sm font-medium">{widget.title || WIDGET_TYPE_LABELS[widget.type]}</span>
                      </div>
                      <button type="button" onClick={(e) => { e.stopPropagation(); handleRemoveWidget(widget.id); }}>
                        <X className="h-3.5 w-3.5 text-text-tertiary hover:text-state-danger-text" />
                      </button>
                    </div>
                    <div className="flex h-24 items-center justify-center rounded-lg bg-surface-muted text-xs text-text-tertiary">
                      {WIDGET_TYPE_LABELS[widget.type]} içeriği
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Properties Panel */}
        {selectedWidgetData && (
          <div className="w-[260px] shrink-0 rounded-xl border border-border-subtle bg-surface-default p-4">
            <div className="flex items-center gap-2 mb-4">
              <Settings2 className="h-4 w-4 text-text-tertiary" />
              <span className="text-sm font-semibold">Widget Özellikleri</span>
            </div>
            <div className="space-y-3">
              <label className="block">
                <span className="text-[10px] font-medium text-text-tertiary">Başlık</span>
                <input
                  type="text"
                  value={selectedWidgetData.title ?? ''}
                  onChange={(e) => dispatch({ type: 'UPDATE_WIDGET', widget: { ...selectedWidgetData, title: e.target.value } })}
                  className="mt-1 w-full rounded-lg border border-border-subtle px-2 py-1.5 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-[10px] font-medium text-text-tertiary">Tip</span>
                <p className="text-sm">{WIDGET_TYPE_LABELS[selectedWidgetData.type]}</p>
              </label>
              <label className="block">
                <span className="text-[10px] font-medium text-text-tertiary">Rapor ID</span>
                <input
                  type="text"
                  value={selectedWidgetData.reportId ?? ''}
                  onChange={(e) => dispatch({ type: 'UPDATE_WIDGET', widget: { ...selectedWidgetData, reportId: e.target.value } })}
                  placeholder="rapor-key"
                  className="mt-1 w-full rounded-lg border border-border-subtle px-2 py-1.5 text-sm"
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
