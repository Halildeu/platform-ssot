/**
 * ChartErrorState — Error message + retry button for chart failures
 *
 * @see chart-viz-engine-selection D-010 (error states)
 */
import React from "react";

export interface ChartErrorStateProps {
  /** Height of the error state. @default 300 */
  height?: number;
  /** Error message. @default "Chart could not be loaded" */
  message?: string;
  /** Technical error detail (shown in smaller text). */
  detail?: string;
  /** Retry callback. */
  onRetry?: () => void;
  /** Retry button label. @default "Tekrar dene" */
  retryLabel?: string;
  /** Additional class name. */
  className?: string;
}

export function ChartErrorState({
  height = 300,
  message = "Chart could not be loaded",
  detail,
  onRetry,
  retryLabel = "Tekrar dene",
  className,
}: ChartErrorStateProps) {
  return (
    <div
      role="alert"
      className={className}
      style={{
        height,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        background: "var(--state-error-bg, #fef2f2)",
        borderRadius: 8,
        border: "1px solid var(--state-error-border, #fecaca)",
        fontFamily: "var(--font-family-sans, Inter, system-ui, sans-serif)",
      }}
      data-testid="chart-error-state"
    >
      {/* Error icon */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="16" cy="16" r="14" stroke="var(--state-error-text, #ef4444)" strokeWidth="2" />
        <line x1="16" y1="10" x2="16" y2="18" stroke="var(--state-error-text, #ef4444)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="16" cy="22" r="1.5" fill="var(--state-error-text, #ef4444)" />
      </svg>

      <span
        style={{
          color: "var(--state-error-text, #ef4444)",
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        {message}
      </span>

      {detail && (
        <span
          style={{
            color: "var(--text-secondary, #6b7280)",
            fontSize: 11,
            maxWidth: 300,
            textAlign: "center",
            fontFamily: "var(--font-family-mono, monospace)",
          }}
        >
          {detail}
        </span>
      )}

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          style={{
            marginTop: 4,
            padding: "6px 16px",
            fontSize: 13,
            fontWeight: 500,
            color: "#fff",
            background: "var(--state-error-text, #ef4444)",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}
