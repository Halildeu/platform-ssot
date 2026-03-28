import type { OfflineQueueMutationAdapter, QueuedAction } from "@platform-mobile/core";

import { createDateFormatPreferenceSyncMutationAdapter } from "../date-format/dateFormatPreferenceClient";
import { createLocalePreferenceSyncMutationAdapter } from "../locale/localePreferenceClient";
import { createNotificationPreferenceSyncMutationAdapter } from "../notification-preferences/notificationPreferenceClient";
import { createProfileSyncMutationAdapter } from "../profile/profileClient";
import { createTimeFormatPreferenceSyncMutationAdapter } from "../time-format/timeFormatPreferenceClient";
import { createTimezonePreferenceSyncMutationAdapter } from "../timezone/timezonePreferenceClient";

export function createPlatformOfflineMutationAdapter(token: string): OfflineQueueMutationAdapter {
  const profileAdapter = createProfileSyncMutationAdapter(token);
  const notificationPreferenceAdapter = createNotificationPreferenceSyncMutationAdapter(token);
  const localePreferenceAdapter = createLocalePreferenceSyncMutationAdapter(token);
  const timezonePreferenceAdapter = createTimezonePreferenceSyncMutationAdapter(token);
  const dateFormatPreferenceAdapter = createDateFormatPreferenceSyncMutationAdapter(token);
  const timeFormatPreferenceAdapter = createTimeFormatPreferenceSyncMutationAdapter(token);

  return {
    execute: async (action: QueuedAction) => {
      if (action.kind === "profile.sync") {
        return profileAdapter.execute(action);
      }

      if (action.kind === "notification.preference.sync") {
        return notificationPreferenceAdapter.execute(action);
      }

      if (action.kind === "profile.locale.sync") {
        return localePreferenceAdapter.execute(action);
      }

      if (action.kind === "profile.timezone.sync") {
        return timezonePreferenceAdapter.execute(action);
      }

      if (action.kind === "profile.date-format.sync") {
        return dateFormatPreferenceAdapter.execute(action);
      }

      if (action.kind === "profile.time-format.sync") {
        return timeFormatPreferenceAdapter.execute(action);
      }

      return {
        status: "failed",
        retryable: false,
        errorCode: "UNSUPPORTED_MUTATION_KIND",
        message: `No offline mutation adapter is registered for ${action.kind}.`,
      };
    },
  };
}
