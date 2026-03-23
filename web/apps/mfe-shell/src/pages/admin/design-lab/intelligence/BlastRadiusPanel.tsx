import React, { useState, useMemo } from "react";
import { Text } from "@mfe/design-system";
import { AlertTriangle, Shield, Zap, Users, BookOpen, Box } from "lucide-react";
import { useDesignLab } from "../DesignLabProvider";
import { useBlastRadius } from "./useBlastRadius";
import type { BlastRadius, Consumer } from "./useBlastRadius";

/* ------------------------------------------------------------------ */
/*  Risk badge                                                          */
/* ------------------------------------------------------------------ */

const RISK_STYLES: Record<BlastRadius["riskScore"], { bg: string; text: string; label: string }> = {
  low: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Low" },
  medium: { bg: "bg-amber-100", text: "text-amber-700", label: "Medium" },
  high: { bg: "bg-orange-100", text: "text-orange-700", label: "High" },
  critical: { bg: "bg-red-100", text: "text-red-700", label: "Critical" },
};

function RiskBadge({ score }: { score: BlastRadius["riskScore"] }) {
  const style = RISK_STYLES[score];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${style.bg} ${style.text}`}
    >
      <Shield className="h-3 w-3" />
      {style.label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Consumer group                                                      */
/* ------------------------------------------------------------------ */

const TYPE_ICONS: Record<Consumer["type"], React.ReactNode> = {
  app: <Zap className="h-3.5 w-3.5 text-blue-500" />,
  recipe: <BookOpen className="h-3.5 w-3.5 text-emerald-500" />,
  pattern: <Box className="h-3.5 w-3.5 text-amber-500" />,
  component: <Box className="h-3.5 w-3.5 text-violet-500" />,
};

function ConsumerGroup({
  title,
  consumers,
}: {
  title: string;
  consumers: Consumer[];
}) {
  if (consumers.length === 0) return null;
  return (
    <div>
      <Text variant="secondary" className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider">
        {title} ({consumers.length})
      </Text>
      <div className="space-y-1">
        {consumers.map((c) => (
          <div
            key={`${c.type}-${c.name}`}
            className="flex items-center gap-2 rounded-lg bg-surface-canvas px-2.5 py-1.5"
          >
            {TYPE_ICONS[c.type]}
            <Text className="text-xs font-medium text-text-primary">
              {c.name}
            </Text>
            <Text variant="secondary" className="ml-auto text-[10px]">
              {c.type}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main panel                                                          */
/* ------------------------------------------------------------------ */

export default function BlastRadiusPanel() {
  const { index } = useDesignLab();
  const [selectedComponent, setSelectedComponent] = useState("");

  const exportedComponents = useMemo(
    () =>
      index.items
        .filter((i) => i.availability === "exported")
        .map((i) => i.name)
        .sort(),
    [index.items],
  );

  const blastRadius = useBlastRadius(selectedComponent);

  // Group consumers by type
  const grouped = useMemo(() => {
    if (!blastRadius) return null;
    const all = [...blastRadius.directConsumers, ...blastRadius.transitiveConsumers];
    return {
      apps: all.filter((c) => c.type === "app"),
      recipes: all.filter((c) => c.type === "recipe"),
      patterns: all.filter((c) => c.type === "pattern"),
      components: all.filter((c) => c.type === "component"),
    };
  }, [blastRadius]);

  return (
    <div className="flex flex-col gap-4">
      {/* Component selector */}
      <div>
        <Text variant="secondary" className="mb-1.5 text-xs font-medium">
          Component sec
        </Text>
        <select
          value={selectedComponent}
          onChange={(e) => setSelectedComponent(e.target.value)}
          className="w-full rounded-lg border border-border-subtle bg-surface-default px-3 py-2 text-sm text-text-primary outline-hidden focus:border-action-primary"
        >
          <option value="">-- Component secin --</option>
          {exportedComponents.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* No selection state */}
      {!selectedComponent && (
        <div className="flex items-center justify-center rounded-2xl border border-border-subtle bg-surface-canvas p-8">
          <Text variant="secondary" className="text-sm">
            Blast radius analizi icin bir component secin
          </Text>
        </div>
      )}

      {/* Blast radius results */}
      {blastRadius && grouped && (
        <>
          {/* Summary */}
          <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-text-secondary" />
                <Text className="text-sm font-semibold text-text-primary">
                  {blastRadius.component}
                </Text>
              </div>
              <RiskBadge score={blastRadius.riskScore} />
            </div>

            <Text variant="secondary" className="mt-3 text-xs leading-5">
              Bu degisiklik{" "}
              <strong className="text-text-primary">
                {blastRadius.affectedApps.length} app
              </strong>
              ,{" "}
              <strong className="text-text-primary">
                {blastRadius.affectedRecipes.length} recipe
              </strong>{" "}
              ve{" "}
              <strong className="text-text-primary">
                {blastRadius.affectedOwners.length} owner
              </strong>
              &apos;i etkiler.
            </Text>

            {/* Impact stat */}
            <div className="mt-3 flex gap-3">
              <div className="rounded-lg bg-surface-canvas px-3 py-1.5">
                <Text variant="secondary" className="text-[10px]">
                  Direkt
                </Text>
                <Text className="text-sm font-bold text-text-primary">
                  {blastRadius.directConsumers.length}
                </Text>
              </div>
              <div className="rounded-lg bg-surface-canvas px-3 py-1.5">
                <Text variant="secondary" className="text-[10px]">
                  Transitif
                </Text>
                <Text className="text-sm font-bold text-text-primary">
                  {blastRadius.transitiveConsumers.length}
                </Text>
              </div>
              <div className="rounded-lg bg-surface-canvas px-3 py-1.5">
                <Text variant="secondary" className="text-[10px]">
                  Toplam Etki
                </Text>
                <Text className="text-sm font-bold text-text-primary">
                  {blastRadius.totalImpact}
                </Text>
              </div>
            </div>
          </div>

          {/* Consumer lists */}
          <div className="space-y-3">
            <ConsumerGroup title="Apps" consumers={grouped.apps} />
            <ConsumerGroup title="Recipes" consumers={grouped.recipes} />
            <ConsumerGroup title="Patterns" consumers={grouped.patterns} />
            <ConsumerGroup title="Components" consumers={grouped.components} />
          </div>

          {/* Affected owners */}
          {blastRadius.affectedOwners.length > 0 && (
            <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
              <div className="mb-2 flex items-center gap-2">
                <Users className="h-4 w-4 text-text-secondary" />
                <Text className="text-sm font-semibold text-text-primary">
                  Etkilenen Sahipler
                </Text>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {blastRadius.affectedOwners.map((owner) => (
                  <span
                    key={owner}
                    className="rounded-full bg-surface-canvas px-2.5 py-0.5 text-xs font-medium text-text-secondary"
                  >
                    {owner}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
