"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { setDisplayName } from "../../system/compose";
import { stateAttrs } from "../../internal/interaction-core/state-attributes";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ContextMenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  danger?: boolean;
  disabled?: boolean;
  separator?: boolean;
  onSelect?: () => void;
}

export interface ContextMenuProps {
  items: ContextMenuItem[];
  children: React.ReactElement;
  onSelect?: (key: string) => void;
  disabled?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function ContextMenu({ items, children, onSelect, disabled = false }: ContextMenuProps) {
  const [open, setOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [focusIndex, setFocusIndex] = React.useState(-1);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const activeItems = React.useMemo(() => items.filter((i) => !i.separator), [items]);

  const close = React.useCallback(() => {
    setOpen(false);
    setFocusIndex(-1);
  }, []);

  // Context menu trigger
  const handleContextMenu = React.useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;
      e.preventDefault();
      setPosition({ x: e.clientX, y: e.clientY });
      setOpen(true);
      setFocusIndex(0);
    },
    [disabled],
  );

  // Close on outside click or escape
  React.useEffect(() => {
    if (!open) return;

    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) close();
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open, close]);

  // Keyboard navigation
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (!open) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusIndex((i) => (i + 1) % activeItems.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusIndex((i) => (i - 1 + activeItems.length) % activeItems.length);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const item = activeItems[focusIndex];
        if (item && !item.disabled) {
          item.onSelect?.();
          onSelect?.(item.key);
          close();
        }
      }
    },
    [open, focusIndex, activeItems, onSelect, close],
  );

  // Viewport adjustment
  const adjustedStyle = React.useMemo(() => {
    const style: React.CSSProperties = {
      position: "fixed",
      left: position.x,
      top: position.y,
      zIndex: 50,
    };
    return style;
  }, [position]);

  const child = React.Children.only(children);

  return (
    <>
      {React.cloneElement(child, { onContextMenu: handleContextMenu } as Record<string, unknown>)}

      {open && (
        <div
          ref={menuRef}
          role="menu"
          style={adjustedStyle}
          className={cn(
            "min-w-[180px] rounded-lg border border-border-subtle bg-surface-default shadow-xl p-1",
            "animate-in fade-in-0 zoom-in-95 duration-150",
          )}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
          {...stateAttrs({ component: "context-menu" })}
        >
          {items.map((item, i) =>
            item.separator ? (
              <div key={`sep-${i}`} className="my-1 h-px bg-border-subtle" role="separator" />
            ) : (
              <button
                key={item.key}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-sm",
                  "transition-colors outline-none",
                  item.danger
                    ? "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                    : "text-text-primary hover:bg-surface-muted",
                  item.disabled && "opacity-50 pointer-events-none",
                  activeItems.indexOf(item) === focusIndex && "bg-surface-muted",
                )}
                onClick={() => {
                  item.onSelect?.();
                  onSelect?.(item.key);
                  close();
                }}
                tabIndex={-1}
              >
                {item.icon && (
                  <span className="shrink-0 [&>svg]:h-4 [&>svg]:w-4 text-text-secondary" aria-hidden>
                    {item.icon}
                  </span>
                )}
                <span className="flex-1 text-left">{item.label}</span>
                {item.shortcut && (
                  <kbd className="ml-auto text-xs text-text-disabled font-mono">{item.shortcut}</kbd>
                )}
              </button>
            ),
          )}
        </div>
      )}
    </>
  );
}

setDisplayName(ContextMenu, "ContextMenu");

export { ContextMenu };
