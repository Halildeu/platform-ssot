/**
 * DataVolumeIndicator — Row count badge for filtered data
 *
 * Shows the number of data points/rows currently visible,
 * with a loading spinner when queries are in flight.
 *
 * @see feature_execution_contract_chart_platform (P2 DoD #17)
 */
import React from "react";

export interface DataVolumeIndicatorProps {
  /** Number of visible data points/rows. */
  count: number;
  /** Total unfiltered count (if known). */
  total?: number;
  /** Whether a query is currently loading. */
  isLoading?: boolean;
  /** Label for the count. @default "rows" */
  label?: string;
  /** Additional class name. */
  className?: string;
}

export function DataVolumeIndicator({
  count,
  total,
  isLoading = false,
  label = "rows",
  className,
}: DataVolumeIndicatorProps) {
  const formatted = count.toLocaleString();
  const totalFormatted = total?.toLocaleString();

  return (
    <span
      role="status"
      aria-live="polite"
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12,
        fontFamily: "var(--font-family-sans, Inter, system-ui, sans-serif)",
        color: "var(--text-secondary, #6b7280)",
        padding: "2px 8px",
        borderRadius: 4,
        background: "var(--bg-muted, #f9fafb)",
      }}
      data-testid="data-volume-indicator"
    >
      {isLoading && (
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            border: "2px solid var(--border-default, #e5e7eb)",
            borderTopColor: "var(--action-primary, #3b82f6)",
            animation: "dvi-spin 0.6s linear infinite",
          }}
          aria-hidden="true"
        />
      )}
      <span>
        {formatted}
        {totalFormatted && ` / ${totalFormatted}`}
        {" "}{label}
      </span>
      <style>{`@keyframes dvi-spin { to { transform: rotate(360deg); } }`}</style>
    </span>
  );
}
