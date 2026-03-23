import React, { useState, useMemo } from "react";
import { Search, BookOpen, Sparkles } from "lucide-react";
import { Text } from "@mfe/design-system";
import { ExampleCard } from "./ExampleCard";
import {
  getExamplesForComponent,
  getExampleCategories,
  EXAMPLE_CATEGORY_META,
} from "./registry";
import type { ExampleCategory, ExampleEntry } from "./registry";

/* ------------------------------------------------------------------ */
/*  ExamplesGallery — Curated code examples with category filters       */
/*                                                                     */
/*  Surpasses Shadcn examples + Storybook stories with:                */
/*  - Categorized examples (Basic, Form, Layout, Advanced, Patterns)   */
/*  - Search across title, description, tags                           */
/*  - Live preview per example                                         */
/*  - One-click code copy                                              */
/*  - Fallback to auto-generated examples when no curated ones exist   */
/* ------------------------------------------------------------------ */

type ExamplesGalleryProps = {
  componentName: string;
  /** Auto-generated examples from existing tab as fallback */
  fallbackContent?: React.ReactNode;
};

export const ExamplesGallery: React.FC<ExamplesGalleryProps> = ({
  componentName,
  fallbackContent,
}) => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<ExampleCategory | "all">("all");

  const allExamples = useMemo(
    () => getExamplesForComponent(componentName),
    [componentName],
  );

  const categories = useMemo(
    () => getExampleCategories(allExamples),
    [allExamples],
  );

  const filteredExamples = useMemo(() => {
    let result = allExamples;

    if (activeCategory !== "all") {
      result = result.filter((e) => e.category === activeCategory);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          (e.tags ?? []).some((t) => t.toLowerCase().includes(q)),
      );
    }

    return result;
  }, [allExamples, activeCategory, search]);

  // No curated examples — show fallback (auto-generated)
  if (allExamples.length === 0) {
    return (
      <div className="space-y-6">
        {/* Info banner */}
        <div className="flex items-center gap-3 rounded-2xl border border-border-subtle bg-surface-canvas p-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
            <Sparkles className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <Text as="div" className="text-xs font-semibold text-text-primary">
              Auto-Generated Examples
            </Text>
            <Text variant="secondary" className="text-[11px]">
              These examples are automatically generated from the component API.
              Curated examples will be added soon.
            </Text>
          </div>
        </div>
        {fallbackContent}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search + Category filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            placeholder="Orneklerde ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border-subtle bg-surface-default pl-9 pr-3 py-2 text-xs text-text-primary outline-hidden placeholder:text-text-tertiary focus:border-action-primary"
          />
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={[
              "flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition",
              activeCategory === "all"
                ? "bg-action-primary text-white"
                : "bg-surface-muted text-text-secondary hover:text-text-primary",
            ].join(" ")}
          >
            All
            <span className={activeCategory === "all" ? "text-white/70" : "text-text-tertiary"}>
              {allExamples.length}
            </span>
          </button>
          {categories.map((cat) => {
            const meta = EXAMPLE_CATEGORY_META[cat];
            const count = allExamples.filter((e) => e.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={[
                  "flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition",
                  activeCategory === cat
                    ? "bg-action-primary text-white"
                    : "bg-surface-muted text-text-secondary hover:text-text-primary",
                ].join(" ")}
              >
                {meta.label}
                <span className={activeCategory === cat ? "text-white/70" : "text-text-tertiary"}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Gallery header */}
      <div className="flex items-center gap-2">
        <BookOpen className="h-3.5 w-3.5 text-text-tertiary" />
        <Text variant="secondary" className="text-[11px]">
          {filteredExamples.length} example{filteredExamples.length !== 1 ? "s" : ""}
          {search && ` matching "${search}"`}
        </Text>
      </div>

      {/* Example cards */}
      <div className="space-y-4">
        {filteredExamples.map((example) => (
          <ExampleCard
            key={example.id}
            example={example}
            componentName={componentName}
            categoryMeta={EXAMPLE_CATEGORY_META[example.category]}
          />
        ))}
      </div>

      {/* Empty state */}
      {filteredExamples.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border-subtle py-12">
          <Search className="h-6 w-6 text-text-tertiary" />
          <Text variant="secondary" className="mt-2 text-xs">
            No examples match "{search}"
          </Text>
          <button
            type="button"
            onClick={() => { setSearch(""); setActiveCategory("all"); }}
            className="mt-2 text-xs font-medium text-action-primary hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ExamplesGallery;
