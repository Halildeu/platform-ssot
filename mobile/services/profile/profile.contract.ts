export type ProfileSessionTimeoutSnapshot = {
  resourceKey: string;
  sessionTimeoutMinutes: number;
  version: number;
};

export type ProfileSessionTimeoutMutationRequest = {
  expectedVersion: number;
  sessionTimeoutMinutes: number;
  source?: string;
  attemptCount?: number;
  queueActionId?: string;
};

export type ProfileSessionTimeoutMutationResponse = {
  status: "ok" | "conflict";
  auditId: string | null;
  resourceKey: string;
  sessionTimeoutMinutes: number;
  version: number;
  source: string;
  message: string;
  errorCode: string | null;
  conflictReason: string | null;
};
