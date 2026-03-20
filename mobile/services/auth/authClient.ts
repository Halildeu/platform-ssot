import {
  buildEffectivePermissionCodes,
  normalizeAuthzSnapshot,
  normalizePermissionCodes,
  type AuthSessionBundle,
} from "@platform-mobile/core";

import { apiJsonRequest, jsonBody } from "../api/httpClient";
import type { AuthzMeResponse, LoginCredentials, LoginSessionResponse } from "./auth.contract";

function normalizeLoginResponse(response: LoginSessionResponse): LoginSessionResponse {
  return {
    token: response.token,
    email: response.email,
    role: response.role,
    permissions: normalizePermissionCodes(response.permissions),
    expiresAt: Number(response.expiresAt),
    sessionTimeoutMinutes: Number(response.sessionTimeoutMinutes ?? 0),
  };
}

function mergePermissions(login: LoginSessionResponse, authz: AuthzMeResponse) {
  return normalizePermissionCodes([...(login.permissions ?? []), ...(authz.permissions ?? [])]);
}

export async function createSession(credentials: LoginCredentials) {
  const payload: {
    email: string;
    password: string;
    companyId?: number;
  } = {
    email: credentials.email,
    password: credentials.password,
  };

  if (typeof credentials.companyId === "number") {
    payload.companyId = credentials.companyId;
  }

  const response = await apiJsonRequest<LoginSessionResponse>("/v1/auth/sessions", {
    method: "POST",
    body: jsonBody(payload),
  });

  return normalizeLoginResponse(response);
}

export async function fetchAuthorizationSnapshot(token: string) {
  const response = await apiJsonRequest<AuthzMeResponse>("/v1/authz/me", {
    method: "GET",
    token,
  });

  return normalizeAuthzSnapshot(response);
}

export async function createAuthorizedSession(credentials: LoginCredentials): Promise<AuthSessionBundle> {
  const login = await createSession(credentials);
  const authz = await fetchAuthorizationSnapshot(login.token);

  return {
    token: login.token,
    email: login.email,
    role: login.role,
    permissions: mergePermissions(login, authz),
    effectivePermissions: buildEffectivePermissionCodes([
      ...(login.permissions ?? []),
      ...(authz.permissions ?? []),
    ]),
    expiresAt: login.expiresAt,
    sessionTimeoutMinutes: login.sessionTimeoutMinutes,
    authz,
    companyId: credentials.companyId ?? null,
    lastSyncedAt: new Date().toISOString(),
  };
}

export async function refreshAuthorizedSession(
  session: AuthSessionBundle,
): Promise<AuthSessionBundle> {
  const authz = await fetchAuthorizationSnapshot(session.token);

  return {
    ...session,
    permissions: normalizePermissionCodes([
      ...(session.permissions ?? []),
      ...(authz.permissions ?? []),
    ]),
    effectivePermissions: buildEffectivePermissionCodes([
      ...(session.permissions ?? []),
      ...(authz.permissions ?? []),
    ]),
    authz,
    lastSyncedAt: new Date().toISOString(),
  };
}
