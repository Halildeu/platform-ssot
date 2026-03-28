import React, { useEffect, useState, useCallback } from "react";
import { Card, CardHeader, CardBody } from "@mfe/design-system";
import { Badge } from "@mfe/design-system";
import { VStack } from "@mfe/design-system";

const COCKPIT_URL = "/cockpit-api";

interface RepoInfo {
  repo_name: string;
  overall_status: string;
  risk_score: number;
  risk_level: string;
  critical: boolean;
}

const riskVariant = (level: string) => {
  if (level === "LOW") return "success" as const;
  if (level === "MEDIUM") return "warning" as const;
  if (level === "HIGH") return "error" as const;
  if (level === "CRITICAL") return "error" as const;
  return "default" as const;
};

export const MultiRepoHealthWidget: React.FC<{ onRefresh?: () => void }> = ({ onRefresh }) => {
  const [repos, setRepos] = useState<RepoInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch(`${COCKPIT_URL}/multi-repo-status`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setRepos(json.entries || json.repos || []);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed");
    }
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);
  useEffect(() => { if (onRefresh) fetch_(); }, [onRefresh, fetch_]);

  if (error) {
    return (
      <Card variant="outlined">
        <CardHeader title="Multi-Repo Health" action={<Badge variant="error">Offline</Badge>} />
        <CardBody>
          <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>{error}</span>
        </CardBody>
      </Card>
    );
  }

  if (repos.length === 0) {
    return (
      <Card variant="outlined">
        <CardHeader title="Multi-Repo Health" />
        <CardBody>
          <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>Loading...</span>
        </CardBody>
      </Card>
    );
  }

  const criticalCount = repos.filter((r) => r.critical).length;

  return (
    <Card variant="outlined">
      <CardHeader
        title="Multi-Repo Health"
        action={
          criticalCount > 0
            ? <Badge variant="error">{criticalCount} critical</Badge>
            : <Badge variant="success">All OK</Badge>
        }
      />
      <CardBody>
        <VStack gap={2}>
          {repos.map((repo, idx) => (
            <div
              key={repo.repo_name || `repo-${idx}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid var(--border-primary, #e5e7eb)",
                background: repo.critical ? "var(--state-danger-bg, #fef2f2)" : "transparent",
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>
                {repo.repo_name || `Repository ${idx + 1}`}
              </span>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Badge variant={riskVariant(repo.risk_level)} size="sm">
                  {repo.risk_level}
                </Badge>
                <span style={{ fontSize: 11, color: "var(--text-tertiary)", fontWeight: 600 }}>
                  {repo.risk_score}/18
                </span>
              </div>
            </div>
          ))}
        </VStack>
      </CardBody>
    </Card>
  );
};
