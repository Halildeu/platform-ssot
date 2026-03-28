/* ------------------------------------------------------------------ */
/*  Auth helper utilities — JWT building, profile mapping              */
/* ------------------------------------------------------------------ */

import type { UserProfile } from "@mfe/shared-types";
import { authConfig } from "../auth/auth-config";
import { decodeJwtPayload } from "../../features/auth/model/auth.slice";

/* ---- Base64 / JWT encoding ---- */

const base64Encode = (value: string) => {
  if (typeof btoa === "function") {
    return btoa(value);
  }
  if (typeof Buffer !== "undefined") {
    return Buffer.from(value, "utf-8").toString("base64");
  }
  return value;
};

const encodeJwtSegment = (value: string) =>
  base64Encode(value)
    .replace(/=+$/, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

const buildFakeToken = (claims: Record<string, unknown>) => {
  const header = encodeJwtSegment(JSON.stringify({ alg: "none", typ: "JWT" }));
  const payload = encodeJwtSegment(JSON.stringify(claims));
  return `${header}.${payload}.shell`;
};

/* ---- Fake auth session ---- */

/**
 * Try to get a real Keycloak token via direct grant (Resource Owner Password).
 * Falls back to fake JWT if Keycloak is unreachable.
 */
const fetchKeycloakDevToken = async (): Promise<{ token: string; expiresIn: number } | null> => {
  try {
    const kcUrl = authConfig.keycloak.url;
    const realm = authConfig.keycloak.realm;
    const clientId = authConfig.keycloak.clientId;
    // Use Keycloak admin credentials for dev token
    const devUsername = authConfig.fakeUser.email === 'dev.shell@example.com'
      ? 'admin@example.com'  // default fake email → use real Keycloak admin
      : authConfig.fakeUser.email;
    const body = new URLSearchParams({
      grant_type: 'password',
      client_id: clientId,
      username: devUsername,
      password: 'admin1234',
    });
    // Use webpack proxy path to avoid CORS, fallback to direct URL
    const proxyUrl = `/auth/realms/${realm}/protocol/openid-connect/token`;
    const directUrl = `${kcUrl}/realms/${realm}/protocol/openid-connect/token`;
    const url = typeof window !== 'undefined' ? proxyUrl : directUrl;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return { token: data.access_token, expiresIn: data.expires_in ?? 900 };
  } catch {
    return null;
  }
};

export const createFakeAuthSession = () => {
  const ttlMs = 60 * 60 * 1000;
  const permissions = authConfig.fakeUser.permissions ?? [];
  const expiresAt = Date.now() + ttlMs;
  const claims = {
    email: authConfig.fakeUser.email,
    name: authConfig.fakeUser.fullName,
    preferred_username:
      authConfig.fakeUser.displayName ?? authConfig.fakeUser.email,
    realm_access: { roles: permissions },
    resource_access: { frontend: { roles: permissions } },
    sessionTimeoutMinutes: ttlMs / 60000,
    exp: Math.floor(expiresAt / 1000),
  };
  const profile: Partial<UserProfile> = {
    email: authConfig.fakeUser.email,
    fullName: authConfig.fakeUser.fullName,
    displayName:
      authConfig.fakeUser.displayName ?? authConfig.fakeUser.fullName,
    permissions,
    role: authConfig.fakeUser.role,
  };
  return { token: buildFakeToken(claims), profile, expiresAt };
};

/**
 * Async version: tries Keycloak direct grant first, falls back to fake JWT.
 * Use this in AuthBootstrapper for full backend compatibility.
 */
export const createDevAuthSession = async () => {
  const permissions = authConfig.fakeUser.permissions ?? [];
  const profile: Partial<UserProfile> = {
    email: authConfig.fakeUser.email,
    fullName: authConfig.fakeUser.fullName,
    displayName:
      authConfig.fakeUser.displayName ?? authConfig.fakeUser.fullName,
    permissions,
    role: authConfig.fakeUser.role,
  };

  // Try real Keycloak token first
  const kc = await fetchKeycloakDevToken();
  if (kc) {
    console.info('[AUTH] Dev mode: using real Keycloak token (direct grant)');
    return { token: kc.token, profile, expiresAt: Date.now() + kc.expiresIn * 1000 };
  }

  // Fallback to fake JWT (frontend-only, backend will reject)
  console.warn('[AUTH] Dev mode: Keycloak unreachable, using fake JWT (backend calls may fail)');
  return createFakeAuthSession();
};

/* ---- Keycloak profile mapping ---- */

export const mapKeycloakProfile = (
  token: string | null,
): Partial<UserProfile> | null => {
  if (!token) return null;
  const claims = decodeJwtPayload(token);
  if (!claims || typeof claims !== "object") return null;
  const email =
    (claims["email"] as string) ??
    (claims["preferred_username"] as string) ??
    "";
  const name =
    (claims["name"] as string) ??
    (claims["given_name"] as string) ??
    (claims["preferred_username"] as string) ??
    email;
  const claimsObj = claims as Record<string, unknown>;
  const realmAccess = claimsObj?.realm_access as Record<string, unknown> | undefined;
  const resourceAccess = claimsObj?.resource_access as Record<string, unknown> | undefined;
  const frontendAccess = resourceAccess?.frontend as Record<string, unknown> | undefined;
  const realmRoles = Array.isArray(realmAccess?.roles)
    ? (realmAccess.roles as string[])
    : [];
  const resourceRoles = Array.isArray(frontendAccess?.roles)
    ? (frontendAccess.roles as string[])
    : [];
  const permissions = [...realmRoles, ...resourceRoles].map(
    (role) => role?.toUpperCase?.() ?? String(role).toUpperCase(),
  );
  return {
    id: (claims["sub"] as string) ?? undefined,
    email,
    role: permissions[0] ?? "USER",
    permissions,
    fullName: name,
    displayName: name,
    name,
  };
};
