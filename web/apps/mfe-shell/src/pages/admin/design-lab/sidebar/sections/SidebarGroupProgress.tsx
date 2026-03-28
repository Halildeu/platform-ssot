import React from "react";

/* ------------------------------------------------------------------ */
/*  SidebarGroupProgress — compact progress indicator for group action */
/*  Shows: mini bar + "8/8" text, fits in ~60px width                  */
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
    <div
      className={`inline-flex items-center gap-1.5 ${className ?? ""}`}
      title={`${current}/${total} ${label ?? "stable"}`}
    >
      <div className="w-8 h-1 rounded-full bg-surface-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[9px] text-text-tertiary tabular-nums">
        {current}/{total}
      </span>
    </div>
  );
};

SidebarGroupProgress.displayName = "SidebarGroupProgress";
