import React, { useEffect, useState, useCallback } from "react";
import { Card, CardHeader, CardBody } from "@mfe/design-system";
import { Badge } from "@mfe/design-system";
import { Descriptions } from "@mfe/design-system";
import type { SystemStatus } from "../hooks/useCockpitAPI";

const COCKPIT_URL = "/cockpit-api";

const statusVariant = (s: string) => {
  const lower = s.toLowerCase();
  if (lower === "ok" || lower === "green" || lower === "healthy" || lower === "ready") return "success" as const;
  if (lower === "warn" || lower === "yellow" || lower === "degraded" || lower === "idle") return "warning" as const;
  if (lower === "fail" || lower === "red" || lower === "unhealthy" || lower === "missing" || lower === "not_ready") return "error" as const;
  return "default" as const;
};

export const SystemStatusWidget: React.FC<{ onRefresh?: () => void }> = ({ onRefresh }) => {
  const [data, setData] = useState<SystemStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch(`${COCKPIT_URL}/status`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      // API wraps in {data, exists, json_valid, path} — unwrap
      const payload = json.data || json;
      setData(payload);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    }
  }, []);

  useEffect(() => {
    fetch_();
  }, [fetch_]);

  useEffect(() => {
    if (onRefresh) fetch_();
  }, [onRefresh, fetch_]);

  if (error) {
    return (
      <Card variant="outlined">
        <CardHeader title="System Status" action={<Badge variant="error">Offline</Badge>} />
        <CardBody>
          <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>
            Cockpit unreachable: {error}
          </span>
        </CardBody>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card variant="outlined">
        <CardHeader title="System Status" />
        <CardBody>
          <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>Loading...</span>
        </CardBody>
      </Card>
    );
  }

  const overall = String(data.overall_status || "unknown");
  const sections = data.sections || {};
  const sectionKeys = Object.keys(sections);

  const items = sectionKeys.slice(0, 8).map((key) => {
    const sec = sections[key] as Record<string, unknown>;
    const secStatus = String(sec?.status || sec?.overall_status || "unknown");
    return {
      key,
      label: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      value: <Badge variant={statusVariant(secStatus)} size="sm">{secStatus}</Badge>,
    };
  });

  return (
    <Card variant="outlined">
      <CardHeader
        title="System Status"
        action={<Badge variant={statusVariant(overall)}>{overall}</Badge>}
      />
      <CardBody>
        <Descriptions items={items} columns={2} density="compact" bordered />
      </CardBody>
    </Card>
  );
};
