import React from "react";
import { Clock } from "lucide-react";
import {
  useReportingSidebarRecents,
  formatRelativeTime,
} from "../hooks";

/* ------------------------------------------------------------------ */
/*  ReportingSidebarRecents — collapsible recent visits list           */
/* ------------------------------------------------------------------ */

type Props = {
  onItemClick: (route: string) => void;
  activeRoute?: string;
};

export const ReportingSidebarRecents: React.FC<Props> = ({
  onItemClick,
  activeRoute,
}) => {
  const { recents } = useReportingSidebarRecents();
  const [isOpen, setIsOpen] = React.useState(true);

  if (recents.length === 0) return null;

  return (
    <div className="px-2 py-1">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-[11px] font-semibold text-text-secondary hover:text-text-primary"
      >
        <Clock className="h-3 w-3" />
        <span className="flex-1 text-left">Son Görüntülenen</span>
        <span className="rounded-full bg-surface-muted px-1.5 text-[10px]">
          {recents.length}
        </span>
      </button>

      {isOpen && (
        <div className="mt-0.5 space-y-0.5">
          {recents.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onItemClick(item.route)}
              className={`flex w-full items-center gap-2 rounded-md px-2 py-1 text-xs text-left transition
                ${
                  activeRoute === item.route
                    ? "bg-[color-mix(in_oklab,var(--action-primary)_10%,transparent)] text-[var(--action-primary)] font-medium"
                    : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
                }
              `}
            >
              <span className="min-w-0 flex-1 truncate">{item.title}</span>
              <span className="shrink-0 text-[10px] text-text-tertiary">
                {formatRelativeTime(item.visitedAt)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
