import React, { useMemo } from "react";
import { cn } from "@mfe/design-system";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type ChartSize = "sm" | "md" | "lg";

export type GaugeThreshold = {
  /** Upper bound of this threshold zone (inclusive). */
  value: number;
  /** CSS color or custom property for this zone. */
  color: string;
};

export interface GaugeChartProps {
  /** Current value to display on the gauge. */
  value: number;
  /** Minimum scale value. @default 0 */
  min?: number;
  /** Maximum scale value. @default 100 */
  max?: number;
  /** Label displayed below the value. */
  label?: string;
  /** Visual size variant. @default "md" */
  size?: ChartSize;
  /** Colour thresholds — zones painted on the arc.
   *  Must be sorted ascending by `value`.
   *  Defaults to green / amber / red at 60 / 80 / 100. */
  thresholds?: GaugeThreshold[];
  /** Chart title. */
  title?: string;
  /** Additional class name. */
  className?: string;
  /** Custom value formatter. */
  valueFormatter?: (value: number) => string;
  /** Text shown when no value is provided. @default "Veri yok" */
  noDataText?: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const SIZE_DIM: Record<ChartSize, number> = { sm: 160, md: 240, lg: 320 };

const DEFAULT_THRESHOLDS: GaugeThreshold[] = [
  { value: 60, color: "var(--state-success-text))" },
  { value: 80, color: "var(--state-warning-text))" },
  { value: 100, color: "var(--state-error-text))" },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Convert a value within [min, max] to an angle on the 180-degree arc. */
function valueToAngle(value: number, min: number, max: number): number {
  const ratio = Math.max(0, Math.min(1, (value - min) / (max - min)));
  // Arc goes from -180 (left) to 0 (right), i.e. the bottom half-circle
  return -180 + ratio * 180;
}

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/** SVG arc path from startAngle to endAngle (degrees). */
function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const start = polarToXY(cx, cy, r, startDeg);
  const end = polarToXY(cx, cy, r, endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const GaugeChart = React.forwardRef<HTMLDivElement, GaugeChartProps>(
  function GaugeChart(
    {
      value,
      min = 0,
      max = 100,
      label,
      size = "md",
      thresholds,
      title,
      className,
      valueFormatter,
      noDataText = "Veri yok",
      ...rest
    },
    forwardedRef,
  ) {
    const dim = SIZE_DIM[size];
    const isEmpty = value == null;

    const zones = thresholds ?? DEFAULT_THRESHOLDS;

    const svgContent = useMemo(() => {
      if (isEmpty) return null;

      const cx = dim / 2;
      const cy = dim * 0.6; // push centre down so the arc sits nicely
      const outerR = dim * 0.42;
      const innerR = outerR * 0.72;
      const midR = (outerR + innerR) / 2;
      const strokeW = outerR - innerR;

      /* ---- threshold arcs ---- */
      let prevAngle = -180;
      const arcs = zones.map((z, i) => {
        const endAngle = valueToAngle(Math.min(z.value, max), min, max);
        const d = arcPath(cx, cy, midR, prevAngle, endAngle);
        prevAngle = endAngle;
        return (
          <path
            key={`zone-${i}`}
            d={d}
            fill="none"
            stroke={z.color}
            strokeWidth={strokeW}
            strokeLinecap="butt"
            opacity="0.25"
          />
        );
      });

      /* ---- value arc (solid overlay) ---- */
      const needleAngle = valueToAngle(value, min, max);
      const valuePath = arcPath(cx, cy, midR, -180, needleAngle);

      // Determine which zone the current value falls into
      const activeZone = zones.find((z) => value <= z.value) ?? zones[zones.length - 1];

      /* ---- needle tick ---- */
      const tip = polarToXY(cx, cy, outerR + 4, needleAngle);
      const tail = polarToXY(cx, cy, innerR - 4, needleAngle);

      const displayValue = valueFormatter ? valueFormatter(value) : String(Math.round(value));

      return (
        <>
          {/* background track */}
          <path
            d={arcPath(cx, cy, midR, -180, 0)}
            fill="none"
            stroke="var(--border-subtle))"
            strokeWidth={strokeW}
            strokeLinecap="butt"
          />
          {/* threshold zones */}
          {arcs}
          {/* value arc */}
          <path
            d={valuePath}
            fill="none"
            stroke={activeZone.color}
            strokeWidth={strokeW}
            strokeLinecap="round"
          />
          {/* needle */}
          <line
            x1={tail.x}
            y1={tail.y}
            x2={tip.x}
            y2={tip.y}
            stroke="var(--text-primary))"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* centre dot */}
          <circle cx={cx} cy={cy} r="4" fill="var(--text-primary))" />
          {/* value text */}
          <text
            x={cx}
            y={cy + 20}
            textAnchor="middle"
            fontSize={dim * 0.09}
            fontWeight="600"
            fill="var(--text-primary))"
          >
            {displayValue}
          </text>
          {/* label */}
          {label && (
            <text
              x={cx}
              y={cy + 36}
              textAnchor="middle"
              fontSize="11"
              fill="var(--text-secondary))"
            >
              {label}
            </text>
          )}
          {/* min / max */}
          <text
            x={cx - outerR}
            y={cy + 14}
            textAnchor="middle"
            fontSize="10"
            fill="var(--text-tertiary))"
          >
            {min}
          </text>
          <text
            x={cx + outerR}
            y={cy + 14}
            textAnchor="middle"
            fontSize="10"
            fill="var(--text-tertiary))"
          >
            {max}
          </text>
        </>
      );
    }, [value, min, max, label, dim, zones, valueFormatter, isEmpty]);

    /* ---- empty state ---- */
    if (isEmpty) {
      return (
        <div
          ref={forwardedRef}
          className={cn(
            "inline-flex items-center justify-center text-sm text-[var(--text-secondary)]",
            className,
          )}
          style={{ width: dim, height: dim * 0.7 }}
          role="img"
          aria-label={title ?? "Gauge chart — no data"}
          data-testid="gauge-chart-empty"
          {...rest}
        >
          {noDataText}
        </div>
      );
    }

    return (
      <div
        ref={forwardedRef}
        className={cn("w-full", className)}
        data-testid="gauge-chart"
        {...rest}
      >
        {title && (
          <div className="mb-1 text-sm font-semibold text-[var(--text-primary)]">{title}</div>
        )}
        <svg
          viewBox={`0 0 ${dim} ${dim * 0.7}`}
          width="100%"
          height={dim * 0.7}
          role="img"
          aria-label={
            title
              ? `${title}: ${valueFormatter ? valueFormatter(value) : value}`
              : `Gauge: ${valueFormatter ? valueFormatter(value) : value}`
          }
        >
          {svgContent}
        </svg>
      </div>
    );
  },
);

GaugeChart.displayName = "GaugeChart";

export default GaugeChart;
