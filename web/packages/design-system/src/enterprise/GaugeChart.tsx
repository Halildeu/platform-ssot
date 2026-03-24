import React from 'react';
import { cn } from '../utils/cn';
import {
  resolveAccessState,
  accessStyles,
  type AccessControlledProps,
} from '../internal/access-controller';

// ── Types ──

/** Single threshold definition for the gauge color zones. */
export interface GaugeThreshold {
  /** Upper value boundary for this zone */
  value: number;
  /** Fill color for the zone arc */
  color: string;
  /** Optional label displayed alongside the zone */
  label?: string;
}

/**
 * Props for the GaugeChart component.
 *
 * @example
 * ```tsx
 * <GaugeChart
 *   value={72}
 *   min={0}
 *   max={100}
 *   label="CPU Usage"
 *   unit="%"
 *   thresholds={[
 *     { value: 33, color: 'var(--state-success-text)', label: 'Low' },
 *     { value: 66, color: 'var(--state-warning-text)', label: 'Medium' },
 *     { value: 100, color: 'var(--state-danger-text)', label: 'High' },
 *   ]}
 * />
 * ```
 *
 * @since 1.0.0
 * @see GaugeThreshold
 */
export interface GaugeChartProps extends AccessControlledProps {
  /** Current gauge value */
  value: number;
  /** Minimum scale value (default 0) */
  min?: number;
  /** Maximum scale value (default 100) */
  max?: number;
  /** Label text displayed below the gauge */
  label?: string;
  /** Unit suffix displayed next to the value (e.g. "%", "ms") */
  unit?: string;
  /** Color threshold zones — sorted by ascending value */
  thresholds?: GaugeThreshold[];
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show the numeric value in the center */
  showValue?: boolean;
  /** Whether to show the label below */
  showLabel?: boolean;
  /** Animate needle on value change */
  animate?: boolean;
  /** Additional class names */
  className?: string;
}

// ── Helpers ──

const SIZE_MAP = {
  sm: { diameter: 120, strokeWidth: 10, valueFontSize: 18, unitFontSize: 10, labelFontSize: 10, needleLength: 38 },
  md: { diameter: 200, strokeWidth: 14, valueFontSize: 28, unitFontSize: 14, labelFontSize: 13, needleLength: 65 },
  lg: { diameter: 280, strokeWidth: 18, valueFontSize: 38, unitFontSize: 18, labelFontSize: 16, needleLength: 92 },
} as const;

const DEFAULT_THRESHOLDS: GaugeThreshold[] = [
  { value: 33, color: 'var(--state-danger-text)', label: 'Low' },
  { value: 66, color: 'var(--state-warning-text)', label: 'Medium' },
  { value: 100, color: 'var(--state-success-text)', label: 'High' },
];

/**
 * Convert a 0-1 ratio to an angle in degrees.
 * The gauge spans 180 degrees, from 180 (left) to 0 (right).
 */
function ratioToAngle(ratio: number): number {
  return 180 - ratio * 180;
}

/**
 * Convert degrees to radians.
 */
function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Compute an SVG arc path for a semi-circle segment.
 */
function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
): string {
  const startRad = degToRad(startAngle);
  const endRad = degToRad(endAngle);
  const x1 = cx + radius * Math.cos(startRad);
  const y1 = cy - radius * Math.sin(startRad);
  const x2 = cx + radius * Math.cos(endRad);
  const y2 = cy - radius * Math.sin(endRad);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  // SVG arc: sweep-flag = 0 because we go from endAngle toward startAngle visually (counter-clockwise in SVG space)
  return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 0 ${x2} ${y2}`;
}

/**
 * Get the color for the current value from thresholds.
 */
function getValueColor(value: number, min: number, max: number, thresholds: GaugeThreshold[]): string {
  const normalized = ((value - min) / (max - min)) * 100;
  const sorted = [...thresholds].sort((a, b) => a.value - b.value);
  for (const t of sorted) {
    const tNorm = ((t.value - min) / (max - min)) * 100;
    if (normalized <= tNorm) return t.color;
  }
  return sorted[sorted.length - 1]?.color ?? 'var(--text-secondary)';
}

// ── Component ──

/**
 * **GaugeChart** — a speedometer-style gauge for displaying a single metric value.
 *
 * Renders a semi-circular arc with color threshold zones, a needle indicator,
 * and centered value text. Supports three size variants and smooth CSS-animated
 * needle transitions.
 *
 * @example
 * ```tsx
 * <GaugeChart value={75} label="Performance" unit="%" size="lg" />
 * ```
 *
 * @since 1.0.0
 * @see GaugeChartProps
 * @see GaugeThreshold
 */
export function GaugeChart({
  value,
  min = 0,
  max = 100,
  label,
  unit,
  thresholds,
  size = 'md',
  showValue = true,
  showLabel = true,
  animate = true,
  className,
  access,
}: GaugeChartProps) {
  const { isHidden, isDisabled, state } = resolveAccessState(access);

  if (isHidden) return null;

  const dims = SIZE_MAP[size];
  const { diameter, strokeWidth, valueFontSize, unitFontSize, labelFontSize, needleLength } = dims;
  const radius = (diameter - strokeWidth) / 2;
  const cx = diameter / 2;
  const cy = diameter / 2 + strokeWidth / 2;

  // SVG total height is a semi-circle plus some bottom space for label
  const svgWidth = diameter;
  const svgHeight = diameter / 2 + strokeWidth + (showLabel && label ? labelFontSize + 12 : 8);

  const resolvedThresholds = thresholds ?? DEFAULT_THRESHOLDS;
  const sortedThresholds = [...resolvedThresholds].sort((a, b) => a.value - b.value);

  // Clamp the value within bounds
  const clampedValue = Math.min(Math.max(value, min), max);
  const ratio = (clampedValue - min) / (max - min);
  const needleAngle = ratioToAngle(ratio);
  const valueColor = getValueColor(clampedValue, min, max, sortedThresholds);

  // ── Build threshold arcs ──
  const arcs: React.ReactNode[] = [];
  let prevRatio = 0;
  for (let i = 0; i < sortedThresholds.length; i++) {
    const t = sortedThresholds[i];
    const tRatio = Math.min(1, Math.max(0, (t.value - min) / (max - min)));
    if (tRatio <= prevRatio) continue;

    const startAngle = ratioToAngle(prevRatio);
    const endAngle = ratioToAngle(tRatio);

    arcs.push(
      <path
        key={`zone-${i}`}
        d={describeArc(cx, cy, radius, startAngle, endAngle)}
        fill="none"
        stroke={t.color}
        strokeWidth={strokeWidth}
        strokeLinecap="butt"
        opacity={0.3}
      />,
    );
    prevRatio = tRatio;
  }

  // ── Value fill arc ──
  const fillStartAngle = 180;
  const fillEndAngle = ratioToAngle(ratio);

  // ── Needle coordinates ──
  const needleRad = degToRad(needleAngle);
  const needleTipX = cx + needleLength * Math.cos(needleRad);
  const needleTipY = cy - needleLength * Math.sin(needleRad);
  const needleBaseSize = strokeWidth * 0.35;
  const perpRad = needleRad + Math.PI / 2;
  const base1X = cx + needleBaseSize * Math.cos(perpRad);
  const base1Y = cy - needleBaseSize * Math.sin(perpRad);
  const base2X = cx - needleBaseSize * Math.cos(perpRad);
  const base2Y = cy + needleBaseSize * Math.sin(perpRad);

  // Formatted value
  const displayValue = Number.isInteger(clampedValue)
    ? clampedValue.toString()
    : clampedValue.toFixed(1);

  return (
    <div
      className={cn(
        'gauge-chart-root inline-flex flex-col items-center',
        accessStyles(state),
        className,
      )}
      role="img"
      aria-label={`Gauge chart${label ? `: ${label}` : ''} — ${displayValue}${unit ?? ''}`}
      aria-valuenow={clampedValue}
      aria-valuemin={min}
      aria-valuemax={max}
      data-testid="gauge-chart"
    >
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background track */}
        <path
          d={describeArc(cx, cy, radius, 0, 180)}
          fill="none"
          stroke="var(--border-default)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Threshold zone arcs */}
        {arcs}

        {/* Filled arc showing current value */}
        {ratio > 0.005 && (
          <path
            d={describeArc(cx, cy, radius, fillEndAngle, fillStartAngle)}
            fill="none"
            stroke={valueColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            opacity={0.85}
          />
        )}

        {/* Tick marks at threshold boundaries */}
        {sortedThresholds.map((t, i) => {
          const tRatio = Math.min(1, Math.max(0, (t.value - min) / (max - min)));
          const angle = ratioToAngle(tRatio);
          const rad = degToRad(angle);
          const innerR = radius - strokeWidth / 2 - 2;
          const outerR = radius + strokeWidth / 2 + 2;
          return (
            <line
              key={`tick-${i}`}
              x1={cx + innerR * Math.cos(rad)}
              y1={cy - innerR * Math.sin(rad)}
              x2={cx + outerR * Math.cos(rad)}
              y2={cy - outerR * Math.sin(rad)}
              stroke="var(--surface-primary)"
              strokeWidth={2}
            />
          );
        })}

        {/* Needle */}
        <g
          style={{
            transition: animate ? 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1)' : undefined,
            transformOrigin: `${cx}px ${cy}px`,
          }}
        >
          <polygon
            points={`${needleTipX},${needleTipY} ${base1X},${base1Y} ${base2X},${base2Y}`}
            fill={valueColor}
            opacity={isDisabled ? 0.4 : 0.9}
          />
          {/* Center pivot circle */}
          <circle
            cx={cx}
            cy={cy}
            r={strokeWidth * 0.45}
            fill="var(--surface-primary)"
            stroke={valueColor}
            strokeWidth={2}
          />
        </g>

        {/* Value text */}
        {showValue && (
          <text
            x={cx}
            y={cy - valueFontSize * 0.25}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={valueFontSize}
            fontWeight={700}
            fill="var(--text-primary)"
          >
            {displayValue}
            {unit && (
              <tspan fontSize={unitFontSize} fill="var(--text-secondary)">
                {' '}{unit}
              </tspan>
            )}
          </text>
        )}

        {/* Min / Max labels */}
        <text
          x={cx - radius - strokeWidth / 2}
          y={cy + labelFontSize + 4}
          textAnchor="start"
          fontSize={labelFontSize * 0.8}
          fill="var(--text-secondary)"
        >
          {min}
        </text>
        <text
          x={cx + radius + strokeWidth / 2}
          y={cy + labelFontSize + 4}
          textAnchor="end"
          fontSize={labelFontSize * 0.8}
          fill="var(--text-secondary)"
        >
          {max}
        </text>

        {/* Bottom label */}
        {showLabel && label && (
          <text
            x={cx}
            y={cy + labelFontSize + 10}
            textAnchor="middle"
            fontSize={labelFontSize}
            fill="var(--text-secondary)"
            fontWeight={500}
          >
            {label}
          </text>
        )}
      </svg>
    </div>
  );
}

GaugeChart.displayName = "GaugeChart";
