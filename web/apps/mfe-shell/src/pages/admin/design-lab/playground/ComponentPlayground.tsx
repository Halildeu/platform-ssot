import React, { useState, useRef } from "react";
import { Text } from "@mfe/design-system";
import { usePlaygroundState } from "./usePlaygroundState";
import { PlaygroundControls } from "./PlaygroundControls";
import { PlaygroundPreview } from "./PlaygroundPreview";
import { PlaygroundCodeOutput } from "./PlaygroundCodeOutput";
import { PreviewToolbar } from "./PreviewToolbar";
import { PreviewThemeWrapper } from "./PreviewThemeWrapper";
import { ViewportFrame } from "./ViewportFrame";
import { ActionsPanel } from "./ActionsPanel";
import { ResponsiveMode } from "./ResponsiveMode";
import { A11yAuditPanel } from "../panels/A11yAuditPanel";
import { PerfProfilerPanel } from "../panels/PerfProfilerPanel";
import { MeasureToolbar, MeasureTooltip, getOutlineStyles } from "../panels/MeasureOverlay";
import { useDesignLab } from "../DesignLabProvider";
import type { DesignLabApiItem } from "../DesignLabProvider";
import type { PreviewAppearance, PreviewViewport } from "./PreviewToolbar";

/* ------------------------------------------------------------------ */
/*  ComponentPlayground — Interactive prop editor + live preview        */
/*                                                                     */
/*  Layout:                                                            */
/*  ┌─────────────────────────────────────────────┐                    */
/*  │  [☀ Light | 🌙 Dark | ◐ HC]  [📱|📋|🖥]  │                    */
/*  ├─────────────────────┬──────────────────┤     │                   */
/*  │   Live Preview      │  Prop Controls    │                        */
/*  │                     │  variant: ──────  │                        */
/*  │   [ Component ]     │  ○ primary       │                        */
/*  │                     │  ○ secondary     │                        */
/*  │                     │  disabled: ☐     │                        */
/*  ├─────────────────────┴──────────────────┤                        */
/*  │  Generated Code                  [Copy] │                        */
/*  │  <Button variant="primary">...</Button> │                        */
/*  └─────────────────────────────────────────┘                        */
/* ------------------------------------------------------------------ */

type ComponentPlaygroundProps = {
  componentName: string;
  apiItem: DesignLabApiItem | null | undefined;
  importStatement?: string;
};

export const ComponentPlayground: React.FC<ComponentPlaygroundProps> = ({
  componentName,
  apiItem,
  importStatement,
}) => {
  const { t } = useDesignLab();
  const { controls, propValues, setProp, resetAll, generatedCode } =
    usePlaygroundState(componentName, apiItem);

  const [appearance, setAppearance] = useState<PreviewAppearance>("light");
  const [viewport, setViewport] = useState<PreviewViewport>("desktop");
  const [actionsExpanded, setActionsExpanded] = useState(false);
  const [a11yExpanded, setA11yExpanded] = useState(false);
  const [perfExpanded, setPerfExpanded] = useState(false);
  const [showResponsive, setShowResponsive] = useState(false);
  const [outlineEnabled, setOutlineEnabled] = useState(false);
  const [measureEnabled, setMeasureEnabled] = useState(false);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  if (!apiItem || controls.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-2xl border-2 border-dashed border-border-subtle bg-surface-canvas">
        <div className="text-center">
          <Text as="div" className="text-lg font-semibold text-text-primary">
            {t("designlab.playground.title")}
          </Text>
          <Text variant="secondary" className="mt-2 text-sm">
            {t("designlab.playground.noApi", { name: componentName })}
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Preview + Controls grid */}
      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        {/* Live preview */}
        <div className="min-h-[250px]">
          <div className="mb-2 flex items-center justify-between">
            <Text
              as="div"
              variant="secondary"
              className="text-[10px] font-semibold uppercase tracking-[0.18em]"
            >
              {t("designlab.playground.preview")}
            </Text>
            <div className="flex items-center gap-2">
              <MeasureToolbar
                outlineEnabled={outlineEnabled}
                measureEnabled={measureEnabled}
                onToggleOutline={() => setOutlineEnabled((p) => !p)}
                onToggleMeasure={() => setMeasureEnabled((p) => !p)}
              />
              <button
                type="button"
                onClick={() => setShowResponsive((p) => !p)}
                className={[
                  "rounded-lg px-2 py-1.5 text-[11px] font-medium transition",
                  showResponsive
                    ? "bg-indigo-100 text-indigo-700 border border-indigo-300"
                    : "bg-surface-muted text-text-secondary hover:text-text-primary",
                ].join(" ")}
              >
                Responsive
              </button>
              <PreviewToolbar
                appearance={appearance}
                viewport={viewport}
                onAppearanceChange={setAppearance}
                onViewportChange={setViewport}
              />
            </div>
          </div>
          {showResponsive ? (
            <ResponsiveMode
              componentName={componentName}
              propValues={propValues}
              appearance={appearance}
            />
          ) : (
            <div className="relative" ref={previewContainerRef}>
              {outlineEnabled && <style>{getOutlineStyles()}</style>}
              <PreviewThemeWrapper
                appearance={appearance}
                className="overflow-hidden rounded-2xl"
              >
                <ViewportFrame viewport={viewport}>
                  <div data-outline-mode={outlineEnabled || undefined}>
                    <PlaygroundPreview
                      componentName={componentName}
                      propValues={propValues}
                    />
                  </div>
                </ViewportFrame>
              </PreviewThemeWrapper>
              <MeasureTooltip enabled={measureEnabled} containerRef={previewContainerRef} />
            </div>
          )}
        </div>

        {/* Controls panel */}
        <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
          <Text
            as="div"
            variant="secondary"
            className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em]"
          >
            {t("designlab.playground.controls")}
          </Text>
          <PlaygroundControls
            controls={controls}
            propValues={propValues}
            onPropChange={setProp}
            onReset={resetAll}
          />
        </div>
      </div>

      {/* Actions Panel (Event Logger) */}
      <ActionsPanel
        expanded={actionsExpanded}
        onToggle={() => setActionsExpanded((prev) => !prev)}
      />

      {/* Accessibility Audit Panel */}
      <A11yAuditPanel
        componentName={componentName}
        propNames={apiItem?.props?.map((p) => p.name) ?? []}
        propValues={propValues}
        expanded={a11yExpanded}
        onToggle={() => setA11yExpanded((prev) => !prev)}
      />

      {/* Performance Profiler Panel */}
      <PerfProfilerPanel
        expanded={perfExpanded}
        onToggle={() => setPerfExpanded((prev) => !prev)}
      />

      {/* Generated code */}
      <PlaygroundCodeOutput
        code={generatedCode}
        importStatement={importStatement}
      />
    </div>
  );
};
