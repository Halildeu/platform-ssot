import React from 'react';
import clsx from 'clsx';
import { MenuBar, createMenuBarItemsFromRoutes, createMenuBarPreset } from '@mfe/design-system';

export type ShellHeaderNavbarItem = {
  key: string;
  path: string;
  label: React.ReactNode;
};

type ShellHeaderNavbarProps = {
  items: ShellHeaderNavbarItem[];
  currentPath: string;
  onNavigate: (path: string) => void;
  ariaLabel: string;
  morePagesLabel: string;
  utility?: React.ReactNode;
  className?: string;
  itemTestIdPrefix?: string;
};

const averageItemWidth = 108;
const layoutPadding = 32;

const toTestIdSuffix = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const rectWithWidth = (width: number): DOMRect =>
  ({
    width,
    height: 40,
    top: 0,
    left: 0,
    right: width,
    bottom: 40,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  }) as DOMRect;

const resolveActiveKey = (items: ShellHeaderNavbarItem[], currentPath: string) => {
  const normalizedPath = currentPath || '/';
  const sortedItems = [...items].sort((a, b) => b.key.length - a.key.length);
  const matchedItem = sortedItems.find((item) => {
    if (item.key === '/') {
      return normalizedPath === '/';
    }
    return normalizedPath.startsWith(item.key);
  });

  if (matchedItem) {
    return matchedItem.key;
  }

  return normalizedPath === '/' ? '/' : null;
};

export const ShellHeaderNavbar: React.FC<ShellHeaderNavbarProps> = ({
  items,
  currentPath,
  onNavigate,
  ariaLabel,
  morePagesLabel,
  utility,
  className,
  itemTestIdPrefix = 'shell-header-nav-item',
}) => {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const utilityRef = React.useRef<HTMLDivElement | null>(null);
  const [visibleItems, setVisibleItems] = React.useState<ShellHeaderNavbarItem[]>(items);
  const [overflowItems, setOverflowItems] = React.useState<ShellHeaderNavbarItem[]>([]);
  const [overflowOpen, setOverflowOpen] = React.useState(false);
  const menuBarPreset = React.useMemo(() => createMenuBarPreset('ghost_utility'), []);
  const activeKey = React.useMemo(() => resolveActiveKey(items, currentPath), [currentPath, items]);

  const measureLayout = React.useCallback(() => {
    const rootWidth =
      rootRef.current?.getBoundingClientRect().width
      || rootRef.current?.clientWidth
      || (typeof window !== 'undefined' ? window.innerWidth : 0);

    if (!rootWidth) {
      setVisibleItems(items);
      setOverflowItems([]);
      return;
    }

    const utilityWidth =
      utilityRef.current?.getBoundingClientRect().width
      || utilityRef.current?.clientWidth
      || (utility ? 120 : 0);
    const availableWidth = Math.max(0, rootWidth - utilityWidth - layoutPadding);
    const maxSlots = Math.max(1, Math.floor(availableWidth / averageItemWidth));
    const needsOverflow = items.length > maxSlots;
    const visibleCount = needsOverflow ? Math.max(1, maxSlots - 1) : items.length;

    setVisibleItems(items.slice(0, visibleCount));
    setOverflowItems(items.slice(visibleCount));
  }, [items, utility]);

  React.useEffect(() => {
    measureLayout();
    if (typeof window === 'undefined') {
      return undefined;
    }

    const frame = window.requestAnimationFrame(measureLayout);
    const handleResize = () => measureLayout();
    window.addEventListener('resize', handleResize);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => measureLayout());
      if (rootRef.current) {
        resizeObserver.observe(rootRef.current);
      }
      if (utilityRef.current) {
        resizeObserver.observe(utilityRef.current);
      }
    }

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
      resizeObserver?.disconnect();
    };
  }, [measureLayout]);

  React.useEffect(() => {
    if (overflowItems.length > 0) {
      measureLayout();
    }
  }, [measureLayout, overflowItems.length]);

  React.useEffect(() => {
    setOverflowOpen(false);
  }, [currentPath]);

  React.useEffect(() => {
    if (!overflowOpen || typeof window === 'undefined') {
      return undefined;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOverflowOpen(false);
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [overflowOpen]);

  const visibleMenuBarItems = React.useMemo(
    () =>
      createMenuBarItemsFromRoutes(
        // Cast needed: mfe-shell uses @types/react@19 (ReactNode includes bigint),
        // design-system uses @types/react@18 (ReactNode excludes bigint).
        (visibleItems.map((item) => ({
          value: item.key,
          label: item.label,
          href: item.path,
          current: item.key === activeKey,
          dataTestId: `${itemTestIdPrefix}-${toTestIdSuffix(item.key)}`,
        })) as unknown as import('@mfe/design-system').MenuBarRouteInput[]),
        {
          currentValue: activeKey ?? undefined,
        },
      ).map((item) => ({
        ...item,
        itemClassName: '!min-h-0 !rounded-full !px-3 !py-1 !text-xs !font-medium',
        activeClassName:
          '!border-[var(--accent-primary-hover)] !bg-[var(--accent-primary)] !text-[var(--action-primary-text)] !shadow-xs',
      })),
    [activeKey, itemTestIdPrefix, visibleItems],
  );

  const overflowHasActive = activeKey ? overflowItems.some((item) => item.key === activeKey) : false;

  const handleMenuItemClick = React.useCallback(
    (value: string, event: React.MouseEvent<HTMLElement>) => {
      const targetItem = visibleItems.find((item) => item.key === value);
      if (!targetItem) {
        return;
      }
      event.preventDefault();
      setOverflowOpen(false);
      onNavigate(targetItem.path);
    },
    [onNavigate, visibleItems],
  );

  return (
    <div ref={rootRef} className={clsx('min-w-0 flex-1', className)} data-testid="shell-header-navbar">
      <MenuBar
        {...menuBarPreset}
        ariaLabel={ariaLabel}
        labelVisibility="always"
        currentPath={currentPath}
        items={visibleMenuBarItems}
        onItemClick={handleMenuItemClick}
        className="min-w-0"
        utility={
          utility || overflowItems.length > 0 ? (
            <div
              ref={utilityRef}
              className="flex items-center gap-2"
              data-testid="shell-header-navbar-utility"
            >
              {utility}
              {overflowItems.length > 0 ? (
                <div className="relative flex-shrink-0">
                  <button
                    type="button"
                    data-testid="shell-header-navbar-overflow-trigger"
                    className={clsx(
                      'inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-medium transition',
                      overflowOpen || overflowHasActive
                        ? 'border-[var(--accent-primary-hover)] bg-[var(--accent-primary)] text-[var(--action-primary-text)] shadow-xs'
                        : 'border-border-subtle bg-surface-muted text-text-secondary hover:border-border-default hover:bg-surface-panel hover:text-text-primary',
                    )}
                    onClick={(event) => {
                      event.stopPropagation();
                      setOverflowOpen((current) => !current);
                    }}
                    aria-haspopup="menu"
                    aria-expanded={overflowOpen}
                    title={morePagesLabel}
                  >
                    ⋯
                  </button>
                  {overflowOpen ? (
                    <div
                      className="absolute right-0 z-50 mt-2 min-w-[220px] rounded-xl border border-border-subtle bg-surface-panel p-2 shadow-xl"
                      onClick={(event) => event.stopPropagation()}
                      data-testid="shell-header-navbar-overflow-menu"
                    >
                      <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wide text-text-subtle">
                        {morePagesLabel}
                      </div>
                      <ul className="flex flex-col gap-2 text-sm text-text-primary">
                        {overflowItems.map((item) => {
                          const isActive = item.key === activeKey;
                          return (
                            <li key={item.key}>
                              <button
                                type="button"
                                data-testid={`shell-header-navbar-overflow-${toTestIdSuffix(item.key)}`}
                                className={clsx(
                                  'w-full rounded-full border px-3 py-1 text-left text-xs font-medium transition',
                                  isActive
                                    ? 'border-[var(--accent-primary-hover)] bg-[var(--accent-primary)] text-[var(--action-primary-text)] shadow-xs'
                                    : 'border-border-subtle bg-surface-default text-text-secondary hover:border-border-default hover:bg-surface-panel hover:text-text-primary',
                                )}
                                onClick={() => {
                                  setOverflowOpen(false);
                                  onNavigate(item.path);
                                }}
                              >
                                {item.label}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : undefined
        }
      />
    </div>
  );
};

export const __shellHeaderNavbarTestUtils = {
  rectWithWidth,
};
