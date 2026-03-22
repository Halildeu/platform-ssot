import React from "react";
import { cn } from "../../utils/cn";

/* ------------------------------------------------------------------ */
/*  Descriptions — Key-value grid for displaying structured metadata  */
/* ------------------------------------------------------------------ */

export interface DescriptionsItem {
  key: string;
  label: React.ReactNode;
  value?: React.ReactNode;
  helper?: React.ReactNode;
  tone?: "default" | "info" | "success" | "warning" | "danger";
  span?: 1 | 2 | 3;
}

export interface DescriptionsProps {
  items: DescriptionsItem[];
  title?: React.ReactNode;
  description?: React.ReactNode;
  columns?: 1 | 2 | 3;
  density?: "comfortable" | "compact";
  bordered?: boolean;
  emptyStateLabel?: React.ReactNode;
  localeText?: { emptyFallbackDescription?: React.ReactNode };
  fullWidth?: boolean;
  className?: string;
}

const TONE_BORDER: Record<string, string> = {
  info: "border-s-[var(--state-info-border)]",
  success: "border-s-[var(--state-success-border)]",
  warning: "border-s-[var(--state-warning-border)]",
  danger: "border-s-[var(--state-danger-border)]",
};

export const Descriptions: React.FC<DescriptionsProps> = ({
  items,
  title,
  description,
  columns = 2,
  density = "comfortable",
  bordered = false,
  emptyStateLabel,
  localeText,
  fullWidth = false,
  className,
}) => {
  const isCompact = density === "compact";
  const cellPadding = isCompact ? "py-2 px-3" : "py-4 px-4";

  if (items.length === 0) {
    const emptyMsg =
      emptyStateLabel ??
      localeText?.emptyFallbackDescription ??
      "No data available";

    return (
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
        <div className="flex items-center justify-center py-12 text-sm text-[var(--text-secondary)]">
          {emptyMsg}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(fullWidth ? "w-full" : "max-w-4xl", className)}>
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

      <dl
        className={cn(
          "grid",
          bordered &&
            "border border-[var(--border-subtle)] rounded-lg overflow-hidden",
        )}
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }}
      >
        {items.map((item) => {
          const tone = item.tone ?? "default";
          const hasToneBorder = tone !== "default";

          return (
            <div
              key={item.key}
              className={cn(
                cellPadding,
                bordered &&
                  "border-b border-r border-[var(--border-subtle)] last:border-b-0 [&:nth-last-child(-n+1)]:border-b-0",
                hasToneBorder && "border-s-2",
                hasToneBorder && TONE_BORDER[tone],
              )}
              style={
                item.span && item.span > 1
                  ? { gridColumn: `span ${item.span}` }
                  : undefined
              }
            >
              <dt className="text-xs font-medium text-[var(--text-secondary)] mb-1">
                {item.label}
              </dt>
              <dd className="text-sm text-[var(--text-primary)]">
                {item.value ?? "\u2014"}
              </dd>
              {item.helper && (
                <dd className="mt-0.5 text-xs text-[var(--text-secondary)]">
                  {item.helper}
                </dd>
              )}
            </div>
          );
        })}
      </dl>
    </div>
  );
};

Descriptions.displayName = "Descriptions";
