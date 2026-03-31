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

const toTestIdSuffix = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const resolveActiveKey = (items: ShellHeaderNavbarItem[], currentPath: string) => {
  const normalizedPath = currentPath || '/';
  const sortedItems = [...items].sort((a, b) => b.key.length - a.key.length);
  const matchedItem = sortedItems.find((item) => {
    if (item.key === '/') return normalizedPath === '/';
    return normalizedPath.startsWith(item.key);
  });
  return matchedItem?.key ?? (normalizedPath === '/' ? '/' : null);
};

const menuBarPreset = createMenuBarPreset('ghost_utility');

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
  const activeKey = React.useMemo(() => resolveActiveKey(items, currentPath), [currentPath, items]);

  const menuBarItems = React.useMemo(
    () =>
      createMenuBarItemsFromRoutes(
        (items.map((item) => ({
          value: item.key,
          label: item.label,
          href: item.path,
          current: item.key === activeKey,
          dataTestId: `${itemTestIdPrefix}-${toTestIdSuffix(item.key)}`,
        })) as unknown as import('@mfe/design-system').MenuBarRouteInput[]),
        { currentValue: activeKey ?? undefined },
      ).map((item) => ({
        ...item,
        itemClassName: 'min-h-0! rounded-full! px-3! py-1! text-xs! font-medium!',
        activeClassName:
          'border-[var(--accent-primary-hover)]! bg-[var(--accent-primary)]! text-[var(--action-primary-text)]! shadow-xs!',
      })),
    [activeKey, itemTestIdPrefix, items],
  );

  const handleMenuItemClick = React.useCallback(
    (value: string, event: React.MouseEvent<HTMLElement>) => {
      const targetItem = items.find((item) => item.key === value);
      if (!targetItem) return;
      event.preventDefault();
      onNavigate(targetItem.path);
    },
    [onNavigate, items],
  );

  return (
    <div className={clsx('min-w-0 flex-1', className)} data-testid="shell-header-navbar">
      <MenuBar
        {...menuBarPreset}
        ariaLabel={ariaLabel}
        labelVisibility="always"
        currentPath={currentPath}
        items={menuBarItems}
        overflowBehavior="collapse-to-more"
        overflowLabel={morePagesLabel}
        onItemClick={handleMenuItemClick}
        endSlot={utility}
        className="min-w-0"
      />
    </div>
  );
};
