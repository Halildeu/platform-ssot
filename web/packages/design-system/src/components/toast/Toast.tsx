import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { cn } from "../../utils/cn";
import { stateAttrs } from "../../internal/interaction-core";

/* ------------------------------------------------------------------ */
/*  Toast — Notification system with provider + hook                   */
/*                                                                     */
/*  Usage:                                                             */
/*    <ToastProvider>                                                   */
/*      <App />                                                        */
/*    </ToastProvider>                                                  */
/*                                                                     */
/*    const toast = useToast();                                        */
/*    toast.success("Saved!");                                         */
/* ------------------------------------------------------------------ */

export type ToastVariant = "info" | "success" | "warning" | "error";
export type ToastPosition = "top-right" | "top-center" | "bottom-right" | "bottom-center";

export interface ToastData {
  id: string;
  variant: ToastVariant;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  info: (message: string, opts?: ToastOptions) => void;
  success: (message: string, opts?: ToastOptions) => void;
  warning: (message: string, opts?: ToastOptions) => void;
  error: (message: string, opts?: ToastOptions) => void;
  dismiss: (id: string) => void;
}

interface ToastOptions {
  title?: string;
  duration?: number;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

let toastCounter = 0;

export interface ToastProviderProps {
  position?: ToastPosition;
  /** Default auto-dismiss duration in ms */
  duration?: number;
  /** Max visible toasts */
  maxVisible?: number;
  children: React.ReactNode;
}

const positionStyles: Record<ToastPosition, string> = {
  "top-right": "top-4 right-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "bottom-right": "bottom-4 right-4",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
};

const variantStyles: Record<ToastVariant, string> = {
  info: "border-[var(--state-info-text)]/20 bg-[var(--surface-default)]",
  success: "border-[var(--state-success-text)]/20 bg-[var(--surface-default)]",
  warning: "border-[var(--state-warning-text)]/20 bg-[var(--surface-default)]",
  error: "border-[var(--state-error-text)]/20 bg-[var(--surface-default)]",
};

const indicatorColors: Record<ToastVariant, string> = {
  info: "bg-[var(--state-info-text)]",
  success: "bg-[var(--state-success-text)]",
  warning: "bg-[var(--state-warning-text)]",
  error: "bg-[var(--state-error-text)]",
};

export const ToastProvider: React.FC<ToastProviderProps> = ({
  position = "top-right",
  duration = 4000,
  maxVisible = 5,
  children,
}) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (variant: ToastVariant, message: string, opts?: ToastOptions) => {
      const id = `toast-${++toastCounter}`;
      const toast: ToastData = {
        id,
        variant,
        message,
        title: opts?.title,
        duration: opts?.duration ?? duration,
      };
      setToasts((prev) => [...prev.slice(-(maxVisible - 1)), toast]);
    },
    [duration, maxVisible],
  );

  const value: ToastContextValue = {
    info: (msg, opts) => addToast("info", msg, opts),
    success: (msg, opts) => addToast("success", msg, opts),
    warning: (msg, opts) => addToast("warning", msg, opts),
    error: (msg, opts) => addToast("error", msg, opts),
    dismiss,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast container */}
      <div
        className={cn(
          "fixed z-[1700] flex flex-col gap-2 pointer-events-none",
          positionStyles[position],
        )}
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={() => dismiss(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

ToastProvider.displayName = "ToastProvider";

/* ---- Individual toast ---- */

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastData;
  onDismiss: () => void;
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      timerRef.current = setTimeout(onDismiss, toast.duration);
    }
    return () => clearTimeout(timerRef.current);
  }, [toast.duration, onDismiss]);

  return (
    <div
      className={cn(
        "pointer-events-auto flex w-80 items-start gap-3 rounded-xl border p-4 shadow-lg",
        "animate-in slide-in-from-right-full fade-in-0",
        variantStyles[toast.variant],
      )}
      role="alert"
      {...stateAttrs({ component: "toast", status: toast.variant === "error" ? "error" : toast.variant === "warning" ? "warning" : toast.variant === "success" ? "success" : "idle" })}
    >
      {/* Color indicator */}
      <span
        className={cn(
          "mt-1 h-2 w-2 shrink-0 rounded-full",
          indicatorColors[toast.variant],
        )}
      />
      <div className="min-w-0 flex-1">
        {toast.title && (
          <div className="text-sm font-semibold text-[var(--text-primary)]">
            {toast.title}
          </div>
        )}
        <div className="text-sm text-[var(--text-secondary)]">
          {toast.message}
        </div>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded-md p-1 text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)]"
        aria-label="Dismiss"
      >
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
          <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
