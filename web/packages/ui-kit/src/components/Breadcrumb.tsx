import React from 'react';
import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  resolveAccessState,
  withAccessGuard,
  type AccessControlledProps,
  type AccessLevel,
} from '../runtime/access-controller';
import LinkInline from './LinkInline';
import Text from './Text';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type BreadcrumbSize = 'sm' | 'md';

export interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  current?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  external?: boolean;
  title?: string;
}

export interface BreadcrumbProps extends AccessControlledProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  size?: BreadcrumbSize;
  maxItems?: number;
  collapseLabel?: string;
  className?: string;
}

type ResolvedItem = BreadcrumbItem & { current: boolean };
type VisibleItem =
  | { type: 'item'; item: ResolvedItem }
  | { type: 'ellipsis'; hiddenLabels: string[] };

const sizeClass: Record<BreadcrumbSize, string> = {
  sm: 'text-xs gap-1.5',
  md: 'text-sm gap-2',
};

const buttonSizeClass: Record<BreadcrumbSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
};

function normalizeItems(items: BreadcrumbItem[]): ResolvedItem[] {
  const hasExplicitCurrent = items.some((item) => item.current);
  return items.map((item, index) => ({
    ...item,
    current: hasExplicitCurrent ? Boolean(item.current) : index === items.length - 1,
  }));
}

function buildVisibleItems(items: ResolvedItem[], maxItems?: number): VisibleItem[] {
  if (!maxItems || maxItems < 4 || items.length <= maxItems) {
    return items.map((item) => ({ type: 'item', item }));
  }

  const tailCount = maxItems - 2;
  const hiddenItems = items.slice(1, items.length - tailCount);
  const tailItems = items.slice(items.length - tailCount);

  return [
    { type: 'item', item: items[0] },
    {
      type: 'ellipsis',
      hiddenLabels: hiddenItems.map((item) => (typeof item.label === 'string' ? item.label : '...')),
    },
    ...tailItems.map((item) => ({ type: 'item', item })),
  ];
}

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  {
    items,
    separator = '/',
    size = 'md',
    maxItems,
    collapseLabel = 'Gizli breadcrumb adimlari',
    className,
    access = 'full',
    accessReason,
  },
  ref,
) {
  const accessState = resolveAccessState(access);
  if (accessState.isHidden || items.length === 0) {
    return null;
  }

  const resolvedItems = normalizeItems(items);
  const visibleItems = buildVisibleItems(resolvedItems, maxItems);
  const blocked = accessState.isDisabled || accessState.isReadonly;
  const interactionState: AccessLevel = blocked ? 'disabled' : accessState.state;

  return (
    <nav
      ref={ref}
      aria-label="breadcrumb"
      data-access-state={accessState.state}
      title={accessReason}
      className={cn('min-w-0', className)}
    >
      <ol className={cn('flex min-w-0 flex-wrap items-center', sizeClass[size])}>
        {visibleItems.map((entry, index) => {
          const showSeparator = index > 0;
          return (
            <li key={entry.type === 'item' ? `${entry.item.title ?? ''}-${index}` : `ellipsis-${index}`} className="flex min-w-0 items-center gap-2">
              {showSeparator ? (
                <span aria-hidden="true" className="text-text-subtle">
                  {separator}
                </span>
              ) : null}
              {entry.type === 'ellipsis' ? (
                <span
                  className="inline-flex items-center rounded-md px-1.5 text-text-subtle"
                  aria-label={collapseLabel}
                  title={entry.hiddenLabels.join(' / ')}
                >
                  ...
                </span>
              ) : entry.item.current ? (
                <Text as="span" weight="semibold" className="truncate text-text-primary">
                  {entry.item.icon ? <span aria-hidden="true" className="mr-1.5 inline-flex items-center">{entry.item.icon}</span> : null}
                  {entry.item.label}
                </Text>
              ) : entry.item.href ? (
                <LinkInline
                  href={entry.item.href}
                  external={entry.item.external}
                  disabled={entry.item.disabled || blocked}
                  onClick={entry.item.onClick as React.MouseEventHandler<HTMLAnchorElement> | undefined}
                  tone="secondary"
                  underline="none"
                  title={entry.item.title}
                  leadingVisual={entry.item.icon ? <span aria-hidden="true">{entry.item.icon}</span> : undefined}
                  className={cn('max-w-[220px] truncate', buttonSizeClass[size])}
                >
                  {entry.item.label}
                </LinkInline>
              ) : entry.item.onClick && !entry.item.disabled && !blocked ? (
                <button
                  type="button"
                  onClick={withAccessGuard<React.MouseEvent<HTMLButtonElement>>(
                    interactionState,
                    entry.item.onClick as React.MouseEventHandler<HTMLButtonElement> | undefined,
                    false,
                  )}
                  className={cn(
                    'inline-flex max-w-[220px] items-center gap-1 rounded-md font-medium text-text-secondary transition hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-focus)] focus-visible:ring-offset-1',
                    buttonSizeClass[size],
                  )}
                  title={entry.item.title}
                >
                  {entry.item.icon ? <span aria-hidden="true">{entry.item.icon}</span> : null}
                  <span className="truncate">{entry.item.label}</span>
                </button>
              ) : (
                <Text as="span" variant="secondary" className="truncate">
                  {entry.item.icon ? <span aria-hidden="true" className="mr-1.5 inline-flex items-center">{entry.item.icon}</span> : null}
                  {entry.item.label}
                </Text>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});

export default Breadcrumb;
