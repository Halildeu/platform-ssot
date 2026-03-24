import React, { useEffect, useRef, useCallback, useId } from "react";
import { cn } from "../../utils/cn";
import { focusRingClass, stateAttrs } from "../../internal/interaction-core";
import { useScrollLock, registerLayer, unregisterLayer, useEscapeKey, useFocusRestore } from "../../internal/overlay-engine";
import { resolveAccessState, accessStyles, type AccessControlledProps } from "../../internal/access-controller";
/* ------------------------------------------------------------------ */
/*  DetailDrawer — Read-only detail panel (wider, with sections)       */
/* ------------------------------------------------------------------ */

export type DetailDrawerSize = "md" | "lg" | "xl" | "full";

export interface DetailDrawerSection {
  key: string;
  title?: React.ReactNode;
  content: React.ReactNode;
}

/** Props for the DetailDrawer component.
 * @example
 * ```tsx
 * <DetailDrawer />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/detail-drawer)
 */
export interface DetailDrawerProps extends AccessControlledProps {
  /** Controlled open state */
  open: boolean;
  /** Close callback */
  onClose: () => void;
  /** Drawer title */
  title: React.ReactNode;
  /** Optional subtitle */
  subtitle?: React.ReactNode;
  /** Optional header actions (e.g. Edit, Delete buttons) */
  actions?: React.ReactNode;
  /** Optional header tags / badges */
  tags?: React.ReactNode;
  /** Sections to render */
  sections?: DetailDrawerSection[];
  /** Or free-form children */
  children?: React.ReactNode;
  /** Footer slot */
  footer?: React.ReactNode;
  /** Width preset */
  size?: DetailDrawerSize;
  /** Close on backdrop click */
  closeOnBackdrop?: boolean;
  className?: string;
}

const sizeMap: Record<DetailDrawerSize, string> = {
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-full",
};

/** Read-only slide-in detail panel with section layout, header actions, and tags. */
export const DetailDrawer: React.FC<DetailDrawerProps> = ({
  open,
  onClose,
  title,
  subtitle,
  actions,
  tags,
  sections,
  children,
  footer,
  size = "lg",
  closeOnBackdrop = true,
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
  useEscapeKey(open, onClose);

  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  const handleBackdrop = useCallback(() => {
    if (closeOnBackdrop) onClose();
  }, [closeOnBackdrop, onClose]);

  if (accessState.isHidden) return null;
  if (!open) return null;

  // Resolve body content: sections > children
  const renderBody = () => {
    if (sections) {
      return sections.map((section) => (
        <div key={section.key} className="border-b border-border-subtle px-6 py-4 last:border-b-0">
          {section.title && (
            <h3 className="mb-3 text-sm font-semibold text-text-secondary uppercase tracking-wider">
              {section.title}
            </h3>
          )}
          {section.content}
        </div>
      ));
    }

    return <div className="px-6 py-4">{children}</div>;
  };

  return (
    <div className="fixed inset-0 z-[1300] flex" data-access-state={accessState.state}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 animate-in fade-in-0"
        onClick={handleBackdrop}
        aria-hidden
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : undefined}
        tabIndex={-1}
        title={accessReason}
        {...stateAttrs({ component: "detail-drawer", state: "open" })}
        className={cn(
          "relative ml-auto flex flex-col w-full bg-surface-default shadow-2xl",
          "animate-in slide-in-from-right",
          accessState.isDisabled && "pointer-events-none opacity-50",
          sizeMap[size],
          className,
        )}
      >
        {/* Header */}
        <div className="border-b border-border-subtle px-6 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-semibold text-text-primary truncate">
                  {title}
                </h2>
                {tags && <div className="flex items-center gap-1.5">{tags}</div>}
              </div>
              {subtitle && (
                <p className="mt-0.5 text-sm text-text-secondary">{subtitle}</p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {actions}
              <button
                type="button"
                onClick={onClose}
                className={cn(
                  "rounded-lg p-1.5 text-[var(--text-tertiary)]",
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
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {renderBody()}
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

DetailDrawer.displayName = "DetailDrawer";
