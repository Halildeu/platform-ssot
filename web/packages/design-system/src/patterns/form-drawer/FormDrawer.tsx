import React, { useEffect, useRef, useCallback, useId } from "react";
import { cn } from "../../utils/cn";
import { focusRingClass, stateAttrs } from "../../internal/interaction-core";
import { useScrollLock, registerLayer, unregisterLayer, useEscapeKey, useFocusRestore } from "../../internal/overlay-engine";
import { resolveAccessState, type AccessControlledProps } from "../../internal/access-controller";

/* ------------------------------------------------------------------ */
/*  FormDrawer — Slide-in panel for create/edit forms                  */
/* ------------------------------------------------------------------ */

export type FormDrawerSize = "sm" | "md" | "lg" | "xl";
export type FormDrawerPlacement = "right" | "left";

/** Props for the FormDrawer component. */
export interface FormDrawerProps extends AccessControlledProps {
  /** Controlled open state */
  open: boolean;
  /** Close callback */
  onClose: () => void;
  /** Drawer title */
  title: React.ReactNode;
  /** Optional subtitle */
  subtitle?: React.ReactNode;
  /** Form body content */
  children: React.ReactNode;
  /** Footer slot — typically submit/cancel buttons */
  footer?: React.ReactNode;
  /** Width preset */
  size?: FormDrawerSize;
  /** Slide direction */
  placement?: FormDrawerPlacement;
  /** Close on backdrop click */
  closeOnBackdrop?: boolean;
  /** Close on Escape key */
  closeOnEscape?: boolean;
  /** Show loading overlay */
  loading?: boolean;
  className?: string;
}

const sizeMap: Record<FormDrawerSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

/** Slide-in panel for create/edit forms with submit/cancel footer, loading overlay, and escape handling. */
export const FormDrawer: React.FC<FormDrawerProps> = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "md",
  placement = "right",
  closeOnBackdrop = true,
  closeOnEscape = true,
  loading = false,
  className,
  access,
  accessReason,
}) => {
  const accessState = resolveAccessState(access);
  const panelRef = useRef<HTMLDivElement>(null);
  const layerId = useId();

  /* ---- overlay-engine: scroll lock ---- */
  useScrollLock(open);

  /* ---- overlay-engine: layer-stack registration ---- */
  useEffect(() => {
    if (open) {
      registerLayer(layerId, "modal");
    }
    return () => {
      if (open) {
        unregisterLayer(layerId);
      }
    };
  }, [open, layerId]);

  /* ---- overlay-engine: focus restore ---- */
  useFocusRestore(open);

  /* ---- overlay-engine: escape key ---- */
  useEscapeKey(open && closeOnEscape, onClose);

  /* Focus panel on open */
  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  const handleBackdropClick = useCallback(() => {
    if (closeOnBackdrop) onClose();
  }, [closeOnBackdrop, onClose]);

  if (accessState.isHidden) return null;
  if (!open) return null;

  const isRight = placement === "right";

  return (
    <div className="fixed inset-0 z-[1300] flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 animate-in fade-in-0"
        onClick={handleBackdropClick}
        aria-hidden
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : undefined}
        tabIndex={-1}
        {...stateAttrs({ component: "form-drawer", state: "open", loading })}
        title={accessReason}
        className={cn(
          "relative flex flex-col w-full bg-surface-default shadow-2xl",
          "animate-in",
          isRight ? "ml-auto slide-in-from-right" : "mr-auto slide-in-from-left",
          accessState.isDisabled && "pointer-events-none opacity-50",
          sizeMap[size],
          className,
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-border-subtle px-6 py-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-text-primary truncate">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-0.5 text-sm text-text-secondary">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "flex-shrink-0 rounded-lg p-1.5 text-[var(--text-tertiary)]",
              "hover:bg-[var(--surface-hover)] hover:text-text-primary",
              focusRingClass("ring"),
              "transition-colors",
            )}
            aria-label="Close drawer"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-default/60">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-border-default border-t-[var(--action-primary)]" />
            </div>
          )}
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-border-subtle px-6 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

FormDrawer.displayName = "FormDrawer";
