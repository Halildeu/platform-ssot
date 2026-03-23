import React from "react";
import { useNavigate } from "react-router-dom";
import { Text } from "@mfe/design-system";
import { useDesignLab } from "../DesignLabProvider";

/* ------------------------------------------------------------------ */
/*  FoundationsListing — Grid of foundation families                   */
/* ------------------------------------------------------------------ */

const FOUNDATION_FAMILIES = [
  "theme_tokens",
  "a11y_i18n",
  "dev_diagnostics",
  "runtime_utilities",
] as const;

export default function FoundationsListing() {
  const navigate = useNavigate();
  const { t } = useDesignLab();

  const families = FOUNDATION_FAMILIES.map((id) => ({
    id,
    title: t(`designlab.foundationFamily.${id}.title`),
    description: t(`designlab.foundationFamily.${id}.description`),
    benchmark: t(`designlab.foundationFamily.${id}.benchmark`),
    badges: [
      t(`designlab.foundationFamily.${id}.badges.${id === "theme_tokens" ? "theme" : id === "a11y_i18n" ? "a11y" : id === "dev_diagnostics" ? "qa" : "hooks"}`),
    ],
  }));

  return (
    <div className="space-y-6">
      <div>
        <Text as="div" className="text-2xl font-bold text-text-primary">
          {t("designlab.sidebar.title.foundations")}
        </Text>
        <Text variant="secondary" className="mt-1 text-sm leading-6">
          {t("designlab.landing.layer.foundations.description")}
        </Text>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {families.map((family) => (
          <button
            key={family.id}
            type="button"
            onClick={() => navigate(`/admin/design-lab/foundations/${family.id}`)}
            className="group rounded-2xl border border-border-subtle bg-surface-default p-5 text-left shadow-xs transition hover:border-action-primary/30 hover:shadow-md"
          >
            <Text as="div" className="text-base font-semibold text-text-primary">
              {family.title}
            </Text>
            <Text variant="secondary" className="mt-2 line-clamp-3 text-sm leading-6">
              {family.description}
            </Text>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {family.badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full bg-surface-muted px-2.5 py-0.5 text-[10px] font-medium text-text-secondary"
                >
                  {badge}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
