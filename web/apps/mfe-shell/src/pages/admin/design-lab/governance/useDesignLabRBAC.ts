/**
 * Design Lab RBAC — role-based visibility and actions
 *
 * Roles:
 * - viewer: can see everything, can't change anything
 * - contributor: can edit doc entries, create stories, propose changes
 * - maintainer: can approve changes, manage deprecation, override quality
 * - admin: full access, can manage roles and policies
 *
 * Integration: reads role from shell auth context or falls back to 'admin' in dev
 */

import { useMemo } from "react";
import { useAppSelector } from "../../../../app/store/store.hooks";
import { isPermitAllMode } from "../../../../app/auth/auth-config";

export type DesignLabRole = "viewer" | "contributor" | "maintainer" | "admin";

export interface DesignLabPermissions {
  canEditDocEntry: boolean;
  canApproveDeprecation: boolean;
  canOverrideQuality: boolean;
  canManageRoles: boolean;
  canDeleteComponent: boolean;
  canPublishRelease: boolean;
  canViewAuditTrail: boolean;
  canExportData: boolean;
}

const ROLE_HIERARCHY: readonly DesignLabRole[] = [
  "viewer",
  "contributor",
  "maintainer",
  "admin",
] as const;

function roleIndex(role: DesignLabRole): number {
  return ROLE_HIERARCHY.indexOf(role);
}

function buildPermissions(role: DesignLabRole): DesignLabPermissions {
  const idx = roleIndex(role);
  return {
    canEditDocEntry: idx >= roleIndex("contributor"),
    canApproveDeprecation: idx >= roleIndex("maintainer"),
    canOverrideQuality: idx >= roleIndex("maintainer"),
    canManageRoles: idx >= roleIndex("admin"),
    canDeleteComponent: idx >= roleIndex("admin"),
    canPublishRelease: idx >= roleIndex("maintainer"),
    canViewAuditTrail: idx >= roleIndex("viewer"),
    canExportData: idx >= roleIndex("contributor"),
  };
}

/**
 * Map the shell auth user role/permissions to a DesignLabRole.
 *
 * In permitAll/dev mode the default is 'admin'.
 * In production the mapping reads from the redux auth slice:
 * - ADMIN or DESIGN_LAB_ADMIN → admin
 * - DESIGN_LAB_MAINTAINER → maintainer
 * - DESIGN_LAB_CONTRIBUTOR → contributor
 * - Anything else → viewer
 */
function resolveRole(
  shellRole: string | null | undefined,
  permissions: string[],
): DesignLabRole {
  if (isPermitAllMode()) return "admin";

  const upper = (shellRole ?? "").toUpperCase();
  const permSet = new Set(permissions.map((p) => p.toUpperCase()));

  if (upper === "ADMIN" || permSet.has("DESIGN_LAB_ADMIN")) return "admin";
  if (permSet.has("DESIGN_LAB_MAINTAINER")) return "maintainer";
  if (permSet.has("DESIGN_LAB_CONTRIBUTOR")) return "contributor";
  return "viewer";
}

export function useDesignLabRBAC(): {
  role: DesignLabRole;
  permissions: DesignLabPermissions;
  isAtLeast: (minRole: DesignLabRole) => boolean;
} {
  const { user } = useAppSelector((state) => state.auth);

  const role = useMemo(
    () => resolveRole(user?.role ?? null, user?.permissions ?? []),
    [user?.role, user?.permissions],
  );

  const permissions = useMemo(() => buildPermissions(role), [role]);

  const isAtLeast = useMemo(
    () => (minRole: DesignLabRole) => roleIndex(role) >= roleIndex(minRole),
    [role],
  );

  return { role, permissions, isAtLeast };
}
