import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Box } from "lucide-react";
import { Text } from "@mfe/design-system";
import { useDesignLab } from "../DesignLabProvider";
import { PRIMITIVE_NAMES, ADVANCED_NAMES } from "../DesignLabSidebarRouter";

/* ------------------------------------------------------------------ */
/*  ComponentsListing — All component groups (modern card grid)        */
/* ------------------------------------------------------------------ */

const GROUP_COLORS = [
  "from-blue-500/10 to-cyan-500/5",
  "from-violet-500/10 to-purple-500/5",
  "from-emerald-500/10 to-teal-500/5",
  "from-amber-500/10 to-orange-500/5",
  "from-rose-500/10 to-pink-500/5",
  "from-indigo-500/10 to-blue-500/5",
];

const GROUP_ICON_BG = [
  "bg-blue-500/10 text-blue-600",
  "bg-violet-500/10 text-violet-600",
  "bg-emerald-500/10 text-emerald-600",
  "bg-amber-500/10 text-amber-600",
  "bg-rose-500/10 text-rose-600",
  "bg-indigo-500/10 text-indigo-600",
];

export default function ComponentsListing() {
  const navigate = useNavigate();
  const { index, taxonomy, t } = useDesignLab();

  const groups = useMemo(
    () =>
      taxonomy.groups
        .map((group, idx) => {
          // Filter out primitives and advanced from component counts
          const filteredSubgroups = group.subgroups.map((sg) => ({
            ...sg,
            items: sg.items.filter(
              (name) => !PRIMITIVE_NAMES.has(name) && !ADVANCED_NAMES.has(name),
            ),
          })).filter((sg) => sg.items.length > 0);

          const totalItems = filteredSubgroups.reduce(
            (sum, sg) => sum + sg.items.length,
            0,
          );
          return {
            ...group,
            subgroups: filteredSubgroups,
            totalItems,
            gradient: GROUP_COLORS[idx % GROUP_COLORS.length],
            iconBg: GROUP_ICON_BG[idx % GROUP_ICON_BG.length],
          };
        })
        .filter((g) => g.totalItems > 0),
    [taxonomy],
  );

  const totalCount = index.items.filter(
    (i) => i.availability === "exported" && !PRIMITIVE_NAMES.has(i.name) && !ADVANCED_NAMES.has(i.name),
  ).length;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border-subtle bg-linear-to-br from-surface-default to-surface-canvas px-6 py-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-default/80 px-3 py-1 text-xs font-medium text-text-secondary backdrop-blur-xs">
            <Box className="h-3 w-3" />
            {totalCount} components
          </div>
          <Text as="div" className="text-2xl font-extrabold tracking-tight text-text-primary">
            {t("designlab.sidebar.title.components")}
          </Text>
          <Text variant="secondary" className="mt-2 max-w-xl text-sm leading-relaxed">
            {t("designlab.landing.layer.components.description")}
          </Text>
        </div>
      </div>

      {/* Group cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <button
            key={group.id}
            type="button"
            onClick={() => navigate(`/admin/design-lab/components/${group.id}`)}
            className="group relative overflow-hidden rounded-2xl border border-border-subtle bg-surface-default p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-border-default hover:shadow-lg"
          >
            {/* Gradient hover overlay */}
            <div className={`absolute inset-0 bg-linear-to-br ${group.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

            <div className="relative">
              <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${group.iconBg} transition-[scale] duration-300 group-hover:scale-110`}>
                <Box className="h-4.5 w-4.5" />
              </div>
              <Text as="div" className="text-base font-semibold text-text-primary">
                {group.label}
              </Text>
              <Text variant="secondary" className="mt-1.5 line-clamp-2 text-xs leading-5">
                {group.subgroups.map((sg) => sg.label).join(", ")}
              </Text>
              <div className="mt-4 flex items-center justify-between">
                <span className="rounded-full bg-surface-muted px-2.5 py-0.5 text-[11px] font-semibold tabular-nums text-text-secondary">
                  {group.totalItems} {t("designlab.landing.items")}
                </span>
                <ArrowRight className="h-4 w-4 text-text-secondary opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
