import React from "react";

/* ------------------------------------------------------------------ */
/*  SidebarGroupProgress — mini progress bar on group headers          */
/*  Shows: "12/15 documented" with visual bar                         */
/* ------------------------------------------------------------------ */

type Props = {
  current: number;
  total: number;
  label?: string;
  className?: string;
};

export const SidebarGroupProgress: React.FC<Props> = ({
  current,
  total,
  label,
  className,
}) => {
  if (total === 0) return null;

  const pct = Math.round((current / total) * 100);
  const color =
    pct >= 90
      ? "bg-state-success-text"
      : pct >= 60
        ? "bg-state-warning-text"
        : "bg-state-danger-text";

  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`} title={`${current}/${total} ${label ?? "items"}`}>
      <div className="flex-1 h-1 rounded-full bg-surface-muted overflow-hidden min-w-[40px]">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[9px] text-text-tertiary tabular-nums whitespace-nowrap">
        {current}/{total}
      </span>
    </div>
  );
};

SidebarGroupProgress.displayName = "SidebarGroupProgress";
