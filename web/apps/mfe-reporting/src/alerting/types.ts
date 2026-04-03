/**
 * Alerting & Scheduling Types
 */

export interface AlertChannel {
  type: 'email' | 'slack' | 'webhook' | 'in-app';
  target: string;
}

export interface AlertRule {
  id: string;
  reportId: string;
  field: string;
  condition: 'gt' | 'lt' | 'eq' | 'change' | 'anomaly';
  threshold: number | string;
  channels: AlertChannel[];
  frequency: 'realtime' | 'hourly' | 'daily';
  enabled: boolean;
  lastTriggeredAt?: string;
  createdAt: string;
}

export interface ScheduleConfig {
  id: string;
  reportId: string;
  enabled: boolean;
  cron: string;
  timezone: string;
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv' | 'png';
  subject?: string;
  includeFilters?: boolean;
  lastRunAt?: string;
  nextRunAt?: string;
  createdAt: string;
}

export interface AlertEvent {
  id: string;
  ruleId: string;
  reportId: string;
  field: string;
  currentValue: unknown;
  threshold: unknown;
  triggeredAt: string;
  acknowledged: boolean;
}
