import { StatusBar } from "expo-status-bar";
import { isSessionExpired, resolvePermissionGate, resolveSessionGate } from "@platform-mobile/core";
import { useEffect, useState } from "react";

import { AuditScreen } from "../screens/AuditScreen";
import { DashboardScreen } from "../screens/DashboardScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { PreferencesScreen } from "../screens/PreferencesScreen";
import { ReportDetailScreen } from "../screens/ReportDetailScreen";
import { ReportsScreen } from "../screens/ReportsScreen";
import type { MobileReportId } from "../services/reporting/reporting.contract";
import { AppProviders } from "./providers/AppProviders";
import { useAuthSession } from "./providers/AuthSessionProvider";

type AppRoute = "home" | "dashboard" | "reports" | "report-detail" | "audit" | "preferences";
type BaseRoute = Exclude<AppRoute, "audit" | "report-detail" | "preferences">;
type NonAuditRoute = Exclude<AppRoute, "audit">;

function RoutedApp() {
  const [route, setRoute] = useState<AppRoute>("home");
  const [selectedReportId, setSelectedReportId] = useState<MobileReportId>("users-overview");
  const [auditBackRoute, setAuditBackRoute] = useState<NonAuditRoute>("dashboard");
  const [preferencesBackRoute, setPreferencesBackRoute] = useState<BaseRoute>("dashboard");
  const { session, status } = useAuthSession();
  const auditRouteGate = resolvePermissionGate(status, session, "audit-read");
  const preferencesRouteGate = resolveSessionGate(status, session);
  const hasUsableSession = Boolean(session) && !isSessionExpired(session);

  useEffect(() => {
    if (hasUsableSession) {
      setRoute((current) => (current === "home" ? "dashboard" : current));
      return;
    }

    setRoute("home");
  }, [hasUsableSession]);

  const openAuditRoute = (origin: NonAuditRoute) => {
    if (!auditRouteGate.allowed) {
      return;
    }

    setAuditBackRoute(origin);
    setRoute("audit");
  };

  const openPreferencesRoute = (origin: BaseRoute) => {
    if (!preferencesRouteGate.allowed) {
      return;
    }

    setPreferencesBackRoute(origin);
    setRoute("preferences");
  };

  const openReportDetail = (reportId: MobileReportId) => {
    setSelectedReportId(reportId);
    setRoute("report-detail");
  };

  if (route === "audit") {
    return <AuditScreen onBack={() => setRoute(auditBackRoute)} />;
  }

  if (route === "preferences") {
    return (
      <PreferencesScreen
        canOpenAuditRoute={auditRouteGate.allowed}
        onBack={() => setRoute(preferencesBackRoute)}
        onOpenAuditRoute={() => {
          openAuditRoute("preferences");
        }}
      />
    );
  }

  if (route === "report-detail") {
    return (
      <ReportDetailScreen
        canOpenAuditRoute={auditRouteGate.allowed}
        onBack={() => setRoute("reports")}
        onOpenAuditRoute={() => {
          openAuditRoute("report-detail");
        }}
        reportId={selectedReportId}
      />
    );
  }

  if (route === "reports") {
    return (
      <ReportsScreen
        canOpenAuditRoute={auditRouteGate.allowed}
        onBack={() => setRoute("dashboard")}
        onOpenAuditRoute={() => {
          openAuditRoute("reports");
        }}
        onOpenPreferencesRoute={() => {
          openPreferencesRoute("reports");
        }}
        onOpenReportDetail={openReportDetail}
      />
    );
  }

  if (route === "dashboard") {
    return (
      <DashboardScreen
        canOpenAuditRoute={auditRouteGate.allowed}
        canOpenPreferencesRoute={preferencesRouteGate.allowed}
        onOpenAuditRoute={() => {
          openAuditRoute("dashboard");
        }}
        onOpenPreferencesRoute={() => {
          openPreferencesRoute("dashboard");
        }}
        onOpenReportDetail={openReportDetail}
        onOpenReportsRoute={() => {
          setRoute("reports");
        }}
      />
    );
  }

  return (
    <HomeScreen
      auditRouteReason={auditRouteGate.reason}
      canOpenAuditRoute={auditRouteGate.allowed}
      canOpenPreferencesRoute={preferencesRouteGate.allowed}
      onOpenAuditRoute={() => {
        openAuditRoute("home");
      }}
      onOpenPreferencesRoute={() => {
        openPreferencesRoute("home");
      }}
      preferencesRouteReason={preferencesRouteGate.reason}
    />
  );
}

export default function AppRoot() {
  return (
    <AppProviders>
      <StatusBar style="dark" />
      <RoutedApp />
    </AppProviders>
  );
}
