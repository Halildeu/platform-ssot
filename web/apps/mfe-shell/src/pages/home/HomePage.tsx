import React from "react";
import { PageHeader, VStack } from "@mfe/design-system";

/**
 * Simple welcome landing page. Cockpit orchestrator widgets (ContextHealth,
 * SystemStatus, DecisionInbox, WorkIntake, MultiRepoHealth, ExtensionHealth,
 * ContextHealthTrend) were removed from the public build on 2026-04-15 because
 * they depend on the control-plane orchestrator API (port 8790 / /cockpit-api),
 * which is not deployed to public-facing hosts (ai.acik.com only has the
 * backend + nginx stack, no cockpit-serve). Widgets crashed with HTML-as-JSON
 * parse errors ("Unexpected token '<'"). Keep them in internal-ops builds.
 */
export const HomePage: React.FC = () => {
  return (
    <VStack gap={6} style={{ padding: "2rem", maxWidth: "960px", margin: "0 auto" }}>
      <PageHeader
        title="Hoş geldiniz"
        description="Platform ana sayfasına erişim sağladınız. Soldaki menüden modüllere geçebilirsiniz."
      />
    </VStack>
  );
};
