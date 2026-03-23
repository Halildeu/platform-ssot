import React, { useState, useCallback } from "react";
import { PageHeader } from "@mfe/design-system";
import { Badge } from "@mfe/design-system";
import { Tabs } from "@mfe/design-system";
import { HStack, VStack } from "@mfe/design-system";
import { ContextHealthWidget } from "./ContextHealthWidget";
import { ContextHealthTrendWidget } from "./widgets/ContextHealthTrendWidget";
import { SystemStatusWidget } from "./widgets/SystemStatusWidget";
import { WorkIntakeWidget } from "./widgets/WorkIntakeWidget";
import { ExtensionHealthWidget } from "./widgets/ExtensionHealthWidget";
import { DecisionInboxWidget } from "./widgets/DecisionInboxWidget";
import { MultiRepoHealthWidget } from "./widgets/MultiRepoHealthWidget";
import { useCockpitSSE } from "./hooks/useCockpitSSE";

export const HomePage: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [sseConnected, setSseConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<string>("");

  const triggerRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const { isConnected } = useCockpitSSE({
    overview_tick: () => {
      triggerRefresh();
      setLastEvent("overview");
      setSseConnected(true);
    },
    intake_tick: () => {
      triggerRefresh();
      setLastEvent("intake");
    },
    decisions_tick: () => {
      triggerRefresh();
      setLastEvent("decisions");
    },
    jobs_tick: () => {
      setLastEvent("jobs");
    },
    locks_tick: () => {
      setLastEvent("locks");
    },
    changed: () => {
      setSseConnected(true);
    },
  });

  const tabItems = [
    {
      key: "overview",
      label: "Overview",
      content: (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: 20,
          marginTop: 16,
        }}>
          <ContextHealthWidget onRefresh={refreshKey > 0 ? triggerRefresh : undefined} />
          <ContextHealthTrendWidget />
          <SystemStatusWidget />
          <DecisionInboxWidget />
          <WorkIntakeWidget />
          <MultiRepoHealthWidget />
        </div>
      ),
    },
    {
      key: "extensions",
      label: "Extensions",
      badge: <Badge variant="info" size="sm">17</Badge>,
      content: (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: 20,
          marginTop: 16,
        }}>
          <ExtensionHealthWidget />
        </div>
      ),
    },
  ];

  return (
    <VStack gap={0}>
      <PageHeader
        title="Orchestrator Dashboard"
        subtitle="Context health, system status, and work tracking — live"
        tags={
          <HStack gap={2}>
            <Badge
              variant={isConnected() || sseConnected ? "success" : "warning"}
              size="sm"
              dot
            >
              {isConnected() || sseConnected ? "SSE Connected" : "Polling"}
            </Badge>
            {lastEvent && (
              <Badge variant="default" size="sm">Last: {lastEvent}</Badge>
            )}
          </HStack>
        }
        actions={
          <button
            onClick={triggerRefresh}
            style={{
              background: "var(--surface-primary)",
              border: "1px solid var(--border-primary)",
              borderRadius: 8,
              padding: "6px 16px",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 500,
              color: "var(--text-primary)",
            }}
          >
            &#x21bb; Refresh All
          </button>
        }
      />

      <div style={{ padding: "0 0px" }}>
        <Tabs items={tabItems} variant="line" defaultActiveKey="overview" />
      </div>
    </VStack>
  );
};

export default HomePage;
