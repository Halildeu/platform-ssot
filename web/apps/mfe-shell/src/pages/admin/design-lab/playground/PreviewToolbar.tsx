import React from "react";
import clsx from "clsx";
import { Sun, Moon, MonitorSmartphone, Tablet, Monitor, Contrast } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  PreviewToolbar — Theme + Viewport segmented controls               */
/*                                                                     */
/*  Reusable across PlaygroundPreview, HeroPreview, ExampleCard        */
/* ------------------------------------------------------------------ */

export type PreviewAppearance = "light" | "dark" | "high-contrast";
export type PreviewViewport = "mobile" | "tablet" | "desktop";

export type PreviewToolbarProps = {
  appearance: PreviewAppearance;
  viewport: PreviewViewport;
  onAppearanceChange: (v: PreviewAppearance) => void;
  onViewportChange: (v: PreviewViewport) => void;
  className?: string;
  /** Hide viewport selector (e.g. in compact contexts) */
  hideViewport?: boolean;
};

const APPEARANCE_OPTIONS: Array<{
  value: PreviewAppearance;
  icon: React.ReactNode;
  label: string;
}> = [
  { value: "light", icon: <Sun className="h-3.5 w-3.5" />, label: "Light" },
  { value: "dark", icon: <Moon className="h-3.5 w-3.5" />, label: "Dark" },
  {
    value: "high-contrast",
    icon: <Contrast className="h-3.5 w-3.5" />,
    label: "HC",
  },
];

const VIEWPORT_OPTIONS: Array<{
  value: PreviewViewport;
  icon: React.ReactNode;
  label: string;
  width: number;
}> = [
  {
    value: "mobile",
    icon: <MonitorSmartphone className="h-3.5 w-3.5" />,
    label: "Mobile",
    width: 375,
  },
  {
    value: "tablet",
    icon: <Tablet className="h-3.5 w-3.5" />,
    label: "Tablet",
    width: 768,
  },
  {
    value: "desktop",
    icon: <Monitor className="h-3.5 w-3.5" />,
    label: "Desktop",
    width: 0,
  },
];

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: Array<{ value: T; icon: React.ReactNode; label: string }>;
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-lg border border-border-subtle bg-surface-canvas p-0.5">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            title={opt.label}
            className={clsx(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-all duration-150",
              active
                ? "bg-surface-default text-text-primary shadow-xs ring-1 ring-border-subtle/50"
                : "text-text-tertiary hover:text-text-secondary",
            )}
          >
            {opt.icon}
            <span className="hidden sm:inline">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export const PreviewToolbar: React.FC<PreviewToolbarProps> = ({
  appearance,
  viewport,
  onAppearanceChange,
  onViewportChange,
  className,
  hideViewport = false,
}) => (
  <div className={clsx("flex flex-wrap items-center gap-2", className)}>
    <SegmentedControl
      options={APPEARANCE_OPTIONS}
      value={appearance}
      onChange={onAppearanceChange}
    />
    {!hideViewport && (
      <SegmentedControl
        options={VIEWPORT_OPTIONS}
        value={viewport}
        onChange={onViewportChange}
      />
    )}
  </div>
);

/** Hook to get viewport width from preset name */
export function getViewportWidth(viewport: PreviewViewport): number | null {
  const opt = VIEWPORT_OPTIONS.find((o) => o.value === viewport);
  return opt && opt.width > 0 ? opt.width : null;
}
