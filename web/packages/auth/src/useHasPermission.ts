import { usePermissions } from './PermissionProvider';

/**
 * Check if the current user has access to a specific module.
 *
 * Usage:
 *   const canViewUsers = useHasModule('USER_MANAGEMENT');
 *   const canViewAudit = useHasModule('AUDIT');
 */
export function useHasModule(module: string): boolean {
  const { hasModule } = usePermissions();
  return hasModule(module);
}

/**
 * Check if current user is superAdmin.
 */
export function useIsSuperAdmin(): boolean {
  const { isSuperAdmin } = usePermissions();
  return isSuperAdmin();
}
