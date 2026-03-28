import React, { useEffect, useState, useCallback, useRef } from "react";
import { Card, CardHeader, CardBody } from "@mfe/design-system";
import { Badge } from "@mfe/design-system";
import { LineChart } from "@mfe/design-system";

const COCKPIT_URL = "/cockpit-api";
const MAX_POINTS = 20;
const POLL_INTERVAL = 30_000;

interface HealthSnapshot {
  score: number;
  grade: string;
  ts: number;
}

export const ContextHealthTrendWidget: React.FC = () => {
  const [history, setHistory] = useState<HealthSnapshot[]>([]);
  const [current, setCurrent] = useState<HealthSnapshot | null>(null);
  const historyRef = useRef<HealthSnapshot[]>([]);

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch(`${COCKPIT_URL}/context-health`);
      if (!res.ok) return;
      const data = await res.json();
      const snap: HealthSnapshot = {
        score: data.score,
        grade: data.grade,
        ts: Date.now(),
      };
      setCurrent(snap);

      const prev = historyRef.current;
      const updated = [...prev, snap].slice(-MAX_POINTS);
      historyRef.current = updated;
      setHistory(updated);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetch_();
    const interval = setInterval(fetch_, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetch_]);

  const labels = history.map((h) =>
    new Date(h.ts).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
  );

  const series = [
    {
      name: "Health Score",
      data: history.map((h) => h.score),
      color: "var(--state-success-text, #22c55e)",
    },
  ];

  const trendDir = history.length >= 2
    ? history[history.length - 1].score - history[history.length - 2].score
    : 0;

  return (
    <Card variant="outlined">
      <CardHeader
        title="Context Health Trend"
        action={
          current ? (
            <Badge variant={current.score >= 90 ? "success" : current.score >= 70 ? "warning" : "error"}>
              {current.score}/100
            </Badge>
          ) : undefined
        }
      />
      <CardBody>
        {history.length < 2 ? (
          <div style={{ textAlign: "center", padding: 24 }}>
            <div style={{ fontSize: 48, fontWeight: 800, color: current ? "var(--state-success-text, #22c55e)" : "var(--text-secondary)" }}>
              {current?.score ?? "—"}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 8 }}>
              Trend data collecting... ({history.length}/2 points)
            </div>
          </div>
        ) : (
          <LineChart
            series={series}
            labels={labels}
            size="sm"
            showDots
            showGrid
            curved
            valueFormatter={(v) => `${v}/100`}
          />
        )}
        {trendDir !== 0 && (
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <span style={{ fontSize: 12, color: trendDir > 0 ? "var(--state-success-text, #22c55e)" : "var(--state-danger-text, #ef4444)" }}>
              {trendDir > 0 ? "▲" : "▼"} {Math.abs(trendDir)} pts
            </span>
          </div>
        )}
      </CardBody>
    </Card>
  );
};
