import { configureOfflineQueueStorage } from "@platform-mobile/core";
import { useEffect, type PropsWithChildren } from "react";

import { AuthSessionProvider } from "./AuthSessionProvider";
import { offlineQueueStorageAdapter } from "../../services/storage/offlineQueue.storage";

export function AppProviders({ children }: PropsWithChildren) {
  useEffect(() => {
    configureOfflineQueueStorage(offlineQueueStorageAdapter);

    return () => {
      configureOfflineQueueStorage(null);
    };
  }, []);

  return <AuthSessionProvider>{children}</AuthSessionProvider>;
}
