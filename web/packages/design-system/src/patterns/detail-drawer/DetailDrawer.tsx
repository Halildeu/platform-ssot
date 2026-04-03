"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { variants } from "../../system/variants";
import { setDisplayName } from "../../system/compose";

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const detailDrawerVariants = variants({
  base: [
    "fixed inset-y-0 right-0 z-50 flex flex-col bg-surface-default shadow-2xl",
    "border-l border-border-subtle",
    "animate-in slide-in-from-right duration-300",
    "focus-visible:outline-none",
  ],
  variants: {
    size: {
      sm: "w-[400px]",
      md: "w-[520px]",
      lg: "w-[680px]",
      xl: "w-[860px]",
      full: "w-[calc(100vw-4rem)]",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DetailDrawerProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  tabs?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  children?: React.ReactNode;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function DetailDrawer(props: DetailDrawerProps) {
  const {
    open,
    onClose,
    title,
    subtitle,
    badge,
    actions,
    tabs,
    footer,
    size,
    closeOnBackdrop = true,
    closeOnEscape = true,
    children,
    className,
  } = props;

  // Escape
  React.useEffect(() => {
    if (!open || !closeOnEscape) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, closeOnEscape, onClose]);

  // Body scroll lock
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;

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
        className={cn(detailDrawerVariants({ size }), className)}
        role="dialog"
        aria-modal
        aria-label={typeof title === "string" ? title : "Detail drawer"}
      >
        {/* Header */}
        <div className="flex flex-col gap-3 px-6 pt-6 pb-3 border-b border-border-subtle">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2">
                {title && <h2 className="text-lg font-semibold text-text-primary truncate">{title}</h2>}
                {badge}
              </div>
              {subtitle && <p className="text-sm text-text-secondary">{subtitle}</p>}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {actions}
              <button
                type="button"
                className="rounded-md p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-colors"
                onClick={onClose}
                aria-label="Close"
              >
                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </button>
            </div>
          </div>

          {tabs}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
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

setDisplayName(DetailDrawer, "DetailDrawer");

export { DetailDrawer, detailDrawerVariants };
