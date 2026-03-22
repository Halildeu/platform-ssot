/**
 * Release health status for Design Lab
 *
 * Reads from:
 * - release-please manifest (.release-please-manifest.json)
 * - Design Lab index metadata
 * - Approval workflow state (pending count)
 */

import { useMemo } from "react";
import { useDesignLab } from "../DesignLabProvider";
import { useApprovalWorkflow } from "./useApprovalWorkflow";

export interface ReleaseHealth {
  currentVersion: string;
  lastReleaseDate: string | null;
  changelogEntries: number;
  verifyStatus: "pass" | "fail" | "unknown";
  coverageStatus: "good" | "warning" | "critical" | "unknown";
  pendingApprovals: number;
  knownIssues: number;
}

/**
 * Static version from .release-please-manifest.json.
 * In production this would be read from build-time injection or API.
 */
const RELEASE_MANIFEST: Record<string, string> = {
  "packages/design-system": "1.0.0",
  "packages/x-data-grid": "0.1.0",
  "packages/x-charts": "0.1.0",
  "packages/x-scheduler": "0.1.0",
  "packages/x-kanban": "0.1.0",
  "packages/x-editor": "0.1.0",
  "packages/x-form-builder": "0.1.0",
  "packages/blocks": "0.1.0",
  "packages/create-app": "0.1.0",
};

export function useReleaseHealth(): ReleaseHealth {
  const { index } = useDesignLab();
  const { getPending } = useApprovalWorkflow();

  return useMemo<ReleaseHealth>(() => {
    const currentVersion =
      RELEASE_MANIFEST["packages/design-system"] ?? "unknown";

    // Derive release date from index metadata if available
    const lastReleaseDate =
      (index.release as Record<string, unknown> | undefined)?.lastReleaseDate as
        | string
        | null ?? null;

    // Derive verify status from index summary
    const summary = index.summary;
    let verifyStatus: ReleaseHealth["verifyStatus"] = "unknown";
    if (summary) {
      const totalExported = summary.exported ?? 0;
      const liveDemo = summary.liveDemo ?? 0;
      // If most exported components have live demos, pass
      verifyStatus =
        totalExported > 0 && liveDemo / totalExported > 0.5
          ? "pass"
          : "fail";
    }

    // Coverage status based on quality gates
    const itemsWithGates = index.items.filter(
      (i) => i.qualityGates && i.qualityGates.length > 0,
    );
    const gateRatio =
      index.items.length > 0
        ? itemsWithGates.length / index.items.length
        : 0;
    let coverageStatus: ReleaseHealth["coverageStatus"] = "unknown";
    if (gateRatio > 0.7) coverageStatus = "good";
    else if (gateRatio > 0.4) coverageStatus = "warning";
    else if (gateRatio > 0) coverageStatus = "critical";

    const pendingApprovals = getPending().length;

    // Known issues: components in planned state still in exported items
    const knownIssues = index.items.filter(
      (i) => i.availability === "exported" && i.lifecycle === "planned",
    ).length;

    return {
      currentVersion,
      lastReleaseDate,
      changelogEntries: Object.keys(RELEASE_MANIFEST).length,
      verifyStatus,
      coverageStatus,
      pendingApprovals,
      knownIssues,
    };
  }, [index, getPending]);
}
