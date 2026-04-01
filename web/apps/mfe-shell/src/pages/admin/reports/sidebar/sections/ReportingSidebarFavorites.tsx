import React from "react";
import { Star, X } from "lucide-react";
import { useReportingSidebarFavorites } from "../hooks";

/* ------------------------------------------------------------------ */
/*  ReportingSidebarFavorites — collapsible favorites list             */
/* ------------------------------------------------------------------ */

type Props = {
  onItemClick: (route: string) => void;
  activeRoute?: string;
};

export const ReportingSidebarFavorites: React.FC<Props> = ({
  onItemClick,
  activeRoute,
}) => {
  const { favorites, toggle } = useReportingSidebarFavorites();
  const [isOpen, setIsOpen] = React.useState(true);

  if (favorites.length === 0) return null;

  return (
    <div className="px-2 py-1">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-[11px] font-semibold text-text-secondary hover:text-text-primary"
      >
        <Star className="h-3 w-3" />
        <span className="flex-1 text-left">Favoriler</span>
        <span className="rounded-full bg-surface-muted px-1.5 text-[10px]">
          {favorites.length}
        </span>
      </button>

      {isOpen && (
        <div className="mt-0.5 space-y-0.5">
          {favorites.map((fav) => (
            <div
              key={fav.id}
              className={`group flex items-center gap-2 rounded-md px-2 py-1 text-xs cursor-pointer transition
                ${
                  activeRoute === fav.route
                    ? "bg-[color-mix(in_oklab,var(--action-primary)_10%,transparent)] text-[var(--action-primary)] font-medium"
                    : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
                }
              `}
            >
              <button
                type="button"
                className="min-w-0 flex-1 truncate text-left"
                onClick={() => onItemClick(fav.route)}
              >
                {fav.title}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(fav);
                }}
                className="shrink-0 opacity-0 group-hover:opacity-100 text-text-tertiary hover:text-text-primary"
                aria-label={`${fav.title} favorilerden cikar`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
