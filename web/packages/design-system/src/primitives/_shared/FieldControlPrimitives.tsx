import React from "react";
import { cn } from "../../utils/cn";
import { Text } from "../text/Text";

/* ------------------------------------------------------------------ */
/*  Field Control Primitives — Shared form field building blocks        */
/*                                                                     */
/*  Used by TextInput, TextArea, Select, and other form primitives.    */
/*  NOT exported from the public API — internal only.                  */
/* ------------------------------------------------------------------ */

export type FieldSize = "sm" | "md" | "lg";
export type FieldTone = "default" | "invalid" | "readonly" | "disabled";
export type FieldDensity = "compact" | "comfortable";

const fieldShellClass: Record<FieldTone, string> = {
  default:
    "border-[var(--border-default)]/80 text-[var(--text-primary)] focus-within:border-[var(--action-primary)] focus-within:ring-2 focus-within:ring-[var(--action-primary)]/30 focus-within:ring-offset-1",
  invalid:
    "border-[var(--state-error-text)]/90 text-[var(--text-primary)] focus-within:border-[var(--state-error-text)] focus-within:ring-2 focus-within:ring-[var(--state-error-text)]/40 focus-within:ring-offset-1",
  readonly:
    "border-[var(--border-subtle)] text-[var(--text-secondary)] shadow-none focus-within:border-[var(--border-subtle)] focus-within:ring-0",
  disabled:
    "border-[var(--border-subtle)] text-[var(--text-disabled)] opacity-80 shadow-none",
};

const fieldSurfaceClass: Record<FieldTone, string> = {
  default:
    "bg-[var(--surface-default)] shadow-sm ring-1 ring-[var(--border-subtle)]/20 backdrop-blur-sm",
  invalid:
    "bg-[var(--surface-default)] shadow-sm ring-1 ring-[var(--border-subtle)]/20 backdrop-blur-sm",
  readonly:
    "bg-[var(--surface-muted)] ring-1 ring-[var(--border-subtle)]/15",
  disabled:
    "bg-[var(--surface-muted)] ring-1 ring-[var(--border-subtle)]/12",
};

const fieldSizeClass: Record<FieldSize, string> = {
  sm: "min-h-10 rounded-xl px-3 py-2",
  md: "min-h-11 rounded-2xl px-4 py-3",
  lg: "min-h-12 rounded-2xl px-4 py-3.5",
};

const fieldDensityClass: Record<FieldDensity, string> = {
  compact: "gap-2.5",
  comfortable: "gap-3",
};

const fieldInputTextClass: Record<FieldSize, string> = {
  sm: "text-sm leading-6",
  md: "text-sm leading-6",
  lg: "text-base leading-7",
};

const fieldSlotClass: Record<FieldSize, string> = {
  sm: "min-w-4 text-sm",
  md: "min-w-5 text-sm",
  lg: "min-w-5 text-base",
};

export const getFieldTone = ({
  invalid,
  disabled,
  readonly,
}: {
  invalid?: boolean;
  disabled?: boolean;
  readonly?: boolean;
}): FieldTone => {
  if (disabled) return "disabled";
  if (readonly) return "readonly";
  if (invalid) return "invalid";
  return "default";
};

export const buildDescribedBy = (...ids: Array<string | undefined>) => {
  const value = ids.filter(Boolean).join(" ").trim();
  return value || undefined;
};

export const getFieldFrameClass = (
  size: FieldSize,
  tone: FieldTone,
  fullWidth: boolean,
  className?: string,
  density: FieldDensity = "comfortable",
) =>
  cn(
    "group relative flex items-start overflow-hidden border transition duration-200",
    fieldShellClass[tone],
    fieldSurfaceClass[tone],
    fieldSizeClass[size],
    fieldDensityClass[density],
    fullWidth && "w-full",
    className,
  );

export const getFieldInputClass = (
  size: FieldSize,
  className?: string,
  density: FieldDensity = "comfortable",
) =>
  cn(
    "min-w-0 flex-1 border-0 bg-transparent p-0 text-[var(--text-primary)] placeholder:text-[var(--text-disabled)]/90 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:text-[var(--text-disabled)]",
    fieldInputTextClass[size],
    density === "compact" ? "leading-5" : undefined,
    className,
  );

export const getFieldSlotClass = (
  size: FieldSize,
  density: FieldDensity = "comfortable",
) =>
  cn(
    "inline-flex shrink-0 items-center justify-center text-[var(--text-secondary)] transition-colors group-focus-within:text-[var(--text-primary)]",
    fieldSlotClass[size],
    density === "compact" ? "translate-y-px" : undefined,
  );

type FieldControlShellProps = {
  inputId: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  countLabel?: string;
  required?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
};

export const FieldControlShell: React.FC<FieldControlShellProps> = ({
  inputId,
  label,
  description,
  hint,
  error,
  countLabel,
  required = false,
  fullWidth = true,
  children,
}) => (
  <div className={cn("space-y-2.5", fullWidth && "w-full")}>
    {label || description ? (
      <div className="space-y-1">
        {label ? (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-[var(--text-primary)]"
          >
            {label}
            {required ? (
              <span aria-hidden="true" className="ms-1 text-[var(--state-error-text)]">
                *
              </span>
            ) : null}
          </label>
        ) : null}
        {description ? (
          <Text as="div" variant="secondary" className="text-sm leading-6">
            {description}
          </Text>
        ) : null}
      </div>
    ) : null}

    {children}

    {hint || error || countLabel ? (
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {error ? (
            <Text as="div" variant="error" className="text-sm leading-6">
              {error}
            </Text>
          ) : hint ? (
            <Text as="div" variant="secondary" className="text-sm leading-6">
              {hint}
            </Text>
          ) : null}
        </div>
        {countLabel ? (
          <Text
            as="div"
            variant={error ? "error" : "muted"}
            className="shrink-0 text-xs font-medium tabular-nums"
          >
            {countLabel}
          </Text>
        ) : null}
      </div>
    ) : null}
  </div>
);

FieldControlShell.displayName = "FieldControlShell";
