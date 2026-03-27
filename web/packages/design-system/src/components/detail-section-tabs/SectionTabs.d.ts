import React from 'react';
import { type AccessControlledProps } from '../../internal/access-controller';
import { type SegmentedClasses } from '../segmented';
export type SectionTabsDensity = 'compact' | 'comfortable';
export type SectionTabsLayout = 'scroll' | 'wrap' | 'auto';
export type SectionTabsBreakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type SectionTabsDescriptionVisibility = 'always' | 'hover' | 'active' | 'active-or-hover';
export type SectionTabsDescriptionDisplay = 'inline' | 'tooltip';
export interface SectionTabsItem {
    value: string;
    label: React.ReactNode;
    description?: React.ReactNode;
    badge?: React.ReactNode;
    dataTestId?: string;
    disabled?: boolean;
    itemClassName?: string;
    activeClassName?: string;
    badgeClassName?: string;
}
export interface SectionTabsClasses extends SegmentedClasses {
    viewport?: string;
    hintTrigger?: string;
    hintContent?: string;
}
export interface SectionTabsProps extends AccessControlledProps {
    /** Tab items to render. */
    items: SectionTabsItem[];
    /** Controlled active tab value. */
    value?: string;
    /** Initial active tab value for uncontrolled mode. */
    defaultValue?: string;
    /** Callback fired when the active tab changes. */
    onValueChange?: (nextValue: string) => void;
    /** Accessible label for the tab group. */
    ariaLabel?: string;
    /** Spacing density variant. */
    density?: SectionTabsDensity;
    /** Layout strategy for tab overflow. */
    layout?: SectionTabsLayout;
    /** Breakpoint at which auto layout switches from scroll to wrap. */
    autoWrapBreakpoint?: SectionTabsBreakpoint;
    /** Controls when tab descriptions become visible. */
    descriptionVisibility?: SectionTabsDescriptionVisibility;
    /** How descriptions are rendered (inline text or tooltip). */
    descriptionDisplay?: SectionTabsDescriptionDisplay;
    /** Additional CSS class name. */
    className?: string;
    /** Custom class name overrides for sub-elements. */
    classes?: SectionTabsClasses;
}
/**
 * Segmented tab strip for switching between detail page sections with support
 * for responsive scroll/wrap layouts, density variants and description tooltips.
   * @example
   * ```tsx
   * <SectionTabs />
   * ```
   * @since 1.0.0
   * @see [Docs](https://design.mfe.dev/components/section-tabs)
  
 */
export declare const SectionTabs: React.ForwardRefExoticComponent<SectionTabsProps & React.RefAttributes<HTMLDivElement>>;
