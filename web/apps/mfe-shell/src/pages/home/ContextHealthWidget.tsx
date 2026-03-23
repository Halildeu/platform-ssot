import React, { useEffect, useState, useCallback } from "react";

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

const COCKPIT_URL = "/cockpit-api";
const POLL_INTERVAL = 15_000;

const COMPONENT_LABELS: Record<string, string> = {
  session_freshness: "Session Freshness",
  decision_coverage: "Decision Coverage",
  standards_compliance: "Standards Compliance",
  artifact_completeness: "Artifact Completeness",
  drift_score: "Drift Score",
  extension_health: "Extension Health",
};

const gradeColor = (grade: string): string => {
  switch (grade) {
    case "A": return "#22c55e";
    case "B": return "#3b82f6";
    case "C": return "#f59e0b";
    case "D": return "#f97316";
    default: return "#ef4444";
  }
};

export const ContextHealthWidget: React.FC = () => {
  const [health, setHealth] = useState<ContextHealth | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>("");

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

  if (error) {
    return (
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.title}>Context Health</span>
          <span style={{ ...styles.badge, backgroundColor: "#ef4444" }}>Offline</span>
        </div>
        <p style={styles.errorText}>Cockpit server unreachable: {error}</p>
        <p style={styles.hint}>Start with: python -m src.ops.manage cockpit-serve</p>
      </div>
    );
  }

  if (!health) {
    return (
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.title}>Context Health</span>
          <span style={styles.loadingDot} />
        </div>
        <p style={styles.loadingText}>Loading...</p>
      </div>
    );
  }

  const components = Object.entries(health.components);

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.title}>Context Health</span>
        <span style={{ ...styles.badge, backgroundColor: gradeColor(health.grade) }}>
          {health.grade}
        </span>
      </div>

      <div style={styles.scoreRow}>
        <span style={{ ...styles.scoreNumber, color: gradeColor(health.grade) }}>
          {health.score}
        </span>
        <span style={styles.scoreMax}>/100</span>
      </div>

      <div style={styles.components}>
        {components.map(([key, comp]) => (
          <div key={key} style={styles.componentRow}>
            <span style={styles.componentLabel}>
              {COMPONENT_LABELS[key] || key}
            </span>
            <div style={styles.barContainer}>
              <div
                style={{
                  ...styles.barFill,
                  width: `${(comp.score / comp.max) * 100}%`,
                  backgroundColor: comp.score === comp.max ? "#22c55e" : comp.score >= comp.max * 0.5 ? "#f59e0b" : "#ef4444",
                }}
              />
            </div>
            <span style={styles.componentScore}>
              {comp.score}/{comp.max}
            </span>
          </div>
        ))}
      </div>

      {health.reasons.length > 0 && (
        <div style={styles.reasons}>
          {health.reasons.map((r, i) => (
            <span key={i} style={styles.reasonChip}>{r}</span>
          ))}
        </div>
      )}

      <div style={styles.footer}>
        <span style={styles.footerText}>Last update: {lastUpdate}</span>
        <button onClick={fetchHealth} style={styles.refreshBtn} title="Refresh">
          &#x21bb;
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "var(--surface-primary, #ffffff)",
    border: "1px solid var(--border-primary, #e5e7eb)",
    borderRadius: 12,
    padding: 24,
    maxWidth: 420,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
    color: "var(--text-primary, #111827)",
  },
  badge: {
    color: "#fff",
    fontSize: 13,
    fontWeight: 700,
    padding: "2px 10px",
    borderRadius: 6,
  },
  scoreRow: {
    display: "flex",
    alignItems: "baseline",
    marginBottom: 20,
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: 800,
    lineHeight: 1,
  },
  scoreMax: {
    fontSize: 20,
    fontWeight: 400,
    color: "var(--text-secondary, #6b7280)",
    marginLeft: 4,
  },
  components: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  componentRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  componentLabel: {
    fontSize: 13,
    color: "var(--text-secondary, #6b7280)",
    minWidth: 150,
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: "var(--surface-secondary, #f3f4f6)",
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 4,
    transition: "width 0.5s ease",
  },
  componentScore: {
    fontSize: 12,
    fontWeight: 600,
    color: "var(--text-primary, #111827)",
    minWidth: 36,
    textAlign: "right" as const,
  },
  reasons: {
    marginTop: 12,
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 6,
  },
  reasonChip: {
    fontSize: 11,
    padding: "2px 8px",
    borderRadius: 4,
    backgroundColor: "#fef3c7",
    color: "#92400e",
  },
  footer: {
    marginTop: 16,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 11,
    color: "var(--text-tertiary, #9ca3af)",
  },
  refreshBtn: {
    background: "none",
    border: "1px solid var(--border-primary, #e5e7eb)",
    borderRadius: 6,
    padding: "4px 8px",
    cursor: "pointer",
    fontSize: 16,
    color: "var(--text-secondary, #6b7280)",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 13,
    margin: "8px 0",
  },
  hint: {
    fontSize: 11,
    color: "var(--text-tertiary, #9ca3af)",
    fontFamily: "monospace",
  },
  loadingText: {
    color: "var(--text-secondary, #6b7280)",
    fontSize: 14,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "#f59e0b",
    animation: "pulse 1.5s infinite",
  },
};
