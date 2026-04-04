/**
 * MobileTooltip — Long-press tooltip for touch devices
 *
 * Positioned at the touch point, shows nearest data point info.
 * Disappears on touch end.
 *
 * @see feature_execution_contract (P2 DoD #15)
 */
import React from "react";

export interface MobileTooltipProps {
  /** Whether the tooltip is visible. */
  visible: boolean;
  /** Position to render at (viewport coordinates). */
  position: { x: number; y: number } | null;
  /** Content to display. */
  content: React.ReactNode;
  /** Additional class name. */
  className?: string;
}

export function MobileTooltip({
  visible,
  position,
  content,
  className,
}: MobileTooltipProps) {
  if (!visible || !position) return null;

  return (
    <div
      role="tooltip"
      className={className}
      style={{
        position: "fixed",
        left: position.x,
        top: position.y - 48,
        transform: "translateX(-50%)",
        padding: "6px 12px",
        borderRadius: 8,
        background: "var(--surface-overlay, rgba(0,0,0,0.85))",
        color: "var(--text-on-overlay, #fff)",
        fontSize: 13,
        fontFamily: "var(--font-family-sans, Inter, system-ui, sans-serif)",
        whiteSpace: "nowrap",
        pointerEvents: "none",
        zIndex: 9999,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
      data-testid="mobile-tooltip"
    >
      {content}
      {/* Arrow */}
      <div
        style={{
          position: "absolute",
          bottom: -6,
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderTop: "6px solid var(--surface-overlay, rgba(0,0,0,0.85))",
        }}
        aria-hidden="true"
      />
    </div>
  );
}
