import { api } from '@mfe/shared-http';
import { getShellServices } from '../app/services/shell-services';
import type { AlertRule, ScheduleConfig } from './types';
import type { ApiInstance } from '@mfe/shared-http';

const resolveHttpClient = (): ApiInstance => {
  try {
    return getShellServices().http;
  } catch {
    return api;
  }
};

/* ─── Backend → Frontend field mapping ─── */

const mapAlertFromBackend = (raw: Record<string, unknown>): AlertRule => ({
  id: raw.id as string,
  reportId: raw.reportKey as string,
  field: raw.field as string,
  condition: raw.condition as AlertRule['condition'],
  threshold: raw.threshold as number | string,
  channels: Array.isArray(raw.channels)
    ? (raw.channels as string[]).map((ch) => ({ type: ch as 'email' | 'slack' | 'webhook' | 'in-app', target: '' }))
    : [],
  frequency: (raw.frequency as AlertRule['frequency']) ?? 'daily',
  enabled: raw.enabled as boolean,
  createdAt: raw.createdAt as string,
});

const mapScheduleFromBackend = (raw: Record<string, unknown>): ScheduleConfig => ({
  id: raw.id as string,
  reportId: raw.reportKey as string,
  enabled: raw.enabled as boolean,
  cron: raw.cron as string,
  timezone: (raw.timezone as string) ?? 'Europe/Istanbul',
  recipients: (raw.recipients as string[]) ?? [],
  format: (raw.format as ScheduleConfig['format']) ?? 'excel',
  createdAt: raw.createdAt as string,
});

/* ─── Alert Rules API ─── */

export async function fetchAlertRules(reportKey: string): Promise<AlertRule[]> {
  const client = resolveHttpClient();
  const { data } = await client.get<Record<string, unknown>[]>(`/v1/alerts/${reportKey}`);
  return data.map(mapAlertFromBackend);
}

export async function createAlertRule(
  reportKey: string,
  rule: Partial<AlertRule>,
): Promise<AlertRule> {
  const client = resolveHttpClient();
  const payload = {
    field: rule.field,
    condition: rule.condition,
    threshold: rule.threshold,
    channels: rule.channels?.map((ch) => ch.type) ?? [],
    frequency: rule.frequency ?? 'daily',
    enabled: rule.enabled ?? true,
  };
  const { data } = await client.post<Record<string, unknown>>(`/v1/alerts/${reportKey}`, payload);
  return mapAlertFromBackend(data);
}

export async function updateAlertRule(
  ruleId: string,
  updates: Partial<AlertRule>,
): Promise<void> {
  const client = resolveHttpClient();
  await client.put(`/v1/alerts/rule/${ruleId}`, {
    field: updates.field,
    condition: updates.condition,
    threshold: updates.threshold,
    enabled: updates.enabled,
  });
}

export async function deleteAlertRule(ruleId: string): Promise<void> {
  const client = resolveHttpClient();
  await client.delete(`/v1/alerts/rule/${ruleId}`);
}

/* ─── Schedules API ─── */

export async function fetchSchedule(reportKey: string): Promise<ScheduleConfig | null> {
  const client = resolveHttpClient();
  try {
    const { data } = await client.get<Record<string, unknown>>(`/v1/schedules/${reportKey}`);
    return mapScheduleFromBackend(data);
  } catch (err: unknown) {
    if ((err as { response?: { status?: number } })?.response?.status === 404) {
      return null;
    }
    throw err;
  }
}

export async function createSchedule(
  reportKey: string,
  config: Partial<ScheduleConfig>,
): Promise<ScheduleConfig> {
  const client = resolveHttpClient();
  const payload = {
    cron: config.cron,
    timezone: config.timezone ?? 'Europe/Istanbul',
    recipients: config.recipients ?? [],
    format: config.format ?? 'excel',
    enabled: config.enabled ?? true,
  };
  const { data } = await client.post<Record<string, unknown>>(`/v1/schedules/${reportKey}`, payload);
  return mapScheduleFromBackend(data);
}

export async function updateSchedule(
  scheduleId: string,
  updates: Partial<ScheduleConfig>,
): Promise<void> {
  const client = resolveHttpClient();
  await client.put(`/v1/schedules/${scheduleId}`, {
    cron: updates.cron,
    timezone: updates.timezone,
    recipients: updates.recipients,
    format: updates.format,
    enabled: updates.enabled,
  });
}

export async function deleteSchedule(scheduleId: string): Promise<void> {
  const client = resolveHttpClient();
  await client.delete(`/v1/schedules/${scheduleId}`);
}
