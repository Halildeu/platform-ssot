import React, { useMemo } from "react";
import { Text } from "@mfe/design-system";
import { QualityBadge, getQualityTier } from "./QualityBadge";

/* ------------------------------------------------------------------ */
/*  PackageQualityScore                                                */
/*                                                                     */
/*  Aggregate quality score for an X-Suite package.                    */
/*  Combines accessibility (40%) and quality checklist (60%) scores    */
/*  into a single weighted package score with tier badge.              */
/* ------------------------------------------------------------------ */

export interface ComponentScoreEntry {
  name: string;
  a11yScore: number;
  qualityScore: number;
}

export interface PackageQualityScoreProps {
  packageName: string;
  components: ComponentScoreEntry[];
}

function avg(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((s, v) => s + v, 0) / values.length);
}

export function PackageQualityScore({
  packageName,
  components,
}: PackageQualityScoreProps) {
  const metrics = useMemo(() => {
    const a11yScores = components.map((c) => c.a11yScore);
    const qualityScores = components.map((c) => c.qualityScore);

    const avgA11y = avg(a11yScores);
    const avgQuality = avg(qualityScores);
    const combined = Math.round(avgA11y * 0.4 + avgQuality * 0.6);

    // Find weakest areas
    const weakest = [...components]
      .sort(
        (a, b) =>
          a.a11yScore * 0.4 +
          a.qualityScore * 0.6 -
          (b.a11yScore * 0.4 + b.qualityScore * 0.6),
      )
      .slice(0, 3);

    return { avgA11y, avgQuality, combined, weakest };
  }, [components]);

  if (components.length === 0) {
    return (
      <div className="rounded-2xl border border-border-subtle bg-surface-default p-5">
        <Text variant="secondary" className="text-sm">
          No components in {packageName}
        </Text>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-default">
      {/* Package header */}
      <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
        <div className="flex items-center gap-3">
          <Text as="div" className="text-sm font-semibold text-text-primary">
            {packageName}
          </Text>
          <QualityBadge score={metrics.combined} size="sm" />
        </div>
        <Text variant="secondary" className="text-xs tabular-nums">
          {components.length} component{components.length !== 1 ? "s" : ""}
        </Text>
      </div>

      {/* Score breakdown bars */}
      <div className="flex flex-col gap-3 px-5 py-4">
        <ScoreBar label="Accessibility" score={metrics.avgA11y} weight="40%" />
        <ScoreBar
          label="Quality Checklist"
          score={metrics.avgQuality}
          weight="60%"
        />
        <div className="flex items-center justify-between border-t border-border-subtle pt-3">
          <Text className="text-xs font-semibold text-text-primary">
            Combined Score
          </Text>
          <Text
            className={`text-sm font-bold tabular-nums ${scoreTextColor(metrics.combined)}`}
          >
            {metrics.combined}%
          </Text>
        </div>
      </div>

      {/* Per-component mini scores */}
      <div className="border-t border-border-subtle">
        <div className="bg-surface-canvas/40 px-5 py-2">
          <Text
            variant="secondary"
            className="text-[10px] font-semibold uppercase tracking-widest"
          >
            Component Scores
          </Text>
        </div>
        <div className="max-h-48 divide-y divide-border-subtle/50 overflow-auto">
          {components.map((comp) => {
            const combined = Math.round(
              comp.a11yScore * 0.4 + comp.qualityScore * 0.6,
            );
            return (
              <div
                key={comp.name}
                className="flex items-center justify-between px-5 py-2 transition-colors hover:bg-surface-canvas/30"
              >
                <Text className="text-xs text-text-primary">{comp.name}</Text>
                <div className="flex items-center gap-3">
                  <Text
                    className="text-[10px] tabular-nums text-text-secondary"
                  >
                    a11y {comp.a11yScore}%
                  </Text>
                  <Text
                    className="text-[10px] tabular-nums text-text-secondary"
                  >
                    quality {comp.qualityScore}%
                  </Text>
                  <span
                    className={`min-w-[2.5rem] rounded-full px-1.5 py-0.5 text-center text-[10px] font-semibold ${scorePillClass(combined)}`}
                  >
                    {combined}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weakest areas */}
      {metrics.weakest.length > 0 && (
        <div className="border-t border-border-subtle bg-state-warning-text/5 px-5 py-3">
          <Text
            variant="secondary"
            className="text-[10px] font-semibold uppercase tracking-widest"
          >
            Needs Attention
          </Text>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {metrics.weakest.map((w) => (
              <span
                key={w.name}
                className="rounded-lg bg-state-warning-bg px-2 py-0.5 text-[10px] font-medium text-state-warning-text"
              >
                {w.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---- Helpers ---- */

function scoreTextColor(score: number): string {
  if (score >= 85) return "text-state-success-text";
  if (score >= 70) return "text-action-primary";
  if (score >= 50) return "text-state-warning-text";
  return "text-state-danger-text";
}

function scorePillClass(score: number): string {
  if (score >= 85) return "bg-state-success-bg text-state-success-text";
  if (score >= 70) return "bg-action-primary/10 text-action-primary";
  if (score >= 50) return "bg-state-warning-bg text-state-warning-text";
  return "bg-state-danger-bg text-state-danger-text";
}

function ScoreBar({
  label,
  score,
  weight,
}: {
  label: string;
  score: number;
  weight: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <Text className="text-xs text-text-secondary">
          {label}{" "}
          <span className="text-[10px] text-text-tertiary">({weight})</span>
        </Text>
        <Text
          className={`text-xs font-semibold tabular-nums ${scoreTextColor(score)}`}
        >
          {score}%
        </Text>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
        <div
          className={`h-full rounded-full transition-all duration-500 ${scoreBarBg(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function scoreBarBg(score: number): string {
  if (score >= 85) return "bg-state-success-text";
  if (score >= 70) return "bg-action-primary";
  if (score >= 50) return "bg-state-warning-text";
  return "bg-state-danger-text";
}
