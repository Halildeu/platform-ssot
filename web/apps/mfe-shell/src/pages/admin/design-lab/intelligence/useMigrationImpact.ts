/**
 * Migration impact scoring
 *
 * When a breaking change is proposed:
 * - How many consumers need to update?
 * - How complex is the migration?
 * - Is there a codemod available?
 * - What's the estimated effort?
 */

import { useMemo } from "react";
import { useBlastRadius } from "./useBlastRadius";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export type ChangeType = "props" | "api" | "behavior" | "removal";
export type EffortLevel = "trivial" | "small" | "medium" | "large";

export interface MigrationImpact {
  component: string;
  changeType: ChangeType;
  consumerCount: number;
  hasCodemod: boolean;
  estimatedEffort: EffortLevel;
  impactScore: number; // 0-100
  recommendations: string[];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Complexity multiplier per change type */
const CHANGE_COMPLEXITY: Record<ChangeType, number> = {
  props: 1,
  api: 2,
  behavior: 3,
  removal: 4,
};

function estimateEffort(
  consumerCount: number,
  changeType: ChangeType,
): EffortLevel {
  const weight = consumerCount * CHANGE_COMPLEXITY[changeType];
  if (weight <= 2) return "trivial";
  if (weight <= 8) return "small";
  if (weight <= 20) return "medium";
  return "large";
}

function calculateImpactScore(
  consumerCount: number,
  changeType: ChangeType,
  hasCodemod: boolean,
): number {
  const base = Math.min(consumerCount * 10, 60);
  const complexityBonus = CHANGE_COMPLEXITY[changeType] * 10;
  const codemodDiscount = hasCodemod ? -20 : 0;
  return Math.max(0, Math.min(100, base + complexityBonus + codemodDiscount));
}

function buildRecommendations(
  changeType: ChangeType,
  consumerCount: number,
  hasCodemod: boolean,
  riskScore: string | undefined,
): string[] {
  const recs: string[] = [];

  if (consumerCount > 5 && !hasCodemod) {
    recs.push("Bu degisiklik icin bir codemod olusturulması onerilir");
  }

  if (changeType === "removal") {
    recs.push(
      "Kaldirilmadan once deprecation sureci baslatilmali (min 2 sprint)",
    );
  }

  if (changeType === "api" || changeType === "behavior") {
    recs.push("Onceki API'yi deprecated olarak isaretleyip yeni API ile birlikte sunun");
  }

  if (riskScore === "critical" || riskScore === "high") {
    recs.push("Degisiklik oncesi tum etkilenen takim sahipleri bilgilendirilmeli");
  }

  if (consumerCount > 10) {
    recs.push("Kademeli rollout (phased migration) onerilir");
  }

  if (consumerCount === 0) {
    recs.push("Consumer yok — guvenle degistirilebilir");
  }

  return recs;
}

/* ------------------------------------------------------------------ */
/*  Known codemods registry (stub — would be populated from CI)         */
/* ------------------------------------------------------------------ */

const KNOWN_CODEMODS = new Set([
  "Button-variant",
  "Select-api",
  "Input-size",
  "Text-as",
]);

function hasKnownCodemod(
  componentName: string,
  changeType: ChangeType,
): boolean {
  return KNOWN_CODEMODS.has(`${componentName}-${changeType}`);
}

/* ------------------------------------------------------------------ */
/*  Hook                                                                */
/* ------------------------------------------------------------------ */

export function useMigrationImpact(
  componentName: string,
  changeType: ChangeType,
): MigrationImpact {
  const blastRadius = useBlastRadius(componentName);

  return useMemo(() => {
    const consumerCount = blastRadius?.totalImpact ?? 0;
    const hasCodemod = hasKnownCodemod(componentName, changeType);
    const estimatedEffort = estimateEffort(consumerCount, changeType);
    const impactScore = calculateImpactScore(
      consumerCount,
      changeType,
      hasCodemod,
    );
    const recommendations = buildRecommendations(
      changeType,
      consumerCount,
      hasCodemod,
      blastRadius?.riskScore,
    );

    return {
      component: componentName,
      changeType,
      consumerCount,
      hasCodemod,
      estimatedEffort,
      impactScore,
      recommendations,
    };
  }, [componentName, changeType, blastRadius]);
}
