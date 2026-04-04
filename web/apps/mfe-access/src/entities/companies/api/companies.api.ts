import axios, { AxiosError } from 'axios';
import { api, type ApiInstance } from '@mfe/shared-http';
import { getShellServices } from '../../../app/services/shell-services';

export interface CompanyDto {
  id: number;
  name: string;
  code?: string;
  status?: string;
}

type PagedResultDto<T> = {
  items?: T[];
  total?: number;
};

const resolveHttpClient = (): ApiInstance => {
  try {
    return getShellServices().http;
  } catch {
    return api;
  }
};

export const getCompanies = async (): Promise<CompanyDto[]> => {
  try {
    const client = resolveHttpClient();
    const res = await client.get<PagedResultDto<CompanyDto>>('/v1/companies');
    return Array.isArray(res.data.items) ? res.data.items : [];
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const res = err as AxiosError<{ message?: string }>;
      console.warn('[companies.api] Failed to fetch companies:', res.response?.data?.message);
    }
    return [];
  }
};
