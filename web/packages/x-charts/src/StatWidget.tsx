import React, { useMemo } from "react";
import { cn, Text } from "@mfe/design-system";
import { SparklineChart } from "./SparklineChart";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface StatWidgetProps {
  /** Stat label / description. */
  label: string;
  /** Current value (raw or pre-formatted). */
  value: string | number;
  /** Previous value — used to auto-compute change percentage. */
  previousValue?: number;
  /** Value formatting mode. @default "number" */
  format?: "number" | "currency" | "percent";
  /** Decimal precision. @default 0 */
  precision?: number;
  /** Prefix prepended to the formatted value (e.g. "$", "TRY"). */
  prefix?: string;
  /** Suffix appended to the formatted value (e.g. "users", "ms"). */
  suffix?: string;
  /** Sparkline data rendered below the value. */
  sparkData?: number[];
  /** Additional class name. */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatValue(
  raw: string | number,
  format: "number" | "currency" | "percent",
  precision: number,
  prefix?: string,
  suffix?: string,
): string {
  if (typeof raw === "string") return raw;

  let formatted: string;
  switch (format) {
    case "currency":
      formatted = raw.toLocaleString(undefined, {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      });
      break;
    case "percent":
      formatted = `${(raw * 100).toFixed(precision)}%`;
      break;
    default:
      formatted = raw.toLocaleString(undefined, {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      });
  }

  return `${prefix ?? ""}${formatted}${suffix ? ` ${suffix}` : ""}`;
}

function computeChange(current: string | number, previous: number): number | null {
  const curr = typeof current === "string" ? parseFloat(current) : current;
  if (isNaN(curr) || previous === 0) return null;
  return ((curr - previous) / Math.abs(previous)) * 100;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const StatWidget = React.forwardRef<HTMLDivElement, StatWidgetProps>(
  function StatWidget(
    {
      label,
      value,
      previousValue,
      format = "number",
      precision = 0,
      prefix,
      suffix,
      sparkData,
      className,
      ...rest
    },
    forwardedRef,
  ) {
    const formattedValue = useMemo(
      () => formatValue(value, format, precision, prefix, suffix),
      [value, format, precision, prefix, suffix],
    );

    const change = useMemo(
      () => (previousValue != null ? computeChange(value, previousValue) : null),
      [value, previousValue],
    );

    const hasSparkline = sparkData && sparkData.length > 0;
    const changeColor =
      change == null
        ? undefined
        : change > 0
          ? "var(--state-success-text))"
          : change < 0
            ? "var(--state-error-text))"
            : "var(--text-secondary))";

    return (
      <div
        ref={forwardedRef}
        className={cn(
          "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default)] px-4 py-3",
          className,
        )}
        aria-label={`${label}: ${formattedValue}${change != null ? `, change ${change > 0 ? "+" : ""}${change.toFixed(1)}%` : ""}`}
        data-testid="stat-widget"
        {...rest}
      >
        {/* ---- top row: label + change badge ---- */}
        <div className="flex items-center justify-between gap-2">
          <Text
            as="span"
            className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-secondary)]"
          >
            {label}
          </Text>

          {change != null && (
            <span
              className="inline-flex items-center gap-0.5 text-[11px] font-semibold"
              style={{ color: changeColor }}
            >
              {change > 0 && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M5 1.5L8.5 6H1.5L5 1.5Z" fill="currentColor" />
                </svg>
              )}
              {change < 0 && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M5 8.5L1.5 4H8.5L5 8.5Z" fill="currentColor" />
                </svg>
              )}
              {change > 0 ? "+" : ""}
              {change.toFixed(1)}%
            </span>
          )}
        </div>

        {/* ---- value ---- */}
        <Text
          as="div"
          className="mt-1 text-xl font-bold leading-none text-[var(--text-primary)]"
        >
          {formattedValue}
        </Text>

        {/* ---- optional sparkline ---- */}
        {hasSparkline && (
          <div className="mt-2">
            <SparklineChart
              data={sparkData}
              type="area"
              width={160}
              height={24}
              color={
                change != null && change >= 0
                  ? "var(--state-success-text))"
                  : change != null && change < 0
                    ? "var(--state-error-text))"
                    : "var(--action-primary))"
              }
              className="w-full"
            />
          </div>
        )}
      </div>
    );
  },
);

StatWidget.displayName = "StatWidget";

export default StatWidget;
