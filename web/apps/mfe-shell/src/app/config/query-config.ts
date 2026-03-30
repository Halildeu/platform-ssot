/* ------------------------------------------------------------------ */
/*  React Query configuration                                          */
/* ------------------------------------------------------------------ */

import { QueryClient, QueryCache } from "@tanstack/react-query";

declare global {
  interface Window {
    __queryErrorHandler?: (message: string, queryKey: unknown) => void;
  }
}
import { readEnv } from "./env";

export const shouldShowQueryDevtools =
  (typeof process === "undefined" || process.env.NODE_ENV !== "production") &&
  readEnv("ENABLE_QUERY_DEVTOOLS", "0").trim() === "1";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Skip queries that handle errors themselves
      if (query.meta?.skipGlobalError) return;
      if (process.env.NODE_ENV !== "production") {
        console.error("[QueryCache]", error);
      }
      // Global error notification for users
      const message =
        error instanceof Error ? error.message : "Bir hata oluştu";
      if (typeof window !== "undefined" && window.__queryErrorHandler) {
        window.__queryErrorHandler(message, query.queryKey);
      }
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Expose queryClient on window for MFEs — @tanstack/react-query is resolved
// via alias in shell (bypassing MF loadShare), so React context sharing
// doesn't work across shell/remote boundary. Window bridge is the safe path.
if (typeof window !== 'undefined') {
  (window as Record<string, unknown>).__SHELL_QUERY_CLIENT__ = queryClient;
}
