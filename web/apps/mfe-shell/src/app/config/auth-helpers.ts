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
