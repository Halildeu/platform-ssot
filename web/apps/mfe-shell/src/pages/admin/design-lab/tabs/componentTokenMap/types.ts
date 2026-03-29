/* ------------------------------------------------------------------ */
/*  Component Token Map — Maps components to design tokens they use     */
/*                                                                     */
/*  Each entry: token name, CSS variable, resolved value, tier,        */
/*  and category for grouping.                                         */
/*                                                                     */
/*  Surpasses AntD component tokens with: tier info, live preview,     */
/*  override code generation                                           */
/* ------------------------------------------------------------------ */

export type TokenTier = "global" | "alias" | "component";

export type TokenCategory = "color" | "spacing" | "typography" | "border" | "shadow" | "sizing" | "motion";

export type TokenEntry = {
  name: string;
  cssVar: string;
  resolvedValue: string;
  tier: TokenTier;
  category: TokenCategory;
  description?: string;
};

export const TOKEN_TIER_META: Record<TokenTier, { label: string; color: string }> = {
  global: { label: "Global", color: "bg-state-info-bg text-state-info-text" },
  alias: { label: "Alias", color: "bg-action-primary/10 text-action-primary" },
  component: { label: "Component", color: "bg-state-warning-bg text-state-warning-text" },
};

export const TOKEN_CATEGORY_META: Record<TokenCategory, { label: string; icon: string }> = {
  color: { label: "Color", icon: "🎨" },
  spacing: { label: "Spacing", icon: "📏" },
  typography: { label: "Typography", icon: "🔤" },
  border: { label: "Border", icon: "🔲" },
  shadow: { label: "Shadow", icon: "🌗" },
  sizing: { label: "Sizing", icon: "📐" },
  motion: { label: "Motion", icon: "✨" },
};
