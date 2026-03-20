export type NotificationPreferenceSnapshot = {
  resourceKey: string;
  channel: string;
  enabled: boolean;
  frequency: string | null;
  version: number;
};

export type NotificationPreferenceMutationRequest = {
  enabled: boolean;
  frequency?: string | null;
  expectedVersion: number;
  source?: string;
  attemptCount?: number;
  queueActionId?: string;
};

export type NotificationPreferenceMutationResponse = {
  status: "ok" | "conflict";
  auditId: string | null;
  resourceKey: string;
  channel: string;
  enabled: boolean;
  frequency: string | null;
  version: number;
  source: string;
  message: string;
  errorCode: string | null;
  conflictReason: string | null;
};
