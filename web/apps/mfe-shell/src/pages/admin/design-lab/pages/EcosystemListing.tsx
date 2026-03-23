import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Text } from "@mfe/design-system";
import { useDesignLab } from "../DesignLabProvider";

const X_SUITE_GROUPS = new Set([
  "x_data_grid", "x_charts", "x_scheduler", "x_kanban", "x_editor", "x_form_builder",
]);

/* ------------------------------------------------------------------ */
/*  EcosystemListing — All ecosystem extensions                        */
/* ------------------------------------------------------------------ */

export default function EcosystemListing() {
  const navigate = useNavigate();
  const { index, t } = useDesignLab();

  const families = useMemo(
    () => index.ecosystem?.currentFamilies ?? [],
    [index],
  );

  const xSuiteItems = useMemo(
    () => index.items.filter((i) => X_SUITE_GROUPS.has(i.taxonomyGroupId) && i.availability === "exported"),
    [index],
  );

  const xSuiteGroups = useMemo(() => {
    const groups = new Map<string, typeof xSuiteItems>();
    for (const item of xSuiteItems) {
      const key = item.taxonomyGroupId;
      const arr = groups.get(key);
      if (arr) arr.push(item);
      else groups.set(key, [item]);
    }
    return Array.from(groups.entries());
  }, [xSuiteItems]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Text as="div" className="text-2xl font-bold text-text-primary">
          {t("designlab.sidebar.title.ecosystem")}
        </Text>
        <Text variant="secondary" className="mt-1 text-sm leading-6">
          {t("designlab.landing.layer.ecosystem.description")}
        </Text>
        <Text variant="secondary" className="mt-1 text-xs">
          {t("designlab.sidebar.itemCount", { count: families.length + xSuiteItems.length })}
        </Text>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {families.map((family) => (
          <button
            key={family.extensionId}
            type="button"
            onClick={() =>
              navigate(`/admin/design-lab/ecosystem/${family.extensionId}`)
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

        {families.length === 0 && xSuiteItems.length === 0 && (
          <div className="col-span-full rounded-2xl border border-border-subtle bg-surface-canvas p-8 text-center">
            <Text variant="secondary">
              {t("designlab.sidebar.empty.default")}
            </Text>
          </div>
        )}
      </div>

      {/* X-Suite Enterprise Extensions */}
      {xSuiteGroups.map(([groupId, items]) => (
        <div key={groupId}>
          <Text
            as="div"
            variant="secondary"
            className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em]"
          >
            {groupId.replace(/_/g, '-').replace(/^x-/, '@mfe/x-')}
          </Text>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() =>
                  navigate(`/admin/design-lab/advanced/${encodeURIComponent(item.name.replace(/\//g, '~'))}`)
                }
                className="group rounded-2xl border border-border-subtle bg-surface-default p-5 text-left shadow-xs transition hover:border-action-primary/30 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <Text as="div" className="text-sm font-semibold text-text-primary">
                    {item.name}
                  </Text>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    {item.lifecycle}
                  </span>
                </div>
                <Text variant="secondary" className="mt-1.5 line-clamp-2 text-xs leading-5">
                  {item.description}
                </Text>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
