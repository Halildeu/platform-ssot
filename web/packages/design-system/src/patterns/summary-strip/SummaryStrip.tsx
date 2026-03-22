import React from "react";
import { cn } from "../../utils/cn";

/* ------------------------------------------------------------------ */
/*  SummaryStrip — Horizontal KPI / metric strip                      */
/* ------------------------------------------------------------------ */

export interface SummaryStripItem {
  key: React.Key;
  label: React.ReactNode;
  value: React.ReactNode;
  note?: React.ReactNode;
  trend?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: "default" | "info" | "success" | "warning";
}

export interface SummaryStripProps {
  items: SummaryStripItem[];
  title?: React.ReactNode;
  description?: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

const TONE_BORDER: Record<string, string> = {
  info: "border-s-[var(--state-info-border)]",
  success: "border-s-[var(--state-success-border)]",
  warning: "border-s-[var(--state-warning-border)]",
};

export const SummaryStrip: React.FC<SummaryStripProps> = ({
  items,
  title,
  description,
  columns = 4,
  className,
}) => (
  <div className={cn("w-full", className)}>
    {(title || description) && (
      <div className="mb-4">
        {title && (
          <h3 className="text-base font-semibold text-[var(--text-primary)]">
            {title}
          </h3>
        )}
        {description && (
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {description}
          </p>
        )}
      </div>
    )}

    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {items.map((item) => {
        const tone = item.tone ?? "default";
        const hasToneBorder = tone !== "default";

        return (
          <article
            key={item.key}
            className={cn(
              "relative rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-card,var(--surface-default))] px-4 py-4",
              hasToneBorder && "border-s-2",
              hasToneBorder && TONE_BORDER[tone],
            )}
          >
            {/* Trend badge — top-right */}
            {item.trend && (
              <div className="absolute top-3 right-3 text-xs font-medium">
                {item.trend}
              </div>
            )}

            {/* Icon */}
            {item.icon && (
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-[var(--surface-muted)] text-[var(--text-secondary)] [&>svg]:h-4 [&>svg]:w-4">
                {item.icon}
              </div>
            )}

            {/* Label */}
            <div className="text-xs font-medium text-[var(--text-secondary)]">
              {item.label}
            </div>

            {/* Value */}
            <div className="mt-1 text-2xl font-bold text-[var(--text-primary)]">
              {item.value}
            </div>

            {/* Note */}
            {item.note && (
              <div className="mt-1 text-xs text-[var(--text-secondary)]">
                {item.note}
              </div>
            )}
          </article>
        );
      })}
    </div>
  </div>
);

SummaryStrip.displayName = "SummaryStrip";
