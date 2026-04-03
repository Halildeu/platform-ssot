"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { variants } from "../../system/variants";
import { setDisplayName } from "../../system/compose";
import { stateAttrs } from "../../internal/interaction-core/state-attributes";

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const tabListVariants = variants({
  base: "inline-flex items-center",
  variants: {
    variant: {
      line: "border-b border-border-default gap-0",
      enclosed: "bg-surface-muted rounded-lg p-1 gap-0.5",
      pill: "gap-1",
    },
    fullWidth: {
      true: "w-full",
    },
  },
  defaultVariants: {
    variant: "line",
  },
});

const tabTriggerVariants = variants({
  base: [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "text-sm font-medium transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action-primary focus-visible:ring-offset-1",
    "disabled:pointer-events-none disabled:opacity-50",
    "cursor-pointer select-none",
  ],
  variants: {
    variant: {
      line: [
        "px-4 py-2.5 -mb-px border-b-2 border-transparent",
        "text-text-secondary hover:text-text-primary",
        "data-[state=active]:border-action-primary data-[state=active]:text-text-primary",
      ],
      enclosed: [
        "px-3 py-1.5 rounded-md",
        "text-text-secondary hover:text-text-primary",
        "data-[state=active]:bg-surface-default data-[state=active]:text-text-primary data-[state=active]:shadow-sm",
      ],
      pill: [
        "px-4 py-2 rounded-full",
        "text-text-secondary hover:bg-surface-muted",
        "data-[state=active]:bg-action-primary data-[state=active]:text-text-inverse",
      ],
    },
    fullWidth: {
      true: "flex-1",
    },
  },
  defaultVariants: {
    variant: "line",
  },
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: "line" | "enclosed" | "pill";
  fullWidth?: boolean;
}

export interface TabListProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface TabTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  closable?: boolean;
  onClose?: () => void;
}
export interface TabContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface TabsCtx {
  value: string;
  onValueChange: (v: string) => void;
  variant: "line" | "enclosed" | "pill";
  fullWidth: boolean;
}

const TabsContext = React.createContext<TabsCtx | null>(null);

function useTabsContext() {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("Tabs compound components must be used within <Tabs>");
  return ctx;
}

// ---------------------------------------------------------------------------
// Tabs Root
// ---------------------------------------------------------------------------

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  function Tabs(props, ref) {
    const {
      className,
      value: valueProp,
      defaultValue = "",
      onValueChange,
      variant = "line",
      fullWidth = false,
      children,
      ...rest
    } = props;

    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const isControlled = valueProp !== undefined;
    const value = isControlled ? valueProp : internalValue;

    const handleChange = React.useCallback(
      (v: string) => {
        if (!isControlled) setInternalValue(v);
        onValueChange?.(v);
      },
      [isControlled, onValueChange],
    );

    return (
      <TabsContext.Provider value={{ value, onValueChange: handleChange, variant, fullWidth }}>
        <div
          ref={ref}
          className={cn("flex flex-col", className)}
          {...stateAttrs({ component: "tabs" })}
          {...rest}
        >
          {children}
        </div>
      </TabsContext.Provider>
    );
  },
);

// ---------------------------------------------------------------------------
// TabList
// ---------------------------------------------------------------------------

const TabList = React.forwardRef<HTMLDivElement, TabListProps>(
  function TabList({ className, children, ...props }, ref) {
    const { variant, fullWidth } = useTabsContext();

    // Keyboard navigation (arrow keys)
    const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
      const triggers = Array.from(
        (e.currentTarget as HTMLElement).querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])'),
      );
      const current = triggers.indexOf(e.target as HTMLButtonElement);
      if (current === -1) return;

      let next = -1;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        next = (current + 1) % triggers.length;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        next = (current - 1 + triggers.length) % triggers.length;
      } else if (e.key === "Home") {
        next = 0;
      } else if (e.key === "End") {
        next = triggers.length - 1;
      }

      if (next >= 0) {
        e.preventDefault();
        triggers[next].focus();
        triggers[next].click();
      }
    }, []);

    return (
      <div
        ref={ref}
        role="tablist"
        className={cn(tabListVariants({ variant, fullWidth }), className)}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </div>
    );
  },
);

// ---------------------------------------------------------------------------
// TabTrigger
// ---------------------------------------------------------------------------

const TabTrigger = React.forwardRef<HTMLButtonElement, TabTriggerProps>(
  function TabTrigger(props, ref) {
    const { className, value, badge, icon, closable, onClose, children, disabled, ...rest } = props;
    const { value: activeValue, onValueChange, variant, fullWidth } = useTabsContext();

    const isActive = value === activeValue;

    const handleCloseClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onClose?.();
    };

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        tabIndex={isActive ? 0 : -1}
        aria-selected={isActive}
        disabled={disabled}
        data-state={isActive ? "active" : "inactive"}
        className={cn(tabTriggerVariants({ variant, fullWidth }), className)}
        onClick={() => onValueChange(value)}
        {...rest}
      >
        {icon && <span className="shrink-0 [&>svg]:h-4 [&>svg]:w-4" aria-hidden>{icon}</span>}
        <span>{children}</span>
        {badge && <span className="shrink-0">{badge}</span>}
        {closable && (
          <button
            type="button"
            className="ml-1 shrink-0 rounded-sm p-0.5 hover:bg-black/10 dark:hover:bg-white/10"
            onClick={handleCloseClick}
            aria-label="Close tab"
            tabIndex={-1}
          >
            <svg className="h-3 w-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        )}
      </button>
    );
  },
);

// ---------------------------------------------------------------------------
// TabContent
// ---------------------------------------------------------------------------

const TabContent = React.forwardRef<HTMLDivElement, TabContentProps>(
  function TabContent({ className, value, children, ...props }, ref) {
    const { value: activeValue } = useTabsContext();
    if (value !== activeValue) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        tabIndex={0}
        className={cn("mt-3 focus-visible:outline-none", className)}
        data-state="active"
        {...props}
      >
        {children}
      </div>
    );
  },
);

setDisplayName(Tabs, "Tabs");
setDisplayName(TabList, "TabList");
setDisplayName(TabTrigger, "TabTrigger");
setDisplayName(TabContent, "TabContent");

export { Tabs, TabList, TabTrigger, TabContent, tabListVariants, tabTriggerVariants };
