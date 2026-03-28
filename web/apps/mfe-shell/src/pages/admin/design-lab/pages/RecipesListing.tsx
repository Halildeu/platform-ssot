import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Text } from "@mfe/design-system";
import { useDesignLab } from "../DesignLabProvider";

/* ------------------------------------------------------------------ */
/*  RecipesListing — All recipe families                               */
/* ------------------------------------------------------------------ */

export default function RecipesListing() {
  const navigate = useNavigate();
  const { index, t } = useDesignLab();

  const families = useMemo(
    () => index.recipes?.currentFamilies ?? [],
    [index],
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Text as="div" className="text-2xl font-bold text-text-primary">
          {t("designlab.sidebar.title.recipes")}
        </Text>
        <Text variant="secondary" className="mt-1 text-sm leading-6">
          {t("designlab.landing.layer.recipes.description")}
        </Text>
        <Text variant="secondary" className="mt-1 text-xs">
          {t("designlab.sidebar.itemCount", { count: families.length })}
        </Text>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {families.map((family) => (
          <button
            key={family.recipeId}
            type="button"
            onClick={() =>
              navigate(`/admin/design-lab/recipes/${family.recipeId}`)
            }
            className="group rounded-2xl border border-border-subtle bg-surface-default p-5 text-left shadow-xs transition hover:border-action-primary/30 hover:shadow-md"
          >
            <Text as="div" className="text-base font-semibold text-text-primary">
              {family.title}
            </Text>
            <Text variant="secondary" className="mt-2 line-clamp-2 text-sm leading-6">
              {family.intent}
            </Text>
            {family.ownerBlocks.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {family.ownerBlocks.slice(0, 3).map((block) => (
                  <span
                    key={block}
                    className="rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-medium text-text-secondary"
                  >
                    {block}
                  </span>
                ))}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
