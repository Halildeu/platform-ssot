import { api, type ApiInstance } from '@mfe/shared-http';
import { getShellServices } from '../../app/services/shell-services';
import type {
  DashboardListItem,
  DashboardMetadata,
  KpiResult,
  ChartResult,
} from './types';

const DASHBOARDS_BASE = '/v1/dashboards';

const resolveHttpClient = (): ApiInstance => {
  try {
    return getShellServices().http;
  } catch {
    return api;
  }
};

export const fetchDashboardList = async (): Promise<DashboardListItem[]> => {
  const client = resolveHttpClient();
  const { data } = await client.get<DashboardListItem[]>(DASHBOARDS_BASE);
  return Array.isArray(data) ? data : [];
};

export const fetchDashboardMetadata = async (key: string): Promise<DashboardMetadata> => {
  const client = resolveHttpClient();
  const { data } = await client.get<DashboardMetadata>(`${DASHBOARDS_BASE}/${key}`);
  return data;
};

export const fetchDashboardKpis = async (
  key: string,
  timeRange: string,
  filters?: Record<string, string>,
): Promise<KpiResult[]> => {
  const client = resolveHttpClient();
  const params = new URLSearchParams({ timeRange });
  if (filters) {
    for (const [k, v] of Object.entries(filters)) {
      if (v) params.set(k, v);
    }
  }
  const { data } = await client.get<KpiResult[]>(
    `${DASHBOARDS_BASE}/${key}/kpis?${params.toString()}`,
  );
  return Array.isArray(data) ? data : [];
};

export const fetchDashboardCharts = async (
  key: string,
  timeRange: string,
  filters?: Record<string, string>,
): Promise<ChartResult[]> => {
  const client = resolveHttpClient();
  const params = new URLSearchParams({ timeRange });
  if (filters) {
    for (const [k, v] of Object.entries(filters)) {
      if (v) params.set(k, v);
    }
  }
  const { data } = await client.get<ChartResult[]>(
    `${DASHBOARDS_BASE}/${key}/charts?${params.toString()}`,
  );
  return Array.isArray(data) ? data : [];
};
