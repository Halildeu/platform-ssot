export type LocalePreferenceSnapshot = {
  resourceKey: string;
  locale: string;
  version: number;
};

export type LocalePreferenceMutationRequest = {
  locale: string;
  expectedVersion: number;
  source?: string;
  attemptCount?: number;
  queueActionId?: string;
};

export type LocalePreferenceMutationResponse = {
  status: "ok" | "conflict";
  auditId: string | null;
  resourceKey: string;
  locale: string;
  version: number;
  source: string;
  message: string;
  errorCode: string | null;
  conflictReason: string | null;
};
