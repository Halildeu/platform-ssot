/* ------------------------------------------------------------------ */
/*  React Query configuration                                          */
/* ------------------------------------------------------------------ */

import { QueryClient, QueryCache } from "@tanstack/react-query";
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
