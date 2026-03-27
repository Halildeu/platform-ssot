import React from 'react';
import { type AccessControlledProps } from '../../internal/access-controller';
import { type SectionTabsBreakpoint, type SectionTabsClasses, type SectionTabsDensity } from './SectionTabs';
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
export interface DetailSectionTabsProps extends AccessControlledProps {
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
}
/** Horizontal tab strip for detail views, with sticky positioning, badge support, and responsive auto-wrap.
   * @example
   * ```tsx
   * <DetailSectionTabs />
   * ```
   * @since 1.0.0
   * @see [Docs](https://design.mfe.dev/components/detail-section-tabs)
   */
export declare const DetailSectionTabs: React.ForwardRefExoticComponent<DetailSectionTabsProps & React.RefAttributes<HTMLDivElement>>;
/** Alias for DetailSectionTabsProps. */
export type DetailSectionTabsPropsType = DetailSectionTabsProps;
/** Alias for DetailSectionTabItem. */
export type DetailSectionTabItemType = DetailSectionTabItem;
