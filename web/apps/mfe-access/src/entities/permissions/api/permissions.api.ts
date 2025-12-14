import axios, { AxiosError } from 'axios';
import { api, type ApiInstance } from '@mfe/shared-http';
import { getShellServices } from '../../../app/services/shell-services';

export type PermissionDto = {
  id?: string | number;
  code?: string;
  moduleKey?: string;
  moduleLabel?: string;
};

type PagedResultDto<T> = {
  items?: T[];
  total?: number;
};

type ErrorResponse = {
  error?: string;
  message?: string;
  meta?: { traceId?: string };
};

const parseError = (err: unknown) => {
  if (axios.isAxiosError(err)) {
    const res = err as AxiosError<ErrorResponse>;
    const msg = res.response?.data?.message || res.response?.data?.error || err.message || 'İstek başarısız';
    const traceId = res.response?.data?.meta?.traceId;
    if (traceId) {
      console.warn(`[permissions.api] traceId=${traceId} message=${msg}`);
    }
    throw new Error(msg);
  }
  throw err;
};

const resolveHttpClient = (): ApiInstance => {
  try {
    return getShellServices().http;
  } catch {
    return api;
  }
};

export const getPermissions = async (): Promise<PermissionDto[]> => {
  try {
    const client = resolveHttpClient();
    const res = await client.get<PagedResultDto<PermissionDto>>('/v1/permissions');
    if (Array.isArray(res.data.items)) {
      return res.data.items;
    }
    return [];
  } catch (err) {
    parseError(err);
    return [];
  }
};
