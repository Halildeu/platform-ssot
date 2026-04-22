import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import telemetryClient from "../telemetry/telemetry-client";

/* ------------------------------------------------------------------ */
/*  RouteTracker — Telemetry page-view tracker                         */
/* ------------------------------------------------------------------ */

export const RouteTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    telemetryClient.trackPageView(location.pathname);
  }, [location.pathname]);

  return null;
};
