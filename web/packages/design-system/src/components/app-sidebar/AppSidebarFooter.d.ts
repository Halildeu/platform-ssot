import React from 'react';
import type { AppSidebarFooterProps as AppSidebarFooterPropsBase } from './types';
/**
 * Footer slot for the AppSidebar compound component. Automatically sticks
 * to the bottom of the sidebar via `mt-auto` and renders a top border.
 *
 * @example
 * ```tsx
 * <AppSidebar.Footer>
 *   <span>v2.0.0</span>
 * </AppSidebar.Footer>
 * ```
 *
 * @since 1.0.0
 * @see AppSidebar
 */
export declare const AppSidebarFooter: React.ForwardRefExoticComponent<AppSidebarFooterPropsBase & React.RefAttributes<HTMLDivElement>>;
/** Props for the AppSidebarFooter component. */
export interface AppSidebarFooterProps extends AppSidebarFooterPropsBase {
}
/** Ref type for AppSidebarFooter. */
export type AppSidebarFooterRef = React.Ref<HTMLDivElement>;
/** Element type for AppSidebarFooter. */
export type AppSidebarFooterElement = HTMLDivElement;
/** CSS properties type for AppSidebarFooter. */
export type AppSidebarFooterCSSProperties = React.CSSProperties;
