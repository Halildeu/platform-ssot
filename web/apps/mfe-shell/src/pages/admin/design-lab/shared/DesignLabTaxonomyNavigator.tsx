import React from 'react';
import clsx from 'clsx';
import { Badge, NavigationRail, Text, createNavigationDestinationItems } from '@mfe/design-system';

export type DesignLabTaxonomyNavigatorItem = {
  id: string;
  title: string;
  count: number;
  description?: string | null;
  disabled?: boolean;
  auxiliaryBadgeLabel?: string | null;
  auxiliaryBadgeTone?: 'success' | 'info' | 'warning' | 'danger' | 'muted';
};

type DesignLabTaxonomyNavigatorProps = {
  items: DesignLabTaxonomyNavigatorItem[];
  activeId: string;
  onChange: (sectionId: string) => void;
  variant: 'sidebar' | 'header';
  ariaLabel: string;
  className?: string;
  itemTestIdPrefix?: string;
  toTestIdSuffix?: (value: string) => string;
  showActiveDescription?: boolean;
};

const defaultToTestIdSuffix = (value: string) => value.replace(/[^a-z0-9]+/gi, '-').toLowerCase();

export const DesignLabTaxonomyNavigator: React.FC<DesignLabTaxonomyNavigatorProps> = ({
  items,
  activeId,
  onChange,
  variant,
  ariaLabel,
  className,
  itemTestIdPrefix = 'design-lab-taxonomy',
  toTestIdSuffix = defaultToTestIdSuffix,
  showActiveDescription = false,
}) => {
  if (!items.length) {
    return null;
  }

  const isItemDisabled = React.useCallback(
    (item: DesignLabTaxonomyNavigatorItem) => (item.disabled ?? false) || (item.count === 0 && item.id !== activeId),
    [activeId],
  );

  const activeItem = items.find((item) => item.id === activeId) ?? items[0] ?? null;
  const navRef = React.useRef<HTMLElement | null>(null);
  const itemRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});
  const [scrollState, setScrollState] = React.useState({
    hasOverflow: false,
    canScrollStart: false,
    canScrollEnd: false,
  });

  const updateScrollState = React.useCallback(() => {
    if (variant !== 'header') {
      return;
    }

    const element = navRef.current;
    if (!element) {
      return;
    }

    const maxScrollLeft = Math.max(0, element.scrollWidth - element.clientWidth);
    const hasOverflow = maxScrollLeft > 8;
    const canScrollStart = element.scrollLeft > 8;
    const canScrollEnd = element.scrollLeft < maxScrollLeft - 8;

    setScrollState((current) => {
      if (
        current.hasOverflow === hasOverflow &&
        current.canScrollStart === canScrollStart &&
        current.canScrollEnd === canScrollEnd
      ) {
        return current;
      }

      return {
        hasOverflow,
        canScrollStart,
        canScrollEnd,
      };
    });
  }, [variant]);

  React.useEffect(() => {
    if (variant !== 'header') {
      return undefined;
    }

    updateScrollState();

    const element = navRef.current;
    if (!element) {
      return undefined;
    }

    const handleScroll = () => updateScrollState();
    const handleResize = () => updateScrollState();

    element.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      element.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [items.length, updateScrollState, variant]);

  React.useEffect(() => {
    if (variant !== 'header') {
      return;
    }

    updateScrollState();
    const activeElement = itemRefs.current[activeId];
    if (!activeElement || typeof activeElement.scrollIntoView !== 'function') {
      return;
    }

    activeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });
  }, [activeId, updateScrollState, variant]);

  if (variant === 'sidebar') {
    const railItems = createNavigationDestinationItems(
      items.map((item) => ({
        value: item.id,
        label: item.title,
        description: item.description ?? undefined,
        badge: String(item.count),
        dataTestId: `${itemTestIdPrefix}-${toTestIdSuffix(item.id)}`,
        current: item.id === activeId,
        disabled: isItemDisabled(item),
      })),
      {
        currentValue: activeId,
      },
    );

    return (
      <div className={clsx('space-y-2', className)} data-testid="design-lab-taxonomy-sidebar">
        <NavigationRail
          items={railItems}
          value={activeId}
          onValueChange={onChange}
          ariaLabel={ariaLabel}
          size="sm"
          appearance="ghost"
          labelVisibility="always"
          className="w-full rounded-[20px] bg-surface-canvas p-1"
          classes={{
            item: 'rounded-[16px] text-left',
            label: 'text-sm font-medium',
            description: 'text-[11px] leading-5',
            badge: 'bg-surface-default text-[11px] font-semibold',
          }}
        />
        {showActiveDescription && activeItem?.description ? (
          <Text variant="secondary" className="block text-xs leading-6">
            {activeItem.description}
          </Text>
        ) : null}
      </div>
    );
  }

  return (
    <div className={clsx('relative', className)} data-testid="design-lab-taxonomy-header-shell">
      {scrollState.hasOverflow && scrollState.canScrollStart ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 rounded-l-[22px] bg-gradient-to-r from-surface-default via-surface-default/85 to-transparent"
          data-testid="design-lab-taxonomy-header-fade-start"
        />
      ) : null}
      {scrollState.hasOverflow && scrollState.canScrollEnd ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 rounded-r-[22px] bg-gradient-to-l from-surface-default via-surface-default/90 to-transparent"
          data-testid="design-lab-taxonomy-header-fade-end"
        />
      ) : null}
      <nav
        ref={navRef}
        className="-mx-1 flex gap-3 overflow-x-auto overflow-y-hidden px-1 pb-2 scroll-px-1 snap-x snap-mandatory"
        data-testid="design-lab-taxonomy-header"
        data-scrollable={scrollState.hasOverflow ? 'true' : 'false'}
        aria-label={ariaLabel}
      >
        {items.map((item) => {
          const isActive = item.id === activeId;
          const isDisabled = isItemDisabled(item);

          return (
            <button
              key={item.id}
              ref={(node) => {
                itemRefs.current[item.id] = node;
              }}
              type="button"
              aria-pressed={isActive}
              aria-current={isActive ? 'page' : undefined}
              aria-disabled={isDisabled || undefined}
              data-state={isActive ? 'active' : 'inactive'}
              data-testid={`${itemTestIdPrefix}-${toTestIdSuffix(item.id)}`}
              disabled={isDisabled}
              onClick={() => {
                if (isDisabled) {
                  return;
                }
                onChange(item.id);
              }}
              className={clsx(
                'group min-w-[190px] flex-1 snap-start rounded-[22px] border px-4 py-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-focus)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55 sm:min-w-[220px]',
                isActive
                  ? 'border-action-primary/25 bg-surface-panel shadow-sm ring-1 ring-action-primary/10'
                  : 'border-border-subtle bg-surface-default hover:border-border-default hover:bg-surface-panel',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Text
                    as="div"
                    className={clsx(
                      'text-sm font-semibold tracking-[-0.01em] text-text-primary sm:text-[15px]',
                      isActive && 'text-action-primary',
                    )}
                  >
                    {item.title}
                  </Text>
                  {item.description ? (
                    <Text variant="secondary" className="mt-2 line-clamp-2 block text-[11px] leading-5 sm:text-xs sm:leading-6">
                      {item.description}
                    </Text>
                  ) : null}
                  {item.auxiliaryBadgeLabel ? (
                    <div className="mt-2">
                      <Badge tone={item.auxiliaryBadgeTone ?? 'warning'}>{item.auxiliaryBadgeLabel}</Badge>
                    </div>
                  ) : null}
                </div>
                <Badge tone={isActive ? 'info' : 'muted'}>{item.count}</Badge>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
