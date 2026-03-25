import React from "react";
import { useNavigate } from "react-router-dom";
import { useSidebarFavorites } from "../hooks";

/* ------------------------------------------------------------------ */
/*  SidebarFavorites — pinned items (collapsible section)              */
/* ------------------------------------------------------------------ */

type Props = {
  className?: string;
};

export const SidebarFavorites: React.FC<Props> = ({ className }) => {
  const { favorites, toggle } = useSidebarFavorites();
  const navigate = useNavigate();

  if (favorites.length === 0) return null;

  return (
    <div className={`px-1 py-1 ${className ?? ""}`}>
      <div className="flex items-center justify-between px-2 py-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
          Favorites
        </span>
        <span className="text-[10px] text-text-tertiary tabular-nums">
          {favorites.length}
        </span>
      </div>
      <div className="space-y-px">
        {favorites.map((fav) => (
          <div
            key={fav.name}
            className="group flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-surface-canvas transition-colors cursor-pointer"
          >
            <button
              type="button"
              onClick={() => navigate(fav.path)}
              className="flex-1 text-left text-[13px] text-text-primary truncate"
            >
              {fav.name}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggle(fav);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-state-warning-text hover:text-state-danger-text"
              aria-label={`Unpin ${fav.name}`}
              title="Remove from favorites"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

SidebarFavorites.displayName = "SidebarFavorites";
