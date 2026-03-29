import React from 'react';
import { usePermissions } from './PermissionProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Required module permission (e.g., 'USER_MANAGEMENT', 'AUDIT') */
  requiredModule?: string;
  /** Fallback when not authorized (default: null = render nothing) */
  fallback?: React.ReactNode;
  /** Redirect path when not authorized */
  redirectTo?: string;
}

/**
 * Route-level protection based on module permissions.
 * Wraps children and only renders if user has required permission.
 *
 * Usage:
 *   <ProtectedRoute requiredModule="AUDIT">
 *     <AuditPage />
 *   </ProtectedRoute>
 */
export function ProtectedRoute({
  children,
  requiredModule,
  fallback = null,
  redirectTo,
}: ProtectedRouteProps) {
  const { initialized, hasModule, isSuperAdmin } = usePermissions();

  if (!initialized) {
    return null; // Loading
  }

  // No module required = public route
  if (!requiredModule) {
    return <>{children}</>;
  }

  // SuperAdmin or has specific module access
  if (isSuperAdmin() || hasModule(requiredModule)) {
    return <>{children}</>;
  }

  // Redirect if configured
  if (redirectTo && typeof window !== 'undefined') {
    window.location.href = redirectTo;
    return null;
  }

  return <>{fallback}</>;
}

/**
 * UI-section-level protection.
 * Conditionally renders children based on module permission.
 *
 * Usage:
 *   <ProtectedSection requiredModule="THEME">
 *     <ThemeAdminButton />
 *   </ProtectedSection>
 */
export function ProtectedSection({
  children,
  requiredModule,
  fallback = null,
}: Omit<ProtectedRouteProps, 'redirectTo'>) {
  const { initialized, hasModule, isSuperAdmin } = usePermissions();

  if (!initialized) return null;
  if (!requiredModule) return <>{children}</>;
  if (isSuperAdmin() || hasModule(requiredModule)) return <>{children}</>;
  return <>{fallback}</>;
}
