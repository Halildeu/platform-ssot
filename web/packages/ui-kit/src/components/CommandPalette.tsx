import React, { useEffect, useId, useMemo, useState } from 'react';
import { Badge } from './Badge';
import { Empty } from './Empty';
import { TextInput } from './TextInput';
import { resolveAccessState, type AccessControlledProps } from '../runtime/access-controller';

export interface CommandPaletteItem {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  group?: string;
  shortcut?: string;
  keywords?: string[];
  disabled?: boolean;
  badge?: React.ReactNode;
}

export interface CommandPaletteProps extends AccessControlledProps {
  open: boolean;
  items: CommandPaletteItem[];
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  onSelect?: (id: string, item: CommandPaletteItem) => void;
  onClose?: () => void;
  placeholder?: string;
  emptyStateLabel?: string;
  footer?: React.ReactNode;
}

const stringify = (value: React.ReactNode) => {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }
  return '';
};

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  items,
  title = 'Command palette',
  subtitle = 'Search actions, routes and AI-assisted workflows from one place.',
  query,
  defaultQuery = '',
  onQueryChange,
  onSelect,
  onClose,
  placeholder = 'Search command, route, policy...',
  emptyStateLabel = 'No matching commands found.',
  footer,
  access = 'full',
  accessReason,
}) => {
  const accessState = resolveAccessState(access);
  const [internalQuery, setInternalQuery] = useState(defaultQuery);
  const [activeIndex, setActiveIndex] = useState(0);
  const titleId = useId();
  const descriptionId = useId();
  const isControlled = query !== undefined;
  const currentQuery = isControlled ? query : internalQuery;
  const canExecute = !accessState.isDisabled && !accessState.isReadonly;

  const filteredItems = useMemo(() => {
    const normalized = currentQuery.trim().toLowerCase();
    if (!normalized) return items;
    return items.filter((item) => {
      const haystack = [
        stringify(item.title),
        stringify(item.description),
        item.group ?? '',
        ...(item.keywords ?? []),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [currentQuery, items]);

  useEffect(() => {
    if (!open) return;
    const firstEnabled = filteredItems.findIndex((item) => !item.disabled);
    setActiveIndex(firstEnabled === -1 ? 0 : firstEnabled);
  }, [filteredItems, open]);

  useEffect(() => {
    if (!open || !onClose) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open || accessState.isHidden) {
    return null;
  }

  const setQueryValue = (value: string) => {
    if (!isControlled) {
      setInternalQuery(value);
    }
    onQueryChange?.(value);
  };

  const groupedItems = filteredItems.reduce<Record<string, CommandPaletteItem[]>>((acc, item) => {
    const key = item.group ?? 'General';
    acc[key] ??= [];
    acc[key].push(item);
    return acc;
  }, {});

  const orderedItems = filteredItems;

  const handleSelect = (item: CommandPaletteItem) => {
    if (item.disabled || !canExecute) {
      return;
    }
    onSelect?.(item.id, item);
    onClose?.();
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (orderedItems.length === 0) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      let next = activeIndex;
      do {
        next = (next + 1) % orderedItems.length;
      } while (orderedItems[next]?.disabled && next !== activeIndex);
      setActiveIndex(next);
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      let next = activeIndex;
      do {
        next = (next - 1 + orderedItems.length) % orderedItems.length;
      } while (orderedItems[next]?.disabled && next !== activeIndex);
      setActiveIndex(next);
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSelect(orderedItems[activeIndex]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 py-10" data-access-state={accessState.state}>
      <div
        className="absolute inset-0 bg-surface-overlay"
        style={{
          backgroundColor:
            'color-mix(in srgb, var(--surface-overlay-bg) calc(var(--overlay-intensity) * 1%), transparent)',
          opacity: 'var(--overlay-opacity)',
        }}
        onClick={() => onClose?.()}
        role="presentation"
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-[32px] border border-border-subtle bg-surface-panel shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <div className="border-b border-border-subtle px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div id={titleId} className="text-lg font-semibold text-text-primary">{title}</div>
              <div id={descriptionId} className="text-sm leading-6 text-text-secondary">{subtitle}</div>
            </div>
            {onClose ? (
              <button
                type="button"
                onClick={() => onClose()}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle bg-surface-default text-text-secondary hover:bg-surface-muted"
                aria-label="Close command palette"
                title={accessReason}
              >
                ×
              </button>
            ) : null}
          </div>
          <div className="mt-4">
            <TextInput
              label="Command search"
              description="Search by route, command or policy cue."
              value={currentQuery}
              onValueChange={setQueryValue}
              onKeyDown={handleInputKeyDown}
              placeholder={placeholder}
              leadingVisual={<span aria-hidden="true">⌘</span>}
              trailingVisual={<Badge tone="muted">AI</Badge>}
              access={accessState.isReadonly ? 'readonly' : access}
              accessReason={accessReason}
            />
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-4 py-4">
          {filteredItems.length === 0 ? (
            <div className="rounded-2xl border border-border-subtle bg-surface-canvas p-5">
              <Empty description={emptyStateLabel} />
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedItems).map(([group, groupItems]) => (
                <section key={group} className="rounded-2xl border border-border-subtle bg-surface-canvas p-3">
                  <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-text-subtle">{group}</div>
                  <div className="space-y-2">
                    {groupItems.map((item) => {
                      const index = orderedItems.findIndex((candidate) => candidate.id === item.id);
                      const isActive = index === activeIndex;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelect(item)}
                          disabled={item.disabled || !canExecute}
                          className={`flex w-full items-start justify-between gap-4 rounded-2xl border px-4 py-3 text-left transition ${
                            isActive
                              ? 'border-action-primary-border bg-action-primary-soft'
                              : 'border-border-subtle bg-surface-panel hover:bg-surface-muted'
                          } ${item.disabled || !canExecute ? 'cursor-not-allowed opacity-60' : ''}`}
                          aria-current={isActive ? 'true' : undefined}
                        >
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-text-primary">{item.title}</div>
                            {item.description ? (
                              <div className="mt-1 text-sm leading-6 text-text-secondary">{item.description}</div>
                            ) : null}
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            {item.badge ? item.badge : null}
                            {item.shortcut ? <Badge tone="muted">{item.shortcut}</Badge> : null}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        {footer ? <div className="border-t border-border-subtle px-6 py-4">{footer}</div> : null}
      </div>
    </div>
  );
};

export default CommandPalette;
