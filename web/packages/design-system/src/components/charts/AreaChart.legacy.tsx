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

export interface AreaChartProps extends AccessControlledProps {
  /** Series to render as filled areas. */
  series: ChartSeries[];
  /** X-axis labels. */
  labels: string[];
  /** Visual size variant. @default "md" */
  size?: ChartSize;
  /** Stack areas on top of each other. @default false */
  stacked?: boolean;
  /** Show dot markers at data points. @default true */
  showDots?: boolean;
  /** Show grid lines. @default true */
  showGrid?: boolean;
  /** Show legend below the chart. @default false */
  showLegend?: boolean;
  /** Use gradient fills instead of flat color. @default true */
  gradient?: boolean;
  /** Use bezier curves instead of straight lines. @default false */
  curved?: boolean;
  /** Custom value formatter. */
  valueFormatter?: (value: number) => string;
  /** Animate on mount. @default true */
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

/** Fallback hex colors for gradient stops (CSS vars can't be used in stop-color reliably). */
const DEFAULT_HEX_COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
];

const PADDING = { top: 20, right: 20, bottom: 40, left: 50 };

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function buildPoints(
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

function pointsToStraightPath(pts: Array<[number, number]>): string {
  if (pts.length < 1) return "";
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i][0]},${pts[i][1]}`;
  }
  return d;
}

function closePath(
  linePath: string,
  pts: Array<[number, number]>,
  baseY: number,
): string {
  if (pts.length < 2) return "";
  return `${linePath} L ${pts[pts.length - 1][0]},${baseY} L ${pts[0][0]},${baseY} Z`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const AreaChart = React.forwardRef<HTMLDivElement, AreaChartProps>(
  function AreaChart(
    {
      series,
      labels,
      size = "md",
      stacked = false,
      showDots = true,
      showGrid = true,
      showLegend = false,
      gradient = true,
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
    const baseY = PADDING.top + chartH;
    const count = labels.length;

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
          data-testid="area-chart-empty"
          {...rest}
        >
          {noDataText}
        </div>
      );
    }

    /* ---- stacking ---- */
    let stackedData: number[][] | null = null;
    let effectiveMax: number;

    if (stacked && series.length > 1) {
      stackedData = [];
      const base = new Array(count).fill(0);
      for (const s of series) {
        const row = s.data.map((v, i) => base[i] + v);
        stackedData.push(row);
        s.data.forEach((v, i) => {
          base[i] += v;
        });
      }
      effectiveMax = Math.max(...base, 1);
    } else {
      effectiveMax = Math.max(...allValues, 1);
    }

    const ticks = 5;
    const tickStep = effectiveMax / ticks;
    const ariaLabel = [title, description].filter(Boolean).join(" — ") || "Area chart";

    return (
      <div
        ref={forwardedRef}
        className={cn(
          "w-full max-w-full",
          accessState.isDisabled && "opacity-50",
          className,
        )}
        title={accessReason}
        data-testid="area-chart"
        {...rest}
      >
        {title && (
          <div
            className="text-sm font-medium text-[var(--text-primary)] mb-1"
            data-testid="area-chart-title"
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

          {/* Gradient defs */}
          {gradient && (
            <defs>
              {series.map((s, si) => {
                const hex = s.color ?? DEFAULT_HEX_COLORS[si % DEFAULT_HEX_COLORS.length];
                return (
                  <linearGradient
                    key={`grad-${si}`}
                    id={`area-grad-${si}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={hex} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={hex} stopOpacity={0.05} />
                  </linearGradient>
                );
              })}
            </defs>
          )}

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
                  data-testid="area-chart-grid-line"
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
                data-testid="area-chart-label"
              >
                {label}
              </text>
            );
          })}

          {/* Areas (render in reverse so first series is on top) */}
          {[...series].reverse().map((s, reverseIdx) => {
            const si = series.length - 1 - reverseIdx;
            const color = s.color ?? DEFAULT_COLORS[si % DEFAULT_COLORS.length];
            const dataToUse = stackedData ? stackedData[si] : s.data;
            const pts = buildPoints(dataToUse, effectiveMax, chartW, chartH, count);
            const linePath = curved
              ? pointsToCurvedPath(pts)
              : pointsToStraightPath(pts);
            const areaPath = closePath(linePath, pts, baseY);
            const fillColor = gradient ? `url(#area-grad-${si})` : color;

            return (
              <g key={si} data-testid="area-chart-series">
                {/* Filled area */}
                <path
                  d={areaPath}
                  fill={fillColor}
                  opacity={gradient ? 1 : 0.25}
                  data-testid="area-chart-area"
                />

                {/* Stroke line on top */}
                <path
                  d={linePath}
                  fill="none"
                  stroke={color}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  data-testid="area-chart-line"
                  style={
                    animate
                      ? {
                          strokeDasharray: 1000,
                          strokeDashoffset: 1000,
                          animation: "area-chart-draw 1s ease-out forwards",
                        }
                      : undefined
                  }
                />

                {/* Dots */}
                {showDots &&
                  pts.map(([x, y], di) => (
                    <circle
                      key={di}
                      cx={x}
                      cy={y}
                      r={3}
                      fill={color}
                      data-testid="area-chart-dot"
                    >
                      <title>{`${s.name}: ${formatValue(dataToUse[di])}`}</title>
                    </circle>
                  ))}
              </g>
            );
          })}

          {/* Animation keyframes */}
          {animate && (
            <style>{`
              @keyframes area-chart-draw {
                to { stroke-dashoffset: 0; }
              }
            `}</style>
          )}
        </svg>

        {/* Legend */}
        {showLegend && (
          <div
            className="flex flex-wrap gap-3 mt-2"
            data-testid="area-chart-legend"
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

AreaChart.displayName = "AreaChart";

export default AreaChart;
