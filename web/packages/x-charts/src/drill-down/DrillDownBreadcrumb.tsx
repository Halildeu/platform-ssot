/**
 * DrillDownBreadcrumb — Accessible breadcrumb navigation for chart drill-down
 *
 * Renders a nav > ol > li trail from the drill path.
 * Click any crumb to navigate back to that level.
 *
 * @see feature_execution_contract (P2 DoD #6)
 */
import React from "react";
import type { BreadcrumbItem } from "./useDrillDown";

export interface DrillDownBreadcrumbProps {
  /** Breadcrumb items from useDrillDown. */
  items: BreadcrumbItem[];
  /** Click handler for navigation. */
  onNavigate: (index: number) => void;
  /** Additional class name. */
  className?: string;
}

export function DrillDownBreadcrumb({
  items,
  onNavigate,
  className,
}: DrillDownBreadcrumbProps) {
  if (items.length <= 1) return null;

  return (
    <nav
      aria-label="Drill-down breadcrumb"
      className={className}
      data-testid="drill-down-breadcrumb"
    >
      <ol
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          listStyle: "none",
          margin: 0,
          padding: 0,
          fontSize: 13,
          fontFamily: "var(--font-family-sans, Inter, system-ui, sans-serif)",
        }}
      >
        {items.map((item, i) => (
          <li
            key={item.index}
            style={{ display: "flex", alignItems: "center", gap: 4 }}
          >
            {i > 0 && (
              <span
                aria-hidden="true"
                style={{ color: "var(--text-tertiary, #9ca3af)", fontSize: 11 }}
              >
                /
              </span>
            )}
            {item.isCurrent ? (
              <span
                aria-current="page"
                style={{
                  color: "var(--text-primary, #1a1a2e)",
                  fontWeight: 600,
                }}
              >
                {item.label}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate(item.index)}
                style={{
                  background: "none",
                  border: "none",
                  padding: "2px 4px",
                  margin: 0,
                  cursor: "pointer",
                  color: "var(--action-primary, #3b82f6)",
                  borderRadius: 4,
                  fontSize: "inherit",
                  fontFamily: "inherit",
                }}
                aria-label={`Navigate to ${item.label}`}
              >
                {item.label}
              </button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
