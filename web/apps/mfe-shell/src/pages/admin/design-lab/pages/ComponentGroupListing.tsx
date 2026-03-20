import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Text } from "@mfe/design-system";
import { useDesignLab } from "../DesignLabProvider";

/* ------------------------------------------------------------------ */
/*  ComponentGroupListing — Components within a taxonomy group         */
/*  e.g. /design-lab/components/actions → lists Button, IconButton...  */
/* ------------------------------------------------------------------ */

export default function ComponentGroupListing() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { taxonomy, index, t } = useDesignLab();

  const group = useMemo(
    () => taxonomy.groups.find((g) => g.id === groupId),
    [taxonomy, groupId],
  );

  if (!group) {
    return (
      <div className="rounded-2xl border border-border-subtle bg-surface-default p-8 text-center">
        <Text variant="secondary">
          {t("designlab.detail.notFound")}
        </Text>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Text
          variant="secondary"
          className="text-xs font-medium uppercase tracking-wider"
        >
          {t("designlab.sidebar.title.components")}
        </Text>
        <Text as="div" className="mt-1 text-2xl font-bold text-text-primary">
          {group.label}
        </Text>
      </div>

      {group.subgroups.map((subgroup) => (
        <div key={subgroup.label}>
          <Text
            as="div"
            variant="secondary"
            className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em]"
          >
            {subgroup.label}
          </Text>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {subgroup.items.map((itemName) => {
              const indexItem = index.items.find((i) => i.name === itemName);
              return (
                <button
                  key={itemName}
                  type="button"
                  onClick={() =>
                    navigate(
                      `/admin/design-lab/components/${groupId}/${itemName}`,
                    )
                  }
                  className="group rounded-2xl border border-border-subtle bg-surface-default p-4 text-left shadow-sm transition hover:border-action-primary/30 hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-2">
                    <Text
                      as="div"
                      className="truncate text-sm font-semibold text-text-primary"
                    >
                      {itemName}
                    </Text>
                    {indexItem?.lifecycle && (
                      <span
                        className={[
                          "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
                          indexItem.lifecycle === "stable"
                            ? "bg-state-success-bg text-state-success-text"
                            : indexItem.lifecycle === "beta"
                              ? "bg-state-warning-bg text-state-warning-text"
                              : "bg-state-info-bg text-state-info-text",
                        ].join(" ")}
                      >
                        {indexItem.lifecycle}
                      </span>
                    )}
                  </div>
                  {indexItem?.description && (
                    <Text
                      variant="secondary"
                      className="mt-1 line-clamp-2 text-xs leading-5"
                    >
                      {indexItem.description}
                    </Text>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
