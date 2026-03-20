import React from "react";
import { cn } from "../../utils/cn";
import {
  resolveAccessState,
  type AccessControlledProps,
} from "../../internal/access-controller";
import type { ChartSize, ChartSeries, ChartLocaleText } from "./types";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface LineChartProps extends AccessControlledProps {
  /** Series to render as lines. */
  series: ChartSeries[];
  /** X-axis labels. */
  labels: string[];
  /** Visual size variant. @default "md" */
  size?: ChartSize;
  /** Show dot markers at data points. @default true */
  showDots?: boolean;
  /** Show grid lines. @default true */
  showGrid?: boolean;
  /** Show legend below the chart. @default false */
  showLegend?: boolean;
  /** Fill area under the lines. @default false */
  showArea?: boolean;
  /** Use bezier curves instead of straight lines. @default false */
  curved?: boolean;
  /** Custom value formatter. */
  valueFormatter?: (value: number) => string;
  /** Animate line drawing on mount. @default true */
  animate?: boolean;
  /** Chart title. */
  title?: string;
  /** Accessible description. */
  description?: string;
  /** Locale overrides. */
  localeText?: ChartLocaleText;
  /** Additional class name. */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const SIZE_HEIGHT: Record<ChartSize, number> = { sm: 200, md: 300, lg: 400 };

const DEFAULT_COLORS = [
  "var(--chart-1, #3b82f6)",
  "var(--chart-2, #10b981)",
  "var(--chart-3, #f59e0b)",
  "var(--chart-4, #ef4444)",
  "var(--chart-5, #8b5cf6)",
];

const PADDING = { top: 20, right: 20, bottom: 40, left: 50 };

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function buildPolylinePoints(
  data: number[],
  maxValue: number,
  chartW: number,
  chartH: number,
  count: number,
): Array<[number, number]> {
  return data.map((v, i) => {
    const x = PADDING.left + (count > 1 ? (i / (count - 1)) * chartW : chartW / 2);
    const y = PADDING.top + chartH - (v / maxValue) * chartH;
    return [x, y];
  });
}

function pointsToPolyline(pts: Array<[number, number]>): string {
  return pts.map(([x, y]) => `${x},${y}`).join(" ");
}

function pointsToCurvedPath(pts: Array<[number, number]>): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const cpx1 = prev[0] + (curr[0] - prev[0]) * 0.4;
    const cpx2 = prev[0] + (curr[0] - prev[0]) * 0.6;
    d += ` C ${cpx1},${prev[1]} ${cpx2},${curr[1]} ${curr[0]},${curr[1]}`;
  }
  return d;
}

function pointsToAreaPath(
  pts: Array<[number, number]>,
  chartH: number,
  curved: boolean,
): string {
  if (pts.length < 2) return "";
  const baseY = PADDING.top + chartH;
  if (curved) {
    const linePath = pointsToCurvedPath(pts);
    return `${linePath} L ${pts[pts.length - 1][0]},${baseY} L ${pts[0][0]},${baseY} Z`;
  }
  const lineStr = pts.map(([x, y]) => `L ${x},${y}`).join(" ");
  return `M ${pts[0][0]},${baseY} ${lineStr} L ${pts[pts.length - 1][0]},${baseY} Z`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const LineChart = React.forwardRef<HTMLDivElement, LineChartProps>(
  function LineChart(
    {
      series,
      labels,
      size = "md",
      showDots = true,
      showGrid = true,
      showLegend = false,
      showArea = false,
      curved = false,
      valueFormatter,
      animate = true,
      title,
      description,
      localeText,
      className,
      access = "full",
      accessReason,
      ...rest
    },
    forwardedRef,
  ) {
    const accessState = resolveAccessState(access);
    if (accessState.isHidden) return null;

    const formatValue = valueFormatter ?? ((v: number) => String(v));
    const noDataText = localeText?.noData ?? "Veri yok";
    const height = SIZE_HEIGHT[size];
    const width = Math.round(height * 1.6);
    const chartW = width - PADDING.left - PADDING.right;
    const chartH = height - PADDING.top - PADDING.bottom;

    const allValues = series.flatMap((s) => s.data);
    const hasData = series.length > 0 && allValues.length > 0;

    /* ---- empty state ---- */
    if (!hasData) {
      return (
        <div
          ref={forwardedRef}
          className={cn(
            "inline-flex items-center justify-center text-sm text-[var(--text-secondary)]",
            accessState.isDisabled && "opacity-50",
            className,
          )}
          style={{ width, height }}
          title={accessReason}
          data-testid="line-chart-empty"
          {...rest}
        >
          {noDataText}
        </div>
      );
    }

    const maxValue = Math.max(...allValues, 1);
    const ticks = 5;
    const tickStep = maxValue / ticks;
    const count = labels.length;

    const ariaLabel = [title, description].filter(Boolean).join(" — ") || "Line chart";

    return (
      <div
        ref={forwardedRef}
        className={cn(
          "w-full max-w-full",
          accessState.isDisabled && "opacity-50",
          className,
        )}
        title={accessReason}
        data-testid="line-chart"
        {...rest}
      >
        {title && (
          <div
            className="text-sm font-medium text-[var(--text-primary)] mb-1"
            data-testid="line-chart-title"
          >
            {title}
          </div>
        )}

        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={ariaLabel}
          className="w-full h-auto"
          style={{ overflow: "visible", maxWidth: width }}
        >
          {description && <desc>{description}</desc>}

          {/* Grid lines */}
          {showGrid &&
            Array.from({ length: ticks + 1 }, (_, i) => {
              const y = PADDING.top + chartH - (i / ticks) * chartH;
              return (
                <line
                  key={`grid-${i}`}
                  x1={PADDING.left}
                  y1={y}
                  x2={PADDING.left + chartW}
                  y2={y}
                  stroke="var(--border-subtle)"
                  strokeWidth={1}
                  data-testid="line-chart-grid-line"
                />
              );
            })}

          {/* Y-axis tick labels */}
          {Array.from({ length: ticks + 1 }, (_, i) => {
            const val = Math.round(tickStep * i);
            const y = PADDING.top + chartH - (i / ticks) * chartH;
            return (
              <text
                key={`tick-${i}`}
                x={PADDING.left - 8}
                y={y + 4}
                textAnchor="end"
                fontSize={10}
                fill="var(--text-secondary)"
              >
                {formatValue(val)}
              </text>
            );
          })}

          {/* X-axis labels */}
          {labels.map((label, i) => {
            const x = PADDING.left + (count > 1 ? (i / (count - 1)) * chartW : chartW / 2);
            return (
              <text
                key={`label-${i}`}
                x={x}
                y={PADDING.top + chartH + 16}
                textAnchor="middle"
                fontSize={10}
                fill="var(--text-secondary)"
                data-testid="line-chart-label"
              >
                {label}
              </text>
            );
          })}

          {/* Series */}
          {series.map((s, si) => {
            const color = s.color ?? DEFAULT_COLORS[si % DEFAULT_COLORS.length];
            const pts = buildPolylinePoints(s.data, maxValue, chartW, chartH, count);

            return (
              <g key={si} data-testid="line-chart-series">
                {/* Area fill */}
                {showArea && (
                  <path
                    d={pointsToAreaPath(pts, chartH, curved)}
                    fill={color}
                    opacity={0.15}
                    data-testid="line-chart-area"
                  />
                )}

                {/* Line */}
                {curved ? (
                  <path
                    d={pointsToCurvedPath(pts)}
                    fill="none"
                    stroke={color}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    data-testid="line-chart-line"
                    style={
                      animate
                        ? {
                            strokeDasharray: 1000,
                            strokeDashoffset: 1000,
                            animation: "line-chart-draw 1s ease-out forwards",
                          }
                        : undefined
                    }
                  />
                ) : (
                  <polyline
                    points={pointsToPolyline(pts)}
                    fill="none"
                    stroke={color}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    data-testid="line-chart-line"
                    style={
                      animate
                        ? {
                            strokeDasharray: 1000,
                            strokeDashoffset: 1000,
                            animation: "line-chart-draw 1s ease-out forwards",
                          }
                        : undefined
                    }
                  />
                )}

                {/* Dots */}
                {showDots &&
                  pts.map(([x, y], di) => (
                    <circle
                      key={di}
                      cx={x}
                      cy={y}
                      r={3}
                      fill={color}
                      data-testid="line-chart-dot"
                    >
                      <title>{`${s.name}: ${formatValue(s.data[di])}`}</title>
                    </circle>
                  ))}
              </g>
            );
          })}

          {/* Animation keyframes */}
          {animate && (
            <style>{`
              @keyframes line-chart-draw {
                to { stroke-dashoffset: 0; }
              }
            `}</style>
          )}
        </svg>

        {/* Legend */}
        {showLegend && (
          <div
            className="flex flex-wrap gap-3 mt-2"
            data-testid="line-chart-legend"
          >
            {series.map((s, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-sm"
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

LineChart.displayName = "LineChart";

export default LineChart;
