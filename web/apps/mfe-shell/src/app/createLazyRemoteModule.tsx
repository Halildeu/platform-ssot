import React from "react";
import { EmptyErrorLoading } from "@mfe/design-system";

type RemoteModule = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: React.ComponentType<any>;
};

const toTestIdSuffix = (value: string) =>
  value.replace(/[^a-z0-9]+/gi, "-").toLowerCase();

const createRemoteUnavailableFallback = (label: string): React.FC => {
  const RemoteUnavailableFallback: React.FC = () => (
    <div
      className="max-w-3xl"
      data-testid={`remote-module-fallback-${toTestIdSuffix(label)}`}
    >
      <EmptyErrorLoading
        mode="error"
        title={`${label} su anda kullanilamiyor`}
        description="Shell calismaya devam ediyor. Gelistirme ortaminda ilgili remote uygulama ayakta olmayabilir."
        errorLabel="Remote modulu yuklenemedi. Local remoteEntry baglantisini kontrol et."
      />
    </div>
  );

  RemoteUnavailableFallback.displayName = `${label}UnavailableFallback`;
  return RemoteUnavailableFallback;
};

export const createLazyRemoteModule = (
  label: string,
  loader: () => Promise<RemoteModule>,
) =>
  React.lazy(async () => {
    try {
      return await loader();
    } catch (error: unknown) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[shell] ${label} remote yuklenemedi`, error);
      }
      return { default: createRemoteUnavailableFallback(label) };
    }
  });

export default createLazyRemoteModule;
