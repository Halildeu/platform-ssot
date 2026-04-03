"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { setDisplayName } from "../../system/compose";
import { stateAttrs } from "../../internal/interaction-core/state-attributes";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  collapsible?: boolean;
}

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface AccordionCtx {
  type: "single" | "multiple";
  openItems: string[];
  toggle: (value: string) => void;
}

interface AccordionItemCtx {
  value: string;
  isOpen: boolean;
  disabled: boolean;
}

const AccordionContext = React.createContext<AccordionCtx | null>(null);
const AccordionItemContext = React.createContext<AccordionItemCtx | null>(null);

function useAccordionCtx() {
  const ctx = React.useContext(AccordionContext);
  if (!ctx) throw new Error("Accordion compounds must be within <Accordion>");
  return ctx;
}

function useItemCtx() {
  const ctx = React.useContext(AccordionItemContext);
  if (!ctx) throw new Error("AccordionItem compounds must be within <AccordionItem>");
  return ctx;
}

// ---------------------------------------------------------------------------
// Accordion Root
// ---------------------------------------------------------------------------

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  function Accordion(props, ref) {
    const {
      className,
      type = "single",
      value: valueProp,
      defaultValue,
      onValueChange,
      collapsible = true,
      children,
      ...rest
    } = props;

    const normalizeVal = (v?: string | string[]): string[] => {
      if (!v) return [];
      return Array.isArray(v) ? v : [v];
    };

    const [internalOpen, setInternalOpen] = React.useState(() => normalizeVal(defaultValue));
    const isControlled = valueProp !== undefined;
    const openItems = isControlled ? normalizeVal(valueProp) : internalOpen;

    const toggle = React.useCallback(
      (itemValue: string) => {
        let next: string[];

        if (type === "single") {
          const isOpen = openItems.includes(itemValue);
          next = isOpen && collapsible ? [] : [itemValue];
        } else {
          next = openItems.includes(itemValue)
            ? openItems.filter((v) => v !== itemValue)
            : [...openItems, itemValue];
        }

        if (!isControlled) setInternalOpen(next);
        onValueChange?.(type === "single" ? (next[0] ?? "") : next);
      },
      [type, openItems, collapsible, isControlled, onValueChange],
    );

    return (
      <AccordionContext.Provider value={{ type, openItems, toggle }}>
        <div
          ref={ref}
          className={cn("divide-y divide-border-subtle", className)}
          {...stateAttrs({ component: "accordion" })}
          {...rest}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  },
);

// ---------------------------------------------------------------------------
// AccordionItem
// ---------------------------------------------------------------------------

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  function AccordionItem({ className, value, disabled = false, children, ...props }, ref) {
    const { openItems } = useAccordionCtx();
    const isOpen = openItems.includes(value);

    return (
      <AccordionItemContext.Provider value={{ value, isOpen, disabled }}>
        <div
          ref={ref}
          className={cn("py-0", className)}
          data-state={isOpen ? "open" : "closed"}
          {...props}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  },
);

// ---------------------------------------------------------------------------
// AccordionTrigger
// ---------------------------------------------------------------------------

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  function AccordionTrigger({ className, children, ...props }, ref) {
    const { toggle } = useAccordionCtx();
    const { value, isOpen, disabled } = useItemCtx();

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "flex w-full items-center justify-between py-4 text-sm font-medium text-text-primary",
          "hover:underline transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action-primary focus-visible:ring-offset-1 rounded-sm",
          "disabled:opacity-50 disabled:pointer-events-none",
          "[&[data-state=open]>svg]:rotate-180",
          className,
        )}
        aria-expanded={isOpen}
        disabled={disabled}
        data-state={isOpen ? "open" : "closed"}
        onClick={() => toggle(value)}
        {...props}
      >
        {children}
        <svg
          className="h-4 w-4 shrink-0 text-text-secondary transition-transform duration-200"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>
    );
  },
);

// ---------------------------------------------------------------------------
// AccordionContent
// ---------------------------------------------------------------------------

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  function AccordionContent({ className, children, ...props }, ref) {
    const { isOpen } = useItemCtx();
    const contentRef = React.useRef<HTMLDivElement>(null);

    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "overflow-hidden text-sm text-text-secondary pb-4",
          "animate-in fade-in-0 slide-in-from-top-1 duration-200",
          className,
        )}
        role="region"
        data-state="open"
        {...props}
      >
        {children}
      </div>
    );
  },
);

setDisplayName(Accordion, "Accordion");
setDisplayName(AccordionItem, "AccordionItem");
setDisplayName(AccordionTrigger, "AccordionTrigger");
setDisplayName(AccordionContent, "AccordionContent");

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
