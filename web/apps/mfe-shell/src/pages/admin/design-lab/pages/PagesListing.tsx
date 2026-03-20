import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Text } from "@mfe/design-system";
import { useDesignLab } from "../DesignLabProvider";

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
          {t("designlab.sidebar.itemCount", { count: families.length })}
        </Text>
      </div>

      {clusters.map(([clusterTitle, items]) => (
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
                  navigate(`/admin/design-lab/pages/${family.pageId}`)
                }
                className="group rounded-2xl border border-border-subtle bg-surface-default p-5 text-left shadow-sm transition hover:border-action-primary/30 hover:shadow-md"
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
    </div>
  );
}
