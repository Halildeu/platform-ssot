import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView, resolveTraceId } from "@mfe/shared-http";
import type { TelemetryContext, TelemetryEvent } from "@mfe/shared-types";
import telemetryClient from "../telemetry/telemetry-client";
import { readEnv } from "../config/env";

/* ------------------------------------------------------------------ */
/*  RouteTracker — Telemetry page-view tracker                         */
/* ------------------------------------------------------------------ */

export const RouteTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const baseContext: TelemetryContext = {
      app: "mfe-shell",
      env: readEnv("APP_ENVIRONMENT", "local") as TelemetryContext["env"],
      version: readEnv("APP_RELEASE", "dev"),
    };
    const traceId = resolveTraceId() ?? undefined;
    const event: TelemetryEvent = {
      eventType: "telemetry",
      eventName: "page_view",
      timestamp: new Date().toISOString(),
      traceId,
      context: { ...baseContext, tags: { route: location.pathname } },
      payload: { route: location.pathname },
    };
    void trackPageView(event);
    telemetryClient.trackPageView(location.pathname);
  }, [location.pathname]);

  return null;
};
