import React, { useEffect, useState, useCallback } from "react";
import { Card, CardHeader, CardBody } from "@mfe/design-system";
import { Badge } from "@mfe/design-system";
import { Descriptions } from "@mfe/design-system";

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
      // API uses "entries" not "repos"
      setRepos(json.entries || json.repos || []);
      setError(null);
    } catch (err) {
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

  const items = repos.map((repo) => ({
    key: repo.repo_name,
    label: repo.repo_name,
    value: (
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <Badge variant={riskVariant(repo.risk_level)} size="sm">
          {repo.risk_level}
        </Badge>
        <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
          Score: {repo.risk_score}/18
        </span>
      </div>
    ),
    tone: repo.critical ? ("danger" as const) : ("default" as const),
  }));

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
        <Descriptions items={items} columns={1} density="compact" bordered />
      </CardBody>
    </Card>
  );
};
