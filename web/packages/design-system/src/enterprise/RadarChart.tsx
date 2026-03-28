import React from 'react';
import { cn } from '../utils/cn';
import {
  resolveAccessState,
  accessStyles,
  type AccessControlledProps,
} from '../internal/access-controller';

// ── Types ──

export interface RadarAxis {
  key: string;
  label: string;
  /** Max value for this axis (default uses global max) */
  max?: number;
}

export interface RadarSeries {
  id: string;
  label: string;
  /** Values keyed by axis key */
  values: Record<string, number>;
  color?: string;
  fillOpacity?: number;
}

/** Props for the RadarChart component. */
export interface RadarChartProps extends AccessControlledProps {
  axes: RadarAxis[];
  series: RadarSeries[];
  /** Chart size in px (default 300) */
  size?: number;
  /** Number of concentric grid levels (default 5) */
  levels?: number;
  /** Show axis labels (default true) */
  showLabels?: boolean;
  /** Show legend for multiple series (default true) */
  showLegend?: boolean;
  /** Show value tooltip on hover */
  showTooltip?: boolean;
  /** Color palette for series without explicit color */
  palette?: string[];
  /** Additional class names */
  className?: string;
}

// ── Default palette ──

const DEFAULT_PALETTE = [
  'var(--action-primary)',
  'var(--state-info-text)',
  'var(--state-success-text)',
  'var(--state-warning-text)',
  'var(--state-error-text)',
  'var(--chart-purple)',
  'var(--chart-pink)',
  'var(--chart-cyan)',
];

// ── Helpers ──

function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleRad: number,
): { x: number; y: number } {
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad),
  };
}

function getAngleForIndex(index: number, total: number): number {
  // Start from top (-PI/2), go clockwise
  return (2 * Math.PI * index) / total - Math.PI / 2;
}

// ── Component ──

/**
 * Multi-axis radar/spider chart comparing one or more data series on a radial grid.
 *
 * @example
 * ```tsx
 * <RadarChart
 *   axes={[{ key: 'speed', label: 'Speed' }, { key: 'power', label: 'Power' }]}
 *   series={[{ id: 'car-a', label: 'Car A', values: { speed: 80, power: 90 } }]}
 *   size={300}
 * />
 * ```
 */
export const RadarChart: React.FC<RadarChartProps> = ({
  axes,
  series,
  size = 300,
  levels = 5,
  showLabels = true,
  showLegend = true,
  showTooltip = true,
  palette = DEFAULT_PALETTE,
  className,
  access,
  accessReason,
}) => {
  const accessState = resolveAccessState(access);
  if (accessState.isHidden) return null;

  const [hoveredPoint, setHoveredPoint] = React.useState<{
    seriesId: string;
    axisKey: string;
    value: number;
    x: number;
    y: number;
  } | null>(null);

  const numAxes = axes.length;
  if (numAxes < 3) {
    return (
      <div className={cn('p-4 text-center text-sm text-[var(--text-tertiary)]', className)}>
        Radar chart requires at least 3 axes
      </div>
    );
  }

  const margin = showLabels ? 50 : 20;
  const svgSize = size + margin * 2;
  const cx = svgSize / 2;
  const cy = svgSize / 2;
  const maxRadius = size / 2;

  // Compute global max per axis
  const axisMaxMap = new Map<string, number>();
  for (const axis of axes) {
    if (axis.max !== undefined) {
      axisMaxMap.set(axis.key, axis.max);
    } else {
      let maxVal = 0;
      for (const s of series) {
        maxVal = Math.max(maxVal, s.values[axis.key] ?? 0);
      }
      axisMaxMap.set(axis.key, maxVal || 1);
    }
  }

  // Concentric grid polygons
  const gridPolygons: string[] = [];
  for (let level = 1; level <= levels; level++) {
    const r = (level / levels) * maxRadius;
    const points = axes.map((_, i) => {
      const angle = getAngleForIndex(i, numAxes);
      const p = polarToCartesian(cx, cy, r, angle);
      return `${p.x},${p.y}`;
    });
    gridPolygons.push(points.join(' '));
  }

  // Axis lines
  const axisLines = axes.map((_, i) => {
    const angle = getAngleForIndex(i, numAxes);
    return polarToCartesian(cx, cy, maxRadius, angle);
  });

  // Axis labels
  const axisLabelPositions = axes.map((axis, i) => {
    const angle = getAngleForIndex(i, numAxes);
    const labelR = maxRadius + 18;
    const pos = polarToCartesian(cx, cy, labelR, angle);

    // Determine text anchor based on position
    let anchor: 'start' | 'middle' | 'end' = 'middle';
    if (pos.x < cx - 10) anchor = 'end';
    else if (pos.x > cx + 10) anchor = 'start';

    let baseline: 'auto' | 'hanging' | 'central' = 'central';
    if (pos.y < cy - maxRadius * 0.8) baseline = 'auto';
    else if (pos.y > cy + maxRadius * 0.8) baseline = 'hanging';

    return { ...pos, anchor, baseline, label: axis.label };
  });

  // Series polygons and data points
  const seriesData = series.map((s, sIdx) => {
    const color = s.color ?? palette[sIdx % palette.length];
    const fillOpacity = s.fillOpacity ?? 0.2;

    const points = axes.map((axis, i) => {
      const val = s.values[axis.key] ?? 0;
      const maxVal = axisMaxMap.get(axis.key) ?? 1;
      const r = (val / maxVal) * maxRadius;
      const angle = getAngleForIndex(i, numAxes);
      return polarToCartesian(cx, cy, r, angle);
    });

    const polygonStr = points.map((p) => `${p.x},${p.y}`).join(' ');

    return { series: s, color, fillOpacity, points, polygonStr };
  });

  const legendHeight = showLegend && series.length > 1 ? 32 : 0;

  return (
    <div
      className={cn(
        'inline-flex flex-col items-center',
        accessStyles(accessState.state),
        className,
      )}
      data-component="radar-chart"
      data-access-state={accessState.state}
      title={accessReason}
    >
      <svg
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        role="img"
        aria-label="Radar chart"
      >
        {/* Grid polygons */}
        {gridPolygons.map((pts, i) => (
          <polygon
            key={`grid-${i}`}
            points={pts}
            fill="none"
            stroke="var(--border-default)"
            strokeWidth={0.5}
            opacity={0.6}
          />
        ))}

        {/* Axis lines */}
        {axisLines.map((end, i) => (
          <line
            key={`axis-${i}`}
            x1={cx}
            y1={cy}
            x2={end.x}
            y2={end.y}
            stroke="var(--border-default)"
            strokeWidth={0.5}
            opacity={0.6}
          />
        ))}

        {/* Axis labels */}
        {showLabels &&
          axisLabelPositions.map((lbl, i) => (
            <text
              key={`label-${i}`}
              x={lbl.x}
              y={lbl.y}
              textAnchor={lbl.anchor}
              dominantBaseline={lbl.baseline}
              fontSize={11}
              fontWeight={500}
              fill="var(--text-secondary)"
            >
              {lbl.label}
            </text>
          ))}

        {/* Series polygons */}
        {seriesData.map((sd) => (
          <polygon
            key={`poly-${sd.series.id}`}
            points={sd.polygonStr}
            fill={sd.color}
            fillOpacity={sd.fillOpacity}
            stroke={sd.color}
            strokeWidth={2}
            strokeLinejoin="round"
          />
        ))}

        {/* Data points (dots) */}
        {seriesData.map((sd) =>
          sd.points.map((pt, i) => {
            const axis = axes[i];
            const val = sd.series.values[axis.key] ?? 0;
            const isHovered =
              hoveredPoint?.seriesId === sd.series.id && hoveredPoint?.axisKey === axis.key;

            return (
              <circle
                key={`dot-${sd.series.id}-${axis.key}`}
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? 5 : 3}
                fill={sd.color}
                stroke="var(--surface-default)"
                strokeWidth={1.5}
                className="cursor-crosshair"
                onMouseEnter={() =>
                  setHoveredPoint({
                    seriesId: sd.series.id,
                    axisKey: axis.key,
                    value: val,
                    x: pt.x,
                    y: pt.y,
                  })
                }
                onMouseLeave={() => setHoveredPoint(null)}
              />
            );
          }),
        )}

        {/* Tooltip */}
        {showTooltip && hoveredPoint && (
          <g style={{ pointerEvents: 'none' }}>
            <rect
              x={hoveredPoint.x + 8}
              y={hoveredPoint.y - 24}
              width={Math.max(60, String(hoveredPoint.value).length * 8 + 20)}
              height={22}
              rx={4}
              fill="var(--surface-default)"
              stroke="var(--border-default)"
              strokeWidth={1}
            />
            <text
              x={hoveredPoint.x + 14}
              y={hoveredPoint.y - 10}
              fontSize={11}
              fontWeight={600}
              fill="var(--text-primary)"
            >
              {hoveredPoint.axisKey}: {hoveredPoint.value}
            </text>
          </g>
        )}
      </svg>

      {/* Legend */}
      {showLegend && series.length > 1 && (
        <div
          className="flex flex-wrap items-center justify-center gap-4 mt-2"
          style={{ minHeight: legendHeight }}
        >
          {seriesData.map((sd) => (
            <div key={`legend-${sd.series.id}`} className="flex items-center gap-1.5 text-xs">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: sd.color }}
              />
              <span className="text-text-secondary">{sd.series.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

RadarChart.displayName = 'RadarChart';
export default RadarChart;
