import { describe, test, expect } from "vitest";

/**
 * State Preview Contract Tests
 *
 * Ensures that:
 * 1. Every previewStates entry in doc files has a corresponding STATE_PROP_MAP mapping
 * 2. previewStates and behaviorModel don't overlap
 * 3. stateModel is properly split (no preview-mappable items left only in behaviorModel)
 * 4. All components with previewStates have valid, non-empty state definitions
 */

import * as fs from "fs";
import * as path from "path";

/**
 * STATE_PROP_MAP keys — parsed directly from the shared source of truth file.
 * This ensures the contract test and runtime ComponentDetail always stay in sync.
 */
const STATE_PROP_MAP_SOURCE = path.resolve(
  "/Users/halilkocoglu/Documents/dev/web/apps/mfe-shell/src/pages/admin/design-lab/shared/statePropMap.ts",
);

function loadStatePropMapKeys(): Set<string> {
  if (!fs.existsSync(STATE_PROP_MAP_SOURCE)) {
    throw new Error("statePropMap.ts not found — contract test cannot validate without it");
  }
  const content = fs.readFileSync(STATE_PROP_MAP_SOURCE, "utf8");
  // Extract all keys from the STATE_PROP_MAP object literal
  // Matches both quoted and unquoted keys
  const keys: string[] = [];
  const quotedKeyRegex = /"([^"]+)":\s*\{/g;
  const unquotedKeyRegex = /^\s+(\w+):\s*\{/gm;
  let match: RegExpExecArray | null;
  while ((match = quotedKeyRegex.exec(content)) !== null) {
    keys.push(match[1]);
  }
  while ((match = unquotedKeyRegex.exec(content)) !== null) {
    // Avoid matching "export const STATE_PROP_MAP: Record<..." line
    if (match[1] !== "export" && match[1] !== "const" && match[1] !== "Record") {
      keys.push(match[1]);
    }
  }
  return new Set(keys);
}

const STATE_PROP_MAP_KEYS = loadStatePropMapKeys();

/* ---- Load all doc entries from the canonical dev repo ---- */
const ENTRIES_DIR = path.resolve(
  "/Users/halilkocoglu/Documents/dev/web/packages/design-system/src/catalog/component-docs/entries",
);

type DocEntry = {
  file: string;
  name: string;
  stateModel: string[];
  previewStates: string[];
  behaviorModel: string[];
};

function loadDocEntries(): DocEntry[] {
  if (!fs.existsSync(ENTRIES_DIR)) return [];

  const files = fs.readdirSync(ENTRIES_DIR).filter((f) => f.endsWith(".doc.ts"));
  const entries: DocEntry[] = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(ENTRIES_DIR, file), "utf8");

    const smMatch = content.match(/"stateModel":\s*\[([\s\S]*?)\]/);
    const psMatch = content.match(/"previewStates":\s*\[([\s\S]*?)\]/);
    const bmMatch = content.match(/"behaviorModel":\s*\[([\s\S]*?)\]/);

    const extractStrings = (match: RegExpMatchArray | null): string[] =>
      match?.[1]?.match(/"([^"]+)"/g)?.map((s) => s.replace(/"/g, "")) ?? [];

    entries.push({
      file,
      name: file.replace(".doc.ts", ""),
      stateModel: extractStrings(smMatch),
      previewStates: extractStrings(psMatch),
      behaviorModel: extractStrings(bmMatch),
    });
  }

  return entries;
}

const allEntries = loadDocEntries();
const entriesWithPreviewStates = allEntries.filter((e) => e.previewStates.length > 0);

/* ---- Tests ---- */

describe("State Preview Contract", () => {
  test("STATE_PROP_MAP source parsed successfully with minimum expected keys", () => {
    // Guard against broken regex parse — expect at least 30 keys
    expect(STATE_PROP_MAP_KEYS.size).toBeGreaterThanOrEqual(30);
  });

  test("doc entries directory exists and has files", () => {
    expect(allEntries.length).toBeGreaterThan(0);
  });

  test("all doc entries have previewStates field (metadata split complete)", () => {
    const withoutSplit = allEntries.filter(
      (e) => e.stateModel.length > 0 && e.previewStates.length === 0 && e.behaviorModel.length === 0,
    );
    // These entries still have stateModel but no split — should be zero after migration
    expect(withoutSplit.length).toBe(0);
  });

  test("every previewStates entry maps to STATE_PROP_MAP", () => {
    const unmapped: { name: string; state: string }[] = [];

    for (const entry of entriesWithPreviewStates) {
      for (const state of entry.previewStates) {
        if (!STATE_PROP_MAP_KEYS.has(state)) {
          unmapped.push({ name: entry.name, state });
        }
      }
    }

    if (unmapped.length > 0) {
      console.warn("Unmapped previewStates:", unmapped);
    }
    expect(unmapped).toEqual([]);
  });

  test("previewStates and behaviorModel don't overlap", () => {
    const overlaps: { name: string; overlap: string[] }[] = [];

    for (const entry of allEntries) {
      const psSet = new Set(entry.previewStates);
      const overlap = entry.behaviorModel.filter((b) => psSet.has(b));
      if (overlap.length > 0) {
        overlaps.push({ name: entry.name, overlap });
      }
    }

    expect(overlaps).toEqual([]);
  });

  test("no preview-mappable items stuck only in behaviorModel", () => {
    const misplaced: { name: string; states: string[] }[] = [];

    for (const entry of allEntries) {
      const previewable = entry.behaviorModel.filter((b) => STATE_PROP_MAP_KEYS.has(b));
      if (previewable.length > 0) {
        misplaced.push({ name: entry.name, states: previewable });
      }
    }

    if (misplaced.length > 0) {
      console.warn("Preview-mappable items in behaviorModel:", misplaced);
    }
    expect(misplaced).toEqual([]);
  });

  test("previewStates has no duplicates within a single entry", () => {
    const dupes: { name: string; duplicates: string[] }[] = [];

    for (const entry of entriesWithPreviewStates) {
      const seen = new Set<string>();
      const dups: string[] = [];
      for (const s of entry.previewStates) {
        if (seen.has(s)) dups.push(s);
        seen.add(s);
      }
      if (dups.length > 0) {
        dupes.push({ name: entry.name, duplicates: dups });
      }
    }

    expect(dupes).toEqual([]);
  });

  test("at least 50 components have non-empty previewStates", () => {
    expect(entriesWithPreviewStates.length).toBeGreaterThanOrEqual(50);
  });

  test("interactive primitives have disabled in previewStates", () => {
    const interactivePrimitives = [
      "Button", "Checkbox", "Switch", "Radio", "TextInput",
      "TextArea", "Select", "Slider", "Upload",
    ];

    const missing: string[] = [];
    for (const name of interactivePrimitives) {
      const entry = allEntries.find((e) => e.name === name);
      if (entry && !entry.previewStates.includes("disabled")) {
        missing.push(name);
      }
    }

    expect(missing).toEqual([]);
  });
});
