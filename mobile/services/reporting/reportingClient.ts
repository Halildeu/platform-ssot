import { formatIsoShort } from "@platform-mobile/core";

import { apiJsonRequest } from "../api/httpClient";
import type {
  DashboardAuditRow,
  DashboardRoleRow,
  MobileReportFilterValues,
  DashboardUserRow,
  MobileReportCard,
  MobileReportCatalogItem,
  MobileReportId,
  ReportDetailRow,
  ReportDetailSnapshot,
  ReportingDashboardSnapshot,
} from "./reporting.contract";
import { getMobileReport, listMobileReports } from "./reporting.contract";

type ApiError = Error & {
  status?: number;
};

type PagedUserResponseDto = {
  items?: DashboardUserRow[];
  total?: number;
};

type PagedRoleResponseDto = {
  items?: Array<{
    id: number;
    name: string;
    description?: string | null;
    memberCount?: number;
    systemRole?: boolean;
    lastModifiedAt?: string | null;
    lastModifiedBy?: string | null;
    permissions?: string[];
  }>;
  total?: number;
};

type AuditEventPageResponse = {
  events?: Array<{
    id: string;
    timestamp: string;
    userEmail: string;
    service: string;
    level: string;
    action: string;
    details?: string | null;
  }>;
  total?: number;
};

type ReportFetchResult<T> =
  | {
      status: "ready";
      total: number;
      rows: T[];
      note: string;
    }
  | {
      status: "blocked" | "error";
      reason: string;
    };

const USERS_PAGE_SIZE = 6;
const AUDIT_PAGE_SIZE = 6;

function trimFilterValue(value: string | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

function getApiErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "Rapor verisi yuklenemedi.";
}

function getApiErrorStatus(error: unknown) {
  if (typeof error === "object" && error !== null && "status" in error) {
    const status = (error as { status?: unknown }).status;
    if (typeof status === "number") {
      return status;
    }
  }

  return null;
}

function isBlockedError(error: unknown) {
  const status = getApiErrorStatus(error);
  return status === 401 || status === 403;
}

function buildBlockedReason(report: MobileReportCatalogItem, error: unknown) {
  if (getApiErrorStatus(error) === 401) {
    return "Oturum yenilenmeli. Tekrar giris yapip raporu acin.";
  }

  return `${report.permissionCode} izni olmadan bu rapor acilamaz.`;
}

async function fetchUsersReport(
  token: string,
  companyId?: number | null,
  filters: MobileReportFilterValues = {},
): Promise<ReportFetchResult<DashboardUserRow>> {
  const report = getMobileReport("users-overview");

  try {
    // Kullanici raporu bugunku backend sozlesmesinde company header olmadan
    // calisiyor; scope listesi bos oldugunda zorla company header gondermek
    // raporu yapay olarak blokluyor.
    void companyId;
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("pageSize", String(USERS_PAGE_SIZE));
    params.set("sort", "lastLogin,desc");
    const search = trimFilterValue(filters.search);
    const status = trimFilterValue(filters.status);
    if (search) {
      params.set("search", search);
    }
    if (status) {
      params.set("status", status);
    }

    const payload = await apiJsonRequest<PagedUserResponseDto>(
      `/v1/users?${params.toString()}`,
      {
        method: "GET",
        token,
      },
    );
    const rows = Array.isArray(payload.items) ? payload.items : [];
    const activeVisibleCount = rows.filter((item) => item.enabled).length;

    return {
      status: "ready",
      total: typeof payload.total === "number" ? payload.total : rows.length,
      rows,
      note: `${activeVisibleCount}/${rows.length || 0} gorunen kayit aktif.`,
    };
  } catch (error) {
    return {
      status: isBlockedError(error) ? "blocked" : "error",
      reason: isBlockedError(error) ? buildBlockedReason(report, error) : getApiErrorMessage(error),
    };
  }
}

async function fetchRolesReport(
  token: string,
  filters: MobileReportFilterValues = {},
): Promise<ReportFetchResult<DashboardRoleRow>> {
  const report = getMobileReport("roles-access");

  try {
    const payload = await apiJsonRequest<PagedRoleResponseDto>("/v1/roles", {
      method: "GET",
      token,
    });
    let rows = (Array.isArray(payload.items) ? payload.items : []).map<DashboardRoleRow>((item) => ({
      id: item.id,
      name: item.name,
      description: item.description ?? null,
      memberCount: item.memberCount ?? 0,
      systemRole: Boolean(item.systemRole),
      lastModifiedAt: item.lastModifiedAt ?? null,
      lastModifiedBy: item.lastModifiedBy ?? null,
      permissionCount: Array.isArray(item.permissions) ? item.permissions.length : 0,
    }));
    const search = trimFilterValue(filters.search).toLocaleLowerCase("tr");
    if (search) {
      rows = rows.filter((item) =>
        `${item.name} ${item.description ?? ""}`.toLocaleLowerCase("tr").includes(search),
      );
    }
    const systemRoleCount = rows.filter((item) => item.systemRole).length;

    return {
      status: "ready",
      total: typeof payload.total === "number" ? payload.total : rows.length,
      rows,
      note: `${systemRoleCount} sistem rolu aktif durumda.`,
    };
  } catch (error) {
    return {
      status: isBlockedError(error) ? "blocked" : "error",
      reason: isBlockedError(error) ? buildBlockedReason(report, error) : getApiErrorMessage(error),
    };
  }
}

async function fetchAuditReport(
  token: string,
  filters: MobileReportFilterValues = {},
): Promise<ReportFetchResult<DashboardAuditRow>> {
  const report = getMobileReport("audit-activity");

  try {
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("pageSize", String(AUDIT_PAGE_SIZE));
    params.set("sort", "timestamp,desc");
    const search = trimFilterValue(filters.search);
    const level = trimFilterValue(filters.level);
    if (search) {
      params.set("search", search);
    }
    if (level && level !== "ALL") {
      params.set("level", level);
    }

    const payload = await apiJsonRequest<AuditEventPageResponse>(
      `/audit/events?${params.toString()}`,
      {
        method: "GET",
        token,
      },
    );
    const rows = (Array.isArray(payload.events) ? payload.events : []).map<DashboardAuditRow>((item) => ({
      id: item.id,
      timestamp: item.timestamp,
      userEmail: item.userEmail,
      service: item.service,
      level: item.level,
      action: item.action,
      details: item.details ?? null,
    }));
    const warningLikeCount = rows.filter((item) => item.level !== "INFO").length;

    return {
      status: "ready",
      total: typeof payload.total === "number" ? payload.total : rows.length,
      rows,
      note: `${warningLikeCount} gorunen olay dikkat gerektiriyor.`,
    };
  } catch (error) {
    return {
      status: isBlockedError(error) ? "blocked" : "error",
      reason: isBlockedError(error) ? buildBlockedReason(report, error) : getApiErrorMessage(error),
    };
  }
}

function buildReportCard(
  report: MobileReportCatalogItem,
  result: ReportFetchResult<unknown>,
): MobileReportCard {
  const capturedAt = new Date().toISOString();

  if (result.status === "ready") {
    return {
      ...report,
      status: "ready",
      total: result.total,
      note: result.note,
      reason: null,
      lastUpdatedAt: capturedAt,
    };
  }

  return {
    ...report,
    status: result.status,
    total: null,
    note: result.reason,
    reason: result.reason,
    lastUpdatedAt: capturedAt,
  };
}

export async function fetchReportingDashboardSnapshot(
  token: string,
  companyId?: number | null,
): Promise<ReportingDashboardSnapshot> {
  const [usersResult, rolesResult, auditResult] = await Promise.all([
    fetchUsersReport(token, companyId),
    fetchRolesReport(token),
    fetchAuditReport(token),
  ]);

  const cards = listMobileReports().map((report) => {
    if (report.id === "users-overview") {
      return buildReportCard(report, usersResult);
    }
    if (report.id === "roles-access") {
      return buildReportCard(report, rolesResult);
    }
    return buildReportCard(report, auditResult);
  });

  return {
    capturedAt: new Date().toISOString(),
    reportCards: cards,
    recentUsers: usersResult.status === "ready" ? usersResult.rows : [],
    recentRoles: rolesResult.status === "ready" ? rolesResult.rows : [],
    recentAuditEvents: auditResult.status === "ready" ? auditResult.rows : [],
  };
}

function buildUsersDetail(
  total: number,
  rows: DashboardUserRow[],
): Omit<ReportDetailSnapshot, "report" | "status" | "reason" | "capturedAt"> {
  const activeVisibleCount = rows.filter((item) => item.enabled).length;
  const recentlyLoggedCount = rows.filter((item) => item.lastLogin).length;
  const detailRows = rows.map<ReportDetailRow>((item) => ({
    id: String(item.id),
    title: item.name,
    subtitle: item.email,
    badge: item.role,
    meta: [
      item.enabled ? "Aktif kullanici" : "Pasif kullanici",
      item.lastLogin ? `Son giris ${formatIsoShort(item.lastLogin)}` : "Son giris kaydi yok",
      `Olusturma ${formatIsoShort(item.createDate)}`,
    ],
  }));

  return {
    total,
    metrics: [
      { label: "Toplam kullanici", value: String(total), tone: "neutral" },
      { label: "Gorunen kayit", value: String(rows.length), tone: "neutral" },
      { label: "Aktif gorunum", value: String(activeVisibleCount), tone: "positive" },
      { label: "Son girisli", value: String(recentlyLoggedCount), tone: "neutral" },
    ],
    rows: detailRows,
  };
}

function buildRolesDetail(
  total: number,
  rows: DashboardRoleRow[],
): Omit<ReportDetailSnapshot, "report" | "status" | "reason" | "capturedAt"> {
  const systemRoleCount = rows.filter((item) => item.systemRole).length;
  const totalMembers = rows.reduce((sum, item) => sum + item.memberCount, 0);
  const detailRows = rows.map<ReportDetailRow>((item) => ({
    id: String(item.id),
    title: item.name,
    subtitle: item.description ?? "Aciklama girilmemis.",
    badge: item.systemRole ? "Sistem" : "Ozel",
    meta: [
      `${item.memberCount} uye`,
      `${item.permissionCount} yetki`,
      item.lastModifiedAt ? `Guncelleme ${formatIsoShort(item.lastModifiedAt)}` : "Guncelleme kaydi yok",
    ],
  }));

  return {
    total,
    metrics: [
      { label: "Toplam rol", value: String(total), tone: "neutral" },
      { label: "Sistem rolu", value: String(systemRoleCount), tone: "positive" },
      { label: "Toplam uye", value: String(totalMembers), tone: "neutral" },
      {
        label: "Ort. yetki",
        value: rows.length > 0 ? String(Math.round(rows.reduce((sum, item) => sum + item.permissionCount, 0) / rows.length)) : "0",
        tone: "neutral",
      },
    ],
    rows: detailRows,
  };
}

function buildAuditDetail(
  total: number,
  rows: DashboardAuditRow[],
): Omit<ReportDetailSnapshot, "report" | "status" | "reason" | "capturedAt"> {
  const warningLikeCount = rows.filter((item) => item.level !== "INFO").length;
  const uniqueServices = new Set(rows.map((item) => item.service)).size;
  const detailRows = rows.map<ReportDetailRow>((item) => ({
    id: item.id,
    title: item.action,
    subtitle: item.userEmail || "Anonim olay",
    badge: item.level,
    meta: [
      item.service,
      formatIsoShort(item.timestamp),
      item.details ?? "Ayrinti kaydi yok",
    ],
  }));

  return {
    total,
    metrics: [
      { label: "Toplam olay", value: String(total), tone: "neutral" },
      { label: "Gorunen olay", value: String(rows.length), tone: "neutral" },
      { label: "Uyari / hata", value: String(warningLikeCount), tone: "warning" },
      { label: "Servis cesidi", value: String(uniqueServices), tone: "neutral" },
    ],
    rows: detailRows,
  };
}

export async function fetchMobileReportDetail(
  token: string,
  reportId: MobileReportId,
  companyId?: number | null,
  filters: MobileReportFilterValues = {},
): Promise<ReportDetailSnapshot> {
  const report = getMobileReport(reportId);
  const capturedAt = new Date().toISOString();

  if (reportId === "users-overview") {
    const result = await fetchUsersReport(token, companyId, filters);
    if (result.status !== "ready") {
      return {
        report,
        status: result.status,
        reason: result.reason,
        capturedAt,
        total: null,
        metrics: [],
        rows: [],
      };
    }

    return {
      report,
      status: "ready",
      reason: null,
      capturedAt,
      ...buildUsersDetail(result.total, result.rows),
    };
  }

  if (reportId === "roles-access") {
    const result = await fetchRolesReport(token, filters);
    if (result.status !== "ready") {
      return {
        report,
        status: result.status,
        reason: result.reason,
        capturedAt,
        total: null,
        metrics: [],
        rows: [],
      };
    }

    return {
      report,
      status: "ready",
      reason: null,
      capturedAt,
      ...buildRolesDetail(result.total, result.rows),
    };
  }

  const result = await fetchAuditReport(token, filters);
  if (result.status !== "ready") {
    return {
      report,
      status: result.status,
      reason: result.reason,
      capturedAt,
      total: null,
      metrics: [],
      rows: [],
    };
  }

  return {
    report,
    status: "ready",
    reason: null,
    capturedAt,
    ...buildAuditDetail(result.total, result.rows),
  };
}
