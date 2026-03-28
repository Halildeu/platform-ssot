import type { SidebarContextValue } from './types';
export declare const SidebarContext: import("react").Context<SidebarContextValue | null>;
/**
 * Access sidebar state and controls from any descendant of `<AppSidebar>`.
 *
 * @example
 * const { isCollapsed, toggle } = useSidebar();
 */
export declare function useSidebar(): SidebarContextValue;
