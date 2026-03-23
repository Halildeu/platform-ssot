import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Workflow, CircleDot, CheckCircle2, Shield, GitBranch, Zap, ArrowRight } from "lucide-react";
import { Text } from "@mfe/design-system";
import { useDesignLab } from "../DesignLabProvider";
import workflowCatalog from "../../design-lab.recipe-workflow-catalog.v1.json";

/* ------------------------------------------------------------------ */
/*  RecipeDetail — Individual recipe page                              */
/*                                                                     */
/*  Tabs: Overview · Workflow · Components · Quality                    */
/* ------------------------------------------------------------------ */

type RecipeTab = "overview" | "workflow" | "components" | "quality";
const RECIPE_TABS: RecipeTab[] = ["overview", "workflow", "components", "quality"];

export default function RecipeDetail() {
  const { recipeId } = useParams<{ recipeId: string }>();
  const navigate = useNavigate();
  const { index, t } = useDesignLab();
  const [activeTab, setActiveTab] = useState<RecipeTab>("overview");

  const recipe = useMemo(
    () => index.recipes?.currentFamilies.find((f) => f.recipeId === recipeId),
    [index, recipeId],
  );

  // Find components that belong to this recipe's sections
  const relatedComponents = useMemo(() => {
    if (!recipe?.sectionIds?.length) return [];
    return index.items.filter((item) =>
      item.sectionIds?.some((sid) => recipe.sectionIds?.includes(sid)),
    );
  }, [recipe, index.items]);

  if (!recipe) {
    return (
      <div className="rounded-2xl border border-border-subtle bg-surface-default p-8 text-center">
        <Text variant="secondary">{t("designlab.detail.notFound")}</Text>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-text-secondary">
        <button type="button" onClick={() => navigate("/admin/design-lab")} className="hover:text-text-primary">
          {t("designlab.breadcrumb.library")}
        </button>
        <span>/</span>
        <button type="button" onClick={() => navigate("/admin/design-lab/recipes")} className="hover:text-text-primary">
          {t("designlab.sidebar.title.recipes")}
        </button>
        <span>/</span>
        <span className="text-text-primary">{recipe.title}</span>
      </div>

      {/* Hero */}
      <div>
        <Text as="div" className="text-3xl font-bold tracking-tight text-text-primary">
          {recipe.title}
        </Text>
        <Text variant="secondary" className="mt-2 max-w-2xl text-sm leading-6">
          {recipe.intent}
        </Text>
        {recipe.ownerBlocks.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {recipe.ownerBlocks.map((block) => (
              <span key={block} className="rounded-full bg-surface-muted px-2.5 py-0.5 text-xs font-medium text-text-secondary">
                {block}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tab navigation */}
      <div className="border-b border-border-subtle">
        <div className="-mb-px flex gap-1">
          {RECIPE_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={[
                "px-4 py-2.5 text-sm font-medium transition",
                activeTab === tab
                  ? "border-b-2 border-action-primary text-text-primary"
                  : "text-text-secondary hover:text-text-primary",
              ].join(" ")}
            >
              {t(`designlab.recipe.tab.${tab}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="min-h-[400px]">
        {activeTab === "overview" && (
          <RecipeOverview recipe={recipe} relatedComponents={relatedComponents} />
        )}
        {activeTab === "workflow" && (
          <RecipeWorkflow recipe={recipe} />
        )}
        {activeTab === "components" && (
          <RecipeComponents relatedComponents={relatedComponents} navigate={navigate} />
        )}
        {activeTab === "quality" && (
          <RecipeQuality recipe={recipe} />
        )}
      </div>
    </div>
  );
}

type RecipeFamily = NonNullable<
  ReturnType<typeof useDesignLab>["index"]["recipes"]
>["currentFamilies"][number];

function RecipeOverview({
  recipe,
  relatedComponents,
}: {
  recipe: RecipeFamily;
  relatedComponents: ReturnType<typeof useDesignLab>["index"]["items"];
}) {
  const { t } = useDesignLab();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Intent */}
      <div className="rounded-2xl border border-border-subtle bg-surface-default p-5">
        <Text as="div" className="mb-3 text-sm font-semibold text-text-primary">
          {t("designlab.recipe.overview.intent")}
        </Text>
        <Text variant="secondary" className="text-sm leading-6">
          {recipe.intent}
        </Text>
      </div>

      {/* Owner blocks */}
      {recipe.ownerBlocks.length > 0 && (
        <div className="rounded-2xl border border-border-subtle bg-surface-default p-5">
          <Text as="div" className="mb-3 text-sm font-semibold text-text-primary">
            {t("designlab.recipe.overview.ownerBlocks")}
          </Text>
          <div className="flex flex-wrap gap-2">
            {recipe.ownerBlocks.map((block) => (
              <span
                key={block}
                className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-text-secondary"
              >
                {block}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Related components summary */}
      {relatedComponents.length > 0 && (
        <div className="rounded-2xl border border-border-subtle bg-surface-default p-5 lg:col-span-2">
          <Text as="div" className="mb-3 text-sm font-semibold text-text-primary">
            {t("designlab.recipe.overview.usedComponents")} ({relatedComponents.length})
          </Text>
          <div className="flex flex-wrap gap-2">
            {relatedComponents.slice(0, 12).map((comp) => (
              <span
                key={comp.name}
                className="rounded-full bg-state-info-bg px-3 py-1 text-xs font-medium text-state-info-text"
              >
                {comp.name}
              </span>
            ))}
            {relatedComponents.length > 12 && (
              <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-text-secondary">
                +{relatedComponents.length - 12}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---- Workflow pattern matching ---- */

const COMPLEXITY_COLORS: Record<string, { bg: string; text: string }> = {
  simple: { bg: "bg-emerald-500/10", text: "text-emerald-600" },
  moderate: { bg: "bg-amber-500/10", text: "text-amber-600" },
  complex: { bg: "bg-rose-500/10", text: "text-rose-600" },
};

const STATE_COLORS: Record<string, string> = {
  zinc: "bg-zinc-100 text-zinc-600 border-zinc-300",
  blue: "bg-blue-100 text-blue-600 border-blue-300",
  emerald: "bg-emerald-100 text-emerald-600 border-emerald-300",
  amber: "bg-amber-100 text-amber-600 border-amber-300",
  violet: "bg-violet-100 text-violet-600 border-violet-300",
  red: "bg-red-100 text-red-600 border-red-300",
};

function snakeToReadable(s: string): string {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function findBestPattern(ownerBlocks: string[]) {
  const patterns = workflowCatalog.workflowPatterns;
  let best: (typeof patterns)[number] | null = null;
  let bestScore = 0;
  const blockSet = new Set(ownerBlocks.map((b) => b.toLowerCase()));
  for (const pattern of patterns) {
    const patternSet = new Set(pattern.ownerBlockPattern.map((p) => p.toLowerCase()));
    const intersection = Array.from(blockSet).filter((b) => Array.from(patternSet).some((p) => b.includes(p) || p.includes(b)));
    const union = new Set(Array.from(blockSet).concat(Array.from(patternSet)));
    const score = intersection.length / union.size;
    if (score > bestScore) {
      bestScore = score;
      best = pattern;
    }
  }
  return bestScore > 0.05 ? best : null;
}

function RecipeWorkflow({ recipe }: { recipe: RecipeFamily }) {
  const { t } = useDesignLab();
  const pattern = useMemo(() => findBestPattern(recipe.ownerBlocks), [recipe.ownerBlocks]);

  if (!pattern) {
    // Fallback: show ownerBlocks as simple sequential steps
    if (recipe.ownerBlocks.length === 0) {
      return (
        <div className="rounded-2xl border border-border-subtle bg-surface-canvas p-8 text-center">
          <Workflow className="mx-auto mb-3 h-8 w-8 text-text-secondary/30" />
          <Text variant="secondary" className="text-sm">
            {t("designlab.recipe.workflow.noPattern")}
          </Text>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Workflow className="h-5 w-5 text-text-secondary" />
          <Text as="div" className="text-sm font-semibold text-text-primary">
            {t("designlab.recipe.workflow.steps")}
          </Text>
        </div>
        <div className="relative pl-8">
          <div className="absolute left-3.5 top-0 h-full w-px bg-border-subtle" />
          {recipe.ownerBlocks.map((block, idx) => (
            <div key={block} className="relative mb-4 last:mb-0">
              <div className="absolute -left-8 top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-border-subtle bg-surface-default text-[10px] font-bold text-text-secondary">
                {idx + 1}
              </div>
              <div className="rounded-xl border border-border-subtle bg-surface-default p-3">
                <Text className="text-sm font-medium text-text-primary">{block}</Text>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const { lifecycle } = workflowCatalog.workflowStates;
  const { transitions } = workflowCatalog.workflowStates;

  return (
    <div className="space-y-8">
      {/* ── Pattern header ── */}
      <div className="flex items-center gap-3">
        <Workflow className="h-5 w-5 text-action-primary" />
        <div>
          <Text as="div" className="text-sm font-semibold text-text-primary">{pattern.title}</Text>
          <Text variant="secondary" className="text-xs">{pattern.description}</Text>
        </div>
        <span className={`ml-auto rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${COMPLEXITY_COLORS[pattern.complexity]?.bg ?? ""} ${COMPLEXITY_COLORS[pattern.complexity]?.text ?? ""}`}>
          {t("designlab.recipe.workflow.complexity")}: {snakeToReadable(pattern.complexity)}
        </span>
      </div>

      {/* ── Section A: Workflow Steps (vertical timeline) ── */}
      <div>
        <Text as="div" className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
          {t("designlab.recipe.workflow.steps")}
        </Text>
        <div className="relative pl-8">
          <div className="absolute left-3.5 top-0 h-full w-px bg-border-subtle" />
          {pattern.steps.map((step, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === pattern.steps.length - 1;
            return (
              <div key={step} className="relative mb-5 last:mb-0">
                <div
                  className={[
                    "absolute -left-8 top-1 flex h-7 w-7 items-center justify-center rounded-full border-2",
                    isFirst
                      ? "border-blue-500 bg-blue-500 text-white"
                      : isLast
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-border-subtle bg-surface-default text-text-secondary",
                  ].join(" ")}
                >
                  {isLast ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <span className="text-[10px] font-bold">{idx + 1}</span>
                  )}
                </div>
                <div className="rounded-xl border border-border-subtle bg-surface-default p-3">
                  <Text className="text-sm font-medium text-text-primary">
                    {snakeToReadable(step)}
                  </Text>
                  {pattern.ownerBlockPattern[idx] && (
                    <span className="ml-2 inline-flex rounded-md bg-surface-muted px-2 py-0.5 text-[10px] font-medium text-text-secondary">
                      {pattern.ownerBlockPattern[idx]}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Section B: Lifecycle States (horizontal flow) ── */}
      <div>
        <Text as="div" className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
          {t("designlab.recipe.workflow.states")}
        </Text>
        <div className="flex flex-wrap items-center gap-2">
          {lifecycle.map((state, idx) => (
            <React.Fragment key={state.stateId}>
              <div
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${STATE_COLORS[state.color] ?? STATE_COLORS.zinc}`}
                title={state.description}
              >
                <CircleDot className="mr-1 inline h-3 w-3" />
                {state.label}
              </div>
              {idx < lifecycle.length - 1 && (
                <ArrowRight className="h-3 w-3 text-text-secondary/40" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── Section C: Quality Gates ── */}
      {pattern.qualityGates.length > 0 && (
        <div>
          <Text as="div" className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">
            {t("designlab.recipe.workflow.qualityGates")}
          </Text>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {pattern.qualityGates.map((gate) => (
              <div key={gate} className="flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-default px-3 py-2">
                <Shield className="h-3.5 w-3.5 text-emerald-500" />
                <Text className="text-xs font-medium text-text-primary">{snakeToReadable(gate)}</Text>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Section D: Dependencies ── */}
      {pattern.dependsOn.length > 0 && (
        <div>
          <Text as="div" className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">
            {t("designlab.recipe.workflow.dependencies")}
          </Text>
          <div className="flex flex-wrap gap-2">
            {pattern.dependsOn.map((dep) => {
              const depPattern = workflowCatalog.workflowPatterns.find((p) => p.patternId === dep);
              return (
                <div key={dep} className="flex items-center gap-1.5 rounded-lg border border-border-subtle bg-surface-default px-3 py-2">
                  <GitBranch className="h-3.5 w-3.5 text-violet-500" />
                  <Text className="text-xs font-medium text-text-primary">
                    {depPattern?.title ?? snakeToReadable(dep)}
                  </Text>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function RecipeComponents({
  relatedComponents,
  navigate,
}: {
  relatedComponents: ReturnType<typeof useDesignLab>["index"]["items"];
  navigate: ReturnType<typeof useNavigate>;
}) {
  const { t } = useDesignLab();

  if (relatedComponents.length === 0) {
    return (
      <div className="rounded-2xl border border-border-subtle bg-surface-canvas p-8 text-center">
        <Text variant="secondary" className="text-sm">
          {t("designlab.recipe.components.empty")}
        </Text>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {relatedComponents.map((comp) => (
        <button
          key={comp.name}
          type="button"
          onClick={() =>
            navigate(`/admin/design-lab/components/${comp.taxonomyGroupId}/${encodeURIComponent(comp.name.replace(/\//g, '~'))}`)
          }
          className="group rounded-2xl border border-border-subtle bg-surface-default p-4 text-left transition hover:border-action-primary/30 hover:shadow-xs"
        >
          <div className="flex items-center justify-between gap-2">
            <Text className="text-sm font-semibold text-text-primary group-hover:text-action-primary">
              {comp.name}
            </Text>
            <span
              className={[
                "rounded-full px-2 py-0.5 text-[10px] font-medium",
                comp.lifecycle === "stable"
                  ? "bg-state-success-bg text-state-success-text"
                  : comp.lifecycle === "beta"
                    ? "bg-state-warning-bg text-state-warning-text"
                    : "bg-state-info-bg text-state-info-text",
              ].join(" ")}
            >
              {comp.lifecycle}
            </span>
          </div>
          <Text variant="secondary" className="mt-1 line-clamp-2 text-xs">
            {comp.description}
          </Text>
        </button>
      ))}
    </div>
  );
}

function RecipeQuality({ recipe }: { recipe: RecipeFamily }) {
  const { t } = useDesignLab();

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-default p-5">
      <Text as="div" className="mb-3 text-sm font-semibold text-text-primary">
        {t("designlab.detail.quality.gates")}
      </Text>
      <Text variant="secondary" className="text-xs">
        {t("designlab.detail.quality.noGates")}
      </Text>
    </div>
  );
}
