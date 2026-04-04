/**
 * ChartLoadingState — Skeleton/spinner placeholder while chart data loads
 *
 * @see chart-viz-engine-selection D-010 (error states)
 */
import React from "react";

export interface ChartLoadingStateProps {
  /** Height of the loading placeholder. @default 300 */
  height?: number;
  /** Loading message for screen readers. @default "Loading chart..." */
  message?: string;
  /** Additional class name. */
  className?: string;
}

export function ChartLoadingState({
  height = 300,
  message = "Loading chart...",
  className,
}: ChartLoadingStateProps) {
  return (
    <div
      role="status"
      aria-label={message}
      className={className}
      style={{
        height,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-muted, #f9fafb)",
        borderRadius: 8,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Shimmer animation */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, transparent 0%, var(--bg-surface, #ffffff) 50%, transparent 100%)",
          animation: "chart-shimmer 1.5s ease-in-out infinite",
        }}
      />
      <span
        style={{
          position: "relative",
          color: "var(--text-secondary, #6b7280)",
          fontSize: 13,
          fontFamily: "var(--font-family-sans, Inter, system-ui, sans-serif)",
        }}
      >
        {message}
      </span>
      <style>{`
        @keyframes chart-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .chart-shimmer { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
