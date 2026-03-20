/* ------------------------------------------------------------------ */
/*  composeExporter — Export composed layout as React component file    */
/* ------------------------------------------------------------------ */

export type CanvasNode = {
  id: string;
  componentName: string;
  props: Record<string, unknown>;
  x: number;
  y: number;
  w: number;
  h: number;
};

export type LayoutConfig = {
  type: "flex" | "grid";
  direction?: "row" | "column";
  gap?: number;
  columns?: number;
};

export function exportToReact(
  nodes: CanvasNode[],
  layout: LayoutConfig,
  name = "ComposedPage",
): string {
  const imports = new Set<string>();
  imports.add("React");

  nodes.forEach((n) => imports.add(n.componentName));

  const importLine = `import { ${Array.from(imports)
    .filter((i) => i !== "React")
    .join(", ")} } from "@mfe/design-system";`;

  const layoutClass = layout.type === "grid"
    ? `grid grid-cols-${layout.columns ?? 2} gap-${layout.gap ?? 4}`
    : `flex ${layout.direction === "column" ? "flex-col" : "flex-row"} gap-${layout.gap ?? 4}`;

  const childrenCode = nodes
    .map((node) => {
      const propsStr = Object.entries(node.props)
        .filter(([, v]) => v !== undefined && v !== "" && v !== false)
        .map(([k, v]) => {
          if (typeof v === "string") return `${k}="${v}"`;
          if (typeof v === "boolean") return v ? k : "";
          return `${k}={${JSON.stringify(v)}}`;
        })
        .filter(Boolean)
        .join(" ");

      const hasChildren = node.props.children && typeof node.props.children === "string";
      if (hasChildren) {
        return `      <${node.componentName}${propsStr ? " " + propsStr.replace(`children="${node.props.children}"`, "") : ""}>${node.props.children}</${node.componentName}>`;
      }
      return `      <${node.componentName}${propsStr ? " " + propsStr : ""} />`;
    })
    .join("\n");

  return `import React from "react";
${importLine}

export default function ${name}() {
  return (
    <div className="${layoutClass}">
${childrenCode}
    </div>
  );
}
`;
}

export function exportToClipboard(code: string): Promise<void> {
  return navigator.clipboard.writeText(code);
}
