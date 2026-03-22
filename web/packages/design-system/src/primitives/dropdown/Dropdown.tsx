import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "../../utils/cn";
import { stateAttrs } from "../../internal/interaction-core";

/* ------------------------------------------------------------------ */
/*  Dropdown — Menu with items, separators, and icons                  */
/* ------------------------------------------------------------------ */

export interface DropdownItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  description?: string;
  disabled?: boolean;
  danger?: boolean;
  onClick?: () => void;
}

export type DropdownSeparator = { type: "separator" };
export type DropdownLabel = { type: "label"; label: string };
export type DropdownEntry = DropdownItem | DropdownSeparator | DropdownLabel;

export type DropdownPlacement = "bottom-start" | "bottom-end" | "top-start" | "top-end";

export interface DropdownProps {
  /** Trigger element */
  children: React.ReactElement;
  items: DropdownEntry[];
  placement?: DropdownPlacement;
  /** Min width in px */
  minWidth?: number;
  className?: string;
  /** Disable the dropdown — prevents opening */
  disabled?: boolean;
}

const placementMap: Record<DropdownPlacement, string> = {
  "bottom-start": "top-full left-0 mt-1",
  "bottom-end": "top-full right-0 mt-1",
  "top-start": "bottom-full left-0 mb-1",
  "top-end": "bottom-full right-0 mb-1",
};

function isSeparator(entry: DropdownEntry): entry is DropdownSeparator {
  return "type" in entry && entry.type === "separator";
}

function isLabel(entry: DropdownEntry): entry is DropdownLabel {
  return "type" in entry && entry.type === "label";
}

export const Dropdown: React.FC<DropdownProps> = ({
  children,
  items,
  placement = "bottom-start",
  minWidth = 180,
  className,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Keyboard navigation
  const actionableItems = items.filter(
    (e): e is DropdownItem => !("type" in e) && !e.disabled,
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      if (!open) {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          setOpen(true);
          setFocusIndex(0);
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusIndex((i) => (i + 1) % actionableItems.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusIndex((i) => (i - 1 + actionableItems.length) % actionableItems.length);
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (focusIndex >= 0) {
            actionableItems[focusIndex]?.onClick?.();
            setOpen(false);
          }
          break;
        case "Escape":
          e.preventDefault();
          setOpen(false);
          break;
      }
    },
    [open, focusIndex, actionableItems, disabled],
  );

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-flex", disabled && "opacity-50 cursor-not-allowed")}
      onKeyDown={handleKeyDown}
      {...stateAttrs({ component: "dropdown", state: open ? "open" : "closed" })}
    >
      {React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
        onClick: disabled ? undefined : () => setOpen((o: boolean) => !o),
        "aria-haspopup": "menu",
        "aria-expanded": open,
        "aria-disabled": disabled || undefined,
        disabled: disabled || undefined,
      })}
      {open && (
        <div
          ref={menuRef}
          role="menu"
          className={cn(
            "absolute z-[1500] overflow-hidden rounded-xl border border-[var(--border-subtle)]",
            "bg-[var(--surface-default)] py-1 shadow-xl",
            "animate-in fade-in-0 zoom-in-95",
            placementMap[placement],
            className,
          )}
          style={{ minWidth }}
        >
          {items.map((entry, i) => {
            if (isSeparator(entry)) {
              return (
                <div
                  key={`sep-${i}`}
                  className="my-1 h-px bg-[var(--border-subtle)]"
                />
              );
            }
            if (isLabel(entry)) {
              return (
                <div
                  key={`label-${i}`}
                  className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]"
                >
                  {entry.label}
                </div>
              );
            }

            const item = entry;
            const actionIdx = actionableItems.indexOf(item);
            const isFocused = actionIdx === focusIndex;

            return (
              <button
                key={item.key}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  item.onClick?.();
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3 py-2 text-start text-sm transition",
                  "disabled:pointer-events-none disabled:opacity-40",
                  item.danger
                    ? "text-[var(--state-error-text)] hover:bg-[var(--state-error-bg)]"
                    : "text-[var(--text-primary)] hover:bg-[var(--surface-muted)]",
                  isFocused && "bg-[var(--surface-muted)]",
                )}
              >
                {item.icon && (
                  <span className="shrink-0 [&>svg]:h-4 [&>svg]:w-4 text-[var(--text-secondary)]">
                    {item.icon}
                  </span>
                )}
                <span className="flex min-w-0 flex-col">
                  <span className="truncate font-medium">{item.label}</span>
                  {item.description && (
                    <span className="truncate text-xs text-[var(--text-secondary)]">
                      {item.description}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

Dropdown.displayName = "Dropdown";
