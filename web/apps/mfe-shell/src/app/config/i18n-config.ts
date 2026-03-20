/* ------------------------------------------------------------------ */
/*  I18n initialization                                                */
/* ------------------------------------------------------------------ */

import { getDictionary } from "@mfe/i18n-dicts";
import { trackPageView, resolveTraceId } from "@mfe/shared-http";
import type { TelemetryEvent } from "@mfe/shared-types";
import {
  configureI18n,
  type LoadDictionaryFn,
} from "../i18n";
import { getShellServices } from "../services/shell-services";
import { readEnv } from "./env";

const DICTIONARY_TTL_MS = 10 * 60 * 1000;

const loadDictionary: LoadDictionaryFn = async (locale, namespace, etag) => {
  const result = getDictionary(locale, namespace);
  if (!result) {
    return { dictionary: {} };
  }
  if (etag && etag === result.version) {
    return { notModified: true, ttlMs: DICTIONARY_TTL_MS };
  }
  return {
    dictionary: result.dictionary,
    etag: result.version,
    ttlMs: DICTIONARY_TTL_MS,
  };
};

const detectInitialLocale = (): string => {
  if (typeof window === "undefined") {
    return "tr";
  }
  const stored = window.localStorage.getItem("mfe.locale");
  if (stored && stored.trim().length > 0) {
    return stored;
  }
  return "tr";
};

const trackAction = trackPageView;

configureI18n({
  initialLocale: detectInitialLocale(),
  fallbackLocale: "en",
  defaultNamespace: "common",
  loadDictionary,
  onFallback: (info) => {
    try {
      getShellServices().telemetry.emit({
        type: "i18n_fallback",
        payload: info,
      });
    } catch (error) {
      if (
        typeof process !== "undefined" &&
        process.env.NODE_ENV !== "production"
      ) {
        console.debug("[shell i18n fallback]", info, error);
      }
    }
  },
  onMissingKey: (info) => {
    try {
      const traceId = resolveTraceId() ?? undefined;
      const event: TelemetryEvent = {
        eventType: "telemetry",
        eventName: "i18n_missing_key",
        timestamp: new Date().toISOString(),
        traceId,
        context: {
          app: "mfe-shell",
          env: readEnv(
            "APP_ENVIRONMENT",
            "local",
          ) as TelemetryEvent["context"]["env"],
          version: readEnv("APP_RELEASE", "dev"),
          tags: {
            namespace: info.namespace,
            locale: info.locale,
            fallback: info.fallbackLocale,
          },
        },
        payload: {
          namespace: info.namespace,
          locale: info.locale,
          key: info.key,
        },
      };
      void trackAction(event);
    } catch (error) {
      if (
        typeof process !== "undefined" &&
        process.env.NODE_ENV !== "production"
      ) {
        console.debug("[shell i18n missing key]", info, error);
      }
    }
  },
});
