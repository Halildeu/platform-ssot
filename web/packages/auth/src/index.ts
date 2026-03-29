// @mfe/auth — Centralized authorization package for ERP MFE apps.
// All permission checks should go through this package.

export { PermissionProvider, usePermissions } from './PermissionProvider';
export { useHasModule, useIsSuperAdmin } from './useHasPermission';
export { ProtectedRoute, ProtectedSection } from './ProtectedRoute';
export { fetchAuthzMe, checkPermission } from './api';
export { MODULES } from './types';
export type { AuthzMeResponse, CheckRequest, CheckResponse, ModuleKey } from './types';
export { useAuthorization } from './compat';
