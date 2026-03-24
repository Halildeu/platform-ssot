import React from "react";
import { cn } from "../../utils/cn";
import {
  resolveAccessState, accessStyles,
  type AccessControlledProps,
} from "../../internal/access-controller";

/* ------------------------------------------------------------------ */
/*  ThemePreviewCard — Miniature theme swatch for theme selection       */
/* ------------------------------------------------------------------ */

export interface ThemePreviewCardProps extends AccessControlledProps {
  /** Whether this theme card is currently selected. */
  selected?: boolean;
  /** Additional CSS class name. */
  className?: string;
  /** Locale-specific label overrides for the preview card. */
  localeText?: {
    /** Title text shown in the swatch. */
    titleText?: React.ReactNode;
    /** Secondary descriptive text. */
    secondaryText?: React.ReactNode;
    /** Label for the save action button. */
    saveLabel?: React.ReactNode;
    /** Accessible label for the selected indicator. */
    selectedLabel?: React.ReactNode;
  };
}

/**
 * Miniature theme swatch card that renders a compact preview of a theme's
 * visual style, used in theme selection galleries and comparison views.
   * @example
   * ```tsx
   * <ThemePreviewCard />
   * ```
   * @since 1.0.0
   * @see [Docs](https://design.mfe.dev/components/theme-preview-card)
  
 */
export const ThemePreviewCard = React.forwardRef<HTMLDivElement, ThemePreviewCardProps>(({
  selected = false,
  className,
  localeText,
  access = "full",
  accessReason,
}, ref) => {
  const accessState = resolveAccessState(access);
  if (accessState.isHidden) return null;
  const resolvedTitleText = localeText?.titleText ?? "Baslik metni";
  const resolvedSecondaryText = localeText?.secondaryText ?? "Ikincil metin";
  const resolvedSaveLabel = localeText?.saveLabel ?? "Kaydet";
  const resolvedSelectedLabel =
    localeText?.selectedLabel ?? "Secili tema onizlemesi";

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex flex-col gap-1 rounded-xl border p-2 text-[10px] transition",
        "bg-surface-default",
        selected
          ? "border-action-primary shadow-xs"
          : "border-border-subtle hover:border-text-secondary",
        className,
      )}
      data-access-state={accessState.state}
      title={accessReason}
    >
      {selected ? (
        <div className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-action-primary text-[9px] font-bold text-text-inverse">
          <span aria-hidden="true">✓</span>
          <span className="sr-only">{resolvedSelectedLabel}</span>
        </div>
      ) : null}
      <div className="flex flex-col gap-1 rounded-lg border border-border-subtle bg-surface-muted px-2 py-2">
        <div className="h-2 w-10 rounded-xs bg-surface-default" />
        <div className="mt-1 h-[6px] rounded-xs bg-transparent text-[9px] font-medium text-text-primary">
          {resolvedTitleText}
        </div>
        <div className="h-[6px] rounded-xs text-[9px] text-text-secondary">
          {resolvedSecondaryText}
        </div>
        <div className="mt-2 flex items-center justify-end">
          <div className="inline-flex items-center rounded-full bg-action-primary px-2 py-[2px] text-[9px] font-semibold text-text-inverse">
            {resolvedSaveLabel}
          </div>
        </div>
      </div>
      <div className="mt-1 h-1.5 w-full rounded-full bg-surface-muted" />
    </div>
  );
});

ThemePreviewCard.displayName = "ThemePreviewCard";

export default ThemePreviewCard;
