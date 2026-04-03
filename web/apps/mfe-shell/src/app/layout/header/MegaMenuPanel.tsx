import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ResolvedNavItem } from './useHeaderNavigation';

/* ------------------------------------------------------------------ */
/*  MegaMenuPanel — Content grid inside a mega menu popover            */
/*                                                                     */
/*  Keyboard: ↑↓ vertical, ←→ horizontal (2-col grid),               */
/*            Home/End first/last, Enter navigate, Escape close        */
/* ------------------------------------------------------------------ */

interface MegaMenuPanelProps {
  items: ResolvedNavItem[];
  activeItemKey: string | null;
  onClose: () => void;
}

export const MegaMenuPanel: React.FC<MegaMenuPanelProps> = ({
  items,
  activeItemKey,
  onClose,
}) => {
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const cols = items.length > 3 ? 2 : 1;
  const colsClass = cols === 2 ? 'grid-cols-2' : 'grid-cols-1';

  // Auto-focus first item on mount
  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      const first = menuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]');
      first?.focus();
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  const handleItemClick = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const focusable = Array.from(
      e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'),
    );
    const current = focusable.indexOf(document.activeElement as HTMLButtonElement);
    if (current < 0) return;

    let next = current;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        next = current + cols < focusable.length ? current + cols : current % cols;
        // Wrap within column: if past end, go to top of same column
        if (next >= focusable.length) next = current % cols;
        break;
      case 'ArrowUp':
        e.preventDefault();
        next = current - cols >= 0 ? current - cols : focusable.length - (cols - (current % cols));
        if (next >= focusable.length) next = focusable.length - 1;
        if (next < 0) next = 0;
        break;
      case 'ArrowRight':
        e.preventDefault();
        next = current + 1 < focusable.length ? current + 1 : 0;
        break;
      case 'ArrowLeft':
        e.preventDefault();
        next = current - 1 >= 0 ? current - 1 : focusable.length - 1;
        break;
      case 'Home':
        e.preventDefault();
        next = 0;
        break;
      case 'End':
        e.preventDefault();
        next = focusable.length - 1;
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        return;
      default:
        return;
    }

    focusable[next]?.focus();
  };

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label="Alt menü"
      className={`grid ${colsClass} gap-0.5 p-1.5`}
      style={{ minWidth: cols === 2 ? 400 : 220 }}
      onKeyDown={handleKeyDown}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = item.key === activeItemKey;

        return (
          <button
            key={item.key}
            type="button"
            role="menuitem"
            tabIndex={-1}
            onClick={() => handleItemClick(item.path)}
            className={`group flex items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-100 ${
              isActive
                ? 'bg-[var(--accent-primary)]/8 text-[var(--accent-primary)]'
                : 'text-text-primary hover:bg-surface-muted'
            }`}
          >
            <Icon
              className={`mt-0.5 h-[18px] w-[18px] shrink-0 transition-colors duration-100 ${
                isActive
                  ? 'text-[var(--accent-primary)]'
                  : 'text-text-subtle group-hover:text-[var(--accent-primary)]'
              }`}
              aria-hidden
            />
            <div className="min-w-0">
              <div className="text-[13px] font-medium leading-tight">{item.label}</div>
              {item.description && (
                <div className="mt-0.5 text-[11px] leading-tight text-text-subtle">
                  {item.description}
                </div>
              )}
            </div>
          </button>
        );
      })}

      {/* Keyboard hint footer */}
      <div className={`${cols === 2 ? 'col-span-2' : ''} mt-1 flex items-center gap-3 border-t border-border-subtle/50 px-3 pt-2 text-[10px] text-text-subtle`}>
        <span><kbd className="rounded border border-border-subtle bg-surface-muted px-1 py-0.5 font-mono text-[9px]">↑↓←→</kbd> gezin</span>
        <span><kbd className="rounded border border-border-subtle bg-surface-muted px-1 py-0.5 font-mono text-[9px]">Enter</kbd> aç</span>
        <span><kbd className="rounded border border-border-subtle bg-surface-muted px-1 py-0.5 font-mono text-[9px]">Esc</kbd> kapat</span>
      </div>
    </div>
  );
};
