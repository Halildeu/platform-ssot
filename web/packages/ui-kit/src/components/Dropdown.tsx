import React, { useEffect, useId, useRef, useState } from 'react';
import {
  resolveAccessState,
  withAccessGuard,
  type AccessControlledProps,
  type AccessLevel,
} from '../runtime/access-controller';

type DropdownItem = {
  key: string;
  label: React.ReactNode;
  disabled?: boolean;
};

export type DropdownProps = {
  trigger: React.ReactNode;
  items: DropdownItem[];
  onSelect?: (key: string) => void;
  align?: 'left' | 'right';
  className?: string;
} & AccessControlledProps;

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  onSelect,
  align = 'left',
  className = '',
  access = 'full',
  accessReason,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const menuId = useId();
  const accessState = resolveAccessState(access);
  const isReadonly = accessState.isReadonly;
  const resolvedDisabled = accessState.isDisabled;
  const interactionState: AccessLevel = resolvedDisabled
    ? 'disabled'
    : isReadonly
      ? 'readonly'
      : accessState.state;

  useEffect(() => {
    if (!open) return undefined;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('click', handleClickOutside);
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  if (accessState.isHidden) {
    return null;
  }

  const handleToggle = withAccessGuard<React.MouseEvent<HTMLButtonElement>>(
    interactionState,
    () => setOpen((prev) => !prev),
    resolvedDisabled,
  );

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (interactionState !== 'full') {
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
    }
  };

  return (
    <div className={`relative inline-block ${className}`} ref={ref} data-access-state={accessState.state}>
      <button
        type="button"
        onClick={handleToggle}
        onKeyDown={handleTriggerKeyDown}
        className="inline-flex items-center justify-center rounded-md border border-border-subtle bg-surface-panel px-3 py-2 text-sm font-medium text-text-primary hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-[var(--accent-focus)] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          color: 'var(--text-primary)',
          backgroundColor: 'var(--surface-panel-bg)',
          borderColor: 'var(--border-subtle)',
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-disabled={resolvedDisabled || isReadonly || undefined}
        aria-readonly={isReadonly || undefined}
        disabled={resolvedDisabled || isReadonly}
        title={accessReason}
      >
        {trigger}
      </button>
      {open ? (
        <div
          id={menuId}
          className={`absolute z-50 mt-2 w-48 rounded-lg border border-border-subtle bg-surface-panel ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
          role="menu"
          style={{
            backgroundColor: 'var(--surface-panel-bg)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-primary)',
            boxShadow: 'var(--elevation-overlay)',
          }}
        >
          <ul className="py-2 text-sm text-text-primary" style={{ color: 'var(--text-primary)' }}>
            {items.map((item) => (
              <li key={item.key}>
                <button
                  type="button"
                  role="menuitem"
                  disabled={item.disabled}
                  onClick={() => {
                    if (item.disabled) return;
                    onSelect?.(item.key);
                    setOpen(false);
                  }}
                  className={`block w-full px-4 py-2 text-left hover:bg-surface-muted focus:outline-none ${
                    item.disabled ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                  style={{
                    color: 'var(--text-primary)',
                    backgroundColor: 'transparent',
                  }}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};
