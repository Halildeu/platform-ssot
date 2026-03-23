import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Text } from "@mfe/design-system";
import { useDesignLab } from "../DesignLabProvider";
import { ADVANCED_NAMES } from "../DesignLabSidebarRouter";

/* ------------------------------------------------------------------ */
/*  PagesListing — All page template families                          */
/* ------------------------------------------------------------------ */

export default function PagesListing() {
  const navigate = useNavigate();
  const { index, t } = useDesignLab();

  const families = useMemo(
    () => index.pages?.currentFamilies ?? [],
    [index],
  );

  const advancedItems = useMemo(
    () => index.items.filter((i) => ADVANCED_NAMES.has(i.name) && i.availability === "exported"),
    [index],
  );

  /* Group by clusterTitle */
  const clusters = useMemo(() => {
    const map = new Map<string, typeof families>();
    for (const f of families) {
      const key = f.clusterTitle ?? t("designlab.sidebar.page.defaultCluster");
      const arr = map.get(key);
      if (arr) arr.push(f);
      else map.set(key, [f]);
    }
    return Array.from(map.entries());
  }, [families, t]);

  return (
    <div className="space-y-6">
      <div>
        <Text as="div" className="text-2xl font-bold text-text-primary">
          {t("designlab.sidebar.title.pages")}
        </Text>
        <Text variant="secondary" className="mt-1 text-sm leading-6">
          {t("designlab.landing.layer.pages.description")}
        </Text>
        <Text variant="secondary" className="mt-1 text-xs">
          {t("designlab.sidebar.itemCount", { count: families.length + advancedItems.length })}
        </Text>
      </div>

      {clusters.length > 0 && clusters.map(([clusterTitle, items]) => (
        <div key={clusterTitle}>
          <Text
            as="div"
            variant="secondary"
            className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em]"
          >
            {clusterTitle}
          </Text>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((family) => (
              <button
                key={family.pageId}
                type="button"
                onClick={() =>
                  navigate(`/admin/design-lab/patterns/${family.pageId}`)
                }
                className="group rounded-2xl border border-border-subtle bg-surface-default p-5 text-left shadow-xs transition hover:border-action-primary/30 hover:shadow-md"
              >
                <Text as="div" className="text-base font-semibold text-text-primary">
                  {family.title}
                </Text>
                <Text variant="secondary" className="mt-2 line-clamp-2 text-sm leading-6">
                  {family.intent}
                </Text>
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Advanced integrations */}
      {advancedItems.length > 0 && (
        <div>
          <Text
            as="div"
            variant="secondary"
            className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em]"
          >
            Advanced Entegrasyonlar
          </Text>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {advancedItems.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() =>
                  navigate(`/admin/design-lab/advanced/${encodeURIComponent(item.name.replace(/\//g, '~'))}`)
                }
                className="group rounded-2xl border border-border-subtle bg-surface-default p-5 text-left shadow-xs transition hover:border-action-primary/30 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <Text as="div" className="text-base font-semibold text-text-primary">
                    {item.name}
                  </Text>
                  <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                    {item.lifecycle}
                  </span>
                </div>
                <Text variant="secondary" className="mt-2 line-clamp-2 text-sm leading-6">
                  {item.description}
                </Text>
              </button>
            ))}
          </div>
        </div>
      )}

      {families.length === 0 && advancedItems.length === 0 && (
        <div className="rounded-2xl border border-border-subtle bg-surface-default p-12 text-center">
          <Text variant="secondary" className="text-sm">
            Bu katmanda henüz öğe yok.
          </Text>
        </div>
      )}
    </div>
  );
}
