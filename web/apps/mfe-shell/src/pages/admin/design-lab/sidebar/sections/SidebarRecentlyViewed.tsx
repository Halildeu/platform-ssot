import React from "react";
import { useNavigate } from "react-router-dom";
import { useSidebarRecents, formatRelativeTime } from "../hooks";

/* ------------------------------------------------------------------ */
/*  SidebarRecentlyViewed — last 10 visited components                 */
/* ------------------------------------------------------------------ */

type Props = {
  className?: string;
};

export const SidebarRecentlyViewed: React.FC<Props> = ({ className }) => {
  const { recents } = useSidebarRecents();
  const navigate = useNavigate();

  if (recents.length === 0) return null;

  return (
    <div className={`px-1 py-1 ${className ?? ""}`}>
      <div className="flex items-center justify-between px-2 py-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
          Recently Viewed
        </span>
      </div>
      <div className="space-y-px">
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
  );
};

SidebarRecentlyViewed.displayName = "SidebarRecentlyViewed";
