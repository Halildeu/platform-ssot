import {
  getSharedReport,
  listSharedReports,
  type SharedReportFilterKey,
  type SharedReportCatalogItem,
  type SharedReportId,
  type SharedReportSavedFilter,
} from "@platform/capabilities";

export type MobileReportId = SharedReportId;

export type MobileReportCatalogItem = SharedReportCatalogItem;

export type MobileReportCardStatus = "ready" | "blocked" | "error";

export type MobileReportCard = MobileReportCatalogItem & {
  status: MobileReportCardStatus;
  total: number | null;
  note: string;
  reason: string | null;
  lastUpdatedAt: string | null;
};

export type DashboardUserRow = {
  id: number;
  name: string;
  email: string;
  role: string;
  enabled: boolean;
  createDate: string;
  lastLogin: string | null;
};

export type DashboardRoleRow = {
  id: number;
  name: string;
  description: string | null;
  memberCount: number;
  systemRole: boolean;
  lastModifiedAt: string | null;
  lastModifiedBy: string | null;
  permissionCount: number;
};

export type DashboardAuditRow = {
  id: string;
  timestamp: string;
  userEmail: string;
  service: string;
  level: string;
  action: string;
  details: string | null;
};

export type ReportingDashboardSnapshot = {
  capturedAt: string;
  reportCards: MobileReportCard[];
  recentUsers: DashboardUserRow[];
  recentRoles: DashboardRoleRow[];
  recentAuditEvents: DashboardAuditRow[];
};

export type MobileReportFilterValues = Partial<Record<SharedReportFilterKey, string>>;

export type MobileSavedReportFilter = SharedReportSavedFilter;

export type ReportDetailMetric = {
  label: string;
  value: string;
  tone?: "neutral" | "positive" | "warning";
};

export type ReportDetailRow = {
  id: string;
  title: string;
  subtitle: string;
  badge: string | null;
  meta: string[];
};

export type ReportDetailSnapshot = {
  report: MobileReportCatalogItem;
  status: MobileReportCardStatus;
  reason: string | null;
  capturedAt: string;
  total: number | null;
  metrics: ReportDetailMetric[];
  rows: ReportDetailRow[];
};

export function listMobileReports() {
  return listSharedReports();
}

export function getMobileReport(reportId: MobileReportId) {
  return getSharedReport(reportId);
}
