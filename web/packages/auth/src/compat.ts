/**
 * Compatibility layer for migrating from legacy useAuthorization hook
 * to @mfe/auth PermissionProvider.
 *
 * Usage in existing MFE code (drop-in replacement):
 *   import { useAuthorization } from '@mfe/auth/compat';
 *   const { hasPermission, role, permissions } = useAuthorization();
 *
 * This adapter reads from PermissionProvider context and returns
 * the same shape as the legacy useAuthorization hook.
 */
import { usePermissions } from './PermissionProvider';
import { MODULES } from './types';

// Legacy permission name → module mapping
const LEGACY_TO_MODULE: Record<string, string> = {
  'VIEW_USERS': MODULES.USER_MANAGEMENT,
  'MANAGE_USERS': MODULES.USER_MANAGEMENT,
  'user-read': MODULES.USER_MANAGEMENT,
  'USER-READ': MODULES.USER_MANAGEMENT,
  'user-update': MODULES.USER_MANAGEMENT,
  'VIEW_ACCESS': MODULES.ACCESS,
  'access-read': MODULES.ACCESS,
  'ACCESS-READ': MODULES.ACCESS,
  'VIEW_AUDIT': MODULES.AUDIT,
  'audit-read': MODULES.AUDIT,
  'AUDIT-READ': MODULES.AUDIT,
  'VIEW_REPORTS': MODULES.REPORT,
  'REPORT_VIEW': MODULES.REPORT,
  'THEME_ADMIN': MODULES.THEME,
  'VARIANTS_READ': MODULES.WAREHOUSE,
  'VARIANTS_WRITE': MODULES.WAREHOUSE,
};

interface LegacyAuthorizationResult {
  hasPermission: (...permissions: string[]) => boolean;
  permissions: string[];
  role: string;
  user: { email: string; role: string } | null;
}

/**
 * Drop-in replacement for the legacy useAuthorization hook.
 * Reads from @mfe/auth PermissionProvider.
 */
export function useAuthorization(): LegacyAuthorizationResult {
  const { authz, hasModule, isSuperAdmin } = usePermissions();

  const hasPermission = (...perms: string[]): boolean => {
    if (isSuperAdmin()) return true;
    return perms.every((p) => {
      const module = LEGACY_TO_MODULE[p];
      if (module) return hasModule(module);
      // Unknown permission — check if it matches a module name directly
      return hasModule(p);
    });
  };

  return {
    hasPermission,
    permissions: authz?.allowedModules ?? [],
    role: isSuperAdmin() ? 'ADMIN' : 'USER',
    user: authz ? { email: authz.userId, role: isSuperAdmin() ? 'ADMIN' : 'USER' } : null,
  };
}
