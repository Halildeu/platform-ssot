import { api, type ApiInstance } from '@mfe/shared-http';
import { getShellServices } from '../../../app/services/shell-services';

export interface ExplainCheckRequest {
  relation: string;
  objectType: string;
  objectId: string;
}

export interface ExplainCheckResult {
  allowed: boolean;
  relation: string;
  objectType: string;
  objectId: string;
}

const resolveHttpClient = (): ApiInstance => {
  try {
    return getShellServices().http;
  } catch {
    return api;
  }
};

export const checkAccess = async (payload: ExplainCheckRequest): Promise<ExplainCheckResult> => {
  try {
    const client = resolveHttpClient();
    const res = await client.post<{ allowed: boolean }>('/v1/authz/check', payload);
    return {
      allowed: res.data.allowed,
      relation: payload.relation,
      objectType: payload.objectType,
      objectId: payload.objectId,
    };
  } catch {
    return {
      allowed: false,
      relation: payload.relation,
      objectType: payload.objectType,
      objectId: payload.objectId,
    };
  }
};
