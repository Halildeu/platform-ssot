import React, { useEffect, useState, useCallback } from "react";
import { Card, CardHeader, CardBody } from "@mfe/design-system";
import { Badge } from "@mfe/design-system";
import { BarChart } from "@mfe/design-system";

const COCKPIT_URL = "/cockpit-api";

interface ExtItem {
  extension_id: string;
  enabled?: boolean;
  status?: string;
  test_count?: number;
  loc?: number;
  [key: string]: unknown;
}

export const ExtensionHealthWidget: React.FC<{ onRefresh?: () => void }> = ({ onRefresh }) => {
  const [extensions, setExtensions] = useState<ExtItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch(`${COCKPIT_URL}/extensions`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setExtensions(json.items || []);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed");
    }
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);
  useEffect(() => { if (onRefresh) fetch_(); }, [onRefresh, fetch_]);

  if (error || extensions.length === 0) {
    return (
      <Card variant="outlined">
        <CardHeader title="Extensions" action={error ? <Badge variant="error">Offline</Badge> : undefined} />
        <CardBody>
          <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>
            {error || "Loading..."}
          </span>
        </CardBody>
      </Card>
    );
  }

  const enabled = extensions.filter((e) => e.enabled !== false).length;
  const total = extensions.length;

  const chartData = extensions.slice(0, 12).map((ext) => ({
    label: ext.extension_id.replace("PRJ-", "").slice(0, 12),
    value: ext.enabled !== false ? 1 : 0,
    color: ext.enabled !== false ? "var(--state-success-text)" : "var(--state-danger-text)",
  }));

  return (
    <Card variant="outlined">
      <CardHeader
        title="Extensions"
        action={<Badge variant={enabled === total ? "success" : "warning"}>{enabled}/{total}</Badge>}
      />
      <CardBody>
        <BarChart
          data={chartData}
          orientation="horizontal"
          size="sm"
          showValues={false}
          showGrid={false}
        />
      </CardBody>
    </Card>
  );
};
