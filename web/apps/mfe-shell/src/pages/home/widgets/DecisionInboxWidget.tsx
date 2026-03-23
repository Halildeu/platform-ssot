import React, { useEffect, useState, useCallback } from "react";
import { Card, CardHeader, CardBody } from "@mfe/design-system";
import { Badge } from "@mfe/design-system";
import { VStack } from "@mfe/design-system";
import { Tag } from "@mfe/design-system";

const COCKPIT_URL = "/cockpit-api";

interface DecisionData {
  items: { id?: string; title?: string; type?: string; priority?: string }[];
  pending_decisions_count: number;
  seed_pending_count: number;
}

export const DecisionInboxWidget: React.FC<{ onRefresh?: () => void }> = ({ onRefresh }) => {
  const [data, setData] = useState<DecisionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch(`${COCKPIT_URL}/decisions`);
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
        <CardHeader title="Decision Inbox" action={error ? <Badge variant="error">Offline</Badge> : undefined} />
        <CardBody>
          <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>
            {error || "Loading..."}
          </span>
        </CardBody>
      </Card>
    );
  }

  const pending = data.pending_decisions_count;
  const seeds = data.seed_pending_count;

  return (
    <Card variant="outlined">
      <CardHeader
        title="Decision Inbox"
        action={
          pending > 0
            ? <Badge variant="warning">{pending} pending</Badge>
            : <Badge variant="success">Clear</Badge>
        }
      />
      <CardBody>
        <VStack gap={3}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: pending > 0 ? "#f59e0b" : "#22c55e" }}>
                {pending}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Pending</div>
            </div>
            <div style={{ width: 1, height: 40, background: "var(--border-primary)" }} />
            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#3b82f6" }}>
                {seeds}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Seeds</div>
            </div>
            <div style={{ width: 1, height: 40, background: "var(--border-primary)" }} />
            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: "var(--text-primary)" }}>
                {data.items.length}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Total</div>
            </div>
          </div>
          {data.items.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {data.items.slice(0, 5).map((item, i) => (
                <Tag key={i} variant="default" size="sm">
                  {item.title || item.id || `Decision ${i + 1}`}
                </Tag>
              ))}
              {data.items.length > 5 && (
                <Tag variant="info" size="sm">+{data.items.length - 5} more</Tag>
              )}
            </div>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
};
