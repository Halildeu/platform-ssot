import React, { useState, useRef, useEffect } from 'react';
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
  const accessState = resolveAccessState(access);
  const isReadonly = accessState.isReadonly;
  const resolvedDisabled = accessState.isDisabled;
  const interactionState: AccessLevel = resolvedDisabled
    ? 'disabled'
    : isReadonly
      ? 'readonly'
      : accessState.state;

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [open]);

  if (accessState.isHidden) {
    return null;
  }

  const handleToggle = withAccessGuard<React.MouseEvent<HTMLButtonElement>>(
    interactionState,
    () => setOpen((prev) => !prev),
    resolvedDisabled,
  );

  return (
    <div className={`relative inline-block ${className}`} ref={ref} data-access-state={accessState.state}>
      <button
        type="button"
        onClick={handleToggle}
        className="inline-flex items-center justify-center rounded-md border border-border-subtle bg-surface-panel px-3 py-2 text-sm font-medium text-text-primary hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-[var(--accent-focus)] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          color: 'var(--text-primary)',
          backgroundColor: 'var(--surface-panel-bg, var(--surface-bg, transparent))',
          borderColor: 'var(--border-subtle)',
        }}
        aria-disabled={resolvedDisabled || isReadonly || undefined}
        aria-readonly={isReadonly || undefined}
        disabled={resolvedDisabled || isReadonly}
        title={accessReason}
      >
        {trigger}
      </button>
      {open ? (
        <div
          className={`absolute z-50 mt-2 w-48 rounded-lg border border-border-subtle bg-surface-panel ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
          style={{
            backgroundColor: 'var(--surface-panel-bg, var(--surface-bg, #fff))',
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
                    backgroundColor: 'var(--surface-panel-bg, transparent)',
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
