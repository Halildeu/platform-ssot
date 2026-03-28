import React from 'react';
import type { AppSidebarHeaderProps as AppSidebarHeaderPropsBase } from './types';
/**
 * Header slot for the AppSidebar compound component. Displays a title,
 * optional subtitle, logo, and action slot (e.g. collapse trigger).
 * Content is hidden in collapsed mode except for the logo and action.
 *
 * @example
 * ```tsx
 * <AppSidebar.Header
 *   title="Design Lab"
 *   subtitle="Component Library"
 *   logo={<Logo />}
 *   action={<AppSidebar.Trigger />}
 * />
 * ```
 *
 * @since 1.0.0
 * @see AppSidebar
 */
export declare const AppSidebarHeader: React.ForwardRefExoticComponent<AppSidebarHeaderPropsBase & React.RefAttributes<HTMLDivElement>>;
/** Props for the AppSidebarHeader component. */
export interface AppSidebarHeaderProps extends AppSidebarHeaderPropsBase {
}
/** Ref type for AppSidebarHeader. */
export type AppSidebarHeaderRef = React.Ref<HTMLDivElement>;
/** Element type for AppSidebarHeader. */
export type AppSidebarHeaderElement = HTMLDivElement;
/** CSS properties type for AppSidebarHeader. */
export type AppSidebarHeaderCSSProperties = React.CSSProperties;
