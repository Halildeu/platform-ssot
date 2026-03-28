import type { TokenEntry, TokenTier, TokenCategory } from "./types";
export type { TokenEntry, TokenTier, TokenCategory } from "./types";
export { TOKEN_TIER_META, TOKEN_CATEGORY_META } from "./types";
import { tokenMap1 } from "./tokens-1";
import { tokenMap2 } from "./tokens-2";
import { tokenMap3 } from "./tokens-3";
import { tokenMap4 } from "./tokens-4";

const _tokenMap: Record<string, TokenEntry[]> = {
  ...tokenMap1,
  ...tokenMap2,
  ...tokenMap3,
  ...tokenMap4,
};

/* ---- Public API ---- */

export function getTokensForComponent(componentName: string): TokenEntry[] {
  return _tokenMap[componentName] ?? [];
}

export function hasTokens(componentName: string): boolean {
  return componentName in _tokenMap && _tokenMap[componentName].length > 0;
}

export function getTokenCategories(tokens: TokenEntry[]): TokenCategory[] {
  const cats = new Set(tokens.map((t) => t.category));
  const order: TokenCategory[] = ["color", "spacing", "typography", "border", "shadow", "sizing", "motion"];
  return order.filter((c) => cats.has(c));
}

export function generateThemeOverride(componentName: string, overrides: Record<string, string>): string {
  const entries = Object.entries(overrides)
    .map(([varName, value]) => `  "${varName}": "${value}"`)
    .join(",\n");

  return `// Theme override for ${componentName}
const ${componentName.toLowerCase()}Overrides = {
${entries}
};

// Apply in theme config:
// <ThemeProvider overrides={{ ${componentName.toLowerCase()}: ${componentName.toLowerCase()}Overrides }}>`;
}
