import React, { useMemo } from "react";
import { cn } from "@mfe/design-system";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type ChartSize = "sm" | "md" | "lg";

export type RadarDataSeries = {
  name: string;
  values: number[];
  color?: string;
};

export interface RadarChartProps {
  /** One or more data series to plot on the radar. Each series.values array
   *  must have the same length as `categories`. */
  series: RadarDataSeries[];
  /** Axis labels around the perimeter. */
  categories: string[];
  /** Visual size variant. @default "md" */
  size?: ChartSize;
  /** Show concentric grid lines. @default true */
  showGrid?: boolean;
  /** Show legend below the chart. @default false */
  showLegend?: boolean;
  /** Fill the area enclosed by the data polygon. @default true */
  filled?: boolean;
  /** Chart title. */
  title?: string;
  /** Accessible description. */
  description?: string;
  /** Additional class name. */
  className?: string;
  /** Text shown when data is empty. @default "Veri yok" */
  noDataText?: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const SIZE_DIM: Record<ChartSize, number> = { sm: 200, md: 300, lg: 400 };

/** Design-token-based fallback palette using CSS custom properties. */
const DEFAULT_COLORS = [
  "var(--action-primary))",
  "var(--state-success-text))",
  "var(--state-warning-text))",
  "var(--state-error-text))",
  "var(--text-tertiary))",
];

const GRID_RINGS = 5;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const RadarChart = React.forwardRef<HTMLDivElement, RadarChartProps>(
  function RadarChart(
    {
      series,
      categories,
      size = "md",
      showGrid = true,
      showLegend = false,
      filled = true,
      title,
      description,
      className,
      noDataText = "Veri yok",
      ...rest
    },
    forwardedRef,
  ) {
    const dim = SIZE_DIM[size];
    const isEmpty =
      !series ||
      series.length === 0 ||
      !categories ||
      categories.length === 0;

    const svgContent = useMemo(() => {
      if (isEmpty) return null;

      const cx = dim / 2;
      const cy = dim / 2;
      const radius = dim * 0.38; // leave room for labels
      const angleStep = 360 / categories.length;

      // Determine the max value across all series for normalisation
      const maxVal = Math.max(
        ...series.flatMap((s) => s.values),
        1, // avoid division by zero
      );

      /* ---- grid rings ---- */
      const gridRings = showGrid
        ? Array.from({ length: GRID_RINGS }, (_, i) => {
            const r = (radius / GRID_RINGS) * (i + 1);
            const points = categories
              .map((_, j) => {
                const { x, y } = polarToCartesian(cx, cy, r, j * angleStep);
                return `${x},${y}`;
              })
              .join(" ");
            return (
              <polygon
                key={`ring-${i}`}
                points={points}
                fill="none"
                stroke="var(--border-subtle))"
                strokeWidth="0.5"
              />
            );
          })
        : null;

      /* ---- spokes ---- */
      const spokes = categories.map((_, i) => {
        const { x, y } = polarToCartesian(cx, cy, radius, i * angleStep);
        return (
          <line
            key={`spoke-${i}`}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke="var(--border-subtle))"
            strokeWidth="0.5"
          />
        );
      });

      /* ---- axis labels ---- */
      const labels = categories.map((cat, i) => {
        const { x, y } = polarToCartesian(cx, cy, radius + 16, i * angleStep);
        return (
          <text
            key={`label-${i}`}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="10"
            fill="var(--text-secondary))"
          >
            {cat}
          </text>
        );
      });

      /* ---- data polygons ---- */
      const polygons = series.map((s, si) => {
        const color = s.color ?? DEFAULT_COLORS[si % DEFAULT_COLORS.length];
        const points = s.values
          .map((v, j) => {
            const r = (v / maxVal) * radius;
            const { x, y } = polarToCartesian(cx, cy, r, j * angleStep);
            return `${x},${y}`;
          })
          .join(" ");

        return (
          <React.Fragment key={`series-${si}`}>
            <polygon
              points={points}
              fill={filled ? color : "none"}
              fillOpacity={filled ? 0.2 : 0}
              stroke={color}
              strokeWidth="2"
            />
            {/* dot markers */}
            {s.values.map((v, j) => {
              const r = (v / maxVal) * radius;
              const { x, y } = polarToCartesian(cx, cy, r, j * angleStep);
              return (
                <circle
                  key={`dot-${si}-${j}`}
                  cx={x}
                  cy={y}
                  r="3"
                  fill={color}
                />
              );
            })}
          </React.Fragment>
        );
      });

      return (
        <>
          {gridRings}
          {spokes}
          {polygons}
          {labels}
        </>
      );
    }, [series, categories, dim, showGrid, filled, isEmpty]);

    /* ---- empty state ---- */
    if (isEmpty) {
      return (
        <div
          ref={forwardedRef}
          className={cn(
            "inline-flex items-center justify-center text-sm text-[var(--text-secondary)]",
            className,
          )}
          style={{ width: dim, height: dim }}
          role="img"
          aria-label={title ?? "Radar chart — no data"}
          data-testid="radar-chart-empty"
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
        data-testid="radar-chart"
        {...rest}
      >
        {title && (
          <div className="mb-1 text-sm font-semibold text-[var(--text-primary)]">{title}</div>
        )}
        {description && (
          <div className="mb-2 text-[11px] text-[var(--text-secondary)]">{description}</div>
        )}

        <svg
          viewBox={`0 0 ${dim} ${dim}`}
          width="100%"
          height={dim}
          role="img"
          aria-label={title ?? "Radar chart"}
        >
          {svgContent}
        </svg>

        {/* ---- legend ---- */}
        {showLegend && (
          <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-[var(--text-secondary)]">
            {series.map((s, i) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: s.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length] }}
                />
                {s.name}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
);

RadarChart.displayName = "RadarChart";

export default RadarChart;
