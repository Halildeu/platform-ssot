/* ------------------------------------------------------------------ */
/*  PortalProvider — Global portal configuration context               */
/*                                                                     */
/*  Allows applications to configure portal behavior for all overlay   */
/*  components in a subtree. Components using usePortal can read       */
/*  defaults from this context via usePortalConfig().                   */
/*                                                                     */
/*  Faz 2.9 — Standardized Portal                                     */
/* ------------------------------------------------------------------ */

import React, { createContext, useContext } from "react";

interface PortalConfig {
  /** Default container for all portals */
  container?: HTMLElement | null;
  /** Whether portals are enabled globally */
  enabled?: boolean;
}

const PortalContext = createContext<PortalConfig>({});

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
export const PortalProvider: React.FC<PortalConfig & { children: React.ReactNode }> = ({
  children,
  ...config
}) => (
  <PortalContext.Provider value={config}>{children}</PortalContext.Provider>
);

PortalProvider.displayName = "PortalProvider";

/**
 * Returns the current portal configuration from the nearest PortalProvider.
 * Falls back to empty config (all defaults) if no provider exists.
 */
export function usePortalConfig(): PortalConfig {
  return useContext(PortalContext);
}
