import React from "react";
export interface PortalConfig {
    /** Default container element for all portals in the subtree. */
    container?: HTMLElement | null;
    /** Whether portals are enabled globally. When false, overlays render inline. */
    enabled?: boolean;
    /** Default z-index base for portal content. */
    zIndex?: number;
    /** Unique identifier prefix for portal container elements. */
    idPrefix?: string;
    /** Whether to lock body scroll when a portal is active. */
    lockScroll?: boolean;
    /** Callback fired when a portal is mounted into the container. */
    onPortalMount?: (portalId: string) => void;
}
/**
 * Provides global portal configuration for all overlay components
 * in the subtree.
 *
 * @example
 * ```tsx
 * // Render all portals into a custom container
 * const portalRoot = document.getElementById("portal-root");
 *
 * function App() {
 *   return (
 *     <PortalProvider container={portalRoot}>
 *       <MyPage />
 *     </PortalProvider>
 *   );
 * }
 *
 * // Disable portals globally (e.g., for SSR or testing)
 * <PortalProvider enabled={false}>
 *   <MyPage />
 * </PortalProvider>
 * ```
 */
/** Props for the PortalProvider component. */
export interface PortalProviderProps extends PortalConfig {
    children: React.ReactNode;
}
export declare const PortalProvider: React.ForwardRefExoticComponent<PortalProviderProps & React.RefAttributes<HTMLDivElement>>;
/**
 * Returns the current portal configuration from the nearest PortalProvider.
 * Falls back to empty config (all defaults) if no provider exists.
 */
export declare function usePortalConfig(): PortalConfig;
/** Ref type for PortalProvider. */
export type PortalProviderRef = React.Ref<HTMLDivElement>;
/** Element type for PortalProvider. */
export type PortalProviderElement = HTMLDivElement;
