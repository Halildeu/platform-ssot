import {
  buildAuthSessionSummary,
  canReplayQueuedWrites,
  configureOfflineQueueMutationAdapter,
  isSessionExpired,
  resolveSessionGate,
  type AuthSessionBundle,
  type AuthSessionStatus,
} from "@platform-mobile/core";
import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

import { createAuthorizedSession, refreshAuthorizedSession } from "../../services/auth/authClient";
import type { LoginCredentials } from "../../services/auth/auth.contract";
import {
  clearStoredAuthSession,
  readStoredAuthSession,
  writeStoredAuthSession,
} from "../../services/auth/authStorage";
import { createPlatformOfflineMutationAdapter } from "../../services/offline/offlineMutationClient";

type AuthSessionContextValue = {
  status: AuthSessionStatus;
  session: AuthSessionBundle | null;
  error: string | null;
  isBusy: boolean;
  canReplayProtectedActions: boolean;
  requiresReauthentication: boolean;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  refreshAuthorization: () => Promise<void>;
  sessionGate: ReturnType<typeof resolveSessionGate>;
  summary: ReturnType<typeof buildAuthSessionSummary>;
};

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "Authentication request failed.";
}

function isUnauthorizedError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as { status?: unknown }).status === "number" &&
    (error as { status: number }).status === 401
  );
}

export function AuthSessionProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<AuthSessionStatus>("bootstrapping");
  const [session, setSession] = useState<AuthSessionBundle | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      startTransition(() => {
        setStatus("bootstrapping");
        setError(null);
      });

      const storedSession = await readStoredAuthSession();
      if (!active) {
        return;
      }

      if (!storedSession) {
        startTransition(() => {
          setStatus("anonymous");
          setSession(null);
          setError(null);
        });
        return;
      }

      if (isSessionExpired(storedSession)) {
        startTransition(() => {
          setStatus("expired");
          setSession(storedSession);
          setError("Stored session expired. Sign in again.");
        });
        return;
      }

      startTransition(() => {
        setStatus("authenticated");
        setSession(storedSession);
        setError(null);
      });

      try {
        const refreshed = await refreshAuthorizedSession(storedSession);
        if (!active) {
          return;
        }

        await writeStoredAuthSession(refreshed);
        startTransition(() => {
          setStatus("authenticated");
          setSession(refreshed);
          setError(null);
        });
      } catch (refreshError) {
        if (!active) {
          return;
        }

        if (isUnauthorizedError(refreshError)) {
          await clearStoredAuthSession();
          startTransition(() => {
            setStatus("expired");
            setSession(storedSession);
            setError("Stored session expired or was revoked. Sign in again.");
          });
          return;
        }

        startTransition(() => {
          setStatus("error");
          setSession(storedSession);
          setError(getErrorMessage(refreshError));
        });
      }
    };

    void bootstrap();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!session?.token || status !== "authenticated") {
      configureOfflineQueueMutationAdapter(null);
      return;
    }

    configureOfflineQueueMutationAdapter(createPlatformOfflineMutationAdapter(session.token));

    return () => {
      configureOfflineQueueMutationAdapter(null);
    };
  }, [session?.token, status]);

  const signIn = async (credentials: LoginCredentials) => {
    startTransition(() => {
      setStatus("authenticating");
      setError(null);
    });

    try {
      const nextSession = await createAuthorizedSession(credentials);
      await writeStoredAuthSession(nextSession);
      startTransition(() => {
        setStatus("authenticated");
        setSession(nextSession);
        setError(null);
      });
    } catch (signInError) {
      startTransition(() => {
        setStatus("error");
        setSession(null);
        setError(getErrorMessage(signInError));
      });
    }
  };

  const signOut = async () => {
    await clearStoredAuthSession();
    startTransition(() => {
      setStatus("anonymous");
      setSession(null);
      setError(null);
    });
  };

  const refreshAuthorization = async () => {
    if (!session) {
      return;
    }

    if (isSessionExpired(session)) {
      startTransition(() => {
        setStatus("expired");
        setError("Session expired. Sign in again.");
      });
      return;
    }

    startTransition(() => {
      setStatus("authenticating");
      setError(null);
    });

    try {
      const refreshed = await refreshAuthorizedSession(session);
      await writeStoredAuthSession(refreshed);
      startTransition(() => {
        setStatus("authenticated");
        setSession(refreshed);
        setError(null);
      });
    } catch (refreshError) {
      if (isUnauthorizedError(refreshError)) {
        await clearStoredAuthSession();
        startTransition(() => {
          setStatus("expired");
          setError("Session expired or was revoked. Sign in again.");
        });
        return;
      }

      startTransition(() => {
        setStatus("error");
        setError(getErrorMessage(refreshError));
      });
    }
  };

  const summary = buildAuthSessionSummary(status, session);
  const sessionGate = resolveSessionGate(status, session);
  const value: AuthSessionContextValue = {
    status,
    session,
    error,
    isBusy: status === "bootstrapping" || status === "authenticating",
    canReplayProtectedActions: canReplayQueuedWrites(status, session),
    requiresReauthentication: status === "expired" || isSessionExpired(session),
    signIn,
    signOut,
    refreshAuthorization,
    sessionGate,
    summary,
  };

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}

export function useAuthSession() {
  const value = useContext(AuthSessionContext);

  if (!value) {
    throw new Error("useAuthSession must be used inside AuthSessionProvider.");
  }

  return value;
}
