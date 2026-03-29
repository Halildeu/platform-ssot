import React from "react";
import { useNavigate } from "react-router-dom";
import { useSidebarHealth } from "../hooks";

/* ------------------------------------------------------------------ */
/*  SidebarHealthBanner — compact doctor score at sidebar top          */
/*  73/73 ✅  │  0 warn · 0 fail · TW4 ✓                              */
/* ------------------------------------------------------------------ */

const STATUS_COLORS = {
  healthy: {
    bg: "bg-state-success-bg",
    text: "text-state-success-text",
    border: "border-state-success-border",
    icon: "✓",
  },
  warning: {
    bg: "bg-state-warning-bg",
    text: "text-state-warning-text",
    border: "border-state-warning-border",
    icon: "!",
  },
  critical: {
    bg: "bg-state-danger-bg",
    text: "text-state-danger-text",
    border: "border-state-danger-border",
    icon: "✕",
  },
  unknown: {
    bg: "bg-surface-muted",
    text: "text-text-tertiary",
    border: "border-border-subtle",
    icon: "?",
  },
} as const;

type Props = {
  className?: string;
};

export const SidebarHealthBanner: React.FC<Props> = ({ className }) => {
  const { health, loading, status, percentage } = useSidebarHealth();
  const navigate = useNavigate();
  const colors = STATUS_COLORS[status];

  if (loading) {
    return (
      <div className={`px-3 py-2 ${className ?? ""}`}>
        <div className="h-8 rounded-md bg-surface-muted animate-pulse" />
      </div>
    );
  }

  if (!health) return null;

  return (
    <button
      type="button"
      onClick={() => navigate("/admin/design-lab/quality")}
      className={`
        mx-2 mt-2 px-3 py-2 rounded-lg border transition-colors cursor-pointer
        ${colors.bg} ${colors.border} hover:opacity-90
        ${className ?? ""}
      `}
      title="View Quality Dashboard"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`
              inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold
              ${status === "healthy" ? "bg-state-success-text text-text-inverse" : ""}
              ${status === "warning" ? "bg-state-warning-text text-text-inverse" : ""}
              ${status === "critical" ? "bg-state-danger-text text-text-inverse" : ""}
              ${status === "unknown" ? "bg-text-tertiary text-text-inverse" : ""}
            `}
          >
            {colors.icon}
          </span>
          <span className={`text-[12px] font-semibold ${colors.text}`}>
            {health.pass}/{health.total}
          </span>
        </div>
        <span className="text-[10px] text-text-tertiary">
          v{health.version}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-1.5 h-1 rounded-full bg-surface-canvas overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            status === "healthy"
              ? "bg-state-success-text"
              : status === "warning"
                ? "bg-state-warning-text"
                : "bg-state-danger-text"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {(health.warn > 0 || health.fail > 0) && (
        <div className="mt-1 text-[10px] text-text-secondary">
          {health.warn > 0 && (
            <span className="text-state-warning-text">{health.warn} warn</span>
          )}
          {health.warn > 0 && health.fail > 0 && <span> · </span>}
          {health.fail > 0 && (
            <span className="text-state-danger-text">{health.fail} fail</span>
          )}
        </div>
      )}
    </button>
  );
};

SidebarHealthBanner.displayName = "SidebarHealthBanner";
