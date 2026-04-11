// @mfe/auth — Centralized authorization package for ERP MFE apps.
// All permission checks should go through this package.

export { PermissionProvider, usePermissions } from './PermissionProvider';
export { useHasModule, useIsSuperAdmin } from './useHasPermission';
export { useCheckPermission } from './useCheckPermission';
export { useExplainPermission } from './useExplainPermission';
export { ProtectedRoute, ProtectedSection } from './ProtectedRoute';
export { fetchAuthzMe, fetchAuthzVersion, checkPermission } from './api';
export { MODULES } from './types';
export type {
  AuthzMeResponse, CheckRequest, CheckResponse, ModuleKey,
  AccessLevel, GrantResult, ScopeAssignment, ExplainResponse,
  PermissionCatalog, ModuleCatalogItem, ActionCatalogItem, ReportCatalogItem,
} from './types';
export { useAuthorization } from './compat';

// Zanzibar-Aware object-level authorization (PRJ-DESIGN-LAB-EVOLUTION Faz 4)
export { ZanzibarGate } from './ZanzibarGate';
export type { ZanzibarGateProps } from './ZanzibarGate';
export { useZanzibarAccess } from './useZanzibarAccess';
export { resolveZanzibarAccessProps } from './resolveZanzibarAccessProps';
export type { ZanzibarAccessResult, ZanzibarAccessProps, UIAccessLevel } from './resolveZanzibarAccessProps';
export { createZanzibarCache } from './zanzibar-cache';
export type { ZanzibarCache, ZanzibarCacheConfig, ZanzibarCacheEntry } from './zanzibar-cache';
