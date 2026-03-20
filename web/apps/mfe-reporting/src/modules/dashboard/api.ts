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
): Promise<KpiResult[]> => {
  const client = resolveHttpClient();
  const { data } = await client.get<KpiResult[]>(
    `${DASHBOARDS_BASE}/${key}/kpis?timeRange=${encodeURIComponent(timeRange)}`,
  );
  return Array.isArray(data) ? data : [];
};

export const fetchDashboardCharts = async (
  key: string,
  timeRange: string,
): Promise<ChartResult[]> => {
  const client = resolveHttpClient();
  const { data } = await client.get<ChartResult[]>(
    `${DASHBOARDS_BASE}/${key}/charts?timeRange=${encodeURIComponent(timeRange)}`,
  );
  return Array.isArray(data) ? data : [];
};
