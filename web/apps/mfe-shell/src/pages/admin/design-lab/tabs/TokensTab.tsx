import React, { useState, useMemo, useCallback } from "react";
import { Search, Copy, Check, Paintbrush, ChevronDown, ChevronRight, Code2 } from "lucide-react";
import { Text } from "@mfe/design-system";
import {
  getTokensForComponent,
  getTokenCategories,
  generateThemeOverride,
  TOKEN_TIER_META,
  TOKEN_CATEGORY_META,
} from "./componentTokenMap";
import type { TokenEntry, TokenCategory, TokenTier } from "./componentTokenMap";

/* ------------------------------------------------------------------ */
/*  TokensTab — Component-level design token documentation              */
/*                                                                     */
/*  Features:                                                          */
/*  - Token table grouped by category (color, spacing, typography…)    */
/*  - Color swatches for color tokens                                  */
/*  - Tier badges (Global, Alias, Component)                           */
/*  - Search and filter by tier                                        */
/*  - Override generator — copy-pasteable theme override code          */
/*                                                                     */
/*  Surpasses AntD component token docs with live preview + override   */
/* ------------------------------------------------------------------ */

type TokensTabProps = {
  componentName: string;
};

export const TokensTab: React.FC<TokensTabProps> = ({ componentName }) => {
  const [search, setSearch] = useState("");
  const [activeTier, setActiveTier] = useState<TokenTier | "all">("all");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["color", "spacing", "typography", "border", "shadow", "sizing", "motion"]));
  const [showOverrideGen, setShowOverrideGen] = useState(false);
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [copiedOverride, setCopiedOverride] = useState(false);

  const allTokens = useMemo(() => getTokensForComponent(componentName), [componentName]);
  const categories = useMemo(() => getTokenCategories(allTokens), [allTokens]);

  const filteredTokens = useMemo(() => {
    let result = allTokens;
    if (activeTier !== "all") {
      result = result.filter((t) => t.tier === activeTier);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.cssVar.toLowerCase().includes(q) ||
          (t.description ?? "").toLowerCase().includes(q),
      );
    }
    return result;
  }, [allTokens, activeTier, search]);

  const tokensByCategory = useMemo(() => {
    const map = new Map<TokenCategory, TokenEntry[]>();
    for (const token of filteredTokens) {
      const list = map.get(token.category) ?? [];
      list.push(token);
      map.set(token.category, list);
    }
    return map;
  }, [filteredTokens]);

  const toggleCategory = useCallback((cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }, []);

  const handleOverrideChange = useCallback((cssVar: string, value: string) => {
    setOverrides((prev) => ({ ...prev, [cssVar]: value }));
  }, []);

  const handleCopyOverride = useCallback(async () => {
    const code = generateThemeOverride(componentName, overrides);
    try {
      await navigator.clipboard.writeText(code);
      setCopiedOverride(true);
      setTimeout(() => setCopiedOverride(false), 2000);
    } catch { /* noop */ }
  }, [componentName, overrides]);

  if (allTokens.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border-subtle py-16">
        <Paintbrush className="h-8 w-8 text-text-tertiary" />
        <Text as="div" className="mt-3 text-sm font-medium text-text-secondary">
          Token documentation coming soon
        </Text>
        <Text variant="secondary" className="mt-1 text-xs">
          Design token mapping for {componentName} will be added in the next update.
        </Text>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            placeholder="Token ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border-subtle bg-surface-default pl-9 pr-3 py-2 text-xs text-text-primary outline-hidden placeholder:text-text-tertiary focus:border-action-primary"
          />
        </div>
        <div className="flex gap-1">
          {(["all", "global", "alias", "component"] as const).map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setActiveTier(tier)}
              className={[
                "rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition",
                activeTier === tier
                  ? "bg-action-primary text-text-inverse"
                  : "bg-surface-muted text-text-secondary hover:text-text-primary",
              ].join(" ")}
            >
              {tier === "all" ? "All" : TOKEN_TIER_META[tier].label}
              <span className={`ml-1 ${activeTier === tier ? "text-text-inverse/70" : "text-text-tertiary"}`}>
                {tier === "all" ? allTokens.length : allTokens.filter((t) => t.tier === tier).length}
              </span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setShowOverrideGen(!showOverrideGen)}
          className={[
            "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition border",
            showOverrideGen
              ? "border-action-primary text-action-primary bg-action-primary/5"
              : "border-border-subtle text-text-secondary hover:text-text-primary",
          ].join(" ")}
        >
          <Code2 className="h-3 w-3" />
          Override Ureticisi
        </button>
      </div>

      {/* Summary */}
      <Text variant="secondary" className="text-[11px]">
        {filteredTokens.length} token{filteredTokens.length !== 1 ? "s" : ""} across {tokensByCategory.size} categor{tokensByCategory.size !== 1 ? "ies" : "y"}
      </Text>

      {/* Token categories */}
      <div className="flex flex-col gap-3">
        {categories.map((cat) => {
          const tokens = tokensByCategory.get(cat);
          if (!tokens || tokens.length === 0) return null;
          const meta = TOKEN_CATEGORY_META[cat];
          const isExpanded = expandedCategories.has(cat);

          return (
            <div key={cat} className="overflow-hidden rounded-2xl border border-border-subtle">
              {/* Category header */}
              <button
                type="button"
                onClick={() => toggleCategory(cat)}
                className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-surface-muted/50 transition"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{meta.icon}</span>
                  <Text as="span" className="text-sm font-semibold text-text-primary">{meta.label}</Text>
                  <span className="rounded-md bg-surface-muted px-1.5 py-0.5 text-[10px] font-medium text-text-tertiary">
                    {tokens.length}
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="h-3.5 w-3.5 text-text-tertiary" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 text-text-tertiary" />
                )}
              </button>

              {/* Token rows */}
              {isExpanded && (
                <div className="border-t border-border-subtle">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border-subtle bg-surface-canvas text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
                        <th className="px-4 py-2 text-left">Token</th>
                        <th className="px-4 py-2 text-left">CSS Variable</th>
                        <th className="px-4 py-2 text-left">Value</th>
                        <th className="px-4 py-2 text-left">Tier</th>
                        {showOverrideGen && <th className="px-4 py-2 text-left">Override</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {tokens.map((token) => (
                        <tr key={token.name} className="border-b border-border-subtle last:border-0 hover:bg-surface-muted/30 transition">
                          <td className="px-4 py-2.5">
                            <div>
                              <Text as="div" className="text-xs font-medium text-text-primary font-mono">
                                {token.name}
                              </Text>
                              {token.description && (
                                <Text variant="secondary" className="text-[10px]">
                                  {token.description}
                                </Text>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-2.5">
                            <code className="rounded-xs bg-surface-muted px-1.5 py-0.5 text-[11px] font-mono text-state-danger-text">
                              {token.cssVar}
                            </code>
                          </td>
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-2">
                              {cat === "color" && (
                                <div
                                  className="h-5 w-5 rounded-xs border border-border-subtle shrink-0"
                                  style={{ backgroundColor: overrides[token.cssVar] || token.resolvedValue }}
                                />
                              )}
                              <code className="text-[11px] font-mono text-text-secondary">
                                {overrides[token.cssVar] || token.resolvedValue}
                              </code>
                            </div>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className={`inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${TOKEN_TIER_META[token.tier].color}`}>
                              {TOKEN_TIER_META[token.tier].label}
                            </span>
                          </td>
                          {showOverrideGen && (
                            <td className="px-4 py-2.5">
                              <input
                                type={cat === "color" ? "color" : "text"}
                                value={overrides[token.cssVar] || (cat === "color" ? token.resolvedValue : "")}
                                onChange={(e) => handleOverrideChange(token.cssVar, e.target.value)}
                                placeholder={token.resolvedValue}
                                className={
                                  cat === "color"
                                    ? "h-7 w-10 cursor-pointer rounded-xs border border-border-subtle"
                                    : "w-24 rounded-lg border border-border-subtle bg-surface-default px-2 py-1 text-[11px] font-mono outline-hidden focus:border-action-primary"
                                }
                              />
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Override Generator Output */}
      {showOverrideGen && Object.keys(overrides).length > 0 && (
        <div className="rounded-2xl border border-action-primary/30 bg-action-primary/5 p-4">
          <div className="flex items-center justify-between mb-2">
            <Text as="div" className="text-xs font-semibold text-text-primary">
              Generated Theme Override
            </Text>
            <button
              type="button"
              onClick={handleCopyOverride}
              className="flex items-center gap-1 rounded-lg border border-border-subtle px-2 py-1 text-[11px] font-medium text-text-secondary hover:text-text-primary transition"
            >
              {copiedOverride ? <Check className="h-3 w-3 text-state-success-text" /> : <Copy className="h-3 w-3" />}
              {copiedOverride ? "Copied" : "Copy"}
            </button>
          </div>
          <pre className="overflow-x-auto rounded-xl bg-surface-inverse p-4 text-xs leading-relaxed text-border-subtle font-mono">
            {generateThemeOverride(componentName, overrides)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TokensTab;
