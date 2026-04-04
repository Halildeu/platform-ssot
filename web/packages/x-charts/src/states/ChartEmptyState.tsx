/**
 * ChartEmptyState — Illustration + message when chart has no data
 *
 * @see chart-viz-engine-selection D-010 (error states)
 */
import React from "react";

export interface ChartEmptyStateProps {
  /** Height of the empty state. @default 300 */
  height?: number;
  /** Primary message. @default "Veri yok" */
  message?: string;
  /** Secondary description. */
  description?: string;
  /** Optional action button. */
  action?: { label: string; onClick: () => void };
  /** Additional class name. */
  className?: string;
}

export function ChartEmptyState({
  height = 300,
  message = "Veri yok",
  description,
  action,
  className,
}: ChartEmptyStateProps) {
  return (
    <div
      role="status"
      className={className}
      style={{
        height,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        background: "var(--bg-muted, #f9fafb)",
        borderRadius: 8,
        fontFamily: "var(--font-family-sans, Inter, system-ui, sans-serif)",
      }}
      data-testid="chart-empty-state"
    >
      {/* Empty chart icon */}
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
        style={{ opacity: 0.4 }}
      >
        <rect x="6" y="30" width="8" height="12" rx="2" fill="var(--text-secondary, #6b7280)" />
        <rect x="20" y="20" width="8" height="22" rx="2" fill="var(--text-secondary, #6b7280)" />
        <rect x="34" y="10" width="8" height="32" rx="2" fill="var(--text-secondary, #6b7280)" />
        <line x1="4" y1="44" x2="44" y2="44" stroke="var(--text-secondary, #6b7280)" strokeWidth="2" strokeLinecap="round" />
      </svg>

      <span
        style={{
          color: "var(--text-primary, #1a1a2e)",
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        {message}
      </span>

      {description && (
        <span
          style={{
            color: "var(--text-secondary, #6b7280)",
            fontSize: 12,
            maxWidth: 240,
            textAlign: "center",
          }}
        >
          {description}
        </span>
      )}

      {action && (
        <button
          type="button"
          onClick={action.onClick}
          style={{
            marginTop: 4,
            padding: "6px 16px",
            fontSize: 13,
            fontWeight: 500,
            color: "var(--action-primary, #3b82f6)",
            background: "transparent",
            border: "1px solid var(--action-primary, #3b82f6)",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
