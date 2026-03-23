import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, Copy, Check, RotateCcw } from "lucide-react";
import { Text, Button, Badge, Avatar, Input } from "@mfe/design-system";
import { useDesignLab } from "../DesignLabProvider";

/* ------------------------------------------------------------------ */
/*  ThemeBuilderPage — Interactive 10-axis theme playground             */
/* ------------------------------------------------------------------ */

type ThemeAxes = {
  appearance: string;
  density: string;
  radius: string;
  elevation: string;
  motion: string;
  tableSurfaceTone: string;
  surfaceTone: string;
  accent: string;
  overlayIntensity: number;
  overlayOpacity: number;
};

const DEFAULT_AXES: ThemeAxes = {
  appearance: "light",
  density: "comfortable",
  radius: "rounded",
  elevation: "raised",
  motion: "standard",
  tableSurfaceTone: "normal",
  surfaceTone: "soft-1",
  accent: "light",
  overlayIntensity: 10,
  overlayOpacity: 10,
};

type AxisConfig = {
  id: keyof ThemeAxes;
  options?: string[];
  type: "select" | "slider";
  min?: number;
  max?: number;
};

const AXIS_CONFIGS: AxisConfig[] = [
  { id: "appearance", type: "select", options: ["light", "dark", "high-contrast"] },
  { id: "density", type: "select", options: ["comfortable", "compact"] },
  { id: "radius", type: "select", options: ["rounded", "sharp"] },
  { id: "elevation", type: "select", options: ["raised", "flat"] },
  { id: "motion", type: "select", options: ["standard", "reduced"] },
  { id: "tableSurfaceTone", type: "select", options: ["soft", "normal", "strong"] },
  { id: "surfaceTone", type: "select", options: ["soft-1", "soft-2", "soft-3"] },
  { id: "accent", type: "select", options: ["light", "dark", "blue", "violet", "emerald"] },
  { id: "overlayIntensity", type: "slider", min: 0, max: 100 },
  { id: "overlayOpacity", type: "slider", min: 0, max: 100 },
];

export default function ThemeBuilderPage() {
  const { t } = useDesignLab();
  const [axes, setAxes] = useState<ThemeAxes>(DEFAULT_AXES);
  const [copied, setCopied] = useState(false);

  const updateAxis = useCallback(<K extends keyof ThemeAxes>(key: K, value: ThemeAxes[K]) => {
    setAxes((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetAxes = useCallback(() => setAxes(DEFAULT_AXES), []);

  // Apply theme to <html> data attributes for live preview
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-appearance", axes.appearance);
    root.setAttribute("data-density", axes.density);
    root.setAttribute("data-radius", axes.radius);
    root.setAttribute("data-elevation", axes.elevation);
    root.setAttribute("data-motion", axes.motion);
    root.setAttribute("data-table-surface-tone", axes.tableSurfaceTone);
    root.setAttribute("data-surface-tone", axes.surfaceTone);
    root.setAttribute("data-accent", axes.accent);
    root.setAttribute("data-overlay-intensity", String(axes.overlayIntensity));
    root.setAttribute("data-overlay-opacity", String(axes.overlayOpacity));

    return () => {
      // Reset to defaults on unmount
      root.setAttribute("data-appearance", DEFAULT_AXES.appearance);
      root.setAttribute("data-density", DEFAULT_AXES.density);
      root.setAttribute("data-radius", DEFAULT_AXES.radius);
      root.setAttribute("data-elevation", DEFAULT_AXES.elevation);
      root.setAttribute("data-motion", DEFAULT_AXES.motion);
    };
  }, [axes]);

  const configJson = useMemo(
    () => JSON.stringify(axes, null, 2),
    [axes],
  );

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(configJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border-subtle bg-linear-to-br from-surface-default to-surface-canvas px-6 py-8">
        <div className="pointer-events-none absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="relative flex items-start justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-default/80 px-3 py-1 text-xs font-medium text-text-secondary backdrop-blur-xs">
              <SlidersHorizontal className="h-3 w-3" />
              10 theme axes
            </div>
            <Text as="div" className="text-2xl font-extrabold tracking-tight text-text-primary">
              {t("designlab.sidebar.title.theme")}
            </Text>
            <Text variant="secondary" className="mt-2 max-w-xl text-sm leading-relaxed">
              {t("designlab.landing.layer.theme.description")}
            </Text>
          </div>
          <button
            type="button"
            onClick={resetAxes}
            className="flex items-center gap-1.5 rounded-lg border border-border-subtle bg-surface-default px-3 py-1.5 text-xs font-medium text-text-secondary transition hover:bg-surface-muted hover:text-text-primary"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Main layout: Controls + Preview */}
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        {/* Left: Axis controls */}
        <div className="space-y-3">
          <Text as="div" className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
            Axis Controls
          </Text>
          {AXIS_CONFIGS.map((config) => (
            <div
              key={config.id}
              className="rounded-xl border border-border-subtle bg-surface-default p-3.5 transition hover:border-border-default"
            >
              <div className="mb-2 flex items-center justify-between">
                <Text className="text-xs font-semibold text-text-primary">
                  {t(`designlab.themeAxis.${config.id}.title`)}
                </Text>
                <Text variant="secondary" className="font-mono text-[10px]">
                  {String(axes[config.id])}
                </Text>
              </div>
              {config.type === "select" && config.options && (
                <div className="flex flex-wrap gap-1.5">
                  {config.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => updateAxis(config.id, opt as any)}
                      className={[
                        "rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all duration-200",
                        axes[config.id] === opt
                          ? "bg-action-primary text-white shadow-xs"
                          : "bg-surface-muted text-text-secondary hover:bg-surface-canvas hover:text-text-primary",
                      ].join(" ")}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
              {config.type === "slider" && (
                <input
                  type="range"
                  min={config.min ?? 0}
                  max={config.max ?? 100}
                  value={axes[config.id] as number}
                  onChange={(e) => updateAxis(config.id, Number(e.target.value) as any)}
                  className="mt-1 w-full accent-action-primary"
                />
              )}
            </div>
          ))}
        </div>

        {/* Right: Live preview + Config */}
        <div className="space-y-6">
          {/* Live component preview */}
          <div>
            <Text as="div" className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-secondary">
              Live Preview
            </Text>
            <div className="rounded-2xl border border-border-subtle bg-surface-default p-6">
              <div className="space-y-6">
                {/* Buttons row */}
                <div>
                  <Text variant="secondary" className="mb-2 text-[11px] font-semibold uppercase tracking-wider">Buttons</Text>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button variant="primary" size="md">Primary</Button>
                    <Button variant="secondary" size="md">Secondary</Button>
                    <Button variant="ghost" size="md">Ghost</Button>
                    <Button variant="danger" size="md">Danger</Button>
                  </div>
                </div>

                {/* Badges */}
                <div>
                  <Text variant="secondary" className="mb-2 text-[11px] font-semibold uppercase tracking-wider">Badges</Text>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="info">Info</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="error">Error</Badge>
                  </div>
                </div>

                {/* Avatars */}
                <div>
                  <Text variant="secondary" className="mb-2 text-[11px] font-semibold uppercase tracking-wider">Avatars</Text>
                  <div className="flex items-center gap-2">
                    <Avatar size="sm" initials="AL" />
                    <Avatar size="md" initials="BO" />
                    <Avatar size="lg" initials="CH" />
                  </div>
                </div>

                {/* Input */}
                <div>
                  <Text variant="secondary" className="mb-2 text-[11px] font-semibold uppercase tracking-wider">Input</Text>
                  <div className="max-w-sm">
                    <Input placeholder="Type something..." />
                  </div>
                </div>

                {/* Cards */}
                <div>
                  <Text variant="secondary" className="mb-2 text-[11px] font-semibold uppercase tracking-wider">Surface Cards</Text>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-border-subtle bg-surface-default p-4 shadow-xs">
                      <Text className="text-sm font-semibold text-text-primary">Default</Text>
                      <Text variant="secondary" className="mt-1 text-xs">Surface default card</Text>
                    </div>
                    <div className="rounded-xl border border-border-subtle bg-surface-muted p-4">
                      <Text className="text-sm font-semibold text-text-primary">Muted</Text>
                      <Text variant="secondary" className="mt-1 text-xs">Surface muted card</Text>
                    </div>
                    <div className="rounded-xl border border-border-subtle bg-surface-canvas p-4">
                      <Text className="text-sm font-semibold text-text-primary">Canvas</Text>
                      <Text variant="secondary" className="mt-1 text-xs">Surface canvas card</Text>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Config JSON */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <Text as="div" className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
                Theme Configuration
              </Text>
              <button
                type="button"
                onClick={handleCopyConfig}
                className="flex items-center gap-1.5 rounded-lg border border-border-subtle bg-surface-default px-3 py-1.5 text-xs font-medium text-text-secondary transition hover:bg-surface-muted hover:text-text-primary"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied!" : "Copy JSON"}
              </button>
            </div>
            <pre className="overflow-auto rounded-xl border border-border-subtle bg-surface-canvas p-4 font-mono text-xs leading-6 text-text-primary">
              {configJson}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
