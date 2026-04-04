import axios, { AxiosError } from 'axios';
import { api, type ApiInstance } from '@mfe/shared-http';
import { getShellServices } from '../../../app/services/shell-services';

export interface ScopeSummaryDto {
  scopeType: string;
  scopeRefId: number;
}

export interface ScopeAssignmentPayload {
  permissionCode: string;
  scopeType: string;
  scopeRefId: number;
}

const resolveHttpClient = (): ApiInstance => {
  try {
    return getShellServices().http;
  } catch {
    return api;
  }
};

export const getUserScopes = async (userId: string): Promise<ScopeSummaryDto[]> => {
  try {
    const client = resolveHttpClient();
    const res = await client.get<ScopeSummaryDto[]>(`/v1/roles/users/${encodeURIComponent(userId)}/scopes`);
    return Array.isArray(res.data) ? res.data : [];
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.warn('[scopes.api] Failed to fetch user scopes:', (err as AxiosError<{ message?: string }>).response?.data?.message);
    }
    return [];
  }
};

export const assignScope = async (userId: string, payload: ScopeAssignmentPayload): Promise<void> => {
  const client = resolveHttpClient();
  await client.post(`/v1/roles/users/${encodeURIComponent(userId)}/scopes`, payload);
};

export const removeScope = async (
  userId: string,
  scopeType: string,
  scopeRefId: number,
  permissionCode: string,
): Promise<void> => {
  const client = resolveHttpClient();
  await client.delete(
    `/v1/roles/users/${encodeURIComponent(userId)}/scopes/${encodeURIComponent(scopeType)}/${scopeRefId}`,
    { params: { permissionCode } },
  );
};
