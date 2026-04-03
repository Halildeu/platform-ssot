/**
 * ReportVisualizationToggle — Grid ↔ Chart toggle toolbar.
 *
 * Shows available chart types based on column metadata inference.
 * Renders above the grid/chart area in ReportPage.
 */

import React, { useMemo, useState, useCallback } from 'react';
import { Table2 } from 'lucide-react';
import type { ColumnMeta } from '@mfe/design-system/advanced/data-grid';
import { inferChartTypes } from './chartTypeInference';
import { ChartRenderer } from './ChartRenderer';
import type { ChartType, ChartConfig } from './types';
import { CHART_TYPE_LABELS, CHART_TYPE_ICONS } from './types';

interface Props {
  columns: ColumnMeta[];
  data: Record<string, unknown>[];
  children: React.ReactNode; /* Grid component */
}

export const ReportVisualizationToggle: React.FC<Props> = ({
  columns,
  data,
  children,
}) => {
  const [activeView, setActiveView] = useState<ChartType>('grid');

  const suggestions = useMemo(
    () => inferChartTypes(columns).filter((s) => s.confidence >= 0.5),
    [columns],
  );

  const activeConfig = useMemo<ChartConfig | null>(() => {
    if (activeView === 'grid') return null;
    const suggestion = suggestions.find((s) => s.type === activeView);
    if (!suggestion) return null;
    return {
      type: suggestion.type,
      xAxis: suggestion.xAxis,
      yAxis: suggestion.yAxis,
      aggregation: 'sum',
      showLegend: true,
      showLabels: true,
      size: 'lg',
    };
  }, [activeView, suggestions]);

  const handleToggle = useCallback((type: ChartType) => {
    setActiveView((prev) => prev === type ? 'grid' : type);
  }, []);

  /* Don't show toggle if only grid is available */
  if (suggestions.length <= 1) {
    return <>{children}</>;
  }

  return (
    <div>
      {/* Toggle bar */}
      <div className="mb-3 flex items-center gap-1 rounded-xl border border-border-subtle bg-surface-default px-2 py-1">
        <span className="mr-2 text-[10px] font-medium text-text-tertiary">Görünüm:</span>

        {/* Grid button */}
        <button
          type="button"
          onClick={() => setActiveView('grid')}
          className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium transition ${
            activeView === 'grid'
              ? 'bg-action-primary text-action-primary-text'
              : 'text-text-secondary hover:bg-surface-muted'
          }`}
        >
          <Table2 className="h-3 w-3" />
          Tablo
        </button>

        {/* Chart type buttons */}
        {suggestions
          .filter((s) => s.type !== 'grid')
          .slice(0, 5) /* max 5 suggestions */
          .map((s) => (
            <button
              key={s.type}
              type="button"
              onClick={() => handleToggle(s.type)}
              title={`${CHART_TYPE_LABELS[s.type]} — ${s.reason}`}
              className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium transition ${
                activeView === s.type
                  ? 'bg-action-primary text-action-primary-text'
                  : 'text-text-secondary hover:bg-surface-muted'
              }`}
            >
              <span>{CHART_TYPE_ICONS[s.type]}</span>
              {CHART_TYPE_LABELS[s.type]}
            </button>
          ))}
      </div>

      {/* Content: Grid or Chart */}
      {activeView === 'grid' ? (
        children
      ) : activeConfig ? (
        <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
          <ChartRenderer config={activeConfig} data={data} height={400} />
        </div>
      ) : (
        children
      )}
    </div>
  );
};
