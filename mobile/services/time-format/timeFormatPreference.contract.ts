export type TimeFormatPreferenceSnapshot = {
  resourceKey: string;
  timeFormat: string;
  version: number;
};

export type TimeFormatPreferenceMutationRequest = {
  timeFormat: string;
  expectedVersion: number;
  source?: string;
  attemptCount?: number;
  queueActionId?: string;
};

export type TimeFormatPreferenceMutationResponse = {
  status: "ok" | "conflict";
  auditId: string | null;
  resourceKey: string;
  timeFormat: string;
  version: number;
  source: string;
  message: string;
  errorCode: string | null;
  conflictReason: string | null;
};
