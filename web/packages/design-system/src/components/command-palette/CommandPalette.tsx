"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { setDisplayName } from "../../system/compose";
import { stateAttrs } from "../../internal/interaction-core/state-attributes";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  group?: string;
  keywords?: string[];
  shortcut?: string;
  onSelect: () => void;
}

export interface CommandPaletteProps {
  items: CommandItem[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  emptyMessage?: string;
}

// ---------------------------------------------------------------------------
// Search algorithm
// ---------------------------------------------------------------------------

function fuzzyMatch(query: string, item: CommandItem): boolean {
  const q = query.toLowerCase();
  const targets = [item.label, item.description, ...(item.keywords ?? [])].filter(Boolean);
  return targets.some((t) => t!.toLowerCase().includes(q));
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function CommandPalette(props: CommandPaletteProps) {
  const {
    items,
    open: openProp,
    onOpenChange,
    placeholder = "Type a command or search...",
    emptyMessage = "No results found.",
  } = props;

  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = openProp !== undefined;
  const isOpen = isControlled ? openProp : internalOpen;

  const [query, setQuery] = React.useState("");
  const [focusIndex, setFocusIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  const setOpen = React.useCallback(
    (v: boolean) => {
      if (!isControlled) setInternalOpen(v);
      onOpenChange?.(v);
      if (!v) {
        setQuery("");
        setFocusIndex(0);
      }
    },
    [isControlled, onOpenChange],
  );

  // Cmd+K / Ctrl+K global shortcut
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(!isOpen);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, setOpen]);

  // Focus input when opened
  React.useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  // Filter items
  const filtered = React.useMemo(
    () => (query ? items.filter((item) => fuzzyMatch(query, item)) : items),
    [items, query],
  );

  // Group items
  const grouped = React.useMemo(() => {
    const groups = new Map<string, CommandItem[]>();
    for (const item of filtered) {
      const group = item.group ?? "";
      const arr = groups.get(group) ?? [];
      arr.push(item);
      groups.set(group, arr);
    }
    return groups;
  }, [filtered]);

  // Flat list for keyboard nav
  const flatList = React.useMemo(() => filtered, [filtered]);

  // Keyboard
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusIndex((i) => Math.min(i + 1, flatList.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = flatList[focusIndex];
        if (item) {
          item.onSelect();
          setOpen(false);
        }
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    },
    [flatList, focusIndex, setOpen],
  );

  // Scroll focused item into view
  React.useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${focusIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [focusIndex]);

  if (!isOpen) return null;

  let itemIndex = 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
        onClick={() => setOpen(false)}
        aria-hidden
      />

      {/* Palette */}
      <div
        className={cn(
          "fixed z-50 left-1/2 top-[15%] -translate-x-1/2",
          "w-full max-w-lg rounded-xl border border-border-subtle bg-surface-default shadow-2xl",
          "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200",
          "flex flex-col overflow-hidden",
        )}
        role="dialog"
        aria-label="Command palette"
        onKeyDown={handleKeyDown}
        {...stateAttrs({ component: "command-palette" })}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-border-subtle px-4">
          <svg className="h-4 w-4 text-text-disabled shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 h-12 bg-transparent text-sm text-text-primary placeholder:text-text-disabled outline-none"
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setFocusIndex(0);
            }}
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="hidden sm:inline-flex text-xs text-text-disabled font-mono bg-surface-muted px-1.5 py-0.5 rounded">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[300px] overflow-y-auto p-2" role="listbox">
          {flatList.length === 0 ? (
            <div className="py-6 text-center text-sm text-text-secondary">{emptyMessage}</div>
          ) : (
            Array.from(grouped.entries()).map(([group, groupItems]) => (
              <div key={group || "__ungrouped"}>
                {group && (
                  <div className="px-2 py-1.5 text-xs font-medium text-text-disabled uppercase tracking-wider">
                    {group}
                  </div>
                )}
                {groupItems.map((item) => {
                  const idx = itemIndex++;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="option"
                      aria-selected={idx === focusIndex}
                      data-index={idx}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-sm text-left",
                        "transition-colors outline-none",
                        idx === focusIndex
                          ? "bg-action-primary text-text-inverse"
                          : "text-text-primary hover:bg-surface-muted",
                      )}
                      onClick={() => {
                        item.onSelect();
                        setOpen(false);
                      }}
                      onMouseEnter={() => setFocusIndex(idx)}
                    >
                      {item.icon && (
                        <span className="shrink-0 [&>svg]:h-4 [&>svg]:w-4 opacity-70" aria-hidden>
                          {item.icon}
                        </span>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="truncate">{item.label}</div>
                        {item.description && (
                          <div className={cn("text-xs truncate mt-0.5", idx === focusIndex ? "opacity-70" : "text-text-secondary")}>
                            {item.description}
                          </div>
                        )}
                      </div>
                      {item.shortcut && (
                        <kbd className={cn("text-xs font-mono shrink-0", idx === focusIndex ? "opacity-70" : "text-text-disabled")}>
                          {item.shortcut}
                        </kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

setDisplayName(CommandPalette, "CommandPalette");

export { CommandPalette };
