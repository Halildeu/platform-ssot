import React, { useState, useCallback, useId, useMemo } from "react";
import { stateAttrs, focusRingClass } from "../../internal/interaction-core";
import { useRovingTabindex } from "../../internal/overlay-engine";
import { cn } from "../../utils/cn";
import type { SlotProps } from "../../primitives/_shared/slot-types";

/* ------------------------------------------------------------------ */
/*  Tabs — Segmented content switcher                                  */
/*                                                                     */
/*  Variants: line · enclosed · pill                                   */
/*  Supports: icons, badges, disabled tabs, controlled/uncontrolled    */
/* ------------------------------------------------------------------ */

export type TabsVariant = "line" | "enclosed" | "pill" | "standard" | "fullWidth" | "scrollable";
export type TabsSize = "sm" | "md" | "lg";
export type TabsDensity = "compact" | "comfortable" | "spacious";

const tabsDensityStyles: Record<TabsDensity, string> = {
  compact: "gap-0 text-sm py-1",
  comfortable: "",
  spacious: "gap-2 text-base py-3",
};

export interface TabItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
  /** Description shown below tab content */
  description?: React.ReactNode;
  /** Show close button on tab */
  closable?: boolean;
  content: React.ReactNode;
}

export type TabsSlot = "root" | "list" | "trigger" | "content";

export interface TabsProps {
  items: TabItem[];
  variant?: TabsVariant;
  size?: TabsSize;
  /** Controlled active key */
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
  /** Called when a closable tab's close button is clicked */
  onCloseTab?: (key: string) => void;
  /** Full width tabs */
  fullWidth?: boolean;
  className?: string;
  /** Density controls gap, text size, and padding of tab buttons */
  density?: TabsDensity;
  /** Override props (className, style, etc.) on internal slot elements */
  slotProps?: SlotProps<TabsSlot>;
}

/** Normalize legacy variant names to internal variants */
const normalizeVariant = (v: TabsVariant): "line" | "enclosed" | "pill" => {
  if (v === "standard" || v === "scrollable") return "line";
  if (v === "fullWidth") return "line";
  return v as "line" | "enclosed" | "pill";
};

type InternalVariant = "line" | "enclosed" | "pill";

const variantBaseStyles: Record<InternalVariant, string> = {
  line: "border-b border-[var(--border-subtle)]",
  enclosed: "bg-[var(--surface-muted)] rounded-xl p-1",
  pill: "gap-1",
};

const tabStyles: Record<InternalVariant, { active: string; inactive: string }> = {
  line: {
    active: "border-b-2 border-[var(--action-primary)] text-[var(--text-primary)]",
    inactive: "text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-b-2 border-transparent",
  },
  enclosed: {
    active: "bg-[var(--surface-default)] text-[var(--text-primary)] shadow-sm rounded-lg",
    inactive: "text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg",
  },
  pill: {
    active: "bg-[var(--action-primary)] text-white rounded-full shadow-sm",
    inactive: "text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] rounded-full",
  },
};

const sizeStyles: Record<TabsSize, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-5 py-2.5 text-base gap-2",
};

const resolveKey = (item: TabItem): string => item.key;

export const Tabs: React.FC<TabsProps> = ({
  items,
  variant: variantProp = "line",
  size = "md",
  activeKey: activeKeyProp,
  defaultActiveKey,
  onChange,
  onCloseTab,
  fullWidth: fullWidthProp = false,
  className,
  density = "comfortable",
  slotProps,
}) => {
  const variant = normalizeVariant(variantProp);
  const fullWidth = fullWidthProp || variantProp === "fullWidth";
  const controlledKey = activeKeyProp;
  const handleChange = onChange;
  const id = useId();
  const [internalKey, setInternalKey] = useState(
    defaultActiveKey ?? (items[0] ? resolveKey(items[0]) : ""),
  );
  const isControlled = controlledKey !== undefined;
  const currentKey = isControlled ? controlledKey : internalKey;

  const handleSelect = useCallback(
    (key: string) => {
      if (!isControlled) setInternalKey(key);
      handleChange?.(key);
    },
    [isControlled, handleChange],
  );

  /* ---- overlay-engine: roving tabindex for arrow key navigation ---- */
  const disabledIndices = useMemo(
    () => new Set(items.map((item, i) => (item.disabled ? i : -1)).filter((i) => i >= 0)),
    [items],
  );

  const currentIndex = items.findIndex((i) => resolveKey(i) === currentKey);

  const roving = useRovingTabindex({
    itemCount: items.length,
    initialIndex: currentIndex >= 0 ? currentIndex : 0,
    direction: "horizontal",
    loop: true,
    disabledIndices,
    onActiveChange: (index: number) => {
      // When arrow keys move focus, also select the tab
      const key = resolveKey(items[index]);
      handleSelect(key);
    },
  });

  const activeItem = items.find((i) => resolveKey(i) === currentKey);

  return (
    <div {...slotProps?.root} className={cn(className, slotProps?.root?.className)}>
      {/* Tab list */}
      <div
        role="tablist"
        {...slotProps?.list}
        className={cn(
          "flex",
          variantBaseStyles[variant],
          variant === "line" && "-mb-px",
          slotProps?.list?.className,
        )}
      >
        {items.map((item, index) => {
          const itemKey = resolveKey(item);
          const isActive = itemKey === currentKey;
          const rovingProps = roving.getItemProps(index);
          return (
            <button
              key={itemKey}
              type="button"
              role="tab"
              id={`${id}-tab-${itemKey}`}
              aria-selected={isActive}
              aria-controls={`${id}-panel-${itemKey}`}
              tabIndex={rovingProps.tabIndex}
              disabled={item.disabled}
              onClick={() => handleSelect(itemKey)}
              onKeyDown={rovingProps.onKeyDown}
              onFocus={rovingProps.onFocus}
              {...stateAttrs({
                state: isActive ? "active" : "inactive",
                component: "tab",
                disabled: item.disabled,
              })}
              className={cn(
                "inline-flex items-center justify-center font-medium transition-all duration-150",
                "disabled:pointer-events-none disabled:opacity-40",
                focusRingClass("outline"),
                sizeStyles[size],
                density !== "comfortable" && tabsDensityStyles[density],
                isActive
                  ? tabStyles[variant].active
                  : tabStyles[variant].inactive,
                fullWidth && "flex-1",
                slotProps?.trigger?.className,
              )}
            >
              {item.icon && (
                <span className="shrink-0 [&>svg]:h-[1em] [&>svg]:w-[1em]">
                  {item.icon}
                </span>
              )}
              {item.label}
              {item.badge && (
                <span className="shrink-0">{item.badge}</span>
              )}
              {item.closable && onCloseTab && (
                <span
                  role="button"
                  tabIndex={0}
                  aria-label="Close tab"
                  className="ms-1 shrink-0 rounded-sm p-0.5 opacity-60 transition hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(itemKey);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.stopPropagation();
                      e.preventDefault();
                      onCloseTab(itemKey);
                    }
                  }}
                >
                  <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                    <path d="M9 3L3 9M3 3l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab panels */}
      {activeItem && (
        <div
          role="tabpanel"
          id={`${id}-panel-${resolveKey(activeItem)}`}
          aria-labelledby={`${id}-tab-${resolveKey(activeItem)}`}
          {...slotProps?.content}
          className={cn("mt-4", slotProps?.content?.className)}
        >
          {activeItem.description && (
            <div className="mb-3 rounded-[20px] border border-[var(--border-subtle)]/70 bg-[var(--surface-default)] px-4 py-3 text-sm text-[var(--text-secondary)] shadow-sm">
              {activeItem.description}
            </div>
          )}
          {activeItem.content}
        </div>
      )}
    </div>
  );
};

Tabs.displayName = "Tabs";
