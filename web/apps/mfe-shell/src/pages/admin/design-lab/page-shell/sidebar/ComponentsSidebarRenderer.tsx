import React from "react";
import { Text } from "@mfe/design-system";
import type { DesignLabSidebarRendererProps } from "./sidebarRendererTypes";

/**
 * Components layer sidebar renderer.
 *
 * Shows component family context card (product tree, import CTA, adoption signals)
 * with component-specific labels and tree navigation.
 *
 * Contract (from layer-contract-matrix):
 * - mustContain: component family context, component tree, component-specific search copy
 * - mustNotContain: recipe cluster cards in preview navigation, page template list, workflow-first sidebar copy
 */
export const ComponentsSidebarRenderer: React.FC<DesignLabSidebarRendererProps> = ({
  layerTitle,
  componentFamilyTitle,
  componentFamilyDescription,
  componentFamilyBadges = [],
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
    () => componentFamilyBadges.find((badge) => /\d/.test(badge)) ?? null,
    [componentFamilyBadges],
  );
  const visibleContextBadges = React.useMemo(
    () => componentFamilyBadges.filter((badge) => badge !== visibleCountBadge).slice(0, 3),
    [componentFamilyBadges, visibleCountBadge],
  );

  return (
    <div className="flex flex-col gap-4">
      <section
        className="rounded-[22px] border border-border-subtle bg-surface-panel px-3.5 py-3.5"
        data-testid="design-lab-component-family-card"
      >
        <Text
          as="div"
          variant="secondary"
          className="text-[11px] font-semibold uppercase tracking-[0.18em]"
        >
          {t("designlab.sidebar.context.title")}
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
              {componentFamilyTitle ?? t("designlab.sidebar.context.empty")}
            </Text>
          </div>
          {visibleCountBadge ? (
            <SectionBadge label={visibleCountBadge} />
          ) : null}
        </div>
        {componentFamilyDescription ? (
          <Text variant="secondary" className="mt-2 block text-xs leading-5">
            {componentFamilyDescription}
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

      <section className="rounded-[22px] border border-border-subtle bg-surface-panel p-2.5">
        <div className="mb-2.5 px-2">
          <Text
            as="div"
            variant="secondary"
            className="text-[11px] font-semibold uppercase tracking-[0.18em]"
          >
            {t("designlab.sidebar.productTree.title")}
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
