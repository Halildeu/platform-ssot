import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Shapes } from "lucide-react";
import { Text } from "@mfe/design-system";
import { useDesignLab } from "../DesignLabProvider";
import { PRIMITIVE_NAMES } from "../DesignLabSidebarRouter";

/* ------------------------------------------------------------------ */
/*  PrimitivesListing — Single-element primitive component grid        */
/* ------------------------------------------------------------------ */

export default function PrimitivesListing() {
  const navigate = useNavigate();
  const { index, t } = useDesignLab();

  const primitives = useMemo(
    () =>
      index.items
        .filter(
          (i) => i.availability === "exported" && PRIMITIVE_NAMES.has(i.name),
        )
        .map((i) => ({
          name: i.name,
          description: i.description,
          lifecycle: i.lifecycle,
          groupId: i.taxonomyGroupId,
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
            <Shapes className="h-3 w-3" />
            {primitives.length} primitives
          </div>
          <Text
            as="div"
            className="text-2xl font-extrabold tracking-tight text-text-primary"
          >
            {t("designlab.sidebar.title.primitives")}
          </Text>
          <Text
            variant="secondary"
            className="mt-2 max-w-xl text-sm leading-relaxed"
          >
            {t("designlab.landing.layer.primitives.description")}
          </Text>
        </div>
      </div>

      {/* Primitive cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {primitives.map((prim) => (
          <button
            key={prim.name}
            type="button"
            onClick={() =>
              navigate(
                `/admin/design-lab/primitives/${prim.groupId}/${encodeURIComponent(prim.name.replace(/\//g, '~'))}`,
              )
            }
            className="group relative overflow-hidden rounded-2xl border border-border-subtle bg-surface-default p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-border-default hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-cyan-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative">
              <div className="flex items-center justify-between gap-2">
                <Text
                  as="div"
                  className="text-sm font-semibold text-text-primary"
                >
                  {prim.name}
                </Text>
                {prim.lifecycle && (
                  <span className="shrink-0 rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-medium text-text-secondary">
                    {prim.lifecycle}
                  </span>
                )}
              </div>
              {prim.description && (
                <Text
                  variant="secondary"
                  className="mt-1.5 line-clamp-2 text-xs leading-5"
                >
                  {prim.description}
                </Text>
              )}
              <div className="mt-3 flex items-center justify-end">
                <ArrowRight className="h-3.5 w-3.5 text-text-secondary opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
