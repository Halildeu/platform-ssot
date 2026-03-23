/**
 * OwnershipPanel — Component ownership coverage and assignments
 *
 * Shows ownership coverage percentage, lists components with/without owners,
 * and displays owner, support tier, and last review date.
 */

import React, { useMemo, useState } from "react";
import { Users, Shield } from "lucide-react";
import { Text } from "@mfe/design-system";
import { useComponentOwnership, type ComponentOwner } from "./useComponentOwnership";

const TIER_LABELS: Record<string, string> = {
  tier1: "Tier 1",
  tier2: "Tier 2",
  tier3: "Tier 3",
};

const TIER_COLORS: Record<string, string> = {
  tier1: "bg-emerald-100 text-emerald-700",
  tier2: "bg-blue-100 text-blue-700",
  tier3: "bg-surface-muted text-text-secondary",
};

export function OwnershipPanel() {
  const { owners, coverage } = useComponentOwnership();
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("all");

  const displayed = useMemo(() => {
    let result = owners;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.component.toLowerCase().includes(q) ||
          o.owner.toLowerCase().includes(q),
      );
    }

    if (tierFilter !== "all") {
      result = result.filter((o) => o.supportTier === tierFilter);
    }

    return result;
  }, [owners, searchQuery, tierFilter]);

  // Group by owner for summary
  const ownerSummary = useMemo(() => {
    const map = new Map<string, number>();
    for (const o of owners) {
      map.set(o.owner, (map.get(o.owner) ?? 0) + 1);
    }
    return Array.from(map.entries())
      .map(([owner, count]) => ({ owner, count }))
      .sort((a, b) => b.count - a.count);
  }, [owners]);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-text-secondary" />
          <Text as="h3" className="text-sm font-semibold text-text-primary">
            Component Ownership
          </Text>
        </div>
      </div>

      {/* Coverage bar */}
      <div className="rounded-xl border border-border-subtle bg-surface-default px-4 py-3">
        <div className="flex items-center justify-between">
          <Text className="text-sm font-medium text-text-primary">
            Coverage
          </Text>
          <Text className="text-sm font-bold text-text-primary">
            {coverage}%
          </Text>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-muted">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${coverage}%` }}
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-3">
          {ownerSummary.map(({ owner, count }) => (
            <div key={owner} className="flex items-center gap-1.5">
              <Shield className="h-3 w-3 text-text-secondary" />
              <Text variant="secondary" className="text-[11px]">
                {owner.replace("@", "")}
              </Text>
              <span className="rounded-full bg-surface-muted px-1.5 py-0.5 text-[10px] font-medium text-text-secondary">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search components..."
          className="h-8 flex-1 rounded-lg border border-border-subtle bg-surface-canvas px-3 text-xs text-text-primary placeholder:text-text-secondary focus:border-border-default focus:outline-hidden focus:ring-1 focus:ring-[var(--accent-focus)]"
        />
        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          className="h-8 rounded-lg border border-border-subtle bg-surface-canvas px-2 text-xs text-text-primary focus:outline-hidden"
        >
          <option value="all">All tiers</option>
          <option value="tier1">Tier 1</option>
          <option value="tier2">Tier 2</option>
          <option value="tier3">Tier 3</option>
        </select>
      </div>

      {/* Component list */}
      <div className="flex flex-col max-h-[400px] gap-1 overflow-auto">
        {displayed.map((item) => (
          <OwnershipRow key={item.component} item={item} />
        ))}
        {displayed.length === 0 && (
          <div className="rounded-xl border border-border-subtle bg-surface-canvas px-4 py-6 text-center">
            <Text variant="secondary" className="text-sm">
              No components found.
            </Text>
          </div>
        )}
      </div>
    </div>
  );
}

function OwnershipRow({ item }: { item: ComponentOwner }) {
  return (
    <div className="flex items-center justify-between rounded-lg px-3 py-2 transition hover:bg-surface-muted/50">
      <div className="min-w-0 flex-1">
        <Text className="truncate text-xs font-medium text-text-primary">
          {item.component}
        </Text>
        <Text variant="secondary" className="text-[10px]">
          {item.owner.replace("@", "")}
        </Text>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${TIER_COLORS[item.supportTier]}`}
        >
          {TIER_LABELS[item.supportTier]}
        </span>
        {item.lastReviewDate && (
          <Text variant="secondary" className="text-[10px]">
            {item.lastReviewDate}
          </Text>
        )}
      </div>
    </div>
  );
}

export default OwnershipPanel;
