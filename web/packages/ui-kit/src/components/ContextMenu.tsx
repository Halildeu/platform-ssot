import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Button } from './Button';
import {
  resolveAccessState,
  shouldBlockInteraction,
  type AccessControlledProps,
} from '../runtime/access-controller';

export type ContextMenuItem = {
  key: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  shortcut?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
};

export interface ContextMenuProps extends AccessControlledProps {
  items: ContextMenuItem[];
  onSelect?: (key: string, item: ContextMenuItem) => void;
  trigger?: React.ReactNode;
  triggerMode?: 'button' | 'contextmenu';
  buttonLabel?: string;
  title?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: 'left' | 'right';
  className?: string;
  testIdPrefix?: string;
}

const CONTEXT_MENU_WIDTH = 288;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const ContextMenu: React.FC<ContextMenuProps> = ({
  items,
  onSelect,
  trigger,
  triggerMode = 'button',
  buttonLabel = 'Bağlam menüsü',
  title,
  open,
  defaultOpen = false,
  onOpenChange,
  align = 'left',
  className = '',
  access = 'full',
  accessReason,
  testIdPrefix,
}) => {
  const accessState = resolveAccessState(access);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [position, setPosition] = useState<{ left?: number; top?: number }>({});
  const menuId = useId();
  const titleId = useId();
  const ref = useRef<HTMLDivElement | null>(null);
  const resolvedOpen = open ?? uncontrolledOpen;

  const setOpen = (next: boolean) => {
    if (open === undefined) {
      setUncontrolledOpen(next);
    }
    onOpenChange?.(next);
  };

  useEffect(() => {
    if (!resolvedOpen) return undefined;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
      }
    };

    window.addEventListener('click', handleClickOutside);
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [resolvedOpen]);

  if (accessState.isHidden) {
    return null;
  }

  const resolvedItems = useMemo(
    () => items.map((item) => ({ ...item, disabled: item.disabled || shouldBlockInteraction(accessState.state) })),
    [items, accessState.state],
  );
  const itemTestId = (key: string) => (testIdPrefix ? `${testIdPrefix}-item-${key}` : undefined);

  const openAtPointer = (event: React.MouseEvent<HTMLElement>) => {
    if (shouldBlockInteraction(accessState.state)) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    const bounds = ref.current?.getBoundingClientRect();
    if (bounds) {
      const left = clamp(event.clientX - bounds.left, 12, Math.max(12, bounds.width - CONTEXT_MENU_WIDTH - 12));
      const top = clamp(event.clientY - bounds.top, 12, Math.max(12, bounds.height - 220));
      setPosition({ left, top });
    }
    setOpen(true);
  };

  const handleButtonToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (shouldBlockInteraction(accessState.state)) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    setPosition({});
    setOpen(!resolvedOpen);
  };

  const handleItemSelect = (item: ContextMenuItem) => {
    if (item.disabled) {
      return;
    }
    onSelect?.(item.key, item);
    setOpen(false);
  };

  const menuPlacementClass = triggerMode === 'contextmenu'
    ? 'min-w-[18rem]'
    : `${align === 'right' ? 'right-0' : 'left-0'} top-full mt-3 min-w-[18rem]`;

  return (
    <div
      ref={ref}
      className={`relative inline-flex ${triggerMode === 'contextmenu' ? 'w-full' : ''} ${className}`.trim()}
      data-access-state={accessState.state}
      data-testid={testIdPrefix ? `${testIdPrefix}-root` : undefined}
      onContextMenu={triggerMode === 'contextmenu' ? openAtPointer : undefined}
    >
      {triggerMode === 'button' ? (
        <Button
          variant="secondary"
          onClick={handleButtonToggle}
          access={access}
          accessReason={accessReason}
          aria-haspopup="menu"
          aria-expanded={resolvedOpen}
          aria-controls={resolvedOpen ? menuId : undefined}
          data-testid={testIdPrefix ? `${testIdPrefix}-trigger` : undefined}
        >
          {trigger ?? buttonLabel}
        </Button>
      ) : (
        <div
          className="w-full rounded-2xl border border-dashed border-border-subtle bg-surface-muted/70 px-4 py-4 text-sm text-text-secondary"
          title={accessReason}
          data-testid={testIdPrefix ? `${testIdPrefix}-trigger` : undefined}
        >
          {trigger ?? 'Sag tiklayarak baglam menusu ac'}
        </div>
      )}

      {resolvedOpen ? (
        <div
          id={menuId}
          role="menu"
          aria-labelledby={title ? titleId : undefined}
          aria-label={title ? undefined : 'Context menu'}
          className={`absolute z-50 rounded-3xl border border-border-subtle bg-surface-panel p-2 shadow-2xl ${menuPlacementClass}`.trim()}
          data-testid={testIdPrefix ? `${testIdPrefix}-menu` : undefined}
          style={
            triggerMode === 'contextmenu'
              ? {
                  left: position.left ?? 12,
                  top: position.top ?? 12,
                  boxShadow: 'var(--elevation-overlay)',
                }
              : { boxShadow: 'var(--elevation-overlay)' }
          }
        >
          {title ? (
            <div id={titleId} className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-[0.24em] text-text-secondary">
              {title}
            </div>
          ) : null}
          <div className="space-y-1">
            {resolvedItems.map((item) => (
              <button
                key={item.key}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => handleItemSelect(item)}
                data-testid={itemTestId(item.key)}
                className={`flex w-full items-start justify-between gap-3 rounded-2xl px-3 py-3 text-left transition ${
                  item.disabled
                    ? 'cursor-not-allowed opacity-50'
                    : item.danger
                      ? 'hover:bg-state-danger/10'
                      : 'hover:bg-surface-muted'
                }`}
              >
                <span className="min-w-0 space-y-1">
                  <span className={`block text-sm font-semibold ${item.danger ? 'text-state-danger-text' : 'text-text-primary'}`}>
                    {item.label}
                  </span>
                  {item.description ? (
                    <span className="block text-xs leading-5 text-text-secondary">{item.description}</span>
                  ) : null}
                </span>
                {item.shortcut ? (
                  <span className="shrink-0 rounded-full border border-border-subtle px-2 py-1 text-[11px] font-semibold text-text-secondary">
                    {item.shortcut}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ContextMenu;
