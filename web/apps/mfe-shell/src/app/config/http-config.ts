/* ------------------------------------------------------------------ */
/*  Shared HTTP configuration — auth token, trace ID, 401 handler      */
/* ------------------------------------------------------------------ */

import {
  configureSharedHttp,
  registerAuthTokenResolver,
  registerTraceIdResolver,
  registerUnauthorizedHandler,
} from "@mfe/shared-http";
import { authConfig } from "../auth/auth-config";
import { store } from "../store/store";
import { logout } from "../../features/auth/model/auth.slice";

/* ---- Trace ID generation ---- */

const generateTraceId = () => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  const random = Math.random().toString(16).slice(2, 10);
  return `trace-${Date.now().toString(36)}-${random}`;
};

/* ---- Register handlers ---- */

configureSharedHttp({ authMode: authConfig.mode });

registerAuthTokenResolver(() => store.getState().auth.token ?? null);
registerTraceIdResolver(() => generateTraceId());
registerUnauthorizedHandler(() => {
  const state = store.getState().auth;
  if (!state.initialized || !state.token) {
    if (
      typeof process !== "undefined" &&
      process.env.NODE_ENV !== "production"
    ) {
      console.debug("[AUTH 401 IGNORE]", {
        initialized: state.initialized,
        hasToken: Boolean(state.token),
      });
    }
    return;
  }
  // Token expire olmuş olabilir — önce Keycloak refresh dene.
  // Logout sadece refresh de başarısız olursa yapılmalı.
  // Keycloak onTokenExpired handler zaten refresh yapıyor;
  // burada logout yapmak yarış koşuluna neden olur.
  if (
    typeof process !== "undefined" &&
    process.env.NODE_ENV !== "production"
  ) {
    console.warn("[AUTH 401 PRESERVE_SESSION]", {
      url: "interceptor",
      method: "response",
    });
  }
  // Logout yapmıyoruz — Keycloak token refresh mekanizması devrede.
  // store.dispatch(logout());
});
