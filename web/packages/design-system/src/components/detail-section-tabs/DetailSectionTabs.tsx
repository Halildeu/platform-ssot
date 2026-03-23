import React from 'react';
import { resolveAccessState, accessStyles, type AccessControlledProps } from '../../internal/access-controller';
import { cn } from '../../utils/cn';
import {
  SectionTabs,
  type SectionTabsBreakpoint,
  type SectionTabsClasses,
  type SectionTabsDensity,
} from './SectionTabs';

export type DetailSectionTabItem = {
  id: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  badge?: React.ReactNode;
  dataTestId?: string;
  disabled?: boolean;
  itemClassName?: string;
  activeClassName?: string;
  badgeClassName?: string;
};

export type DetailSectionTabsProps = AccessControlledProps & {
  /** Tab items to render. */
  tabs: DetailSectionTabItem[];
  /** Currently active tab identifier. */
  activeTabId: string;
  /** Callback fired when the active tab changes. */
  onTabChange: (tabId: string) => void;
  /** Accessible label for the tab strip. */
  ariaLabel?: string;
  /** Prefix for generated test IDs. */
  testIdPrefix?: string;
  /** Additional CSS class name. */
  className?: string;
  /** Whether the tab strip sticks to the top on scroll. */
  sticky?: boolean;
  /** Spacing density variant. */
  density?: SectionTabsDensity;
  /** Breakpoint at which tabs switch from scroll to wrap layout. */
  autoWrapBreakpoint?: SectionTabsBreakpoint;
  /** Custom class name overrides for sub-elements. */
  classes?: SectionTabsClasses;
};

/** Horizontal tab strip for detail views, with sticky positioning, badge support, and responsive auto-wrap. */
export const DetailSectionTabs: React.FC<DetailSectionTabsProps> = ({
  tabs,
  activeTabId,
  onTabChange,
  ariaLabel = 'Detay sekmeleri',
  testIdPrefix,
  className,
  sticky = true,
  density = 'compact',
  autoWrapBreakpoint = 'xl',
  classes,
  access,
  accessReason,
}) => {
  const accessState = resolveAccessState(access);
  if (accessState.isHidden) return null;
  const items = React.useMemo(
    () =>
      tabs.map((tab) => ({
        value: tab.id,
        label: tab.label,
        description: tab.description,
        badge: tab.badge,
        dataTestId: tab.dataTestId ?? (testIdPrefix ? `${testIdPrefix}-tab-${tab.id}` : undefined),
        disabled: tab.disabled,
        itemClassName: tab.itemClassName,
        activeClassName: tab.activeClassName,
        badgeClassName: tab.badgeClassName,
      })),
    [tabs, testIdPrefix],
  );

  return (
    <div
      data-component="detail-section-tabs"
      className={cn(sticky && 'sticky top-4 z-10', className, accessStyles(accessState.state))}
      title={accessReason}
    >
      <SectionTabs
        items={items}
        value={activeTabId}
        onValueChange={onTabChange}
        ariaLabel={ariaLabel}
        density={density}
        layout="auto"
        autoWrapBreakpoint={autoWrapBreakpoint}
        descriptionDisplay="tooltip"
        descriptionVisibility="hover"
        classes={{
          ...classes,
          viewport: cn('pb-0', classes?.viewport),
        }}
      />
    </div>
  );
};

DetailSectionTabs.displayName = 'DetailSectionTabs';
