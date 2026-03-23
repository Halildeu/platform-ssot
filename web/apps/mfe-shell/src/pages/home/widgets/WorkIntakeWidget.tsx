import React, { useEffect, useState, useCallback } from "react";
import { Card, CardHeader, CardBody } from "@mfe/design-system";
import { Badge } from "@mfe/design-system";
import { PieChart } from "@mfe/design-system";

const COCKPIT_URL = "/cockpit-api";

interface IntakeData {
  items: { id: string; title?: string; bucket?: string; status?: string }[];
  summary?: Record<string, number>;
}

const BUCKET_COLORS: Record<string, string> = {
  TICKET: "#3b82f6",
  PROJECT: "#8b5cf6",
  BUG: "#ef4444",
  TECH_DEBT: "#f59e0b",
  ENHANCEMENT: "#22c55e",
  RESEARCH: "#06b6d4",
};

export const WorkIntakeWidget: React.FC<{ onRefresh?: () => void }> = ({ onRefresh }) => {
  const [data, setData] = useState<IntakeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch(`${COCKPIT_URL}/intake`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    }
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);
  useEffect(() => { if (onRefresh) fetch_(); }, [onRefresh, fetch_]);

  if (error || !data) {
    return (
      <Card variant="outlined">
        <CardHeader title="Work Intake" action={error ? <Badge variant="error">Offline</Badge> : undefined} />
        <CardBody>
          <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>
            {error || "Loading..."}
          </span>
        </CardBody>
      </Card>
    );
  }

  const bucketCounts: Record<string, number> = {};
  data.items.forEach((item) => {
    const b = item.bucket || "OTHER";
    bucketCounts[b] = (bucketCounts[b] || 0) + 1;
  });

  const chartData = Object.entries(bucketCounts).map(([label, value]) => ({
    label,
    value,
    color: BUCKET_COLORS[label] || "#9ca3af",
  }));

  const total = data.items.length;

  return (
    <Card variant="outlined">
      <CardHeader
        title="Work Intake"
        action={<Badge variant="info">{total} items</Badge>}
      />
      <CardBody>
        {chartData.length > 0 ? (
          <PieChart
            data={chartData}
            size="sm"
            donut
            showLegend
            showPercentage
            innerLabel={
              <span style={{ fontSize: 20, fontWeight: 700 }}>{total}</span>
            }
          />
        ) : (
          <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>
            No work items
          </span>
        )}
      </CardBody>
    </Card>
  );
};
