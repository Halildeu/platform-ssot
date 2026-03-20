import React from "react";
import { createPortal } from "react-dom";
import { cn } from "../utils/cn";

export type OverlayCloseReason = "close-button" | "overlay" | "escape";

export const premiumOverlayPanelClassName =
  "rounded-[28px] border border-border-subtle/80 ring-1 ring-[var(--border-subtle)]/20 shadow-[0_30px_70px_-40px_var(--shadow-color,rgba(15,23,42,0.4))] backdrop-blur-md";

export const premiumOverlayCloseButtonClassName =
  "inline-flex h-8 w-8 items-center justify-center rounded-full border border-border-subtle/70 bg-[var(--surface-card,var(--surface-default))] text-text-subtle shadow-[0_14px_28px_-24px_var(--shadow-color,rgba(15,23,42,0.24))] transition hover:-translate-y-px hover:border-border-default hover:bg-[var(--surface-card,var(--surface-default))] hover:text-text-primary hover:shadow-[0_18px_32px_-22px_var(--shadow-color,rgba(15,23,42,0.28))]";

interface OverlaySurfaceProps {
  open: boolean;
  accessState?: { isHidden?: boolean };
  onClose?: (reason: OverlayCloseReason) => void;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  keepMounted?: boolean;
  destroyOnHidden?: boolean;
  placement?: "right" | "left" | "center";
  transitionPreset?: "slide" | "fade" | "scale";
  portalTarget?: HTMLElement | null;
  disablePortal?: boolean;
  ariaLabel?: string;
  viewportClassName?: string;
  surfaceClassName?: string;
  surfaceAppearance?: "premium" | "default";
  children: React.ReactNode;
}

export const OverlaySurface: React.FC<OverlaySurfaceProps> = ({
  open,
  accessState,
  onClose,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  keepMounted = false,
  destroyOnHidden = true,
  placement = "center",
  transitionPreset: _transitionPreset = "fade",
  portalTarget,
  disablePortal = false,
  ariaLabel,
  viewportClassName,
  surfaceClassName,
  surfaceAppearance: _surfaceAppearance = "default",
  children,
}) => {
  const [mounted, setMounted] = React.useState(open);
  const overlayRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (open) {
      setMounted(true);
    } else if (!keepMounted && destroyOnHidden) {
      const timeout = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [open, keepMounted, destroyOnHidden]);

  React.useEffect(() => {
    if (!open || !closeOnEscape) return undefined;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onClose?.("escape");
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, closeOnEscape, onClose]);

  if (!mounted && !keepMounted) {
    return null;
  }

  if (accessState?.isHidden) {
    return null;
  }

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (
      closeOnOverlayClick &&
      event.target === overlayRef.current
    ) {
      onClose?.("overlay");
    }
  };

  const content = (
    <div
      ref={overlayRef}
      role="dialog"
      aria-label={ariaLabel}
      aria-modal="true"
      className={cn(
        "fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity duration-300",
        open ? "opacity-100" : "pointer-events-none opacity-0",
        viewportClassName,
      )}
      onClick={handleOverlayClick}
    >
      <div
        className={cn(
          "transition-transform duration-300",
          placement === "right" && (open ? "translate-x-0" : "translate-x-full"),
          placement === "left" && (open ? "translate-x-0" : "-translate-x-full"),
          surfaceClassName,
        )}
      >
        {children}
      </div>
    </div>
  );

  if (disablePortal || typeof document === "undefined") {
    return content;
  }

  return createPortal(content, portalTarget ?? document.body);
};
