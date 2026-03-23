import React from 'react';
import type { ChartResult, ChartDataRow } from './types';

type ChartCardProps = {
  chart: ChartResult;
  onDrillDown?: (chart: ChartResult, dataPoint?: ChartDataRow) => void;
  children: React.ReactNode;
};

export const ChartCard: React.FC<ChartCardProps> = ({ chart, onDrillDown, children }) => {
  return (
    <div
      className="rounded-lg border border-border-subtle bg-surface-primary p-4 shadow-xs"
      role="region"
      aria-label={chart.title}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">{chart.title}</h3>
        {chart.drillTo && onDrillDown && (
          <button
            type="button"
            onClick={() => onDrillDown(chart)}
            className="text-xs text-action-primary-text hover:underline"
          >
            Detay
          </button>
        )}
      </div>
      <div className="min-h-[200px]">
        {chart.data.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-sm text-text-subtle">
            Veri bulunamadı
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};
