/**
 * ChartAriaLive — Aria-live region for chart update announcements
 *
 * Announces chart data changes to screen readers via aria-live polite region.
 * Debounces rapid updates to avoid overwhelming assistive technology.
 *
 * @see chart-viz-engine-selection D-009 (a11y)
 */
import React, { useEffect, useRef, useState } from "react";

export interface ChartAriaLiveProps {
  /** The announcement message to relay to screen readers. */
  message: string;
  /** Politeness level. @default "polite" */
  politeness?: "polite" | "assertive";
  /** Debounce delay in ms to avoid rapid-fire announcements. @default 300 */
  debounceMs?: number;
}

/**
 * Invisible aria-live region that announces chart updates to screen readers.
 *
 * @example
 * ```tsx
 * <ChartAriaLive
 *   message={`Chart updated: ${data.length} data points loaded`}
 * />
 * ```
 */
export function ChartAriaLive({
  message,
  politeness = "polite",
  debounceMs = 300,
}: ChartAriaLiveProps) {
  const [announced, setAnnounced] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!message) return;

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      // Toggle between empty and message to force re-announcement
      setAnnounced("");
      requestAnimationFrame(() => setAnnounced(message));
    }, debounceMs);

    return () => clearTimeout(timerRef.current);
  }, [message, debounceMs]);

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
      style={{
        position: "absolute",
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        borderWidth: 0,
      }}
    >
      {announced}
    </div>
  );
}
