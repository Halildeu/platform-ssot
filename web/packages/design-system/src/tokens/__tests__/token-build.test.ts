// @vitest-environment node
import { describe, it, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";

const TOKENS_DIR = path.resolve(__dirname, "..");

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** All .ts source files in src/tokens/ (excluding tests, index, and build/) */
function getTokenSourceFiles(): string[] {
  return fs
    .readdirSync(TOKENS_DIR)
    .filter(
      (f) =>
        f.endsWith(".ts") &&
        f !== "index.ts" &&
        !f.endsWith(".d.ts") &&
        !f.endsWith(".test.ts") &&
        !f.endsWith(".spec.ts"),
    );
}

/**
 * Convert a camelCase or PascalCase key to kebab-case.
 * Mirrors the toKebab() in build-tokens.mjs.
 */
function toKebab(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

/* ------------------------------------------------------------------ */
/*  Required token families — every build must include these           */
/* ------------------------------------------------------------------ */
const REQUIRED_FAMILIES = [
  "palette",
  "semanticColorTokens",
  "spacing",
  "radius",
  "fontFamily",
  "fontSize",
  "fontWeight",
  "lineHeight",
  "letterSpacing",
  "duration",
  "easing",
  "zIndex",
  "elevation",
  "opacity",
  "density",
  "focusRing",
] as const;

/* ------------------------------------------------------------------ */
/*  Tests                                                              */
/* ------------------------------------------------------------------ */

describe("Token build consistency", () => {
  // Load all token exports dynamically
  let barrel: Record<string, unknown>;

  const getBarrel = async (): Promise<Record<string, unknown>> => {
    if (!barrel) {
      barrel = await import("../index");
    }
    return barrel;
  };

  /* ---- 1. No duplicate CSS variable keys across all token families ---- */
  it("has no duplicate CSS variable names across all token families", async () => {
    const mod = await getBarrel();
    const allCssVars = new Set<string>();
    const duplicates: string[] = [];

    function collectKeys(obj: Record<string, unknown>, prefix: string) {
      for (const [key, val] of Object.entries(obj)) {
        const varName = `--${prefix}-${toKebab(String(key))}`;
        if (typeof val === "object" && val !== null && !Array.isArray(val)) {
          collectKeys(val as Record<string, unknown>, `${prefix}-${toKebab(String(key))}`);
        } else {
          if (allCssVars.has(varName)) {
            duplicates.push(varName);
          }
          allCssVars.add(varName);
        }
      }
    }

    for (const exportKey of Object.keys(mod)) {
      const value = mod[exportKey];
      if (typeof value === "object" && value !== null) {
        collectKeys(value as Record<string, unknown>, toKebab(exportKey));
      }
    }

    expect(duplicates).toEqual([]);
  });

  /* ---- 2. All required token families are present ---- */
  it("exports all required token families", async () => {
    const mod = await getBarrel();
    const exportedKeys = Object.keys(mod);

    for (const family of REQUIRED_FAMILIES) {
      expect(exportedKeys).toContain(family);
    }
  });

  /* ---- 3. Token key naming convention — top-level keys are valid JS identifiers ---- */
  it("all top-level token keys are valid identifiers or numeric strings", async () => {
    const mod = await getBarrel();

    for (const exportKey of Object.keys(mod)) {
      const value = mod[exportKey];
      if (typeof value !== "object" || value === null) continue;

      for (const key of Object.keys(value as Record<string, unknown>)) {
        // Keys must be valid JS identifiers or numeric (for spacing: 0, 0.5, etc.)
        const isValidIdentifier = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key);
        const isNumeric = /^[0-9]+(\.[0-9]+)?$/.test(key);
        const isQuotedKebab = /^[a-z0-9]+(-[a-z0-9]+)*$/.test(key);

        expect(
          isValidIdentifier || isNumeric || isQuotedKebab,
        ).toBe(true);
      }
    }
  });

  /* ---- 4. CSS variable names are kebab-case ---- */
  it("generated CSS variable names follow kebab-case convention", async () => {
    const mod = await getBarrel();

    function checkKebab(obj: Record<string, unknown>, prefix: string) {
      for (const [key, val] of Object.entries(obj)) {
        const varName = `--${prefix}-${toKebab(String(key))}`;
        // Must match: --lowercase-kebab-123 pattern (dots allowed for spacing keys like 0.5)
        expect(varName).toMatch(/^--[a-z0-9.]+(-[a-z0-9.]+)*$/);

        if (typeof val === "object" && val !== null && !Array.isArray(val)) {
          checkKebab(val as Record<string, unknown>, `${prefix}-${toKebab(String(key))}`);
        }
      }
    }

    for (const exportKey of Object.keys(mod)) {
      const value = mod[exportKey];
      if (typeof value === "object" && value !== null) {
        checkKebab(value as Record<string, unknown>, toKebab(exportKey));
      }
    }
  });

  /* ---- 5. Spacing tokens follow 4px grid ---- */
  it("spacing tokens follow the 4px grid system", async () => {
    const mod = await getBarrel();
    const { spacing } = mod as { spacing: Record<string, string> };

    for (const [key, value] of Object.entries(spacing)) {
      const numKey = Number(key);
      const pxMatch = String(value).match(/^(\d+)px$/);
      expect(pxMatch).not.toBeNull();

      if (pxMatch) {
        const pxValue = Number(pxMatch[1]);
        // Each spacing step = key * 4px (with exception for 0)
        if (numKey === 0) {
          expect(pxValue).toBe(0);
        } else {
          expect(pxValue).toBe(numKey * 4);
        }
      }
    }
  });

  /* ---- 6. Color palette values are valid hex ---- */
  it("palette color values are valid hex colors", async () => {
    const mod = await getBarrel();
    const { palette } = mod as { palette: Record<string, string> };

    for (const [, value] of Object.entries(palette)) {
      expect(value).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  /* ---- 7. Z-index tokens are in ascending order ---- */
  it("z-index tokens are in ascending order", async () => {
    const mod = await getBarrel();
    const { zIndex } = mod as { zIndex: Record<string, number> };

    const values = Object.values(zIndex);
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThanOrEqual(values[i - 1]);
    }
  });

  /* ---- 8. Font weight values are standard CSS numeric weights ---- */
  it("font weight values are standard CSS numeric weights", async () => {
    const mod = await getBarrel();
    const { fontWeight } = mod as { fontWeight: Record<string, number> };

    const validWeights = [100, 200, 300, 400, 500, 600, 700, 800, 900];
    for (const [, value] of Object.entries(fontWeight)) {
      expect(validWeights).toContain(value);
    }
  });

  /* ---- 9. Opacity values are between 0 and 1 ---- */
  it("opacity values are between 0 and 1 (inclusive)", async () => {
    const mod = await getBarrel();
    const { opacity } = mod as { opacity: Record<string, number> };

    for (const [, value] of Object.entries(opacity)) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(1);
    }
  });

  /* ---- 10. Density modes cover all three levels ---- */
  it("density tokens include compact, comfortable, and spacious modes", async () => {
    const mod = await getBarrel();
    const { density } = mod as { density: Record<string, unknown> };

    expect(Object.keys(density)).toContain("compact");
    expect(Object.keys(density)).toContain("comfortable");
    expect(Object.keys(density)).toContain("spacious");
  });

  /* ---- 11. Elevation tokens include the required levels ---- */
  it("elevation tokens include none through xl and inner", async () => {
    const mod = await getBarrel();
    const { elevation } = mod as { elevation: Record<string, string> };

    const requiredKeys = ["none", "xs", "sm", "md", "lg", "xl", "inner"];
    for (const key of requiredKeys) {
      expect(Object.keys(elevation)).toContain(key);
    }
  });

  /* ---- 12. Semantic color tokens all start with -- prefix ---- */
  it("semantic color token values are CSS variable references (-- prefix)", async () => {
    const mod = await getBarrel();
    const { semanticColorTokens } = mod as {
      semanticColorTokens: Record<string, string>;
    };

    for (const [, value] of Object.entries(semanticColorTokens)) {
      expect(value).toMatch(/^--[a-z-]+$/);
    }
  });

  /* ---- 13. Token source files have no circular imports ---- */
  it("token source files do not import from each other (no circular deps)", () => {
    const tokenFiles = getTokenSourceFiles();

    for (const file of tokenFiles) {
      const content = fs.readFileSync(path.join(TOKENS_DIR, file), "utf-8");
      const otherTokenFiles = tokenFiles.filter((f) => f !== file);

      for (const other of otherTokenFiles) {
        const baseName = other.replace(/\.ts$/, "");
        // Should not import from sibling token files (except semantic.ts is an interface-only file)
        if (file !== "semantic.ts" && other !== "semantic.ts") {
          expect(content).not.toMatch(
            new RegExp(`from\\s+['"]\\.\\/\\s*${baseName}['"]`),
          );
        }
      }
    }
  });
});
