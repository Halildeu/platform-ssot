import React from "react";
import { EmptyState as Empty } from "../empty-state";
import { Text } from "../../primitives/text";
import { ThemePreviewCard } from "../theme-preview-card";
import { type ThemePresetGalleryItem } from "./ThemePresetGallery";
import { resolveAccessState, type AccessControlledProps } from "../../internal/access-controller";

export interface ThemePresetCompareProps extends AccessControlledProps {
  /** Left-side preset to compare. */
  leftPreset?: ThemePresetGalleryItem | null;
  /** Right-side preset to compare. */
  rightPreset?: ThemePresetGalleryItem | null;
  /** Heading displayed above the comparison. */
  title?: React.ReactNode;
  /** Descriptive text below the heading. */
  description?: React.ReactNode;
  /** Theme axes to include in the comparison matrix. */
  axes?: string[];
  /** Additional CSS class name. */
  className?: string;
}

const normalizeAxisValue = (preset: ThemePresetGalleryItem, axis: string) => {
  switch (axis) {
    case "appearance":
      return preset.appearance ?? "\u2014";
    case "density":
      return preset.density ?? "\u2014";
    case "intent":
      return preset.intent ?? "\u2014";
    case "contrast":
      return preset.isHighContrast ? "high" : "standard";
    case "mode":
    case "themeMode":
      return preset.themeMode ?? "\u2014";
    default:
      return "\u2014";
  }
};

/**
 * Side-by-side comparison view for two theme presets, displaying a matrix
 * of appearance, density, contrast and intent axes with preview cards.
 */
export const ThemePresetCompare = React.forwardRef<HTMLElement, ThemePresetCompareProps>(({
  leftPreset,
  rightPreset,
  title = "Theme preset compare",
  description = "Presetler appearance, density, contrast ve intent eksenlerinde ayni compare matrisiyle okunur.",
  axes = ["appearance", "density", "intent", "contrast"],
  className = "",
  access = "full",
  accessReason,
}, ref) => {
  const accessState = resolveAccessState(access);
  if (accessState.isHidden) {
    return null;
  }

  if (!leftPreset || !rightPreset) {
    return (
      <section
        ref={ref}
        className={`rounded-3xl border border-border-subtle bg-surface-muted p-5 shadow-xs ${className}`.trim()}
        data-access-state={accessState.state}
        data-component="theme-preset-compare"
        title={accessReason}
      >
        <Text as="div" className="text-base font-semibold text-text-primary">
          {title}
        </Text>
        <Text variant="secondary" className="mt-1 block text-sm leading-6">
          {description}
        </Text>
        <div className="mt-4 rounded-[24px] border border-border-subtle bg-surface-default p-4">
          <Empty description="Karsilastirma icin iki preset gerekli." />
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className={`rounded-3xl border border-border-subtle bg-surface-muted p-5 shadow-xs ${className}`.trim()}
      data-access-state={accessState.state}
      data-component="theme-preset-compare"
      title={accessReason}
    >
      <Text as="div" className="text-base font-semibold text-text-primary">
        {title}
      </Text>
      <Text variant="secondary" className="mt-1 block text-sm leading-6">
        {description}
      </Text>

      <div className="mt-4 grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(380px, 100%), 1fr))" }}>
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))" }}>
          {[leftPreset, rightPreset].map((preset, index) => (
            <div key={preset.presetId} className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
              <div className="grid grid-cols-[140px_minmax(0,1fr)] gap-4">
                <div className="rounded-[20px] border border-border-subtle bg-surface-muted p-3">
                  <ThemePreviewCard selected={index === 0 ? leftPreset.isDefaultMode : rightPreset.isDefaultMode} />
                </div>
                <div>
                  <Text as="div" className="text-sm font-semibold text-text-primary">
                    {preset.label}
                  </Text>
                  <Text variant="secondary" className="mt-1 block text-sm leading-6">
                    {preset.intent ?? "Preset intent belirtilmedi."}
                  </Text>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
          <div className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)] gap-3 border-b border-border-subtle pb-3">
            <Text variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.16em]">
              Axis
            </Text>
            <Text variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.16em]">
              {leftPreset.label}
            </Text>
            <Text variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.16em]">
              {rightPreset.label}
            </Text>
          </div>
          <div className="mt-3 space-y-3">
            {axes.map((axis) => (
              <div key={axis} className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)] gap-3 rounded-2xl border border-border-subtle bg-surface-muted px-3 py-3">
                <Text as="div" className="text-sm font-semibold capitalize text-text-primary">
                  {axis}
                </Text>
                <Text variant="secondary" className="text-sm leading-6">
                  {normalizeAxisValue(leftPreset, axis)}
                </Text>
                <Text variant="secondary" className="text-sm leading-6">
                  {normalizeAxisValue(rightPreset, axis)}
                </Text>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

ThemePresetCompare.displayName = 'ThemePresetCompare';

export default ThemePresetCompare;
