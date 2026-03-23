import React, { useEffect, useState, useCallback } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@mfe/design-system";
import { Badge } from "@mfe/design-system";
import { VStack } from "@mfe/design-system";

const COCKPIT_URL = "/cockpit-api";
const POLL_INTERVAL = 15_000;

interface HealthComponent {
  score: number;
  max: number;
}

interface ContextHealth {
  status: string;
  score: number;
  grade: string;
  blocking: boolean;
  components: Record<string, HealthComponent>;
  reasons: string[];
  ts: number;
}

const COMPONENT_LABELS: Record<string, string> = {
  session_freshness: "Session Freshness",
  decision_coverage: "Decision Coverage",
  standards_compliance: "Standards Compliance",
  artifact_completeness: "Artifact Completeness",
  drift_score: "Drift Score",
  extension_health: "Extension Health",
};

const gradeVariant = (grade: string) => {
  if (grade === "A") return "success" as const;
  if (grade === "B") return "info" as const;
  if (grade === "C") return "warning" as const;
  return "error" as const;
};

const barColor = (score: number, max: number) => {
  const pct = score / max;
  if (pct >= 1) return "#22c55e";
  if (pct >= 0.5) return "#f59e0b";
  return "#ef4444";
};

export const ContextHealthWidget: React.FC<{ onRefresh?: () => void }> = ({ onRefresh }) => {
  const [health, setHealth] = useState<ContextHealth | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState("");

  const fetchHealth = useCallback(async () => {
    try {
      const res = await fetch(`${COCKPIT_URL}/context-health`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ContextHealth = await res.json();
      setHealth(data);
      setError(null);
      setLastUpdate(new Date().toLocaleTimeString("tr-TR"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed");
    }
  }, []);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchHealth]);

  useEffect(() => {
    if (onRefresh) fetchHealth();
  }, [onRefresh, fetchHealth]);

  if (error) {
    return (
      <Card variant="outlined">
        <CardHeader title="Context Health" action={<Badge variant="error">Offline</Badge>} />
        <CardBody>
          <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>
            Cockpit unreachable: {error}
          </span>
          <br />
          <code style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
            python -m src.ops.manage cockpit-serve
          </code>
        </CardBody>
      </Card>
    );
  }

  if (!health) {
    return (
      <Card variant="outlined">
        <CardHeader title="Context Health" />
        <CardBody>
          <span style={{ color: "var(--text-secondary)" }}>Loading...</span>
        </CardBody>
      </Card>
    );
  }

  const components = Object.entries(health.components);

  return (
    <Card variant="outlined">
      <CardHeader
        title="Context Health"
        action={<Badge variant={gradeVariant(health.grade)} size="lg">{health.grade}</Badge>}
      />
      <CardBody>
        <VStack gap={4}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span style={{
              fontSize: 48,
              fontWeight: 800,
              lineHeight: 1,
              color: barColor(health.score, 100),
            }}>
              {health.score}
            </span>
            <span style={{ fontSize: 20, color: "var(--text-secondary)" }}>/100</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {components.map(([key, comp]) => (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 13, color: "var(--text-secondary)", minWidth: 150 }}>
                  {COMPONENT_LABELS[key] || key}
                </span>
                <div style={{
                  flex: 1, height: 8,
                  backgroundColor: "var(--surface-secondary, #f3f4f6)",
                  borderRadius: 4, overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%", borderRadius: 4,
                    width: `${(comp.score / comp.max) * 100}%`,
                    backgroundColor: barColor(comp.score, comp.max),
                    transition: "width 0.5s ease",
                  }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, minWidth: 36, textAlign: "right" }}>
                  {comp.score}/{comp.max}
                </span>
              </div>
            ))}
          </div>

          {health.reasons.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {health.reasons.map((r, i) => (
                <Badge key={i} variant="warning" size="sm">{r}</Badge>
              ))}
            </div>
          )}
        </VStack>
      </CardBody>
      <CardFooter>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
            Last: {lastUpdate}
          </span>
          <button
            onClick={fetchHealth}
            style={{
              background: "none", border: "1px solid var(--border-primary)",
              borderRadius: 6, padding: "4px 8px", cursor: "pointer",
              fontSize: 14, color: "var(--text-secondary)",
            }}
          >
            &#x21bb;
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};
