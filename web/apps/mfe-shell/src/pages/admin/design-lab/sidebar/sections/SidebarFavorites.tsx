import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSidebarFavorites, useDragDrop } from "../hooks";

/* ------------------------------------------------------------------ */
/*  SidebarFavorites — pinned items with drag-drop reorder             */
/* ------------------------------------------------------------------ */

type Props = {
  className?: string;
  defaultCollapsed?: boolean;
};

export const SidebarFavorites: React.FC<Props> = ({ className, defaultCollapsed = false }) => {
  const { favorites, toggle, reorder } = useSidebarFavorites();
  const navigate = useNavigate();
  const { getDragProps, isDragging } = useDragDrop(favorites, reorder);
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  if (favorites.length === 0) return null;

  return (
    <div className={`px-1 py-1 ${className ?? ""}`}>
      {/* Header — clickable to collapse */}
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="flex w-full items-center justify-between px-2 py-1 rounded hover:bg-surface-canvas transition-colors cursor-pointer"
      >
        <span className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
          Favorites
        </span>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-text-tertiary tabular-nums">
            {favorites.length}
          </span>
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

      {/* Items — collapsible with animation */}
      <div
        className={`
          overflow-hidden transition-all duration-200
          ${collapsed ? "max-h-0 opacity-0" : "max-h-[500px] opacity-100"}
        `}
      >
        <div className="space-y-px mt-0.5">
          {favorites.map((fav, i) => (
            <div
              key={fav.name}
              {...getDragProps(i)}
              className={`
                group flex items-center gap-2 px-2 py-1.5 rounded-md
                hover:bg-surface-canvas transition-colors cursor-pointer
                ${isDragging ? "cursor-grabbing" : "cursor-grab"}
                ${getDragProps(i).className}
              `}
            >
              {/* Drag handle */}
              <span className="opacity-0 group-hover:opacity-50 text-text-tertiary cursor-grab" aria-hidden>
                <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                  <circle cx="5" cy="4" r="1.5" />
                  <circle cx="11" cy="4" r="1.5" />
                  <circle cx="5" cy="8" r="1.5" />
                  <circle cx="11" cy="8" r="1.5" />
                  <circle cx="5" cy="12" r="1.5" />
                  <circle cx="11" cy="12" r="1.5" />
                </svg>
              </span>

              <button
                type="button"
                onClick={() => navigate(fav.path)}
                className="flex-1 text-left text-[13px] text-text-primary truncate"
              >
                {fav.name}
              </button>

              {/* Unpin button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(fav);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-state-warning-text hover:text-state-danger-text cursor-pointer"
                aria-label={`Unpin ${fav.name}`}
                title="Remove from favorites"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

SidebarFavorites.displayName = "SidebarFavorites";
