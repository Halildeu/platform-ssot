import React from 'react';
import { Badge, Text } from '@mfe/design-system';
import benchmarkParityMatrixRaw from '../../design-lab.benchmark-parity-matrix.v1.json';

/* ── Types ── */

type BenchmarkItem = {
  capabilityId: string;
  capability: string;
  canonicalLayer: string;
  status: 'aligned' | 'partial' | 'misplaced' | 'missing';
  currentScore: number;
  antDesignReference: string;
  muiReference: string;
  nextAction: string;
};

type BenchmarkParityMatrix = {
  summary: {
    overallParityPercent: number;
    totalCapabilities: number;
    aligned: number;
    partial: number;
    misplaced: number;
    missing: number;
  };
  items: BenchmarkItem[];
};

const matrix = benchmarkParityMatrixRaw as unknown as BenchmarkParityMatrix;

/* ── Constants ── */

const STATUS_TONE: Record<string, 'success' | 'warning' | 'muted' | 'info'> = {
  aligned: 'success',
  partial: 'warning',
  misplaced: 'muted',
  missing: 'muted',
};

const SCORE_COLOR = (score: number): string => {
  if (score >= 95) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 90) return 'text-blue-600 dark:text-blue-400';
  if (score >= 85) return 'text-amber-600 dark:text-amber-400';
  return 'text-zinc-600 dark:text-zinc-400';
};

const SCORE_BAR_COLOR = (score: number): string => {
  if (score >= 95) return 'bg-emerald-400';
  if (score >= 90) return 'bg-blue-400';
  if (score >= 85) return 'bg-amber-400';
  return 'bg-zinc-400';
};

/* ── Layer filter type ── */

export type BenchmarkLayerFilter = 'all' | 'foundations' | 'components' | 'recipes' | 'pages' | 'ecosystem' | 'platform_contracts';

/* ── Score bar sub-component ── */

const ScoreBar: React.FC<{ score: number }> = ({ score }) => (
  <div className="flex items-center gap-2">
    <div className="h-1.5 flex-1 rounded-full bg-zinc-100 dark:bg-zinc-800">
      <div
        className={`h-1.5 rounded-full transition-all ${SCORE_BAR_COLOR(score)}`}
        style={{ width: `${score}%` }}
      />
    </div>
    <span className={`text-xs font-bold tabular-nums ${SCORE_COLOR(score)}`}>{score}</span>
  </div>
);

/* ── Main Panel ── */

type BenchmarkParityPanelProps = {
  layerFilter?: BenchmarkLayerFilter;
  DetailLabelComponent: React.ComponentType<any>;
  SectionBadgeComponent: React.ComponentType<any>;
  MetricCardComponent: React.ComponentType<any>;
};

/**
 * Shared benchmark parity panel.
 * Reads from `design-lab.benchmark-parity-matrix.v1.json` and renders
 * capability scores, status, AntD/MUI references and next actions.
 * Optionally filtered by layer.
 */
export const BenchmarkParityPanel: React.FC<BenchmarkParityPanelProps> = ({
  layerFilter = 'all',
  DetailLabelComponent,
  SectionBadgeComponent,
  MetricCardComponent,
}) => {
  const DetailLabel = DetailLabelComponent;
  const SectionBadge = SectionBadgeComponent;
  const MetricCard = MetricCardComponent;

  const filteredItems = React.useMemo(() => {
    if (layerFilter === 'all') return matrix.items;
    return matrix.items.filter((item) => {
      const id = item.capabilityId.toLowerCase();
      const layer = layerFilter.toLowerCase();
      return item.canonicalLayer === layer || id.startsWith(`${layer}.`);
    });
  }, [layerFilter]);

  const { summary } = matrix;

  // Compute filtered stats
  const filteredStats = React.useMemo(() => {
    const avg = filteredItems.length > 0
      ? Math.round(filteredItems.reduce((s, i) => s + i.currentScore, 0) / filteredItems.length)
      : 0;
    const aligned = filteredItems.filter((i) => i.status === 'aligned').length;
    const partial = filteredItems.filter((i) => i.status === 'partial').length;
    return { avg, aligned, partial, total: filteredItems.length };
  }, [filteredItems]);

  return (
    <div className="space-y-4">
      {/* Summary header */}
      <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div>
            <DetailLabel>Benchmark Parity Matrix</DetailLabel>
            <Text variant="secondary" className="mt-1 block text-sm leading-6">
              Ant Design ve MUI ile capability parity durumu.
              {layerFilter !== 'all' ? ` (${layerFilter} katmani)` : ''}
            </Text>
          </div>
          <Badge variant={summary.overallParityPercent >= 90 ? 'success' : 'warning'}>
            {summary.overallParityPercent}% overall
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <MetricCard
            label="Capabilities"
            value={layerFilter === 'all' ? summary.totalCapabilities : filteredStats.total}
            note={layerFilter === 'all' ? 'Total tracked capabilities' : `${layerFilter} capabilities`}
          />
          <MetricCard
            label="Avg score"
            value={layerFilter === 'all' ? `${summary.overallParityPercent}%` : `${filteredStats.avg}%`}
            note="Weighted parity score"
          />
          <MetricCard
            label="Aligned"
            value={layerFilter === 'all' ? summary.aligned : filteredStats.aligned}
            note="AntD/MUI parity reached"
          />
          <MetricCard
            label="Partial"
            value={layerFilter === 'all' ? summary.partial : filteredStats.partial}
            note="Gap remaining"
          />
        </div>
      </div>

      {/* Capability cards */}
      <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-xs">
        <DetailLabel>Capability breakdown</DetailLabel>
        <div className="mt-4 space-y-3">
          {filteredItems.map((item) => (
            <div
              key={item.capabilityId}
              className="rounded-[20px] border border-border-subtle bg-surface-default p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <Text className="text-sm font-semibold text-text-primary truncate">
                    {item.capability}
                  </Text>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={STATUS_TONE[item.status] ?? 'muted'}>{item.status}</Badge>
                </div>
              </div>

              {/* Score bar */}
              <div className="mt-3">
                <ScoreBar score={item.currentScore} />
              </div>

              {/* References */}
              <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                <div className="rounded-lg bg-surface-panel px-3 py-2">
                  <Text variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">
                    Ant Design
                  </Text>
                  <Text className="mt-0.5 block text-[11px] font-medium text-text-primary leading-5">
                    {item.antDesignReference}
                  </Text>
                </div>
                <div className="rounded-lg bg-surface-panel px-3 py-2">
                  <Text variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">
                    MUI
                  </Text>
                  <Text className="mt-0.5 block text-[11px] font-medium text-text-primary leading-5">
                    {item.muiReference}
                  </Text>
                </div>
              </div>

              {/* Layer badge + Next action */}
              <div className="mt-2 flex items-start gap-2">
                <SectionBadge label={item.canonicalLayer} />
                <Text variant="secondary" className="text-[11px] leading-5">
                  {item.nextAction}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
