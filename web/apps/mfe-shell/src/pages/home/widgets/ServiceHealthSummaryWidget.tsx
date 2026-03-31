import React, { useEffect, useState, useCallback } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@mfe/design-system";
import { Badge } from "@mfe/design-system";
import { useNavigate } from "react-router-dom";
import { KPICard } from "@mfe/x-charts";
import { MiniChart } from "@mfe/x-charts";
import type { MiniChartDataPoint } from "@mfe/x-charts";

const POLL_INTERVAL = 10_000;

interface ServiceInfo {
  name: string;
  port: number;
  category: string;
  health: string;
  rssMb?: number;
}

interface ServicesResponse {
  services: ServiceInfo[];
  timestamp: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  frontend: "var(--action-primary)",
  core: "var(--state-info-text)",
  auth: "var(--state-warning-text)",
  business: "var(--state-success-text)",
  data: "var(--text-secondary)",
  observability: "var(--state-info-text)",
};

export const ServiceHealthSummaryWidget: React.FC = () => {
  const [data, setData] = useState<ServicesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch("/api/services");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Connection failed");
    }
  }, []);

  useEffect(() => {
    fetchServices();
    const interval = setInterval(fetchServices, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchServices]);

  if (error) {
    return (
      <Card variant="outlined">
        <CardHeader title="Service Health" action={<Badge variant="error">Offline</Badge>} />
        <CardBody>
          <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>
            Service API unreachable: {error}
          </span>
        </CardBody>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card variant="outlined">
        <CardHeader title="Service Health" />
        <CardBody>
          <span style={{ color: "var(--text-secondary)" }}>Loading...</span>
        </CardBody>
      </Card>
    );
  }

  const services = data.services;
  const upCount = services.filter((s) => s.health === "UP").length;
  const downCount = services.filter((s) => s.health === "DOWN" || s.health === "TIMEOUT").length;
  const totalRam = services.reduce((sum, s) => sum + (s.rssMb || 0), 0);

  // Category breakdown for bar chart
  const catCounts: Record<string, number> = {};
  services.forEach((s) => {
    catCounts[s.category] = (catCounts[s.category] || 0) + 1;
  });
  const categoryData: MiniChartDataPoint[] = Object.entries(catCounts).map(([label, value]) => ({
    label: label.charAt(0).toUpperCase() + label.slice(1),
    value,
  }));

  // Category UP counts for stacked view
  const catUpCounts: Record<string, number> = {};
  services.filter((s) => s.health === "UP").forEach((s) => {
    catUpCounts[s.category] = (catUpCounts[s.category] || 0) + 1;
  });

  const allUp = downCount === 0;

  return (
    <Card variant="outlined">
      <CardHeader
        title="Service Health"
        action={
          <Badge variant={allUp ? "success" : "error"}>
            {upCount}/{services.length}
          </Badge>
        }
      />
      <CardBody>
        {/* KPI row */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <KPICard
            title="Healthy"
            value={upCount}
            icon={<span style={{ color: "var(--state-success-text)", fontSize: 18 }}>✓</span>}
            trend={allUp ? { direction: "up", value: "All up", positive: true } : undefined}
          />
          <KPICard
            title="Down"
            value={downCount}
            icon={<span style={{ color: downCount > 0 ? "var(--state-danger-text)" : "var(--text-secondary)", fontSize: 18 }}>✗</span>}
            trend={downCount > 0 ? { direction: "down", value: `${downCount} down`, positive: false } : undefined}
          />
          <KPICard
            title="RAM"
            value={totalRam >= 1024 ? `${(totalRam / 1024).toFixed(1)} GB` : `${totalRam} MB`}
            icon={<span style={{ fontSize: 16 }}>💾</span>}
          />
        </div>

        {/* Category breakdown */}
        <MiniChart
          data={categoryData}
          type="bar"
          height={80}
          color="var(--action-primary)"
        />

        {/* Down services list */}
        {downCount > 0 && (
          <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 4 }}>
            {services
              .filter((s) => s.health === "DOWN" || s.health === "TIMEOUT")
              .map((s) => (
                <Badge key={s.name} variant="error" size="sm">
                  {s.name} :{s.port}
                </Badge>
              ))}
          </div>
        )}
      </CardBody>
      <CardFooter>
        <button
          onClick={() => navigate("/admin/services")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 500,
            color: "var(--action-primary)",
            padding: 0,
          }}
        >
          Detayli Yonetim →
        </button>
      </CardFooter>
    </Card>
  );
};
