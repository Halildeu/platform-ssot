import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSidebarRecents, formatRelativeTime } from "../hooks";

/* ------------------------------------------------------------------ */
/*  SidebarRecentlyViewed — last 10 visited, collapsible               */
/* ------------------------------------------------------------------ */

type Props = {
  className?: string;
  defaultCollapsed?: boolean;
};

export const SidebarRecentlyViewed: React.FC<Props> = ({ className, defaultCollapsed = false }) => {
  const { recents, clear } = useSidebarRecents();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  if (recents.length === 0) return null;

  return (
    <div className={`px-1 py-1 ${className ?? ""}`}>
      {/* Header — clickable to collapse */}
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="flex w-full items-center justify-between px-2 py-1 rounded hover:bg-surface-canvas transition-colors cursor-pointer"
      >
        <span className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
          Recently Viewed
        </span>
        <div className="flex items-center gap-1">
          {recents.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clear();
              }}
              className="text-[9px] text-text-tertiary hover:text-state-danger-text transition-colors cursor-pointer"
              title="Clear history"
            >
              Clear
            </button>
          )}
          <svg
            className={`w-3 h-3 text-text-tertiary transition-transform duration-200 ${collapsed ? "" : "rotate-180"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {/* Items — collapsible */}
      <div
        className={`
          overflow-hidden transition-all duration-200
          ${collapsed ? "max-h-0 opacity-0" : "max-h-[300px] opacity-100"}
        `}
      >
        <div className="space-y-px mt-0.5">
          {recents.slice(0, 5).map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => navigate(item.path)}
              className="flex w-full items-center justify-between gap-2 px-2 py-1.5 rounded-md hover:bg-surface-canvas transition-colors text-left cursor-pointer"
            >
              <span className="text-[13px] text-text-primary truncate">
                {item.name}
              </span>
              <span className="text-[10px] text-text-tertiary whitespace-nowrap shrink-0">
                {formatRelativeTime(item.visitedAt)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

SidebarRecentlyViewed.displayName = "SidebarRecentlyViewed";
