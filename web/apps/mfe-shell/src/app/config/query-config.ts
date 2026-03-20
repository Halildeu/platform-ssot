/* ------------------------------------------------------------------ */
/*  React Query configuration                                          */
/* ------------------------------------------------------------------ */

import { QueryClient } from "@tanstack/react-query";
import { readEnv } from "./env";

export const shouldShowQueryDevtools =
  (typeof process === "undefined" || process.env.NODE_ENV !== "production") &&
  readEnv("ENABLE_QUERY_DEVTOOLS", "0").trim() === "1";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
