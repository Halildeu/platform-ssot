export type DateFormatPreferenceSnapshot = {
  resourceKey: string;
  dateFormat: string;
  version: number;
};

export type DateFormatPreferenceMutationRequest = {
  dateFormat: string;
  expectedVersion: number;
  source?: string;
  attemptCount?: number;
  queueActionId?: string;
};

export type DateFormatPreferenceMutationResponse = {
  status: "ok" | "conflict";
  auditId: string | null;
  resourceKey: string;
  dateFormat: string;
  version: number;
  source: string;
  message: string;
  errorCode: string | null;
  conflictReason: string | null;
};
