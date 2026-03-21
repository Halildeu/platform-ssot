import React, { useState, useCallback } from "react";
import { cn } from "@mfe/design-system";
import type { ChartInteractionState } from "./useChartInteractions";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ChartToolbarProps {
  /** Interaction state returned by useChartInteractions. */
  interactions: ChartInteractionState;
  /** Callback to export the chart as PNG. */
  onExportPNG?: () => void;
  /** Callback to export the chart as SVG. */
  onExportSVG?: () => void;
  /** Additional class name for the toolbar wrapper. */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Icon components (inline SVG — no external deps)                    */
/* ------------------------------------------------------------------ */

const iconClass = "h-4 w-4";

function ZoomInIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3M11 8v6M8 11h6" />
    </svg>
  );
}

function ZoomOutIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3M8 11h6" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function BrushIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="8" width="18" height="8" rx="1" />
      <path d="M7 8V5M17 8V5M7 16v3M17 16v3" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
  );
}

function FullscreenIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

function ExitFullscreenIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Toolbar button                                                     */
/* ------------------------------------------------------------------ */

interface TBProps {
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

function ToolbarButton({ label, onClick, active = false, disabled = false, children }: TBProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center rounded-md p-1.5 text-[var(--text-secondary)] transition-colors",
        "hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]",
        "disabled:pointer-events-none disabled:opacity-40",
        active && "bg-[var(--surface-active)] text-[var(--action-primary)]",
      )}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Separator                                                          */
/* ------------------------------------------------------------------ */

function Sep() {
  return <div className="mx-0.5 h-5 w-px bg-[var(--border-subtle)]" aria-hidden="true" />;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ChartToolbar({
  interactions,
  onExportPNG,
  onExportSVG,
  className,
}: ChartToolbarProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      // Find the closest chart container and request fullscreen on it
      const el = document.querySelector("[data-chart-toolbar-root]") as HTMLElement | null;
      if (el) {
        el.requestFullscreen?.().catch(() => {});
        setIsFullscreen(true);
      }
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  // Listen for external fullscreen exit (e.g. Esc key)
  React.useEffect(() => {
    function onFSChange() {
      if (!document.fullscreenElement) setIsFullscreen(false);
    }
    document.addEventListener("fullscreenchange", onFSChange);
    return () => document.removeEventListener("fullscreenchange", onFSChange);
  }, []);

  const hasZoom = interactions.zoomLevel !== undefined;
  const hasBrush = interactions.clearBrush !== undefined;
  const hasExport = onExportPNG || onExportSVG;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-default)] px-1 py-0.5",
        className,
      )}
      role="toolbar"
      aria-label="Chart toolbar"
      data-testid="chart-toolbar"
    >
      {/* Zoom controls */}
      {hasZoom && (
        <>
          <ToolbarButton label="Zoom in" onClick={interactions.zoomIn}>
            <ZoomInIcon />
          </ToolbarButton>
          <ToolbarButton label="Zoom out" onClick={interactions.zoomOut} disabled={interactions.zoomLevel <= 1}>
            <ZoomOutIcon />
          </ToolbarButton>
          <ToolbarButton label="Reset zoom" onClick={interactions.resetZoom} disabled={interactions.zoomLevel <= 1}>
            <ResetIcon />
          </ToolbarButton>
        </>
      )}

      {/* Brush */}
      {hasBrush && hasZoom && <Sep />}
      {hasBrush && (
        <ToolbarButton
          label={interactions.brushRange ? "Clear selection" : "Brush select"}
          onClick={interactions.clearBrush}
          active={interactions.isBrushing || !!interactions.brushRange}
        >
          <BrushIcon />
        </ToolbarButton>
      )}

      {/* Export */}
      {hasExport && (hasBrush || hasZoom) && <Sep />}
      {onExportPNG && (
        <ToolbarButton label="Export PNG" onClick={onExportPNG}>
          <DownloadIcon />
        </ToolbarButton>
      )}
      {onExportSVG && (
        <ToolbarButton label="Export SVG" onClick={onExportSVG}>
          <DownloadIcon />
        </ToolbarButton>
      )}

      {/* Fullscreen */}
      <Sep />
      <ToolbarButton label={isFullscreen ? "Exit fullscreen" : "Fullscreen"} onClick={toggleFullscreen}>
        {isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
      </ToolbarButton>
    </div>
  );
}

ChartToolbar.displayName = "ChartToolbar";

export default ChartToolbar;
