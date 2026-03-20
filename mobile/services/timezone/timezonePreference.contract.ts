export type TimezonePreferenceSnapshot = {
  resourceKey: string;
  timezone: string;
  version: number;
};

export type TimezonePreferenceMutationRequest = {
  timezone: string;
  expectedVersion: number;
  source?: string;
  attemptCount?: number;
  queueActionId?: string;
};

export type TimezonePreferenceMutationResponse = {
  status: "ok" | "conflict";
  auditId: string | null;
  resourceKey: string;
  timezone: string;
  version: number;
  source: string;
  message: string;
  errorCode: string | null;
  conflictReason: string | null;
};
