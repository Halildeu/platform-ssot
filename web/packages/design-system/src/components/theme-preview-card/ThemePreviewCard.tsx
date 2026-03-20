import React from "react";
import { cn } from "../../utils/cn";

/* ------------------------------------------------------------------ */
/*  ThemePreviewCard — Miniature theme swatch for theme selection       */
/* ------------------------------------------------------------------ */

export interface ThemePreviewCardProps {
  selected?: boolean;
  className?: string;
  localeText?: {
    titleText?: React.ReactNode;
    secondaryText?: React.ReactNode;
    saveLabel?: React.ReactNode;
    selectedLabel?: React.ReactNode;
  };
}

export const ThemePreviewCard: React.FC<ThemePreviewCardProps> = ({
  selected = false,
  className,
  localeText,
}) => {
  const resolvedTitleText = localeText?.titleText ?? "Baslik metni";
  const resolvedSecondaryText = localeText?.secondaryText ?? "Ikincil metin";
  const resolvedSaveLabel = localeText?.saveLabel ?? "Kaydet";
  const resolvedSelectedLabel =
    localeText?.selectedLabel ?? "Secili tema onizlemesi";

  return (
    <div
      className={cn(
        "relative flex flex-col gap-1 rounded-xl border p-2 text-[10px] transition",
        "bg-[var(--surface-default)]",
        selected
          ? "border-[var(--action-primary)] shadow-sm"
          : "border-[var(--border-subtle)] hover:border-[var(--text-secondary)]",
        className,
      )}
    >
      {selected ? (
        <div className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--action-primary)] text-[9px] font-bold text-white">
          <span aria-hidden="true">✓</span>
          <span className="sr-only">{resolvedSelectedLabel}</span>
        </div>
      ) : null}
      <div className="flex flex-col gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-2 py-2">
        <div className="h-2 w-10 rounded bg-[var(--surface-default)]" />
        <div className="mt-1 h-[6px] rounded-sm bg-transparent text-[9px] font-medium text-[var(--text-primary)]">
          {resolvedTitleText}
        </div>
        <div className="h-[6px] rounded-sm text-[9px] text-[var(--text-secondary)]">
          {resolvedSecondaryText}
        </div>
        <div className="mt-2 flex items-center justify-end">
          <div className="inline-flex items-center rounded-full bg-[var(--action-primary)] px-2 py-[2px] text-[9px] font-semibold text-white">
            {resolvedSaveLabel}
          </div>
        </div>
      </div>
      <div className="mt-1 h-1.5 w-full rounded-full bg-[var(--surface-muted)]" />
    </div>
  );
};

ThemePreviewCard.displayName = "ThemePreviewCard";

export default ThemePreviewCard;
