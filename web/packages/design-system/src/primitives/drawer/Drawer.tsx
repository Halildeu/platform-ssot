import React, { useEffect, useRef, useCallback, useId } from "react";
import ReactDOM from "react-dom";
import { stateAttrs } from "../../internal/interaction-core";
import {
  registerLayer,
  unregisterLayer,
  useScrollLock,
  useEscapeKey,
  useFocusRestore,
} from "../../internal/overlay-engine";
import { cn } from "../../utils/cn";

/* ------------------------------------------------------------------ */
/*  Drawer — Slide-in side panel                                       */
/*                                                                     */
/*  Generic primitive for slide-in panels from any edge.               */
/*  Placements: left · right · top · bottom                            */
/*  Sizes: sm · md · lg · full                                         */
/* ------------------------------------------------------------------ */

export type DrawerPlacement = "left" | "right" | "top" | "bottom";
export type DrawerSize = "sm" | "md" | "lg" | "full";

/** Props for the Drawer component. */
export interface DrawerProps {
  /** Controlled open state */
  open: boolean;
  /** Close callback */
  onClose: () => void;
  /** Which edge the drawer slides in from */
  placement?: DrawerPlacement;
  /** Width/height preset */
  size?: DrawerSize;
  /** Drawer title */
  title?: React.ReactNode;
  /** Description below title */
  description?: React.ReactNode;
  /** Main content */
  children: React.ReactNode;
  /** Footer content (actions) */
  footer?: React.ReactNode;
  /** Close when clicking the overlay backdrop */
  closeOnOverlayClick?: boolean;
  /** Close when pressing Escape */
  closeOnEscape?: boolean;
  /** Show the backdrop overlay */
  showOverlay?: boolean;
  /** Additional class name on the panel */
  className?: string;
}

/* ---- Size maps per axis ---- */

const horizontalSizeStyles: Record<DrawerSize, string> = {
  sm: "max-w-sm w-full",
  md: "max-w-md w-full",
  lg: "max-w-2xl w-full",
  full: "max-w-full w-full",
};

const verticalSizeStyles: Record<DrawerSize, string> = {
  sm: "max-h-[25vh] h-full",
  md: "max-h-[50vh] h-full",
  lg: "max-h-[75vh] h-full",
  full: "max-h-full h-full",
};

/* ---- Placement layout ---- */

const placementContainerStyles: Record<DrawerPlacement, string> = {
  right: "justify-end",
  left: "justify-start",
  top: "items-start",
  bottom: "items-end",
};

const placementPanelStyles: Record<DrawerPlacement, string> = {
  right: "h-full",
  left: "h-full",
  top: "w-full",
  bottom: "w-full",
};

const placementAnimationStyles: Record<DrawerPlacement, string> = {
  right: "animate-in slide-in-from-right",
  left: "animate-in slide-in-from-left",
  top: "animate-in slide-in-from-top",
  bottom: "animate-in slide-in-from-bottom",
};

/** Slide-in side panel from any edge with overlay backdrop, scroll lock, and focus management. */
export const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(({
  open,
  onClose,
  placement = "right",
  size = "md",
  title,
  description,
  children,
  footer,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showOverlay = true,
  className,
}, forwardedRef) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const layerId = useId();
  const titleId = useId();
  const descriptionId = useId();

  const isHorizontal = placement === "left" || placement === "right";

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

  /* ---- auto-focus panel on open ---- */
  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  /* ---- overlay click ---- */
  const handleOverlayClick = useCallback(() => {
    if (closeOnOverlayClick) onClose();
  }, [closeOnOverlayClick, onClose]);

  if (!open) return null;

  const sizeStyles = isHorizontal ? horizontalSizeStyles : verticalSizeStyles;

  const content = (
    <div
      className={cn("fixed inset-0 z-[1300] flex", placementContainerStyles[placement])}
      {...stateAttrs({ component: "drawer", state: "open" })}
    >
      {/* Backdrop */}
      {showOverlay && (
        <div
          className="absolute inset-0 bg-black/40 animate-in fade-in-0"
          onClick={handleOverlayClick}
          data-testid="drawer-overlay"
          aria-hidden
        />
      )}

      {/* Panel */}
      <div
        ref={(node) => {
          (panelRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof forwardedRef === 'function') forwardedRef(node);
          else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(
          "relative flex flex-col bg-surface-default shadow-2xl",
          placementPanelStyles[placement],
          placementAnimationStyles[placement],
          sizeStyles[size],
          className,
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border-subtle px-6 py-4">
          <div className="min-w-0 flex-1">
            {title && (
              <h2
                id={titleId}
                className="text-lg font-semibold text-text-primary truncate"
              >
                {title}
              </h2>
            )}
            {description && (
              <p
                id={descriptionId}
                className="mt-1 text-sm text-text-secondary"
              >
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-1.5 text-text-secondary transition hover:bg-surface-muted hover:text-text-primary"
            aria-label="Close"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
              <path
                d="M15 5L5 15M5 5l10 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto px-6 py-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-border-subtle px-6 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  const target = typeof document !== "undefined" ? document.body : null;
  if (!target) return content;
  return ReactDOM.createPortal(content, target);
});

Drawer.displayName = "Drawer";
