/* ------------------------------------------------------------------ */
/*  Config barrel — side-effect imports that wire the application       */
/* ------------------------------------------------------------------ */

// Order matters: HTTP first, then services, then i18n
export { readEnv, readEnvBoolean } from "./env";
export { queryClient, shouldShowQueryDevtools } from "./query-config";
