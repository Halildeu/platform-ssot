import React, { useState, useMemo, useCallback } from "react";
import { Sparkles, Copy, Check, ChevronDown, ChevronRight, Code2, Layers } from "lucide-react";
import { Text } from "@mfe/design-system";
import { getTemplatesForComponent, getPatternCategories } from "./patternTemplates";
import type { PatternTemplate } from "./patternTemplates";

/* ------------------------------------------------------------------ */
/*  SuggestedPatterns — Auto-generated usage patterns for a component  */
/*                                                                     */
/*  Shows template-based patterns generated from component props/slots */
/*  Grouped by category (form, conditional, list, error, composition) */
/*  Each pattern: expandable code with copy button                     */
/*                                                                     */
/*  Unique: No competitor auto-generates usage patterns.               */
/* ------------------------------------------------------------------ */

type SuggestedPatternsProps = {
  componentName: string;
  componentProps?: string[];
};

export const SuggestedPatterns: React.FC<SuggestedPatternsProps> = ({
  componentName,
  componentProps = [],
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const templates = useMemo(
    () => getTemplatesForComponent(componentName),
    [componentName],
  );

  const categories = useMemo(() => getPatternCategories(), []);

  const filtered = useMemo(() => {
    if (filterCategory === "all") return templates;
    return templates.filter((t) => t.category === filterCategory);
  }, [templates, filterCategory]);

  const handleCopy = useCallback(async (template: PatternTemplate) => {
    try {
      const code = template.generate(componentName, componentProps);
      await navigator.clipboard.writeText(code);
      setCopiedId(template.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch { /* noop */ }
  }, [componentName, componentProps]);

  if (templates.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-500" />
          <Text as="h3" className="text-xs font-semibold text-text-primary">
            Suggested Patterns
          </Text>
          <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700">
            {templates.length}
          </span>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => setFilterCategory("all")}
          className={[
            "rounded-md px-2 py-1 text-[10px] font-medium transition",
            filterCategory === "all"
              ? "bg-violet-500 text-white"
              : "bg-surface-muted text-text-secondary hover:text-text-primary",
          ].join(" ")}
        >
          All ({templates.length})
        </button>
        {categories.map((cat) => {
          const count = templates.filter((t) => t.category === cat.id).length;
          if (count === 0) return null;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilterCategory(cat.id)}
              className={[
                "rounded-md px-2 py-1 text-[10px] font-medium transition",
                filterCategory === cat.id
                  ? "bg-violet-500 text-white"
                  : "bg-surface-muted text-text-secondary hover:text-text-primary",
              ].join(" ")}
            >
              {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Pattern list */}
      <div className="flex flex-col gap-1.5">
        {filtered.map((template) => {
          const isExpanded = expandedId === template.id;
          const isCopied = copiedId === template.id;
          const code = template.generate(componentName, componentProps);

          return (
            <div
              key={template.id}
              className="rounded-xl border border-border-subtle bg-surface-default overflow-hidden"
            >
              {/* Header row */}
              <div className="flex items-center justify-between px-3 py-2">
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : template.id)}
                  className="flex items-center gap-2 text-left flex-1 min-w-0"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3 shrink-0 text-text-tertiary" />
                  ) : (
                    <ChevronRight className="h-3 w-3 shrink-0 text-text-tertiary" />
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Text className="text-[11px] font-semibold text-text-primary truncate">
                        {template.name}
                      </Text>
                      <CategoryBadge category={template.category} />
                    </div>
                    <Text variant="secondary" className="text-[10px] truncate">
                      {template.description}
                    </Text>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(template)}
                  className="ml-2 flex shrink-0 items-center gap-1 rounded-md border border-border-subtle px-2 py-1 text-[10px] font-medium text-text-secondary hover:text-text-primary transition"
                >
                  {isCopied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                  {isCopied ? "Copied" : "Copy"}
                </button>
              </div>

              {/* Code block */}
              {isExpanded && (
                <div className="border-t border-border-subtle">
                  <pre className="overflow-x-auto bg-gray-900 p-3 text-[11px] leading-relaxed text-gray-200 font-mono">
                    {code}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-border-subtle py-6 text-center">
          <Text variant="secondary" className="text-xs">
            No patterns available for this category
          </Text>
        </div>
      )}
    </div>
  );
};

/* ---- Category badge ---- */

const CATEGORY_COLORS: Record<string, string> = {
  form: "bg-blue-100 text-blue-700",
  conditional: "bg-amber-100 text-amber-700",
  list: "bg-emerald-100 text-emerald-700",
  error: "bg-red-100 text-red-700",
  composition: "bg-purple-100 text-purple-700",
  state: "bg-indigo-100 text-indigo-700",
};

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className={`rounded-sm px-1 py-0.5 text-[8px] font-bold uppercase ${CATEGORY_COLORS[category] ?? "bg-[var(--surface-muted)] text-[var(--text-secondary)]"}`}>
      {category}
    </span>
  );
}

export default SuggestedPatterns;
