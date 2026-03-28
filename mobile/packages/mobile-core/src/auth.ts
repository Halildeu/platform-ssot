export type AuthScopeSummary = {
  scopeType: string;
  refIds: number[];
};

export type AllowedScope = {
  scopeType: string;
  refId: number;
};

export type AuthzSnapshot = {
  userId: string;
  permissions: string[];
  scopes: AuthScopeSummary[];
  superAdmin: boolean;
  allowedScopes: AllowedScope[];
};

export type AuthSessionBundle = {
  token: string;
  email: string;
  role: string;
  permissions: string[];
  effectivePermissions: string[];
  expiresAt: number;
  sessionTimeoutMinutes: number;
  authz: AuthzSnapshot;
  companyId?: number | null;
  lastSyncedAt: string;
};

export type AuthSessionStatus =
  | "bootstrapping"
  | "anonymous"
  | "authenticating"
  | "authenticated"
  | "expired"
  | "error";

export type AuthSessionSummary = {
  permissionCount: number;
  effectivePermissionCount: number;
  allowedScopeCount: number;
  isExpired: boolean;
  statusLabel: string;
};

export type SessionGate = {
  allowed: boolean;
  reason: string;
};

const statusLabels: Record<AuthSessionStatus, string> = {
  bootstrapping: "Bootstrapping",
  anonymous: "Anonymous",
  authenticating: "Authenticating",
  authenticated: "Authenticated",
  expired: "Expired",
  error: "Error",
};

const permissionAliasMap: Record<string, string[]> = {
  view_access: ["access-read"],
  view_audit: ["audit-read"],
  view_users: ["user-read"],
  manage_users: ["user-read", "user-create", "user-update", "user-delete"],
  edit_users: ["user-read", "user-update"],
};

export function normalizePermissionCodes(values: string[] | undefined): string[] {
  if (!values || values.length === 0) {
    return [];
  }

  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    if (typeof value !== "string") {
      continue;
    }

    const normalized = value.trim();
    if (!normalized) {
      continue;
    }

    const key = normalized.toLowerCase();
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(normalized);
  }

  return result;
}

export function buildEffectivePermissionCodes(values: string[] | undefined): string[] {
  const normalized = normalizePermissionCodes(values);
  if (normalized.length === 0) {
    return [];
  }

  const seen = new Set<string>();
  const result: string[] = [];

  const pushPermission = (value: string) => {
    const nextValue = value.trim();
    if (!nextValue) {
      return;
    }

    const key = nextValue.toLowerCase();
    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    result.push(nextValue);
  };

  for (const value of normalized) {
    pushPermission(value);

    const aliases = permissionAliasMap[value.toLowerCase().replace(/-/g, "_")] ?? [];
    for (const alias of aliases) {
      pushPermission(alias);
    }
  }

  return result;
}

export function normalizeAuthzSnapshot(
  snapshot: Partial<AuthzSnapshot> | null | undefined,
): AuthzSnapshot {
  const rawScopes = Array.isArray(snapshot?.scopes) ? snapshot.scopes : [];
  const rawAllowedScopes = Array.isArray(snapshot?.allowedScopes) ? snapshot.allowedScopes : [];

  return {
    userId: typeof snapshot?.userId === "string" ? snapshot.userId : "",
    permissions: normalizePermissionCodes(snapshot?.permissions),
    scopes: rawScopes
      .filter((scope) => scope && typeof scope.scopeType === "string")
      .map((scope) => ({
        scopeType: scope.scopeType,
        refIds: Array.isArray(scope.refIds)
          ? scope.refIds.filter((refId): refId is number => typeof refId === "number")
          : [],
      })),
    superAdmin: Boolean(snapshot?.superAdmin),
    allowedScopes: rawAllowedScopes
      .filter((scope) => scope && typeof scope.scopeType === "string" && typeof scope.refId === "number")
      .map((scope) => ({
        scopeType: scope.scopeType,
        refId: scope.refId,
      })),
  };
}

export function isSessionExpired(
  session: Pick<AuthSessionBundle, "expiresAt"> | null | undefined,
  now = Date.now(),
) {
  if (!session || !Number.isFinite(session.expiresAt)) {
    return true;
  }

  return session.expiresAt <= now;
}

export function buildAuthSessionSummary(
  status: AuthSessionStatus,
  session: AuthSessionBundle | null,
): AuthSessionSummary {
  return {
    permissionCount: session?.permissions.length ?? 0,
    effectivePermissionCount: session?.effectivePermissions.length ?? session?.permissions.length ?? 0,
    allowedScopeCount: session?.authz.allowedScopes.length ?? 0,
    isExpired: isSessionExpired(session),
    statusLabel: statusLabels[status],
  };
}

export function canReplayQueuedWrites(
  status: AuthSessionStatus,
  session: AuthSessionBundle | null,
) {
  return status === "authenticated" && !isSessionExpired(session);
}

export function hasPermissionCode(
  permissions: string[] | null | undefined,
  permissionCode: string,
) {
  if (!permissions || permissions.length === 0) {
    return false;
  }

  const normalizedPermissionCode = permissionCode.trim().toLowerCase();
  if (!normalizedPermissionCode) {
    return false;
  }

  return permissions.some((permission) => permission.trim().toLowerCase() === normalizedPermissionCode);
}

export function hasSessionPermission(
  session: AuthSessionBundle | null | undefined,
  permissionCode: string,
) {
  return hasPermissionCode(session?.effectivePermissions ?? session?.permissions, permissionCode);
}

export function resolveSessionGate(
  status: AuthSessionStatus,
  session: AuthSessionBundle | null,
): SessionGate {
  if (status === "bootstrapping" || status === "authenticating") {
    return {
      allowed: false,
      reason: "Session is syncing with the backend.",
    };
  }

  if (status === "anonymous" || !session) {
    return {
      allowed: false,
      reason: "Sign in before opening protected mobile features.",
    };
  }

  if (status === "expired" || isSessionExpired(session)) {
    return {
      allowed: false,
      reason: "Session expired or was revoked. Sign in again.",
    };
  }

  if (status === "error") {
    return {
      allowed: false,
      reason: "Session state is degraded. Refresh authorization or sign in again.",
    };
  }

  return {
    allowed: true,
    reason: "Session is active.",
  };
}

export function resolvePermissionGate(
  status: AuthSessionStatus,
  session: AuthSessionBundle | null,
  permissionCode: string,
): SessionGate {
  const sessionGate = resolveSessionGate(status, session);
  if (!sessionGate.allowed) {
    return sessionGate;
  }

  if (!hasSessionPermission(session, permissionCode)) {
    return {
      allowed: false,
      reason: `${permissionCode} permission is required.`,
    };
  }

  return {
    allowed: true,
    reason: `${permissionCode} permission granted.`,
  };
}

export function describeAllowedScopes(session: AuthSessionBundle | null) {
  if (!session || session.authz.allowedScopes.length === 0) {
    return "No scopes resolved";
  }

  return session.authz.allowedScopes
    .slice(0, 4)
    .map((scope) => `${scope.scopeType}:${scope.refId}`)
    .join(", ");
}
