import React from "react";
import { Text } from "@mfe/design-system";
import type { DesignLabSidebarRendererProps } from "./sidebarRendererTypes";

/**
 * Platform contract summary shown in the foundations sidebar.
 * These represent the cross-cutting governance rules that all layers must comply with.
 */
const PLATFORM_CONTRACT_SIGNALS: ReadonlyArray<{
  id: string;
  label: string;
  scope: string;
}> = [
  { id: "theme_tokens", label: "Theme & Tokens", scope: "All layers" },
  { id: "accessibility", label: "Accessibility", scope: "All layers" },
  { id: "i18n", label: "i18n / RTL", scope: "All layers" },
  { id: "density_motion", label: "Density & Motion", scope: "Components+" },
];

/**
 * Foundations layer sidebar renderer.
 *
 * Shows foundation family context card (token/theme/runtime tree)
 * with foundation-specific labels, tree navigation, and platform
 * contract compliance signals.
 *
 * Contract (from layer-contract-matrix):
 * - mustContain: system family context, token/theme/runtime tree, foundation-specific search copy, platform contract signals
 * - mustNotContain: recipe cluster list, page template cards, component import CTA
 */
export const FoundationsSidebarRenderer: React.FC<DesignLabSidebarRendererProps> = ({
  layerTitle,
  foundationFamilyTitle,
  foundationFamilyDescription,
  foundationFamilyBadges = [],
  treeTracks,
  treeSelection,
  onTreeSelectionChange,
  ProductTreeComponent,
  SectionBadgeComponent,
  t,
}) => {
  const ProductTree = ProductTreeComponent;
  const SectionBadge = SectionBadgeComponent;

  const visibleCountBadge = React.useMemo(
    () => foundationFamilyBadges.find((badge) => /\d/.test(badge)) ?? null,
    [foundationFamilyBadges],
  );
  const visibleContextBadges = React.useMemo(
    () => foundationFamilyBadges.filter((badge) => badge !== visibleCountBadge).slice(0, 3),
    [foundationFamilyBadges, visibleCountBadge],
  );

  return (
    <div className="space-y-4">
      <section
        className="rounded-[22px] border border-border-subtle bg-surface-panel px-3.5 py-3.5"
        data-testid="design-lab-foundation-family-card"
      >
        <Text
          as="div"
          variant="secondary"
          className="text-[11px] font-semibold uppercase tracking-[0.18em]"
        >
          {t("designlab.sidebar.context.foundations")}
        </Text>
        <div className="mt-2 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Text variant="secondary" className="block text-xs leading-5">
              {layerTitle}
            </Text>
            <Text
              as="div"
              className="mt-1 text-sm font-semibold leading-6 text-text-primary"
            >
              {foundationFamilyTitle ?? t("designlab.sidebar.context.empty")}
            </Text>
          </div>
          {visibleCountBadge ? (
            <SectionBadge label={visibleCountBadge} />
          ) : null}
        </div>
        {foundationFamilyDescription ? (
          <Text variant="secondary" className="mt-2 block text-xs leading-5">
            {foundationFamilyDescription}
          </Text>
        ) : null}
        {visibleContextBadges.length ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {visibleContextBadges.map((badge) => (
              <SectionBadge key={badge} label={badge} />
            ))}
          </div>
        ) : null}
      </section>

      <section
        className="rounded-[22px] border border-border-subtle bg-surface-panel px-3.5 py-3"
        data-testid="design-lab-foundation-contracts"
      >
        <Text
          as="div"
          variant="secondary"
          className="text-[11px] font-semibold uppercase tracking-[0.18em]"
        >
          {t("designlab.sidebar.platformContracts.title")}
        </Text>
        <Text variant="secondary" className="mt-1 block text-[10px] leading-4">
          {t("designlab.sidebar.platformContracts.description")}
        </Text>
        <div className="mt-2.5 space-y-1.5">
          {PLATFORM_CONTRACT_SIGNALS.map((contract) => (
            <div
              key={contract.id}
              className="flex items-center justify-between gap-2 rounded-xl bg-surface-default px-3 py-2"
              data-testid={`design-lab-contract-${contract.id}`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <Text className="text-xs font-medium text-text-primary truncate">
                  {contract.label}
                </Text>
              </div>
              <Text variant="secondary" className="shrink-0 text-[10px]">
                {contract.scope}
              </Text>
            </div>
          ))}
        </div>
      </section>

      <section
        className="rounded-[22px] border border-border-subtle bg-surface-panel p-2.5"
        data-testid="design-lab-foundation-tree"
      >
        <div className="mb-2.5 px-2">
          <Text
            as="div"
            variant="secondary"
            className="text-[11px] font-semibold uppercase tracking-[0.18em]"
          >
            {t("designlab.sidebar.foundationTree.title")}
          </Text>
        </div>
        <ProductTree
          tracks={treeTracks}
          selection={treeSelection}
          onSelectionChange={onTreeSelectionChange}
          testIdPrefix="design-lab"
        />
      </section>
    </div>
  );
};
