import React from "react";

/* ------------------------------------------------------------------ */
/*  Quality Badge — tier-based visual indicator                        */
/*                                                                     */
/*  Tiers:                                                             */
/*    platinum >= 95   gold >= 85   silver >= 70   bronze < 70         */
/*                                                                     */
/*  Renders a compact badge with shield icon, score %, and tier label. */
/* ------------------------------------------------------------------ */

export type QualityTier = "bronze" | "silver" | "gold" | "platinum";

export function getQualityTier(score: number): QualityTier {
  if (score >= 95) return "platinum";
  if (score >= 85) return "gold";
  if (score >= 70) return "silver";
  return "bronze";
}

const TIER_CONFIG: Record<
  QualityTier,
  { color: string; bg: string; border: string; label: string }
> = {
  bronze: {
    color: "var(--state-warning-text)",
    bg: "rgba(205,127,50,0.10)",
    border: "rgba(205,127,50,0.25)",
    label: "Bronze",
  },
  silver: {
    color: "var(--text-secondary)",
    bg: "rgba(192,192,192,0.12)",
    border: "rgba(192,192,192,0.30)",
    label: "Silver",
  },
  gold: {
    color: "var(--state-warning-text)",
    bg: "rgba(255,215,0,0.10)",
    border: "rgba(255,215,0,0.30)",
    label: "Gold",
  },
  platinum: {
    color: "var(--action-primary)",
    bg: "rgba(99,102,241,0.08)",
    border: "rgba(99,102,241,0.25)",
    label: "Platinum",
  },
};

const SIZE_MAP = {
  sm: { badge: "px-2 py-0.5 gap-1", icon: "h-3 w-3", text: "text-[10px]" },
  md: { badge: "px-2.5 py-1 gap-1.5", icon: "h-3.5 w-3.5", text: "text-xs" },
  lg: { badge: "px-3 py-1.5 gap-2", icon: "h-4 w-4", text: "text-sm" },
} as const;

export interface QualityBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  /** Show only the tier icon + label (no score number) */
  compact?: boolean;
}

export function QualityBadge({
  score,
  size = "md",
  compact = false,
}: QualityBadgeProps) {
  const tier = getQualityTier(score);
  const config = TIER_CONFIG[tier];
  const s = SIZE_MAP[size];

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${s.badge}`}
      style={{
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        color: config.color,
      }}
      title={`Quality: ${score}% (${config.label})`}
    >
      {/* Shield + checkmark icon */}
      <svg
        className={s.icon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
      {!compact && (
        <span className={s.text}>{score}%</span>
      )}
      <span className={s.text}>{config.label}</span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Utility: tier distribution counter                                 */
/* ------------------------------------------------------------------ */

export function countByTier(
  scores: number[],
): Record<QualityTier, number> {
  const result: Record<QualityTier, number> = {
    bronze: 0,
    silver: 0,
    gold: 0,
    platinum: 0,
  };
  for (const s of scores) {
    result[getQualityTier(s)]++;
  }
  return result;
}
