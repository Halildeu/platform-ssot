/**
 * Codegen Sandbox — generates and validates component usage code
 *
 * Given a component name + desired props:
 * 1. Generates import statement
 * 2. Generates JSX usage
 * 3. Validates props against doc entry
 * 4. Checks for required props
 * 5. Warns about deprecated props
 *
 * No compilation needed — pure static analysis against doc entries
 */

import { useCallback } from "react";
import { useDesignLab } from "../DesignLabProvider";
import type { DesignLabApiProp } from "../DesignLabProvider";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export interface CodegenResult {
  importStatement: string;
  jsxCode: string;
  fullExample: string;
  warnings: string[];
  isValid: boolean;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function formatPropValue(value: unknown): string {
  if (typeof value === "string") return `"${value}"`;
  if (typeof value === "boolean") return `{${value}}`;
  if (typeof value === "number") return `{${value}}`;
  if (value === null || value === undefined) return `{undefined}`;
  return `{${JSON.stringify(value)}}`;
}

function generateJsx(
  componentName: string,
  props: Record<string, unknown>,
  hasChildren: boolean,
): string {
  const propEntries = Object.entries(props);

  if (propEntries.length === 0 && !hasChildren) {
    return `<${componentName} />`;
  }

  const propStrings = propEntries.map(([key, val]) => {
    if (typeof val === "boolean" && val === true) return key;
    return `${key}=${formatPropValue(val)}`;
  });

  const propsStr = propStrings.length > 0 ? ` ${propStrings.join(" ")}` : "";

  if (!hasChildren) {
    return `<${componentName}${propsStr} />`;
  }

  return `<${componentName}${propsStr}>\n  {/* children */}\n</${componentName}>`;
}

function validateProps(
  providedProps: Record<string, unknown>,
  apiProps: DesignLabApiProp[],
): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const knownPropNames = new Set(apiProps.map((p) => p.name));

  // Check for unknown props
  for (const key of Object.keys(providedProps)) {
    if (!knownPropNames.has(key) && key !== "children" && key !== "className") {
      warnings.push(`Bilinmeyen prop: "${key}" — API taniminda bulunmuyor`);
    }
  }

  // Check required props
  for (const prop of apiProps) {
    if (
      prop.required &&
      !(prop.name in providedProps) &&
      prop.default === "" // no default value
    ) {
      errors.push(`Zorunlu prop eksik: "${prop.name}" (${prop.type})`);
    }
  }

  // Check deprecated props (by naming convention)
  for (const prop of apiProps) {
    if (
      prop.description?.toLowerCase().includes("deprecated") &&
      prop.name in providedProps
    ) {
      warnings.push(
        `Deprecated prop kullaniliyor: "${prop.name}" — ${prop.description}`,
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

function validateCodeString(
  code: string,
  items: Map<string, { name: string }>,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check for basic JSX structure
  const tagMatch = code.match(/<(\w+)/);
  if (!tagMatch) {
    errors.push("Gecerli JSX yapisi bulunamadi");
    return { valid: false, errors };
  }

  const componentName = tagMatch[1];

  // Check if component exists in catalog
  if (
    componentName &&
    componentName[0] === componentName[0].toUpperCase() &&
    !items.has(componentName)
  ) {
    errors.push(
      `"${componentName}" katologda bulunamadi — import statement'i kontrol edin`,
    );
  }

  return { valid: errors.length === 0, errors };
}

/* ------------------------------------------------------------------ */
/*  Hook                                                                */
/* ------------------------------------------------------------------ */

export function useCodegenSandbox(): {
  generate: (
    componentName: string,
    props?: Record<string, unknown>,
  ) => CodegenResult;
  validate: (code: string) => { valid: boolean; errors: string[] };
} {
  const { indexItemMap, apiItemMap } = useDesignLab();

  const generate = useCallback(
    (
      componentName: string,
      props: Record<string, unknown> = {},
    ): CodegenResult => {
      const warnings: string[] = [];

      // Find index item for import statement
      const indexItem = indexItemMap.get(componentName);
      const apiItem = apiItemMap.get(componentName);

      const importStatement = indexItem?.importStatement
        ? indexItem.importStatement
        : `import { ${componentName} } from "@mfe/design-system";`;

      // Validate props if API definition exists
      if (apiItem?.props) {
        const validation = validateProps(props, apiItem.props);
        warnings.push(...validation.errors, ...validation.warnings);
      }

      // Check if component likely has children
      const hasChildren =
        apiItem?.props?.some((p) => p.name === "children") ?? false;

      const jsxCode = generateJsx(componentName, props, hasChildren);

      const fullExample = [
        importStatement,
        "",
        "export default function Example() {",
        "  return (",
        `    ${jsxCode.split("\n").join("\n    ")}`,
        "  );",
        "}",
      ].join("\n");

      return {
        importStatement,
        jsxCode,
        fullExample,
        warnings,
        isValid: !warnings.some((w) => w.startsWith("Zorunlu prop eksik")),
      };
    },
    [indexItemMap, apiItemMap],
  );

  const validate = useCallback(
    (code: string): { valid: boolean; errors: string[] } => {
      return validateCodeString(code, indexItemMap);
    },
    [indexItemMap],
  );

  return { generate, validate };
}
