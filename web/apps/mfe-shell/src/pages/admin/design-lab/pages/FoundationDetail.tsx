import React from "react";
import { useParams } from "react-router-dom";
import { Text } from "@mfe/design-system";
import { useDesignLab } from "../DesignLabProvider";

/* ------------------------------------------------------------------ */
/*  FoundationDetail — Individual foundation family page               */
/*  TODO: Faz 2 — full detail content with tabs                        */
/* ------------------------------------------------------------------ */

export default function FoundationDetail() {
  const { familyId } = useParams<{ familyId: string }>();
  const { t } = useDesignLab();

  const title = familyId
    ? t(`designlab.foundationFamily.${familyId}.title`)
    : "";
  const description = familyId
    ? t(`designlab.foundationFamily.${familyId}.description`)
    : "";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Text
          variant="secondary"
          className="text-xs font-medium uppercase tracking-wider"
        >
          {t("designlab.sidebar.title.foundations")}
        </Text>
        <Text as="div" className="mt-1 text-2xl font-bold text-text-primary">
          {title || familyId}
        </Text>
        <Text variant="secondary" className="mt-2 text-sm leading-6">
          {description}
        </Text>
      </div>

      {/* Placeholder for Faz 2 tab content */}
      <div className="rounded-2xl border border-border-subtle bg-surface-default p-6">
        <Text variant="secondary" className="text-sm">
          {t("designlab.detail.comingSoon")}
        </Text>
      </div>
    </div>
  );
}
