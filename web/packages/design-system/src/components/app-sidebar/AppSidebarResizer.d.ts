import React from 'react';
import type { AppSidebarResizerProps as AppSidebarResizerPropsBase } from './types';
/**
 * Drag-to-resize handle for the AppSidebar. Appears as a thin vertical
 * strip on the right edge of the sidebar when `resizable` is enabled.
 * Uses pointer capture for smooth drag tracking and exposes ARIA
 * separator semantics with value-now/min/max.
 *
 * @example
 * ```tsx
 * <AppSidebar resizable>
 *   <AppSidebar.Resizer />
 * </AppSidebar>
 * ```
 *
 * @since 1.0.0
 * @see AppSidebar
 */
export declare const AppSidebarResizer: React.ForwardRefExoticComponent<AppSidebarResizerPropsBase & React.RefAttributes<HTMLDivElement>>;
/** Props for the AppSidebarResizer component. */
export interface AppSidebarResizerProps extends AppSidebarResizerPropsBase {
}
/** Ref type for AppSidebarResizer. */
export type AppSidebarResizerRef = React.Ref<HTMLDivElement>;
/** Element type for AppSidebarResizer. */
export type AppSidebarResizerElement = HTMLDivElement;
/** CSS properties type for AppSidebarResizer. */
export type AppSidebarResizerCSSProperties = React.CSSProperties;
