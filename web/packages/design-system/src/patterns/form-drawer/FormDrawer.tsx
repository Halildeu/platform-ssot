"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { variants } from "../../system/variants";
import { composeRefs, setDisplayName } from "../../system/compose";

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const drawerVariants = variants({
  base: [
    "fixed inset-y-0 z-50 flex flex-col bg-surface-default shadow-2xl border",
    "transition-transform duration-300 ease-out",
    "focus-visible:outline-none",
  ],
  variants: {
    side: {
      right: "right-0 border-l border-border-subtle",
      left: "left-0 border-r border-border-subtle",
    },
    size: {
      sm: "w-[360px]",
      md: "w-[480px]",
      lg: "w-[640px]",
      xl: "w-[800px]",
    },
  },
  defaultVariants: {
    side: "right",
    size: "md",
  },
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FormDrawerProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  side?: "left" | "right";
  size?: "sm" | "md" | "lg" | "xl";
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function FormDrawer(props: FormDrawerProps) {
  const {
    open,
    onClose,
    title,
    description,
    footer,
    side = "right",
    size,
    closeOnBackdrop = true,
    closeOnEscape = true,
    loading = false,
    children,
    className,
  } = props;

  // Escape key
  React.useEffect(() => {
    if (!open || !closeOnEscape) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, closeOnEscape, onClose]);

  // Lock body scroll
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;

  const translateClass = side === "right"
    ? "animate-in slide-in-from-right duration-300"
    : "animate-in slide-in-from-left duration-300";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 animate-in fade-in-0 duration-200"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden
      />

      {/* Drawer */}
      <div
        className={cn(drawerVariants({ side, size }), translateClass, className)}
        role="dialog"
        aria-modal
        aria-label={typeof title === "string" ? title : "Form drawer"}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-2">
            <div className="flex flex-col gap-1 min-w-0">
              {title && <h2 className="text-lg font-semibold text-text-primary">{title}</h2>}
              {description && <p className="text-sm text-text-secondary">{description}</p>}
            </div>
            <button
              type="button"
              className="shrink-0 rounded-md p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-colors"
              onClick={onClose}
              aria-label="Close"
            >
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 relative">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-default/60">
              <svg className="h-6 w-6 animate-spin text-action-primary" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          )}
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-border-subtle px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </>
  );
}

setDisplayName(FormDrawer, "FormDrawer");

export { FormDrawer, drawerVariants };
