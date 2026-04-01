import { useState, useEffect, useMemo } from "react";
import {
  listSharedReportsForChannel,
  type SharedReportCatalogItem,
} from "@platform/capabilities";
import { api } from "@mfe/shared-http";
import type { CatalogItemLike } from "./reportingCategoryMap";

/* ------------------------------------------------------------------ */
/*  API types (mirrors mfe-reporting definitions)                      */
/* ------------------------------------------------------------------ */

type ReportListItem = {
  key: string;
  title: string;
  description?: string;
  category?: string;
};

type DashboardListItem = {
  key: string;
  title: string;
  description?: string;
  category?: string;
  icon?: string;
};

/* ------------------------------------------------------------------ */
/*  Mappers                                                            */
/* ------------------------------------------------------------------ */

function mapStatic(report: SharedReportCatalogItem): CatalogItemLike {
  return {
    id: report.id,
    title: report.title,
    description: report.description,
    group: report.category ?? "Genel",
    icon: report.icon ?? "\uD83D\uDCCB",
    tags: report.tags ? [...report.tags] : [],
    badge: {
      label: report.type === "dashboard" ? "Dashboard" : "Grid",
      tone: report.type === "dashboard" ? "info" : "primary",
    },
    route: report.webRouteSegment,
    type: report.type ?? "grid",
    category: report.category ?? "Genel",
    source: "static",
  };
}

function mapDynamic(report: ReportListItem): CatalogItemLike {
  return {
    id: `dynamic-${report.key}`,
    title: report.title,
    description: report.description,
    group: report.category || "Di\u011Fer",
    icon: "\uD83D\uDCCA",
    tags: [],
    badge: { label: "Grid", tone: "primary" },
    route: report.key,
    type: "grid",
    category: report.category || "Di\u011Fer",
    source: "dynamic",
  };
}

function mapDashboard(db: DashboardListItem): CatalogItemLike {
  return {
    id: `dashboard-${db.key}`,
    title: db.title,
    description: db.description,
    group: db.category || "Dashboard",
    icon: db.icon || "\uD83D\uDCC8",
    tags: [],
    badge: { label: "Dashboard", tone: "info" },
    route: `dashboard-${db.key}`,
    type: "dashboard",
    category: db.category || "Dashboard",
    source: "dashboard",
  };
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useReportingCatalog() {
  const [dynamicReports, setDynamicReports] = useState<ReportListItem[]>([]);
  const [dashboards, setDashboards] = useState<DashboardListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const staticItems = useMemo(
    () => listSharedReportsForChannel("web").map(mapStatic),
    [],
  );

  useEffect(() => {
    let active = true;
    Promise.all([
      api
        .get<ReportListItem[]>("/v1/reports")
        .then((r) => (Array.isArray(r.data) ? r.data : []))
        .catch(() => [] as ReportListItem[]),
      api
        .get<DashboardListItem[]>("/v1/dashboards")
        .then((r) => (Array.isArray(r.data) ? r.data : []))
        .catch(() => [] as DashboardListItem[]),
    ]).then(([reports, dbs]) => {
      if (active) {
        setDynamicReports(reports);
        setDashboards(dbs);
        setIsLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const items = useMemo<CatalogItemLike[]>(() => {
    const staticRoutes = new Set(staticItems.map((s) => s.route));

    const dynamicItems = dynamicReports
      .filter((r) => !staticRoutes.has(r.key))
      .map(mapDynamic);

    const allRoutes = new Set([
      ...staticRoutes,
      ...dynamicItems.map((d) => d.route),
    ]);

    const dashboardItems = dashboards
      .filter((db) => !allRoutes.has(`dashboard-${db.key}`))
      .map(mapDashboard);

    return [...staticItems, ...dynamicItems, ...dashboardItems];
  }, [staticItems, dynamicReports, dashboards]);

  return { items, isLoading };
}
