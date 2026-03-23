import React from 'react';
import { Badge, Text } from '@mfe/design-system';
import migrationGovernanceCatalogRaw from '../../design-lab.migration-governance.v1.json';

/* ── Types ── */

type GovernanceMaturityLevel = {
  level: number;
  label: string;
  description: string;
};

type GovernanceDimension = {
  dimensionId: string;
  title: string;
  description: string;
  appliesTo: string[];
  maturityLevels: GovernanceMaturityLevel[];
};

type MigrationLane = {
  laneId: string;
  title: string;
  layer: string;
  status: 'active' | 'planned' | 'completed';
  description: string;
  steps: string[];
};

type MigrationGovernanceCatalog = {
  governanceDimensions: GovernanceDimension[];
  layerGovernanceStatus: Record<string, Record<string, number>>;
  migrationLanes: MigrationLane[];
};

const catalog = migrationGovernanceCatalogRaw as unknown as MigrationGovernanceCatalog;

/* ── Layer type ── */

export type GovernanceLayerId = 'foundations' | 'components' | 'recipes' | 'pages' | 'ecosystem';

/* ── Constants ── */

const MATURITY_COLORS: Record<number, { dot: string; bar: string; text: string }> = {
  1: { dot: 'bg-zinc-400', bar: 'bg-zinc-300 dark:bg-zinc-600', text: 'text-zinc-600 dark:text-zinc-400' },
  2: { dot: 'bg-amber-400', bar: 'bg-amber-200 dark:bg-amber-800/40', text: 'text-amber-600 dark:text-amber-400' },
  3: { dot: 'bg-blue-400', bar: 'bg-blue-200 dark:bg-blue-800/40', text: 'text-blue-600 dark:text-blue-400' },
  4: { dot: 'bg-emerald-400', bar: 'bg-emerald-200 dark:bg-emerald-800/40', text: 'text-emerald-600 dark:text-emerald-400' },
};

const LANE_STATUS_TONE: Record<string, 'success' | 'warning' | 'info'> = {
  active: 'success',
  planned: 'warning',
  completed: 'info',
};

/* ── Shared sub-components ── */

const MaturityBar: React.FC<{ current: number; max: number }> = ({ current, max }) => (
  <div className="flex items-center gap-1.5">
    {Array.from({ length: max }, (_, i) => {
      const level = i + 1;
      const filled = level <= current;
      return (
        <div
          key={level}
          className={`h-2 flex-1 rounded-full transition-colors ${
            filled ? (MATURITY_COLORS[level]?.bar ?? 'bg-emerald-200') : 'bg-zinc-100 dark:bg-zinc-800'
          }`}
        />
      );
    })}
  </div>
);

/* ── Main Panel ── */

type MigrationGovernancePanelProps = {
  layer: GovernanceLayerId;
  DetailLabelComponent: React.ComponentType<any>;
  SectionBadgeComponent: React.ComponentType<any>;
  MetricCardComponent: React.ComponentType<any>;
};

/**
 * Layer-agnostic migration governance panel.
 * Reads from `design-lab.migration-governance.v1.json` catalog
 * and renders governance dimensions, maturity levels and migration lanes
 * filtered for the given layer.
 */
export const MigrationGovernancePanel: React.FC<MigrationGovernancePanelProps> = ({
  layer,
  DetailLabelComponent,
  SectionBadgeComponent,
  MetricCardComponent,
}) => {
  const DetailLabel = DetailLabelComponent;
  const SectionBadge = SectionBadgeComponent;
  const MetricCard = MetricCardComponent;

  const layerStatus = catalog.layerGovernanceStatus[layer] ?? {};
  const applicableDimensions = catalog.governanceDimensions.filter((d) =>
    d.appliesTo.includes(layer),
  );
  const layerLanes = catalog.migrationLanes.filter((lane) => lane.layer === layer);

  // Compute aggregate scores
  const totalScore = applicableDimensions.reduce(
    (sum, d) => sum + (layerStatus[d.dimensionId] ?? 1),
    0,
  );
  const maxScore = applicableDimensions.length * 4;
  const overallPercent = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  // Count per maturity level
  const levelCounts = applicableDimensions.reduce<Record<number, number>>((acc, d) => {
    const level = layerStatus[d.dimensionId] ?? 1;
    acc[level] = (acc[level] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {/* Header summary */}
      <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div>
            <DetailLabel>Migration Governance</DetailLabel>
            <Text variant="secondary" className="mt-1 block text-sm leading-6">
              Bu katmanin migration governance olgunluk durumu ve aktif migration lane&apos;leri.
            </Text>
          </div>
          <Badge variant={overallPercent >= 75 ? 'success' : overallPercent >= 50 ? 'warning' : 'muted'}>
            {overallPercent}% maturity
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <MetricCard
            label="Overall score"
            value={`${totalScore}/${maxScore}`}
            note={`${applicableDimensions.length} governance dimension`}
          />
          <MetricCard
            label="Level 4 (Automated)"
            value={levelCounts[4] ?? 0}
            note="Tam otomasyonlu dimension"
          />
          <MetricCard
            label="Level 3 (Governed)"
            value={levelCounts[3] ?? 0}
            note="Policy-driven dimension"
          />
          <MetricCard
            label="Level 1-2 (Manual)"
            value={(levelCounts[1] ?? 0) + (levelCounts[2] ?? 0)}
            note="Gelisim gerektiren dimension"
          />
        </div>
      </div>

      {/* Dimension detail cards */}
      <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-xs">
        <DetailLabel>Governance dimensions</DetailLabel>
        <div className="mt-4 space-y-3">
          {applicableDimensions.map((dimension) => {
            const currentLevel = layerStatus[dimension.dimensionId] ?? 1;
            const currentMaturity = dimension.maturityLevels.find((m) => m.level === currentLevel);
            const colors = MATURITY_COLORS[currentLevel] ?? MATURITY_COLORS[1];

            return (
              <div
                key={dimension.dimensionId}
                className="rounded-[20px] border border-border-subtle bg-surface-default p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${colors.dot}`} />
                    <Text className="text-sm font-semibold text-text-primary">
                      {dimension.title}
                    </Text>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-bold ${colors.text}`}>
                      L{currentLevel}
                    </span>
                    <SectionBadge label={currentMaturity?.label ?? `Level ${currentLevel}`} />
                  </div>
                </div>

                <Text variant="secondary" className="mt-1.5 block text-xs leading-5">
                  {dimension.description}
                </Text>

                {/* Maturity bar */}
                <div className="mt-3">
                  <MaturityBar current={currentLevel} max={4} />
                </div>

                {/* Current maturity description */}
                <Text variant="secondary" className="mt-2 block text-[11px] leading-5 italic">
                  {currentMaturity?.description}
                </Text>

                {/* Next level hint (if not max) */}
                {currentLevel < 4 ? (
                  <div className="mt-2 rounded-lg bg-surface-panel px-3 py-2">
                    <Text variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">
                      Next level
                    </Text>
                    <Text className="mt-0.5 block text-[11px] font-medium text-text-primary leading-5">
                      {dimension.maturityLevels.find((m) => m.level === currentLevel + 1)?.description}
                    </Text>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Migration lanes for this layer */}
      {layerLanes.length > 0 ? (
        <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-xs">
          <DetailLabel>Migration lanes</DetailLabel>
          <Text variant="secondary" className="mt-1 block text-xs leading-5">
            Bu katmana ait aktif ve planli migration lane&apos;leri.
          </Text>
          <div className="mt-4 space-y-3">
            {layerLanes.map((lane) => (
              <div
                key={lane.laneId}
                className="rounded-[20px] border border-border-subtle bg-surface-default p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <Text className="text-sm font-semibold text-text-primary">{lane.title}</Text>
                  <Badge variant={LANE_STATUS_TONE[lane.status] ?? 'muted'}>{lane.status}</Badge>
                </div>
                <Text variant="secondary" className="mt-1.5 block text-xs leading-5">
                  {lane.description}
                </Text>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {lane.steps.map((step, idx) => (
                    <span
                      key={step}
                      className="inline-flex items-center gap-1 rounded-md bg-surface-panel px-2 py-1 text-[10px] font-medium text-text-secondary"
                    >
                      <span className="text-[9px] font-bold text-text-tertiary">{idx + 1}.</span>
                      {step.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Cross-layer overview (compact) */}
      <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-xs">
        <DetailLabel>Cross-layer maturity comparison</DetailLabel>
        <Text variant="secondary" className="mt-1 block text-xs leading-5">
          Tum katmanlarin governance olgunlugu bir bakista.
        </Text>
        <div className="mt-4 space-y-2">
          {Object.entries(catalog.layerGovernanceStatus).map(([layerId, dims]) => {
            const layerDimensions = catalog.governanceDimensions.filter((d) =>
              d.appliesTo.includes(layerId),
            );
            const lTotal = layerDimensions.reduce(
              (s, d) => s + (dims[d.dimensionId] ?? 1),
              0,
            );
            const lMax = layerDimensions.length * 4;
            const lPct = lMax > 0 ? Math.round((lTotal / lMax) * 100) : 0;
            const isCurrentLayer = layerId === layer;

            return (
              <div
                key={layerId}
                className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2 ${
                  isCurrentLayer
                    ? 'bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-200 dark:ring-blue-800'
                    : 'bg-surface-default'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Text className={`text-xs font-semibold ${isCurrentLayer ? 'text-blue-600 dark:text-blue-300' : 'text-text-primary'}`}>
                    {layerId}
                  </Text>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24">
                    <MaturityBar current={Math.round(lPct / 25)} max={4} />
                  </div>
                  <Text className={`text-xs font-bold tabular-nums ${isCurrentLayer ? 'text-blue-600 dark:text-blue-300' : 'text-text-secondary'}`}>
                    {lPct}%
                  </Text>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
