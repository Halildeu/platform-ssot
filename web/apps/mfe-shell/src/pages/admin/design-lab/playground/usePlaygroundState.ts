import { useState, useMemo, useCallback } from "react";
import type { DesignLabApiItem } from "../DesignLabProvider";

/* ------------------------------------------------------------------ */
/*  usePlaygroundState — manages interactive prop state                */
/*                                                                     */
/*  Parses variantAxes and props from doc entries to build:            */
/*  - controls: typed UI control descriptors                           */
/*  - propValues: current prop state record                            */
/*  - setProp / resetAll: state mutators                               */
/*  - generatedCode: JSX string from current state                     */
/* ------------------------------------------------------------------ */

export type PlaygroundControlKind = "select" | "boolean" | "text" | "number";

export type PlaygroundControl = {
  name: string;
  kind: PlaygroundControlKind;
  options?: string[]; // for "select" kind
  defaultValue: string | boolean | number;
  description: string;
  group: "variant" | "state" | "prop";
};

export type PlaygroundState = {
  controls: PlaygroundControl[];
  propValues: Record<string, string | boolean | number>;
  setProp: (name: string, value: string | boolean | number) => void;
  resetAll: () => void;
  generatedCode: string;
};

/* ---- Parsing helpers ---- */

/**
 * Parses "variant: primary | secondary | ghost | destructive"
 * into { name: "variant", values: ["primary", "secondary", "ghost", "destructive"] }
 */
function parseVariantAxis(raw: string): {
  name: string;
  values: string[];
} | null {
  const colonIdx = raw.indexOf(":");
  if (colonIdx === -1) return null;

  const name = raw.slice(0, colonIdx).trim();
  const valuesRaw = raw.slice(colonIdx + 1).trim();
  const values = valuesRaw
    .split("|")
    .map((v) => v.trim())
    .filter(Boolean);

  return values.length > 0 ? { name, values } : null;
}

/**
 * Infers control kind from prop type string
 */
function inferControlKind(
  propType: string,
): { kind: PlaygroundControlKind; options?: string[] } {
  // Boolean
  if (propType === "boolean" || propType === "bool") {
    return { kind: "boolean" };
  }

  // Number
  if (propType === "number") {
    return { kind: "number" };
  }

  // Union type like "'primary' | 'secondary' | 'ghost'"
  const unionMatch = propType.match(/^'([^']+)'(\s*\|\s*'[^']+')+$/);
  if (unionMatch) {
    const options = propType
      .split("|")
      .map((s) => s.trim().replace(/^'|'$/g, ""))
      .filter(Boolean);
    return { kind: "select", options };
  }

  // ReactNode / function / complex types → skip or text
  if (
    propType.includes("ReactNode") ||
    propType.includes("=>") ||
    propType.includes("(")
  ) {
    return { kind: "text" };
  }

  return { kind: "text" };
}

/**
 * Resolves a default value for a control from the prop's default string
 */
function resolveDefaultValue(
  kind: PlaygroundControlKind,
  defaultStr: string,
  options?: string[],
): string | boolean | number {
  const cleaned = defaultStr.replace(/^['"]|['"]$/g, "").trim();

  switch (kind) {
    case "boolean":
      return cleaned === "true";
    case "number":
      return Number(cleaned) || 0;
    case "select":
      return options?.includes(cleaned) ? cleaned : (options?.[0] ?? cleaned);
    default:
      return cleaned === "-" ? "" : cleaned;
  }
}

/* ---- State model to boolean controls ---- */

const STATE_MODEL_BOOLEANS: Record<string, { defaultValue: boolean; description: string }> = {
  full: { defaultValue: false, description: "Full interaction mode" },
  readonly: { defaultValue: false, description: "Read-only mode" },
  disabled: { defaultValue: false, description: "Disabled state" },
  loading: { defaultValue: false, description: "Loading state" },
  fullWidth: { defaultValue: false, description: "Full-width layout" },
};

/* ---- Build controls from API item ---- */

function buildControls(apiItem: DesignLabApiItem | null | undefined): {
  controls: PlaygroundControl[];
  defaults: Record<string, string | boolean | number>;
} {
  if (!apiItem) return { controls: [], defaults: {} };

  const controls: PlaygroundControl[] = [];
  const defaults: Record<string, string | boolean | number> = {};

  // 1. Variant axes → select controls
  for (const axisRaw of apiItem.variantAxes) {
    const parsed = parseVariantAxis(axisRaw);
    if (parsed) {
      const defaultValue = parsed.values[0];
      controls.push({
        name: parsed.name,
        kind: "select",
        options: parsed.values,
        defaultValue,
        description: `${parsed.name} axis`,
        group: "variant",
      });
      defaults[parsed.name] = defaultValue;
    }
  }

  // 2. State model → boolean toggles (only simple states)
  for (const stateEntry of apiItem.stateModel) {
    const stateKey = stateEntry.toLowerCase().trim();
    const knownState = STATE_MODEL_BOOLEANS[stateKey];
    if (knownState && !defaults[stateKey]) {
      controls.push({
        name: stateKey,
        kind: "boolean",
        defaultValue: knownState.defaultValue,
        description: knownState.description,
        group: "state",
      });
      defaults[stateKey] = knownState.defaultValue;
    }
  }

  // 3. Props that aren't already covered by variant axes
  for (const prop of apiItem.props) {
    // Skip compound props (e.g. "title / description / children")
    if (prop.name.includes("/")) continue;

    // Skip if already handled by variant axes
    if (defaults[prop.name] !== undefined) continue;

    // Skip ReactNode and function props
    if (
      prop.type.includes("ReactNode") ||
      prop.type.includes("=>") ||
      prop.type.includes("(")
    ) continue;

    const { kind, options } = inferControlKind(prop.type);
    const defaultValue = resolveDefaultValue(kind, prop.default, options);

    controls.push({
      name: prop.name,
      kind,
      options,
      defaultValue,
      description: prop.description,
      group: "prop",
    });
    defaults[prop.name] = defaultValue;
  }

  return { controls, defaults };
}

/* ---- Code generator ---- */

function generateCode(
  componentName: string,
  propValues: Record<string, string | boolean | number>,
  defaults: Record<string, string | boolean | number>,
): string {
  const entries = Object.entries(propValues).filter(([key, value]) => {
    // Skip unchanged defaults
    return value !== defaults[key];
  });

  const propsString = entries
    .map(([key, value]) => {
      if (typeof value === "boolean") {
        return value ? key : `${key}={false}`;
      }
      if (typeof value === "number") {
        return `${key}={${value}}`;
      }
      return `${key}="${value}"`;
    })
    .join(" ");

  const propsWithSpace = propsString ? ` ${propsString}` : "";
  return `<${componentName}${propsWithSpace}>\n  Content\n</${componentName}>`;
}

/* ---- Hook ---- */

export function usePlaygroundState(
  componentName: string,
  apiItem: DesignLabApiItem | null | undefined,
): PlaygroundState {
  const { controls, defaults } = useMemo(
    () => buildControls(apiItem),
    [apiItem],
  );

  const [propValues, setPropValues] = useState<
    Record<string, string | boolean | number>
  >(() => ({ ...defaults }));

  const setProp = useCallback(
    (name: string, value: string | boolean | number) => {
      setPropValues((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  const resetAll = useCallback(() => {
    setPropValues({ ...defaults });
  }, [defaults]);

  const generatedCode = useMemo(
    () => generateCode(componentName, propValues, defaults),
    [componentName, propValues, defaults],
  );

  return { controls, propValues, setProp, resetAll, generatedCode };
}
