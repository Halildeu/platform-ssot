"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { slotVariants } from "../../system/variants";
import { setDisplayName, composeRefs } from "../../system/compose";
import { stateAttrs } from "../../internal/interaction-core/state-attributes";

// ---------------------------------------------------------------------------
// Slot Variants
// ---------------------------------------------------------------------------

const dialogStyles = slotVariants({
  slots: {
    backdrop: "fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
    panel: [
      "fixed z-50 bg-surface-default rounded-xl shadow-xl border border-border-subtle",
      "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
      "flex flex-col max-h-[85vh] w-full",
      "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
      "focus-visible:outline-none",
    ],
    header: "flex items-start justify-between gap-4 px-6 pt-6 pb-2",
    title: "text-lg font-semibold text-text-primary leading-tight",
    description: "text-sm text-text-secondary mt-1",
    body: "flex-1 overflow-y-auto px-6 py-4",
    footer: "flex items-center justify-end gap-3 px-6 pb-6 pt-2",
    closeButton: [
      "absolute right-4 top-4 rounded-md p-1",
      "text-text-secondary hover:text-text-primary hover:bg-surface-muted",
      "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action-primary",
    ],
  },
  variants: {
    size: {
      sm: "",
      md: "",
      lg: "",
      xl: "",
      full: "",
    },
  },
  compoundVariants: [
    { size: "sm", slot: "panel", className: "max-w-sm" },
    { size: "md", slot: "panel", className: "max-w-lg" },
    { size: "lg", slot: "panel", className: "max-w-2xl" },
    { size: "xl", slot: "panel", className: "max-w-4xl" },
    { size: "full", slot: "panel", className: "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]" },
  ],
  defaultVariants: {
    size: "md",
  },
});

// ---------------------------------------------------------------------------
// Close icon
// ---------------------------------------------------------------------------

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  closable?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  children?: React.ReactNode;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Dialog = React.forwardRef<HTMLDialogElement, DialogProps>(
  function Dialog(props, ref) {
    const {
      open,
      onClose,
      size,
      title,
      description,
      footer,
      closable = true,
      closeOnBackdrop = true,
      closeOnEscape = true,
      children,
      className,
    } = props;

    const dialogRef = React.useRef<HTMLDialogElement>(null);
    const composedRef = composeRefs(ref, dialogRef);

    // Sync native dialog open state
    React.useEffect(() => {
      const el = dialogRef.current;
      if (!el) return;

      if (open && !el.open) {
        el.showModal();
      } else if (!open && el.open) {
        el.close();
      }
    }, [open]);

    // Escape key handling
    const handleCancel = React.useCallback(
      (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (closeOnEscape && closable) onClose();
      },
      [closeOnEscape, closable, onClose],
    );

    // Backdrop click
    const handleBackdropClick = React.useCallback(
      (e: React.MouseEvent) => {
        if (closeOnBackdrop && closable && e.target === dialogRef.current) {
          onClose();
        }
      },
      [closeOnBackdrop, closable, onClose],
    );

    const styles = dialogStyles({ size });
    const state = open ? "open" : "closed";

    return (
      <dialog
        ref={composedRef}
        className={cn(
          "fixed inset-0 z-50 m-0 h-screen w-screen bg-transparent p-0",
          "backdrop:bg-transparent",
          className,
        )}
        onCancel={handleCancel}
        onClick={handleBackdropClick}
        {...stateAttrs({ state, component: "dialog" })}
      >
        {/* Backdrop */}
        <div className={styles.backdrop} data-state={state} aria-hidden />

        {/* Panel */}
        <div
          className={styles.panel}
          data-state={state}
          role="document"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          {closable && (
            <button
              type="button"
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close"
            >
              <CloseIcon />
            </button>
          )}

          {/* Header */}
          {(title || description) && (
            <div className={styles.header}>
              <div>
                {title && <h2 className={styles.title}>{title}</h2>}
                {description && <p className={styles.description}>{description}</p>}
              </div>
            </div>
          )}

          {/* Body */}
          <div className={styles.body}>{children}</div>

          {/* Footer */}
          {footer && <div className={styles.footer}>{footer}</div>}
        </div>
      </dialog>
    );
  },
);

setDisplayName(Dialog, "Dialog");

export { Dialog, dialogStyles };
