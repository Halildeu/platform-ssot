import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Database } from "lucide-react";
import { Text } from "@mfe/design-system";
import { useDesignLab } from "../DesignLabProvider";
import { ADVANCED_NAMES } from "../DesignLabSidebarRouter";

/* ------------------------------------------------------------------ */
/*  AdvancedListing — Heavy 3rd-party components (AG Grid, Charts…)   */
/* ------------------------------------------------------------------ */

export default function AdvancedListing() {
  const navigate = useNavigate();
  const { index, t } = useDesignLab();

  const advancedItems = useMemo(
    () =>
      index.items
        .filter((i) => ADVANCED_NAMES.has(i.name))
        .map((i) => ({
          name: i.name,
          description: i.description,
          lifecycle: i.lifecycle,
        })),
    [index],
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border-subtle bg-gradient-to-br from-surface-default to-surface-canvas px-6 py-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-default/80 px-3 py-1 text-xs font-medium text-text-secondary backdrop-blur-sm">
            <Database className="h-3 w-3" />
            {advancedItems.length} advanced components
          </div>
          <Text
            as="div"
            className="text-2xl font-extrabold tracking-tight text-text-primary"
          >
            {t("designlab.sidebar.title.advanced")}
          </Text>
          <Text
            variant="secondary"
            className="mt-2 max-w-xl text-sm leading-relaxed"
          >
            {t("designlab.landing.layer.advanced.description")}
          </Text>
        </div>
      </div>

      {/* Advanced cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {advancedItems.map((item) => (
          <button
            key={item.name}
            type="button"
            onClick={() => navigate(`/admin/design-lab/advanced/${item.name}`)}
            className="group relative overflow-hidden rounded-2xl border border-border-subtle bg-surface-default p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-border-default hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 transition-transform duration-300 group-hover:scale-110">
                <Database className="h-4.5 w-4.5" />
              </div>
              <Text
                as="div"
                className="text-base font-semibold text-text-primary"
              >
                {item.name}
              </Text>
              {item.description && (
                <Text
                  variant="secondary"
                  className="mt-1.5 line-clamp-2 text-xs leading-5"
                >
                  {item.description}
                </Text>
              )}
              <div className="mt-4 flex items-center justify-between">
                {item.lifecycle && (
                  <span className="rounded-full bg-surface-muted px-2.5 py-0.5 text-[11px] font-semibold text-text-secondary">
                    {item.lifecycle}
                  </span>
                )}
                <ArrowRight className="h-4 w-4 text-text-secondary opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
              </div>
            </div>
          </button>
        ))}

        {advancedItems.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-subtle bg-surface-canvas px-8 py-16 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-600">
              <Database className="h-7 w-7" />
            </div>
            <Text
              as="div"
              className="text-lg font-semibold text-text-primary"
            >
              Advanced Components
            </Text>
            <Text
              variant="secondary"
              className="mt-2 max-w-md text-sm leading-relaxed"
            >
              Enterprise-grade data grids, charts, and heavy third-party integrations. Components will appear here as they are registered in the catalog.
            </Text>
          </div>
        )}
      </div>
    </div>
  );
}
