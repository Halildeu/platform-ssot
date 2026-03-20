import React from 'react';
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

export type DetailSectionTabsProps = {
  tabs: DetailSectionTabItem[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  ariaLabel?: string;
  testIdPrefix?: string;
  className?: string;
  sticky?: boolean;
  density?: SectionTabsDensity;
  autoWrapBreakpoint?: SectionTabsBreakpoint;
  classes?: SectionTabsClasses;
};

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
}) => {
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
      className={cn(sticky && 'sticky top-4 z-10', className)}
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
