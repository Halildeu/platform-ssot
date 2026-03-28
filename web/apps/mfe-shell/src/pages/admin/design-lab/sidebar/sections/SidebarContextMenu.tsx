import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/* ------------------------------------------------------------------ */
/*  SidebarContextMenu — right-click context menu for nav items        */
/*  Copy import • Copy path • Open playground • Open source • Pin      */
/* ------------------------------------------------------------------ */

export type ContextMenuItem = {
  label: string;
  icon?: string;
  shortcut?: string;
  onClick: () => void;
  danger?: boolean;
  divider?: boolean;
};

type ContextMenuState = {
  x: number;
  y: number;
  items: ContextMenuItem[];
} | null;

const ContextMenuContext = React.createContext<{
  show: (e: React.MouseEvent, items: ContextMenuItem[]) => void;
  hide: () => void;
}>({
  show: () => {},
  hide: () => {},
});

export function useContextMenu() {
  return React.useContext(ContextMenuContext);
}

export const ContextMenuProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [menu, setMenu] = useState<ContextMenuState>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const show = useCallback((e: React.MouseEvent, items: ContextMenuItem[]) => {
    e.preventDefault();
    e.stopPropagation();

    // Position menu within viewport
    const x = Math.min(e.clientX, window.innerWidth - 220);
    const y = Math.min(e.clientY, window.innerHeight - items.length * 36 - 16);
    setMenu({ x, y, items });
  }, []);

  const hide = useCallback(() => setMenu(null), []);

  // Close on click outside or Escape
  useEffect(() => {
    if (!menu) return;

    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenu(null);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenu(null);
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [menu]);

  return (
    <ContextMenuContext.Provider value={{ show, hide }}>
      {children}
      {menu &&
        createPortal(
          <div
            ref={menuRef}
            className="
              fixed z-[100] min-w-[200px] rounded-lg border border-border-default
              bg-surface-default shadow-lg py-1
              animate-in fade-in zoom-in-95 duration-100
            "
            style={{ left: menu.x, top: menu.y }}
            role="menu"
            aria-label="Context menu"
          >
            {menu.items.map((item, i) =>
              item.divider ? (
                <hr key={i} className="my-1 border-border-subtle" />
              ) : (
                <button
                  key={i}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    item.onClick();
                    setMenu(null);
                  }}
                  className={`
                    flex w-full items-center justify-between gap-3 px-3 py-1.5
                    text-[13px] transition-colors cursor-pointer
                    ${
                      item.danger
                        ? "text-state-danger-text hover:bg-state-danger-bg"
                        : "text-text-primary hover:bg-surface-canvas"
                    }
                  `}
                >
                  <span className="flex items-center gap-2">
                    {item.icon && <span className="text-[12px]">{item.icon}</span>}
                    {item.label}
                  </span>
                  {item.shortcut && (
                    <kbd className="text-[10px] text-text-tertiary font-mono">
                      {item.shortcut}
                    </kbd>
                  )}
                </button>
              ),
            )}
          </div>,
          document.body,
        )}
    </ContextMenuContext.Provider>
  );
};

ContextMenuProvider.displayName = "ContextMenuProvider";

/* ------------------------------------------------------------------ */
/*  Helper: build context menu items for a component                   */
/* ------------------------------------------------------------------ */

export function buildComponentMenuItems(opts: {
  name: string;
  importPath?: string;
  playgroundPath?: string;
  isPinned: boolean;
  onTogglePin: () => void;
  onNavigate: (path: string) => void;
}): ContextMenuItem[] {
  const items: ContextMenuItem[] = [];

  if (opts.importPath) {
    items.push({
      label: "Copy import",
      icon: "📋",
      shortcut: "⌘C",
      onClick: () => {
        navigator.clipboard.writeText(
          `import { ${opts.name} } from '@mfe/design-system';`,
        );
      },
    });
  }

  items.push({
    label: "Copy component name",
    icon: "📝",
    onClick: () => {
      navigator.clipboard.writeText(opts.name);
    },
  });

  if (opts.playgroundPath) {
    items.push({
      label: "Open in Playground",
      icon: "🎮",
      onClick: () => opts.onNavigate(opts.playgroundPath!),
    });
  }

  items.push({ label: "", divider: true, onClick: () => {} });

  items.push({
    label: opts.isPinned ? "Remove from favorites" : "Add to favorites",
    icon: opts.isPinned ? "★" : "☆",
    onClick: opts.onTogglePin,
  });

  return items;
}
