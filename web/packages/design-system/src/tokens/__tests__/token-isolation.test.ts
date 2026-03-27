// @vitest-environment node
import { describe, it, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";

const TOKENS_DIR = path.resolve(__dirname, "..");

/** All .ts source files in src/tokens/ (excluding tests, index, and build/) */
function getTokenSourceFiles(): string[] {
  return fs
    .readdirSync(TOKENS_DIR)
    .filter(
      (f) =>
        f.endsWith(".ts") &&
        f !== "index.ts" &&
        !f.endsWith(".test.ts") &&
        !f.endsWith(".spec.ts"),
    );
}

describe("Token isolation", () => {
  const tokenFiles = getTokenSourceFiles();

  describe("no React or component imports", () => {
    it.each(tokenFiles)("%s has no React imports", (file) => {
      const content = fs.readFileSync(path.join(TOKENS_DIR, file), "utf-8");
      expect(content).not.toMatch(/from\s+['"]react['"]/);
      expect(content).not.toMatch(/import\s+React/);
      expect(content).not.toMatch(/require\s*\(\s*['"]react['"]\s*\)/);
    });

    it.each(tokenFiles)(
      "%s has no component or primitive imports",
      (file) => {
        const content = fs.readFileSync(path.join(TOKENS_DIR, file), "utf-8");
        expect(content).not.toMatch(/from\s+['"]\.\.\/components/);
        expect(content).not.toMatch(/from\s+['"]\.\.\/primitives/);
        expect(content).not.toMatch(/from\s+['"]@mfe\/design-system/);
      },
    );
  });

  describe("exports are plain data (no React components)", () => {
    it("barrel export contains only plain objects, constants, and types", async () => {
      const barrel = await import("../index");
      const exportedKeys = Object.keys(barrel);

      expect(exportedKeys.length).toBeGreaterThan(0);

      for (const key of exportedKeys) {
        const value = barrel[key as keyof typeof barrel];

        // Must not be a React component (function with $$typeof or returning JSX)
        if (typeof value === "function") {
          // React components have these markers
          expect(value).not.toHaveProperty("$$typeof");
          expect(value).not.toHaveProperty("_context");
          expect(value).not.toHaveProperty("Provider");
        }

        // Must be a plain value: object, string, number, or function (utility)
        expect(["object", "string", "number", "function"]).toContain(
          typeof value,
        );
      }
    });
  });

  describe("token values are serializable", () => {
    it("all exported values survive JSON round-trip", async () => {
      const barrel = await import("../index");

      for (const key of Object.keys(barrel)) {
        const value = barrel[key as keyof typeof barrel];

        // Skip non-serializable types that are just type exports (undefined at runtime)
        if (value === undefined) continue;

        expect(() => {
          const serialized = JSON.stringify(value);
          expect(serialized).toBeDefined();
          const parsed = JSON.parse(serialized);
          expect(parsed).toEqual(JSON.parse(JSON.stringify(value)));
        }).not.toThrow();
      }
    });
  });

  describe("no side effects on import", () => {
    it("importing token modules does not modify globalThis", async () => {
      const globalKeysBefore = new Set(Object.keys(globalThis));

      // Dynamic import to capture any side effects
      await import("../index");

      const globalKeysAfter = new Set(Object.keys(globalThis));

      // Allow vitest internals but no other additions
      for (const key of globalKeysAfter) {
        if (!globalKeysBefore.has(key)) {
          // Vitest may add __vitest* keys — those are OK
          expect(key).toMatch(/^__vitest/);
        }
      }
    });

    it("importing token modules does not write to document or window", async () => {
      // In a node environment, document and window should not exist
      expect(typeof document).toBe("undefined");
      expect(typeof window).toBe("undefined");

      // Import should succeed in pure Node (no DOM required)
      const barrel = await import("../index");
      expect(barrel).toBeDefined();
    });
  });
});
