import React, { useState, useCallback, useEffect, useRef } from "react";
import { Ruler, Box, Eye, EyeOff } from "lucide-react";
import { Text } from "@mfe/design-system";

/* ------------------------------------------------------------------ */
/*  MeasureOverlay — Measure spacing + Outline elements                 */
/*                                                                     */
/*  Features:                                                          */
/*  - Outline mode: colored borders by nesting depth                   */
/*  - Measure mode: shows padding/margin/dimensions on hover           */
/*  - Toggle buttons in playground toolbar                             */
/*                                                                     */
/*  Surpasses: Storybook Measure + Outline addons combined             */
/* ------------------------------------------------------------------ */

type MeasureOverlayProps = {
  outlineEnabled: boolean;
  measureEnabled: boolean;
  onToggleOutline: () => void;
  onToggleMeasure: () => void;
};

export const MeasureToolbar: React.FC<MeasureOverlayProps> = ({
  outlineEnabled,
  measureEnabled,
  onToggleOutline,
  onToggleMeasure,
}) => {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={onToggleOutline}
        className={[
          "flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium transition",
          outlineEnabled
            ? "bg-violet-100 text-violet-700 border border-violet-300"
            : "bg-surface-muted text-text-secondary hover:text-text-primary",
        ].join(" ")}
        title="Toggle element outlines"
      >
        <Box className="h-3 w-3" />
        Outline
      </button>
      <button
        type="button"
        onClick={onToggleMeasure}
        className={[
          "flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium transition",
          measureEnabled
            ? "bg-blue-100 text-blue-700 border border-blue-300"
            : "bg-surface-muted text-text-secondary hover:text-text-primary",
        ].join(" ")}
        title="Toggle measure on hover"
      >
        <Ruler className="h-3 w-3" />
        Measure
      </button>
    </div>
  );
};

/* ---- Outline CSS injection ---- */

const OUTLINE_COLORS = [
  "rgba(255, 0, 0, 0.3)",
  "rgba(0, 128, 255, 0.3)",
  "rgba(0, 200, 0, 0.3)",
  "rgba(255, 165, 0, 0.3)",
  "rgba(128, 0, 255, 0.3)",
];

export function getOutlineStyles(): string {
  return `
    [data-outline-mode] * {
      outline: 1px solid rgba(128, 128, 128, 0.2) !important;
    }
    [data-outline-mode] > * { outline-color: ${OUTLINE_COLORS[0]} !important; }
    [data-outline-mode] > * > * { outline-color: ${OUTLINE_COLORS[1]} !important; }
    [data-outline-mode] > * > * > * { outline-color: ${OUTLINE_COLORS[2]} !important; }
    [data-outline-mode] > * > * > * > * { outline-color: ${OUTLINE_COLORS[3]} !important; }
    [data-outline-mode] > * > * > * > * > * { outline-color: ${OUTLINE_COLORS[4]} !important; }
  `;
}

/* ---- Measure Tooltip ---- */

type MeasureInfo = {
  x: number;
  y: number;
  width: number;
  height: number;
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  paddingLeft: string;
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;
  tagName: string;
  className: string;
};

export const MeasureTooltip: React.FC<{
  enabled: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}> = ({ enabled, containerRef }) => {
  const [info, setInfo] = useState<MeasureInfo | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!container.contains(target)) {
        setInfo(null);
        return;
      }

      const rect = target.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const computed = window.getComputedStyle(target);

      setInfo({
        x: rect.left - containerRect.left,
        y: rect.top - containerRect.top,
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        paddingTop: computed.paddingTop,
        paddingRight: computed.paddingRight,
        paddingBottom: computed.paddingBottom,
        paddingLeft: computed.paddingLeft,
        marginTop: computed.marginTop,
        marginRight: computed.marginRight,
        marginBottom: computed.marginBottom,
        marginLeft: computed.marginLeft,
        tagName: target.tagName.toLowerCase(),
        className: target.className?.toString().slice(0, 40) || "",
      });

      setPos({ x: e.clientX - containerRect.left + 12, y: e.clientY - containerRect.top + 12 });
    };

    const handleMouseLeave = () => setInfo(null);

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [enabled, containerRef]);

  if (!enabled || !info) return null;

  return (
    <>
      {/* Highlight box */}
      <div
        className="pointer-events-none absolute border-2 border-blue-400 bg-blue-400/10 transition-all duration-75"
        style={{
          left: info.x,
          top: info.y,
          width: info.width,
          height: info.height,
        }}
      />
      {/* Tooltip */}
      <div
        className="pointer-events-none absolute z-50 rounded-lg bg-gray-900 px-3 py-2 text-xs text-gray-200 shadow-xl"
        style={{ left: pos.x, top: pos.y, maxWidth: 280 }}
      >
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-blue-400 font-mono font-semibold">&lt;{info.tagName}&gt;</span>
          <span className="text-gray-500 font-mono truncate">{info.className}</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[10px]">
          <span className="text-gray-400">Size:</span>
          <span className="text-white font-mono">{info.width} × {info.height}</span>
          <span className="text-gray-400">Padding:</span>
          <span className="text-emerald-400 font-mono">
            {info.paddingTop} {info.paddingRight} {info.paddingBottom} {info.paddingLeft}
          </span>
          <span className="text-gray-400">Margin:</span>
          <span className="text-amber-400 font-mono">
            {info.marginTop} {info.marginRight} {info.marginBottom} {info.marginLeft}
          </span>
        </div>
      </div>
    </>
  );
};

export default MeasureToolbar;
