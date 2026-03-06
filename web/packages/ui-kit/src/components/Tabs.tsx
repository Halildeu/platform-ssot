import React from 'react';
import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  resolveAccessState,
  type AccessControlledProps,
} from '../runtime/access-controller';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type TabsAppearance = 'underline' | 'pill';
export type TabsSize = 'sm' | 'md' | 'lg';
export type TabsOrientation = 'horizontal' | 'vertical';
export type TabsActivationMode = 'auto' | 'manual';

export interface TabsItem {
  value: string;
  label: React.ReactNode;
  content?: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  description?: React.ReactNode;
  tabClassName?: string;
  panelClassName?: string;
}

export interface TabsProps extends AccessControlledProps {
  items: TabsItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  appearance?: TabsAppearance;
  size?: TabsSize;
  orientation?: TabsOrientation;
  activationMode?: TabsActivationMode;
  listLabel?: string;
  fullWidth?: boolean;
  keepMounted?: boolean;
  className?: string;
  listClassName?: string;
  panelsClassName?: string;
}

const listClassByAppearance: Record<TabsAppearance, string> = {
  underline: 'gap-2 border-b border-border-subtle',
  pill: 'gap-2 rounded-2xl border border-border-subtle bg-surface-panel p-1',
};

const tabClassByAppearance: Record<TabsAppearance, string> = {
  underline:
    'rounded-t-xl border-b-2 border-transparent text-text-secondary hover:text-text-primary data-[active=true]:border-[var(--accent-primary)] data-[active=true]:text-text-primary',
  pill:
    'rounded-xl border border-transparent text-text-secondary hover:bg-surface-muted hover:text-text-primary data-[active=true]:border-border-default data-[active=true]:bg-surface-default data-[active=true]:text-text-primary data-[active=true]:shadow-sm',
};

const tabClassBySize: Record<TabsSize, string> = {
  sm: 'min-h-9 px-3 py-2 text-sm',
  md: 'min-h-10 px-4 py-2.5 text-sm',
  lg: 'min-h-11 px-5 py-3 text-base',
};

const listClassByOrientation: Record<TabsOrientation, string> = {
  horizontal: 'flex flex-wrap items-stretch',
  vertical: 'flex flex-col items-stretch',
};

const panelSpacingByOrientation: Record<TabsOrientation, string> = {
  horizontal: 'pt-4',
  vertical: 'pl-4',
};

function getFirstEnabledValue(items: TabsItem[]): string {
  return items.find((item) => !item.disabled)?.value ?? items[0]?.value ?? '';
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  {
    items,
    value,
    defaultValue,
    onValueChange,
    appearance = 'underline',
    size = 'md',
    orientation = 'horizontal',
    activationMode = 'auto',
    listLabel = 'Tabs',
    fullWidth = false,
    keepMounted = false,
    className,
    listClassName,
    panelsClassName,
    access = 'full',
    accessReason,
  },
  ref,
) {
  const accessState = resolveAccessState(access);
  const listId = React.useId();
  const firstEnabledValue = React.useMemo(() => getFirstEnabledValue(items), [items]);
  const isControlled = typeof value === 'string';
  const [internalValue, setInternalValue] = React.useState<string>(() => defaultValue ?? firstEnabledValue);
  const selectedValue = React.useMemo(() => {
    const candidate = isControlled ? value : internalValue;
    if (candidate && items.some((item) => item.value === candidate)) {
      return candidate;
    }
    return firstEnabledValue;
  }, [firstEnabledValue, internalValue, isControlled, items, value]);
  const [focusedValue, setFocusedValue] = React.useState<string>(selectedValue || firstEnabledValue);
  const tabRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  React.useEffect(() => {
    if (!selectedValue) return;
    if (!items.some((item) => item.value === focusedValue)) {
      setFocusedValue(selectedValue);
      return;
    }
    if (!focusedValue) {
      setFocusedValue(selectedValue);
    }
  }, [focusedValue, items, selectedValue]);

  const enabledItems = React.useMemo(() => items.filter((item) => !item.disabled), [items]);
  const hasPanels = React.useMemo(() => items.some((item) => item.content !== undefined), [items]);

  const commitSelection = React.useCallback(
    (nextValue: string) => {
      if (!nextValue || accessState.isDisabled || accessState.isReadonly) return;
      if (!isControlled) {
        setInternalValue(nextValue);
      }
      onValueChange?.(nextValue);
    },
    [accessState.isDisabled, accessState.isReadonly, isControlled, onValueChange],
  );

  const focusTab = React.useCallback(
    (nextValue: string, selectOnFocus: boolean) => {
      setFocusedValue(nextValue);
      const target = tabRefs.current[nextValue];
      if (target) {
        target.focus();
      }
      if (selectOnFocus) {
        commitSelection(nextValue);
      }
    },
    [commitSelection],
  );

  if (accessState.isHidden || items.length === 0) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn(
        'flex min-w-0 flex-col',
        orientation === 'vertical' && 'gap-0 md:flex-row md:items-start',
        className,
      )}
      data-access-state={accessState.state}
      data-appearance={appearance}
      data-orientation={orientation}
      title={accessReason}
    >
      <div
        role="tablist"
        aria-label={listLabel}
        aria-orientation={orientation}
        className={cn(
          listClassByOrientation[orientation],
          listClassByAppearance[appearance],
          orientation === 'vertical' ? 'md:min-w-[220px]' : 'w-full',
          listClassName,
        )}
      >
        {items.map((item) => {
          const active = item.value === selectedValue;
          const focused = item.value === focusedValue;
          const blocked = Boolean(item.disabled || accessState.isDisabled);
          const readonly = accessState.isReadonly;
          const tabId = `${listId}-${item.value}-tab`;
          const panelId = `${listId}-${item.value}-panel`;

          return (
            <button
              key={item.value}
              ref={(node) => {
                tabRefs.current[item.value] = node;
              }}
              type="button"
              role="tab"
              id={tabId}
              aria-controls={hasPanels ? panelId : undefined}
              aria-selected={active}
              aria-disabled={blocked || readonly || undefined}
              disabled={blocked}
              tabIndex={focused ? 0 : -1}
              data-active={active ? 'true' : 'false'}
              data-readonly={readonly ? 'true' : 'false'}
              className={cn(
                'inline-flex min-w-0 items-center justify-center gap-2 whitespace-nowrap font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-focus)] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
                fullWidth && orientation === 'horizontal' && 'flex-1',
                orientation === 'vertical' && 'justify-start text-left',
                tabClassByAppearance[appearance],
                tabClassBySize[size],
                readonly && 'cursor-default',
                item.tabClassName,
              )}
              onClick={(event) => {
                if (blocked || readonly) {
                  event.preventDefault();
                  return;
                }
                setFocusedValue(item.value);
                commitSelection(item.value);
              }}
              onFocus={() => setFocusedValue(item.value)}
              onKeyDown={(event) => {
                if (enabledItems.length === 0) return;
                const currentIndex = enabledItems.findIndex((candidate) => candidate.value === item.value);
                if (currentIndex === -1) return;

                const isHorizontal = orientation === 'horizontal';
                const previousKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
                const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';
                let nextIndex: number | null = null;

                if (event.key === nextKey) {
                  nextIndex = (currentIndex + 1) % enabledItems.length;
                } else if (event.key === previousKey) {
                  nextIndex = (currentIndex - 1 + enabledItems.length) % enabledItems.length;
                } else if (event.key === 'Home') {
                  nextIndex = 0;
                } else if (event.key === 'End') {
                  nextIndex = enabledItems.length - 1;
                }

                if (nextIndex !== null) {
                  event.preventDefault();
                  focusTab(enabledItems[nextIndex].value, activationMode === 'auto');
                  return;
                }

                if (activationMode === 'manual' && (event.key === 'Enter' || event.key === ' ')) {
                  event.preventDefault();
                  if (!blocked && !readonly) {
                    commitSelection(item.value);
                  }
                }
              }}
            >
              {item.icon ? <span aria-hidden="true" className="inline-flex shrink-0 items-center">{item.icon}</span> : null}
              <span className="min-w-0 truncate">{item.label}</span>
              {item.badge ? <span className="inline-flex shrink-0 items-center">{item.badge}</span> : null}
            </button>
          );
        })}
      </div>
      {hasPanels ? (
        <div className={cn('min-w-0 flex-1', panelSpacingByOrientation[orientation], panelsClassName)}>
          {items.map((item) => {
            const active = item.value === selectedValue;
            const tabId = `${listId}-${item.value}-tab`;
            const panelId = `${listId}-${item.value}-panel`;
            if (!keepMounted && !active) {
              return null;
            }
            return (
              <div
                key={item.value}
                id={panelId}
                role="tabpanel"
                aria-labelledby={tabId}
                hidden={!active}
                tabIndex={0}
                className={cn(
                  'min-w-0 focus:outline-none',
                  !active && keepMounted && 'hidden',
                  item.panelClassName,
                )}
              >
                {item.description ? (
                  <div className="mb-3 text-sm text-text-secondary">{item.description}</div>
                ) : null}
                {item.content}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
});

export default Tabs;
