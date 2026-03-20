import React, { useState, useCallback, useRef } from "react";
import { Monitor, Tablet, Smartphone, Maximize2, GripVertical } from "lucide-react";
import { Text } from "@mfe/design-system";
import { PlaygroundPreview } from "./PlaygroundPreview";
import { PreviewThemeWrapper } from "./PreviewThemeWrapper";
import type { PreviewAppearance } from "./PreviewToolbar";

/* ------------------------------------------------------------------ */
/*  ResponsiveMode — Multi-viewport preview showcase                    */
/*                                                                     */
/*  Features:                                                          */
/*  - Side-by-side Mobile / Tablet / Desktop viewports                 */
/*  - Single viewport with draggable resize handle                     */
/*  - Breakpoint labels and current width indicator                    */
/*  - Appearance (light/dark) support per viewport                     */
/*                                                                     */
/*  Surpasses: Storybook (single viewport), MUI/AntD (none)           */
/* ------------------------------------------------------------------ */

type BreakpointDef = {
  name: string;
  width: number;
  icon: React.ReactNode;
  color: string;
};

const BREAKPOINTS: BreakpointDef[] = [
  { name: "Mobile", width: 375, icon: <Smartphone className="h-3.5 w-3.5" />, color: "border-blue-400" },
  { name: "Tablet", width: 768, icon: <Tablet className="h-3.5 w-3.5" />, color: "border-purple-400" },
  { name: "Desktop", width: 1280, icon: <Monitor className="h-3.5 w-3.5" />, color: "border-emerald-400" },
];

type ResponsiveModeProps = {
  componentName: string;
  propValues: Record<string, string | number | boolean>;
  appearance: PreviewAppearance;
};

export const ResponsiveMode: React.FC<ResponsiveModeProps> = ({
  componentName,
  propValues,
  appearance,
}) => {
  const [mode, setMode] = useState<"multi" | "single">("multi");
  const [singleWidth, setSingleWidth] = useState(768);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const startX = e.clientX;
    const startWidth = singleWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      const newWidth = Math.max(280, Math.min(1400, startWidth + delta * 2));
      setSingleWidth(Math.round(newWidth));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [singleWidth]);

  // Determine breakpoint label for single mode
  const currentBreakpoint = singleWidth < 640 ? "Mobile" : singleWidth < 1024 ? "Tablet" : "Desktop";

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Maximize2 className="h-3.5 w-3.5 text-text-tertiary" />
          <Text as="span" className="text-xs font-semibold text-text-primary">Responsive Preview</Text>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setMode("multi")}
            className={[
              "flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition",
              mode === "multi" ? "bg-action-primary text-white" : "bg-surface-muted text-text-secondary hover:text-text-primary",
            ].join(" ")}
          >
            Side by Side
          </button>
          <button
            type="button"
            onClick={() => setMode("single")}
            className={[
              "flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition",
              mode === "single" ? "bg-action-primary text-white" : "bg-surface-muted text-text-secondary hover:text-text-primary",
            ].join(" ")}
          >
            Resizable
          </button>
        </div>
      </div>

      {/* Multi-viewport mode */}
      {mode === "multi" && (
        <div className="grid grid-cols-3 gap-3">
          {BREAKPOINTS.map((bp) => (
            <div key={bp.name} className={`overflow-hidden rounded-2xl border-2 ${bp.color}`}>
              {/* Label */}
              <div className="flex items-center gap-1.5 border-b border-border-subtle bg-surface-canvas px-3 py-2">
                {bp.icon}
                <Text as="span" className="text-[11px] font-semibold text-text-primary">{bp.name}</Text>
                <Text variant="secondary" className="text-[10px]">{bp.width}px</Text>
              </div>
              {/* Preview */}
              <PreviewThemeWrapper appearance={appearance} className="p-4">
                <div
                  style={{ maxWidth: `${Math.min(bp.width, 400)}px`, margin: "0 auto" }}
                  className="overflow-hidden"
                >
                  <PlaygroundPreview
                    componentName={componentName}
                    propValues={propValues}
                  />
                </div>
              </PreviewThemeWrapper>
            </div>
          ))}
        </div>
      )}

      {/* Single viewport with resize handle */}
      {mode === "single" && (
        <div className="flex flex-col items-center" ref={containerRef}>
          {/* Width indicator */}
          <div className="mb-2 flex items-center gap-2">
            <Text as="span" className="text-xs font-semibold text-text-primary">
              {singleWidth}px
            </Text>
            <span className="rounded-md bg-surface-muted px-1.5 py-0.5 text-[10px] font-medium text-text-tertiary">
              {currentBreakpoint}
            </span>
          </div>

          {/* Resizable container */}
          <div className="relative inline-block">
            <div
              className={[
                "overflow-hidden rounded-2xl border-2 transition-colors",
                isDragging ? "border-action-primary" : "border-border-subtle",
              ].join(" ")}
              style={{ width: `${Math.min(singleWidth, 900)}px` }}
            >
              <PreviewThemeWrapper appearance={appearance} className="p-6">
                <div className="flex items-center justify-center">
                  <PlaygroundPreview
                    componentName={componentName}
                    propValues={propValues}
                  />
                </div>
              </PreviewThemeWrapper>
            </div>

            {/* Resize handle */}
            <div
              className={[
                "absolute -right-4 top-1/2 -translate-y-1/2 flex h-12 w-6 cursor-col-resize items-center justify-center rounded-r-lg border border-l-0 border-border-subtle transition",
                isDragging ? "bg-action-primary/10 border-action-primary" : "bg-surface-muted hover:bg-surface-canvas",
              ].join(" ")}
              onMouseDown={handleDragStart}
            >
              <GripVertical className="h-3.5 w-3.5 text-text-tertiary" />
            </div>
          </div>

          {/* Quick breakpoint buttons */}
          <div className="mt-3 flex gap-2">
            {BREAKPOINTS.map((bp) => (
              <button
                key={bp.name}
                type="button"
                onClick={() => setSingleWidth(bp.width)}
                className={[
                  "flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition",
                  Math.abs(singleWidth - bp.width) < 50
                    ? "bg-action-primary text-white"
                    : "bg-surface-muted text-text-secondary hover:text-text-primary",
                ].join(" ")}
              >
                {bp.icon} {bp.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponsiveMode;
