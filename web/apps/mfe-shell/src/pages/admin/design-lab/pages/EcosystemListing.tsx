import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Text } from "@mfe/design-system";
import { useDesignLab } from "../DesignLabProvider";

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

  return (
    <div className="space-y-6">
      <div>
        <Text as="div" className="text-2xl font-bold text-text-primary">
          {t("designlab.sidebar.title.ecosystem")}
        </Text>
        <Text variant="secondary" className="mt-1 text-sm leading-6">
          {t("designlab.landing.layer.ecosystem.description")}
        </Text>
        <Text variant="secondary" className="mt-1 text-xs">
          {t("designlab.sidebar.itemCount", { count: families.length })}
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

        {families.length === 0 && (
          <div className="col-span-full rounded-2xl border border-border-subtle bg-surface-canvas p-8 text-center">
            <Text variant="secondary">
              {t("designlab.sidebar.empty.default")}
            </Text>
          </div>
        )}
      </div>
    </div>
  );
}
