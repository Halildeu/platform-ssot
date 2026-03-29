import React from "react";
import { cn, Text } from "@mfe/design-system";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface KPICardTrend {
  /** Direction of the trend arrow. */
  direction: "up" | "down" | "flat";
  /** Display value (e.g. "+12.4%", "-3.2%"). */
  value: string;
  /** Whether this trend is positive for the metric. @default true for "up" */
  positive?: boolean;
}

export interface KPICardProps {
  /** Metric title / label. */
  title: string;
  /** Metric value (formatted string or number). */
  value: string | number;
  /** Secondary text below the value. */
  subtitle?: string;
  /** Trend indicator with direction + label. */
  trend?: KPICardTrend;
  /** Optional chart element rendered below the value (SparklineChart, MiniChart, etc.). */
  chart?: React.ReactNode;
  /** Optional icon rendered in the top-left. */
  icon?: React.ReactNode;
  /** Additional class name. */
  className?: string;
  /** Click handler — adds hover/cursor styles when provided. */
  onClick?: () => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const KPICard = React.forwardRef<HTMLDivElement, KPICardProps>(
  function KPICard(
    { title, value, subtitle, trend, chart, icon, className, onClick, ...rest },
    forwardedRef,
  ) {
    const isPositive = trend
      ? trend.positive ?? trend.direction === "up"
      : false;

    const trendColor = trend
      ? isPositive
        ? "var(--state-success-text))"
        : trend.direction === "flat"
          ? "var(--text-secondary))"
          : "var(--state-error-text))"
      : undefined;

    return (
      <div
        ref={forwardedRef}
        className={cn(
          "overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-default)] p-5",
          onClick && "cursor-pointer transition-shadow hover:shadow-md",
          className,
        )}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick}
        onKeyDown={
          onClick
            ? (e: React.KeyboardEvent) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined
        }
        aria-label={`${title}: ${value}${trend ? `, trend ${trend.direction} ${trend.value}` : ""}`}
        data-testid="kpi-card"
        {...rest}
      >
        {/* ---- header row: icon + title ---- */}
        <div className="flex items-center gap-2">
          {icon && (
            <span className="shrink-0 text-[var(--text-secondary)]" aria-hidden="true">
              {icon}
            </span>
          )}
          <Text
            as="div"
            className="text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]"
          >
            {title}
          </Text>
        </div>

        {/* ---- value + trend row ---- */}
        <div className="mt-2 flex items-end gap-2">
          <Text
            as="div"
            className="text-2xl font-bold leading-none text-[var(--text-primary)]"
          >
            {value}
          </Text>

          {trend && (
            <span
              className="mb-0.5 inline-flex items-center gap-0.5 text-xs font-semibold"
              style={{ color: trendColor }}
            >
              {trend.direction === "up" && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M7 3L11.5 8.5H2.5L7 3Z" fill="currentColor" />
                </svg>
              )}
              {trend.direction === "down" && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M7 11L2.5 5.5H11.5L7 11Z" fill="currentColor" />
                </svg>
              )}
              {trend.direction === "flat" && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path
                    d="M2.5 7H11.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              )}
              {trend.value}
            </span>
          )}
        </div>

        {/* ---- subtitle ---- */}
        {subtitle && (
          <Text className="mt-1 text-[11px] text-[var(--text-secondary)]">
            {subtitle}
          </Text>
        )}

        {/* ---- optional chart area ---- */}
        {chart && <div className="mt-3">{chart}</div>}
      </div>
    );
  },
);

KPICard.displayName = "KPICard";

export default KPICard;
