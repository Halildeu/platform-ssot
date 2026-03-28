import React, { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";

/* ------------------------------------------------------------------ */
/*  SidebarHoverPreview — component preview card on hover              */
/*  Shows: name, description, lifecycle, variant count, tags           */
/* ------------------------------------------------------------------ */

export type PreviewData = {
  name: string;
  description?: string;
  lifecycle?: string;
  tags?: string[];
  variantCount?: number;
  propsCount?: number;
  hasTests?: boolean;
  a11yScore?: number;
};

type PreviewState = {
  x: number;
  y: number;
  data: PreviewData;
} | null;

const DELAY_MS = 300;
const LIFECYCLE_COLORS: Record<string, string> = {
  stable: "bg-state-success-bg text-state-success-text border-state-success-border",
  beta: "bg-state-warning-bg text-state-warning-text border-state-warning-border",
  planned: "bg-surface-muted text-text-tertiary border-border-subtle",
  deprecated: "bg-state-danger-bg text-state-danger-text border-state-danger-border",
};

const PreviewContext = React.createContext<{
  show: (rect: DOMRect, data: PreviewData) => void;
  hide: () => void;
  scheduleShow: (rect: DOMRect, data: PreviewData) => void;
  cancelShow: () => void;
}>({
  show: () => {},
  hide: () => {},
  scheduleShow: () => {},
  cancelShow: () => {},
});

export function useHoverPreview() {
  return React.useContext(PreviewContext);
}

export const HoverPreviewProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [preview, setPreview] = useState<PreviewState>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const show = useCallback((rect: DOMRect, data: PreviewData) => {
    const x = rect.right + 8;
    const y = Math.min(rect.top, window.innerHeight - 200);
    setPreview({ x, y, data });
  }, []);

  const hide = useCallback(() => {
    clearTimeout(timerRef.current);
    setPreview(null);
  }, []);

  const scheduleShow = useCallback(
    (rect: DOMRect, data: PreviewData) => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => show(rect, data), DELAY_MS);
    },
    [show],
  );

  const cancelShow = useCallback(() => {
    clearTimeout(timerRef.current);
    setPreview(null);
  }, []);

  return (
    <PreviewContext.Provider value={{ show, hide, scheduleShow, cancelShow }}>
      {children}
      {preview &&
        createPortal(
          <div
            className="
              fixed z-[90] w-[260px] rounded-xl border border-border-default
              bg-surface-default shadow-xl p-3
              animate-in fade-in slide-in-from-left-2 duration-150
              pointer-events-none
            "
            style={{ left: preview.x, top: preview.y }}
            role="tooltip"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="text-[14px] font-semibold text-text-primary leading-tight">
                {preview.data.name}
              </h4>
              {preview.data.lifecycle && (
                <span
                  className={`
                    shrink-0 px-1.5 py-0.5 rounded-md text-[9px] font-semibold uppercase border
                    ${LIFECYCLE_COLORS[preview.data.lifecycle] ?? LIFECYCLE_COLORS.planned}
                  `}
                >
                  {preview.data.lifecycle}
                </span>
              )}
            </div>

            {/* Description */}
            {preview.data.description && (
              <p className="text-[11px] text-text-secondary leading-relaxed mb-2 line-clamp-3">
                {preview.data.description}
              </p>
            )}

            {/* Stats row */}
            <div className="flex items-center gap-3 text-[10px] text-text-tertiary">
              {preview.data.variantCount != null && (
                <span className="flex items-center gap-1">
                  <span className="text-[9px]">◆</span>
                  {preview.data.variantCount} variants
                </span>
              )}
              {preview.data.propsCount != null && (
                <span className="flex items-center gap-1">
                  <span className="text-[9px]">⚙</span>
                  {preview.data.propsCount} props
                </span>
              )}
              {preview.data.hasTests && (
                <span className="flex items-center gap-1 text-state-success-text">
                  <span className="text-[9px]">✓</span>
                  Tested
                </span>
              )}
            </div>

            {/* Tags */}
            {preview.data.tags && preview.data.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {preview.data.tags.slice(0, 5).map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 rounded bg-surface-muted text-[9px] text-text-tertiary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* A11y score */}
            {preview.data.a11yScore != null && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1 rounded-full bg-surface-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      preview.data.a11yScore >= 90
                        ? "bg-state-success-text"
                        : preview.data.a11yScore >= 70
                          ? "bg-state-warning-text"
                          : "bg-state-danger-text"
                    }`}
                    style={{ width: `${preview.data.a11yScore}%` }}
                  />
                </div>
                <span className="text-[9px] text-text-tertiary tabular-nums">
                  A11y {preview.data.a11yScore}%
                </span>
              </div>
            )}
          </div>,
          document.body,
        )}
    </PreviewContext.Provider>
  );
};

HoverPreviewProvider.displayName = "HoverPreviewProvider";
