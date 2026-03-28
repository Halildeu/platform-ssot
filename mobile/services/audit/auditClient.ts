import { apiJsonRequest } from "../api/httpClient";
import type { AuditEventPageResponse, AuditPreviewQuery } from "./audit.contract";

function buildAuditPreviewQuery(query: AuditPreviewQuery) {
  const parts = new URLSearchParams();

  if (query.page) {
    parts.set("page", String(query.page));
  }
  if (query.pageSize) {
    parts.set("pageSize", String(query.pageSize));
  }
  if (query.service) {
    parts.set("service", query.service);
  }
  if (query.action) {
    parts.set("action", query.action);
  }

  const serialized = parts.toString();
  return serialized ? `?${serialized}` : "";
}

export async function fetchAuditPreview(
  token: string,
  query: AuditPreviewQuery = {},
) {
  const normalizedQuery: AuditPreviewQuery = {
    page: query.page ?? 1,
    pageSize: query.pageSize ?? 3,
    service: query.service ?? "auth-service",
    action: query.action ?? "SESSION_CREATED",
  };

  return apiJsonRequest<AuditEventPageResponse>(
    `/audit/events${buildAuditPreviewQuery(normalizedQuery)}`,
    {
      method: "GET",
      token,
    },
  );
}
