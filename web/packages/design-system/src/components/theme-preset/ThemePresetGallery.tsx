import React from "react";
import { Badge } from "../../primitives/badge";
import { EmptyState as Empty } from "../empty-state";
import { Text } from "../../primitives/text";
import { ThemePreviewCard } from "../theme-preview-card";
import {
  resolveAccessState,
  withAccessGuard,
  type AccessControlledProps,
  type AccessLevel,
} from "../../internal/access-controller";

/** Describes a single theme preset entry within the gallery. */
export interface ThemePresetGalleryItem {
  /** Unique identifier for this preset. */
  presetId: string;
  /** Display name for the preset. */
  label: React.ReactNode;
  /** Theme mode descriptor (e.g. "light", "dark"). */
  themeMode?: React.ReactNode;
  /** Visual appearance descriptor. */
  appearance?: React.ReactNode;
  /** Density descriptor (e.g. "comfortable", "compact"). */
  density?: React.ReactNode;
  /** Design intent or purpose of this preset. */
  intent?: React.ReactNode;
  /** Whether this preset uses high-contrast colors. */
  isHighContrast?: boolean;
  /** Whether this is the default/recommended preset. */
  isDefaultMode?: boolean;
  /** Additional badge elements rendered on the preset card. */
  badges?: React.ReactNode[];
}

/**
 * ThemePresetGallery displays a selectable grid of theme preset cards
 * with preview thumbnails and metadata comparison.
 */
export interface ThemePresetGalleryProps extends AccessControlledProps {
  /** Array of theme presets to display. */
  presets: ThemePresetGalleryItem[];
  /** Gallery heading. */
  title?: React.ReactNode;
  /** Explanatory text below the heading. */
  description?: React.ReactNode;
  /** Comparison axis labels shown as badges above the grid. */
  compareAxes?: React.ReactNode[];
  /** Controlled selected preset ID. */
  selectedPresetId?: string | null;
  /** Initial selected preset for uncontrolled mode. */
  defaultSelectedPresetId?: string | null;
  /** Callback fired when a preset is selected. */
  onSelectPreset?: (presetId: string, preset: ThemePresetGalleryItem) => void;
  /** Additional CSS class name. */
  className?: string;
}

export const ThemePresetGallery = React.forwardRef<HTMLElement, ThemePresetGalleryProps>(({
  presets,
  title = "Tema on tanim galerisi",
  description = "Resmi preset ailesi docs, runtime ve release diliyle ayni preset kimlikleri uzerinden okunur.",
  compareAxes = [],
  selectedPresetId,
  defaultSelectedPresetId = null,
  onSelectPreset,
  className = "",
  access = "full",
  accessReason,
}, ref) => {
  const accessState = resolveAccessState(access);
  const [internalSelectedPresetId, setInternalSelectedPresetId] = React.useState<string | null>(
    defaultSelectedPresetId ?? presets[0]?.presetId ?? null,
  );

  if (accessState.isHidden) {
    return null;
  }

  const currentSelectedPresetId = selectedPresetId ?? internalSelectedPresetId;
  const interactionState: AccessLevel = accessState.isDisabled
    ? "disabled"
    : accessState.isReadonly
      ? "readonly"
      : accessState.state;

  return (
    <section
      ref={ref}
      className={`rounded-3xl border border-border-subtle bg-surface-muted p-5 shadow-xs ${className}`.trim()}
      data-access-state={accessState.state}
      data-component="theme-preset-gallery"
      title={accessReason}
    >
      <Text as="div" className="text-base font-semibold text-text-primary">
        {title}
      </Text>
      <Text variant="secondary" className="mt-1 block text-sm leading-6">
        {description}
      </Text>

      {compareAxes.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {compareAxes.map((axis, index) => (
            <Badge key={`theme-axis-${index}`} variant="muted">
              {axis}
            </Badge>
          ))}
        </div>
      ) : null}

      {presets.length === 0 ? (
        <div className="mt-4 rounded-[24px] border border-border-subtle bg-surface-default p-4">
          <Empty description="Theme preset bulunamadi." />
        </div>
      ) : (
        <div className="mt-4 grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))" }}>
          {presets.map((preset) => {
            const selected = preset.presetId === currentSelectedPresetId;
            const blocked = accessState.isDisabled || accessState.isReadonly;

            return (
              <button
                key={preset.presetId}
                type="button"
                className={`w-full rounded-[26px] border px-4 py-4 text-start transition ${
                  selected
                    ? "border-action-primary-border bg-[var(--action-primary-soft)]"
                    : "border-border-subtle bg-surface-default hover:bg-surface-muted"
                } ${blocked ? "cursor-not-allowed opacity-75" : ""}`}
                aria-current={selected ? "true" : undefined}
                onClick={withAccessGuard<React.MouseEvent<HTMLButtonElement>>(
                  interactionState,
                  () => {
                    if (selectedPresetId === undefined) {
                      setInternalSelectedPresetId(preset.presetId);
                    }
                    onSelectPreset?.(preset.presetId, preset);
                  },
                  accessState.isDisabled,
                )}
                title={accessReason}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Text as="div" className="text-sm font-semibold text-text-primary">
                      {preset.label}
                    </Text>
                    {preset.intent ? (
                      <Text variant="secondary" className="mt-1 block text-sm leading-6">
                        {preset.intent}
                      </Text>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {preset.isDefaultMode ? <Badge variant="success">Default</Badge> : null}
                    {preset.isHighContrast ? <Badge variant="warning">High contrast</Badge> : null}
                    {preset.badges?.map((badge, index) => (
                      <React.Fragment key={`${preset.presetId}-badge-${index}`}>{badge}</React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(160px, 100%), 1fr))" }}>
                  <div className="rounded-[20px] border border-border-subtle bg-surface-muted p-3">
                    <ThemePreviewCard selected={selected} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-border-subtle bg-surface-muted px-3 py-3">
                      <Text variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                        Mode
                      </Text>
                      <Text as="div" className="mt-2 text-sm font-semibold text-text-primary">
                        {preset.themeMode ?? "\u2014"}
                      </Text>
                    </div>
                    <div className="rounded-2xl border border-border-subtle bg-surface-muted px-3 py-3">
                      <Text variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                        Appearance
                      </Text>
                      <Text as="div" className="mt-2 text-sm font-semibold text-text-primary">
                        {preset.appearance ?? "\u2014"}
                      </Text>
                    </div>
                    <div className="rounded-2xl border border-border-subtle bg-surface-muted px-3 py-3">
                      <Text variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                        Density
                      </Text>
                      <Text as="div" className="mt-2 text-sm font-semibold text-text-primary">
                        {preset.density ?? "\u2014"}
                      </Text>
                    </div>
                    <div className="rounded-2xl border border-border-subtle bg-surface-muted px-3 py-3">
                      <Text variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                        Contrast
                      </Text>
                      <Text as="div" className="mt-2 text-sm font-semibold text-text-primary">
                        {preset.isHighContrast ? "high" : "standard"}
                      </Text>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
});

ThemePresetGallery.displayName = "ThemePresetGallery";

export default ThemePresetGallery;
