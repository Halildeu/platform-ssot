import React, { useMemo } from 'react';
import { cn } from '../utils/cn';
import {
  resolveAccessState,
  accessStyles,
  type AccessControlledProps,
} from '../internal/access-controller';
import {
  formatValue,
  getTrendColor,
  getTrendIcon,
  type TrendDirection,
} from './types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Props for the MetricComparisonCard component.
 *
 * @example
 * ```tsx
 * <MetricComparisonCard
 *   title="Revenue"
 *   currentValue={125000}
 *   previousValue={100000}
 *   format="currency"
 *   currencySymbol="USD"
 *   period={{ current: 'Q1 2025', previous: 'Q4 2024' }}
 *   target={130000}
 *   sparklineData={[95000, 98000, 102000, 110000, 125000]}
 *   size="md"
 * />
 * ```
 *
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/metric-comparison-card)
 */
export interface MetricComparisonCardProps extends AccessControlledProps {
  /** Metric title */
  title: string;
  /** Current period value */
  currentValue: number;
  /** Previous period value for comparison */
  previousValue: number;
  /** Number format for display */
  format?: 'number' | 'currency' | 'percent';
  /** Currency code (used when format is 'currency') */
  currencySymbol?: string;
  /** Period labels */
  period?: { current: string; previous: string };
  /** Optional target value — renders a target progress bar */
  target?: number;
  /** Optional sparkline data points */
  sparklineData?: number[];
  /** Card size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Invert trend colors (down = good, up = bad) */
  invertTrend?: boolean;
  /** Additional CSS class names for the root element */
  className?: string;
}

// ---------------------------------------------------------------------------
// Size config
// ---------------------------------------------------------------------------

interface SizeConfig {
  padding: string;
  titleSize: string;
  valueSize: string;
  subSize: string;
  trendSize: string;
  sparkW: number;
  sparkH: number;
}

const SIZE_CONFIGS: Record<string, SizeConfig> = {
  sm: {
    padding: 'p-3',
    titleSize: 'text-xs',
    valueSize: 'text-lg',
    subSize: 'text-[10px]',
    trendSize: 'text-xs',
    sparkW: 48,
    sparkH: 20,
  },
  md: {
    padding: 'p-4',
    titleSize: 'text-sm',
    valueSize: 'text-2xl',
    subSize: 'text-xs',
    trendSize: 'text-sm',
    sparkW: 64,
    sparkH: 28,
  },
  lg: {
    padding: 'p-5',
    titleSize: 'text-base',
    valueSize: 'text-3xl',
    subSize: 'text-sm',
    trendSize: 'text-base',
    sparkW: 80,
    sparkH: 36,
  },
};

// ---------------------------------------------------------------------------
// Sparkline renderer
// ---------------------------------------------------------------------------

function Sparkline({
  data,
  width,
  height,
  color,
}: {
  data: number[];
  width: number;
  height: number;
  color: string;
}) {
  if (data.length < 2) return null;

  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const range = maxVal - minVal || 1;
  const pad = 2;
  const innerH = height - pad * 2;
  const stepX = width / (data.length - 1);

  const points = data
    .map((v, i) => {
      const x = i * stepX;
      const y = pad + innerH - ((v - minVal) / range) * innerH;
      return `${x},${y}`;
    })
    .join(' ');

  const areaPath = [
    `M 0,${pad + innerH - ((data[0] - minVal) / range) * innerH}`,
    ...data.map((v, i) => {
      const x = i * stepX;
      const y = pad + innerH - ((v - minVal) / range) * innerH;
      return `L ${x},${y}`;
    }),
    `L ${width},${height}`,
    `L 0,${height}`,
    'Z',
  ].join(' ');

  const gradId = `mc-spark-${width}-${height}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Sparkline trend"
      className="shrink-0"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={(data.length - 1) * stepX}
        cy={pad + innerH - ((data[data.length - 1] - minVal) / range) * innerH}
        r={2}
        fill={color}
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Target progress bar
// ---------------------------------------------------------------------------

function TargetBar({
  current,
  target,
  size,
}: {
  current: number;
  target: number;
  size: SizeConfig;
}) {
  const pct = target > 0 ? Math.min(100, (current / target) * 100) : 0;
  const isOnTrack = pct >= 100;

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-0.5">
        <span className={cn(size.subSize)} style={{ color: 'var(--text-secondary)' }}>
          Target
        </span>
        <span className={cn(size.subSize, 'font-medium')} style={{ color: 'var(--text-secondary)' }}>
          {Math.round(pct)}%
        </span>
      </div>
      <div
        className="w-full h-1.5 rounded-full overflow-hidden"
        style={{ backgroundColor: 'var(--surface-muted, #e5e7eb)' }}
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Target progress: ${Math.round(pct)}%`}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${pct}%`,
            backgroundColor: isOnTrack
              ? 'var(--state-success-text, #16a34a)'
              : 'var(--interactive-primary, #3b82f6)',
          }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/** Period-over-period metric comparison card with trend, optional target bar, and sparkline. */
export function MetricComparisonCard({
  title,
  currentValue,
  previousValue,
  format = 'number',
  currencySymbol = 'TRY',
  period,
  target,
  sparklineData,
  size = 'md',
  invertTrend = false,
  className,
  access,
  accessReason,
}: MetricComparisonCardProps) {
  const accessState = resolveAccessState(access);
  const { isHidden } = accessState;
  if (isHidden) return null;

  const s = SIZE_CONFIGS[size] ?? SIZE_CONFIGS.md;

  // Calculate trend
  const trendInfo = useMemo(() => {
    if (previousValue === 0 && currentValue === 0) {
      return { direction: 'flat' as TrendDirection, pct: 0 };
    }
    if (previousValue === 0) {
      return { direction: 'up' as TrendDirection, pct: 100 };
    }
    const change = ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
    const direction: TrendDirection = change > 0.5 ? 'up' : change < -0.5 ? 'down' : 'flat';
    return { direction, pct: Math.abs(Math.round(change * 10) / 10) };
  }, [currentValue, previousValue]);

  const trendColor = getTrendColor(trendInfo.direction, invertTrend);
  const trendIcon = getTrendIcon(trendInfo.direction);

  // Format values
  const formatOpts = { format, currency: currencySymbol };
  const formattedCurrent = formatValue(currentValue, formatOpts);
  const formattedPrevious = formatValue(previousValue, formatOpts);

  // Determine change sign for display
  const changeSign = trendInfo.direction === 'up' ? '+' : trendInfo.direction === 'down' ? '-' : '';
  const absoluteChange = Math.abs(currentValue - previousValue);
  const formattedChange = formatValue(absoluteChange, formatOpts);

  return (
    <div
      className={cn(
        'rounded-lg border',
        s.padding,
        accessStyles(accessState.state),
        className,
      )}
      style={{
        borderColor: 'var(--border-default)',
        backgroundColor: 'var(--surface-default)',
      }}
      role="region"
      aria-label={`${title} metric comparison`}
      data-component="metric-comparison-card"
      data-access-state={accessState.state}
      {...(accessReason ? { title: accessReason } : {})}
    >
      {/* Header row: title + sparkline */}
      <div className="flex items-start justify-between gap-2">
        <span
          className={cn(s.titleSize, 'font-medium')}
          style={{ color: 'var(--text-secondary)' }}
        >
          {title}
        </span>
        {sparklineData && sparklineData.length >= 2 && (
          <Sparkline
            data={sparklineData}
            width={s.sparkW}
            height={s.sparkH}
            color={trendColor}
          />
        )}
      </div>

      {/* Current value */}
      <div className="flex items-baseline gap-2 mt-1">
        <span
          className={cn(s.valueSize, 'font-bold tracking-tight')}
          style={{ color: 'var(--text-primary)' }}
        >
          {formattedCurrent}
        </span>

        {/* Trend badge */}
        <span
          className={cn(
            s.trendSize,
            'inline-flex items-center gap-0.5 font-semibold',
          )}
          style={{ color: trendColor }}
          aria-label={`${trendInfo.direction === 'up' ? 'Increased' : trendInfo.direction === 'down' ? 'Decreased' : 'No change'} by ${trendInfo.pct}%`}
        >
          <span aria-hidden="true">{trendIcon}</span>
          {trendInfo.pct}%
        </span>
      </div>

      {/* Previous value + change */}
      <div
        className={cn('flex items-center gap-2 mt-1', s.subSize)}
        style={{ color: 'var(--text-tertiary)' }}
      >
        <span>
          {period?.previous ?? 'Previous'}: {formattedPrevious}
        </span>
        <span style={{ color: trendColor }}>
          ({changeSign}{formattedChange})
        </span>
      </div>

      {/* Period labels */}
      {period && (
        <div
          className={cn('mt-1', s.subSize)}
          style={{ color: 'var(--text-tertiary)' }}
        >
          {period.current}
        </div>
      )}

      {/* Target bar */}
      {typeof target === 'number' && (
        <TargetBar current={currentValue} target={target} size={s} />
      )}
    </div>
  );
}

MetricComparisonCard.displayName = 'MetricComparisonCard';

export default MetricComparisonCard;
