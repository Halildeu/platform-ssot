import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import type { AuthzMeResponse } from './types';
import { fetchAuthzMe } from './api';

interface PermissionContextValue {
  /** Current user's authorization data */
  authz: AuthzMeResponse | null;
  /** Whether initial load is complete */
  initialized: boolean;
  /** Whether currently loading */
  loading: boolean;
  /** Check if user has access to a module */
  hasModule: (module: string) => boolean;
  /** Check if user is superAdmin */
  isSuperAdmin: () => boolean;
  /** Check if user can access a company */
  canAccessCompany: (companyId: number) => boolean;
  /** Refresh authorization data */
  refresh: () => Promise<void>;
}

const PermissionContext = createContext<PermissionContextValue>({
  authz: null,
  initialized: false,
  loading: false,
  hasModule: () => false,
  isSuperAdmin: () => false,
  canAccessCompany: () => false,
  refresh: async () => {},
});

interface PermissionProviderProps {
  children: React.ReactNode;
  /** HTTP GET function (from shared-http or axios) */
  httpGet: (url: string) => Promise<{ data: any }>;
  /** If true, all permissions are granted (dev/permitAll mode) */
  permitAll?: boolean;
  /** Cache TTL in ms (default: 60000 = 1 min) */
  cacheTtl?: number;
}

export function PermissionProvider({
  children,
  httpGet,
  permitAll = false,
  cacheTtl = 60_000,
}: PermissionProviderProps) {
  const [authz, setAuthz] = useState<AuthzMeResponse | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadAuthz = useCallback(async () => {
    if (permitAll) {
      setAuthz({
        userId: 'dev-user',
        superAdmin: true,
        allowedModules: [
          'USER_MANAGEMENT', 'ACCESS', 'AUDIT', 'REPORT',
          'WAREHOUSE', 'PURCHASE', 'THEME',
        ],
        allowedCompanyIds: [],
        allowedProjectIds: [],
        allowedWarehouseIds: [],
      });
      setInitialized(true);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchAuthzMe(httpGet);
      setAuthz(data);
    } catch (err) {
      console.error('[PermissionProvider] Failed to fetch authz:', err);
      setAuthz(null);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [httpGet, permitAll]);

  useEffect(() => {
    loadAuthz();

    if (!permitAll && cacheTtl > 0) {
      const interval = setInterval(loadAuthz, cacheTtl);
      return () => clearInterval(interval);
    }
  }, [loadAuthz, permitAll, cacheTtl]);

  const value = useMemo<PermissionContextValue>(() => ({
    authz,
    initialized,
    loading,
    hasModule: (module: string) => {
      if (permitAll || authz?.superAdmin) return true;
      return authz?.allowedModules?.includes(module) ?? false;
    },
    isSuperAdmin: () => permitAll || (authz?.superAdmin ?? false),
    canAccessCompany: (companyId: number) => {
      if (permitAll || authz?.superAdmin) return true;
      return authz?.allowedCompanyIds?.includes(companyId) ?? false;
    },
    refresh: loadAuthz,
  }), [authz, initialized, loading, permitAll, loadAuthz]);

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
}

/**
 * Hook to access permission context.
 */
export function usePermissions() {
  return useContext(PermissionContext);
}
