"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { variants } from "../../system/variants";
import { setDisplayName } from "../../system/compose";

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const toastVariants = variants({
  base: [
    "pointer-events-auto relative flex w-full items-start gap-3 rounded-lg border p-4 shadow-lg",
    "animate-in fade-in-0 slide-in-from-top-2 duration-300",
    "data-[state=closing]:animate-out data-[state=closing]:fade-out-0 data-[state=closing]:slide-out-to-right-full",
  ],
  variants: {
    variant: {
      default: "bg-surface-default border-border-default text-text-primary",
      success: "bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200",
      error: "bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200",
      warning: "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-200",
      info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

const icons: Record<string, React.ReactNode> = {
  success: (
    <svg className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
  ),
  error: (
    <svg className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
    </svg>
  ),
  warning: (
    <svg className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.168 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  ),
  info: (
    <svg className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
    </svg>
  ),
};

// ---------------------------------------------------------------------------
// Toast Types
// ---------------------------------------------------------------------------

export interface ToastData {
  id: string;
  variant?: "default" | "success" | "error" | "warning" | "info";
  title?: string;
  description?: string;
  duration?: number;
  persistent?: boolean;
  action?: { label: string; onClick: () => void };
}

interface ToastState {
  toasts: ToastData[];
}

type ToastAction =
  | { type: "ADD"; toast: ToastData }
  | { type: "REMOVE"; id: string }
  | { type: "UPDATE"; toast: Partial<ToastData> & { id: string } };

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function toastReducer(state: ToastState, action: ToastAction): ToastState {
  switch (action.type) {
    case "ADD":
      return { toasts: [...state.toasts, action.toast] };
    case "REMOVE":
      return { toasts: state.toasts.filter((t) => t.id !== action.id) };
    case "UPDATE":
      return {
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t,
        ),
      };
  }
}

// ---------------------------------------------------------------------------
// Context & Hook
// ---------------------------------------------------------------------------

interface ToastAPI {
  toast: (data: Omit<ToastData, "id">) => string;
  dismiss: (id: string) => void;
  update: (toast: Partial<ToastData> & { id: string }) => void;
}

const ToastContext = React.createContext<ToastAPI | null>(null);

export function useToast(): ToastAPI {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

let toastCounter = 0;

export interface ToastProviderProps {
  children: React.ReactNode;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
  maxToasts?: number;
}

function ToastProvider({
  children,
  position = "top-right",
  maxToasts = 5,
}: ToastProviderProps) {
  const [state, dispatch] = React.useReducer(toastReducer, { toasts: [] });

  const api = React.useMemo<ToastAPI>(
    () => ({
      toast: (data) => {
        const id = `toast-${++toastCounter}`;
        dispatch({ type: "ADD", toast: { ...data, id } });

        if (!data.persistent) {
          const dur = data.duration ?? 5000;
          setTimeout(() => dispatch({ type: "REMOVE", id }), dur);
        }

        return id;
      },
      dismiss: (id) => dispatch({ type: "REMOVE", id }),
      update: (toast) => dispatch({ type: "UPDATE", toast }),
    }),
    [],
  );

  const positionClasses: Record<string, string> = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  };

  const visibleToasts = state.toasts.slice(-maxToasts);

  return (
    <ToastContext.Provider value={api}>
      {children}

      {/* Toast container */}
      <div
        className={cn(
          "fixed z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none",
          positionClasses[position],
        )}
        aria-live="polite"
        aria-label="Notifications"
      >
        {visibleToasts.map((t) => (
          <ToastItem key={t.id} data={t} onDismiss={() => api.dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Toast Item
// ---------------------------------------------------------------------------

function ToastItem({ data, onDismiss }: { data: ToastData; onDismiss: () => void }) {
  const { variant = "default", title, description, action } = data;

  return (
    <div className={toastVariants({ variant })} role="alert">
      {variant !== "default" && icons[variant]}

      <div className="flex-1 min-w-0">
        {title && <p className="text-sm font-semibold">{title}</p>}
        {description && <p className="text-sm opacity-80 mt-0.5">{description}</p>}
        {action && (
          <button
            type="button"
            className="mt-2 text-sm font-medium underline underline-offset-2 hover:opacity-80"
            onClick={action.onClick}
          >
            {action.label}
          </button>
        )}
      </div>

      <button
        type="button"
        className="shrink-0 rounded-md p-1 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        onClick={onDismiss}
        aria-label="Dismiss"
      >
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M4 4l8 8M12 4l-8 8" />
        </svg>
      </button>
    </div>
  );
}

setDisplayName(ToastProvider, "ToastProvider");

export { ToastProvider, toastVariants };
