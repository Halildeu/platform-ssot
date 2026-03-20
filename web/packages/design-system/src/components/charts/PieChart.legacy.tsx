import React from "react";
import { cn } from "../../utils/cn";
import {
  resolveAccessState,
  type AccessControlledProps,
} from "../../internal/access-controller";
import type { ChartSize, ChartDataPoint, ChartLocaleText } from "./types";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface PieChartProps extends AccessControlledProps {
  /** Data points to render as slices. */
  data: ChartDataPoint[];
  /** Visual size variant. @default "md" */
  size?: ChartSize;
  /** Donut mode (ring instead of filled). @default false */
  donut?: boolean;
  /** Show labels beside slices. @default false */
  showLabels?: boolean;
  /** Show legend below the chart. @default false */
  showLegend?: boolean;
  /** Show percentage on slices. @default false */
  showPercentage?: boolean;
  /** Custom value formatter. */
  valueFormatter?: (value: number) => string;
  /** Center content for donut mode. */
  innerLabel?: React.ReactNode;
  /** Animate slices on mount. @default true */
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

const SIZE_DIM: Record<ChartSize, number> = { sm: 200, md: 300, lg: 400 };

const DEFAULT_COLORS = [
  "var(--chart-1, #3b82f6)",
  "var(--chart-2, #10b981)",
  "var(--chart-3, #f59e0b)",
  "var(--chart-4, #ef4444)",
  "var(--chart-5, #8b5cf6)",
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

function describeSlice(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
): string {
  // Full circle special case
  if (endAngle - startAngle >= 359.99) {
    const r2 = r;
    return `M ${cx} ${cy - r2} A ${r2} ${r2} 0 1 1 ${cx - 0.001} ${cy - r2} Z`;
  }
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const PieChart = React.forwardRef<HTMLDivElement, PieChartProps>(
  function PieChart(
    {
      data,
      size = "md",
      donut = false,
      showLabels = false,
      showLegend = false,
      showPercentage = false,
      valueFormatter,
      innerLabel,
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
    const dim = SIZE_DIM[size];
    const cx = dim / 2;
    const cy = dim / 2;
    const radius = dim / 2 - 30; // leave room for labels
    const innerRadius = donut ? radius * 0.6 : 0;

    const validData = (data ?? []).filter((d) => d.value > 0);
    const total = validData.reduce((sum, d) => sum + d.value, 0);

    /* ---- empty state ---- */
    if (validData.length === 0) {
      return (
        <div
          ref={forwardedRef}
          className={cn(
            "inline-flex items-center justify-center text-sm text-[var(--text-secondary)]",
            accessState.isDisabled && "opacity-50",
            className,
          )}
          style={{ width: dim, height: dim }}
          title={accessReason}
          data-testid="pie-chart-empty"
          {...rest}
        >
          {noDataText}
        </div>
      );
    }

    const ariaLabel = [title, description].filter(Boolean).join(" — ") || "Pie chart";

    let currentAngle = 0;

    return (
      <div
        ref={forwardedRef}
        className={cn(
          "w-full max-w-full",
          accessState.isDisabled && "opacity-50",
          className,
        )}
        title={accessReason}
        data-testid="pie-chart"
        {...rest}
      >
        {title && (
          <div
            className="text-sm font-medium text-[var(--text-primary)] mb-1"
            data-testid="pie-chart-title"
          >
            {title}
          </div>
        )}

        <svg
          viewBox={`0 0 ${dim} ${dim}`}
          role="img"
          aria-label={ariaLabel}
          className="w-full h-auto"
          style={{ overflow: "visible", maxWidth: dim }}
        >
          {description && <desc>{description}</desc>}

          {validData.map((d, i) => {
            const sliceAngle = (d.value / total) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + sliceAngle;
            currentAngle = endAngle;

            const color = d.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length];
            const midAngle = startAngle + sliceAngle / 2;
            const labelPos = polarToCartesian(cx, cy, radius + 16, midAngle);
            const pct = Math.round((d.value / total) * 100);

            return (
              <g key={i} data-testid="pie-chart-slice">
                {/* Slice */}
                {donut ? (
                  <path
                    d={describeArc(cx, cy, radius, startAngle, endAngle)}
                    fill="none"
                    stroke={color}
                    strokeWidth={radius - innerRadius}
                    strokeLinecap="butt"
                  >
                    <title>{`${d.label}: ${formatValue(d.value)} (${pct}%)`}</title>
                  </path>
                ) : (
                  <path
                    d={describeSlice(cx, cy, radius, startAngle, endAngle)}
                    fill={color}
                    stroke="var(--bg-primary)"
                    strokeWidth={2}
                  >
                    <title>{`${d.label}: ${formatValue(d.value)} (${pct}%)`}</title>
                  </path>
                )}

                {/* Labels */}
                {(showLabels || showPercentage) && (
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={10}
                    fill="var(--text-secondary)"
                    data-testid="pie-chart-label"
                  >
                    {showLabels && showPercentage
                      ? `${d.label} (${pct}%)`
                      : showPercentage
                        ? `${pct}%`
                        : d.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Inner label for donut */}
          {donut && innerLabel && (
            <foreignObject
              x={cx - innerRadius}
              y={cy - innerRadius}
              width={innerRadius * 2}
              height={innerRadius * 2}
              data-testid="pie-chart-inner-label"
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {innerLabel}
              </div>
            </foreignObject>
          )}

          {/* Animation */}
          {animate && (
            <style>{`
              @keyframes pie-chart-spin {
                from { transform: rotate(-90deg); opacity: 0; }
                to { transform: rotate(0deg); opacity: 1; }
              }
            `}</style>
          )}
        </svg>

        {/* Legend */}
        {showLegend && (
          <div
            className="flex flex-wrap gap-3 mt-2"
            data-testid="pie-chart-legend"
          >
            {validData.map((d, i) => {
              const pct = Math.round((d.value / total) * 100);
              return (
                <div key={i} className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-sm"
                    style={{ backgroundColor: d.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length] }}
                  />
                  {d.label} ({pct}%)
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  },
);

PieChart.displayName = "PieChart";

export default PieChart;
