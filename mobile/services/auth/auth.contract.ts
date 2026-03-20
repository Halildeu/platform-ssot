import type { AuthScopeSummary, AllowedScope } from "@platform-mobile/core";

export type LoginCredentials = {
  email: string;
  password: string;
  companyId?: number | null;
};

export type LoginSessionResponse = {
  token: string;
  email: string;
  role: string;
  permissions: string[];
  expiresAt: number;
  sessionTimeoutMinutes: number;
};

export type AuthzMeResponse = {
  userId: string;
  permissions: string[];
  scopes: AuthScopeSummary[];
  superAdmin: boolean;
  allowedScopes: AllowedScope[];
};
