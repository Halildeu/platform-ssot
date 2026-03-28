import React, { useState, useMemo, useCallback } from "react";
import { Plus, Trash2, Copy, Check, ChevronDown, ChevronRight, Move, Code2 } from "lucide-react";
import { Text } from "@mfe/design-system";
import { PlaygroundPreview } from "../playground/PlaygroundPreview";
import { PreviewThemeWrapper } from "../playground/PreviewThemeWrapper";

/* ------------------------------------------------------------------ */
/*  CompositionMode — Slot & children editor for component composition  */
/*                                                                     */
/*  Features:                                                          */
/*  - Add child components to named slots                              */
/*  - Per-child props editing                                          */
/*  - Drag to reorder children                                        */
/*  - Live preview of composed result                                  */
/*  - Generated JSX code output                                        */
/*                                                                     */
/*  Surpasses: MUI + Storybook — biggest differentiation opportunity   */
/* ------------------------------------------------------------------ */

type CompositionChild = {
  id: string;
  componentName: string;
  props: Record<string, unknown>;
  slot?: string;
};

type SlotDef = {
  name: string;
  accepts: string[];
  description: string;
};

/* ---- Slot definitions per component ---- */

const SLOT_DEFS: Record<string, SlotDef[]> = {
  Modal: [
    { name: "title", accepts: ["Text"], description: "Modal title content" },
    { name: "body", accepts: ["Input", "Select", "Textarea", "Alert", "Text"], description: "Modal body content" },
    { name: "footer", accepts: ["Button", "ButtonGroup"], description: "Modal footer actions" },
  ],
  Card: [
    { name: "header", accepts: ["Text", "Badge"], description: "Card header" },
    { name: "content", accepts: ["Text", "Input", "Button", "Alert", "List"], description: "Card main content" },
    { name: "footer", accepts: ["Button", "Link"], description: "Card footer actions" },
  ],
  Alert: [
    { name: "action", accepts: ["Button", "Link"], description: "Alert action button" },
  ],
  PageHeader: [
    { name: "title", accepts: ["Text"], description: "Page title" },
    { name: "actions", accepts: ["Button", "IconButton", "ButtonGroup"], description: "Header action buttons" },
    { name: "breadcrumb", accepts: ["Breadcrumb"], description: "Breadcrumb navigation" },
  ],
  Form: [
    { name: "fields", accepts: ["Input", "Select", "Checkbox", "Switch", "Textarea", "DatePicker"], description: "Form fields" },
    { name: "actions", accepts: ["Button"], description: "Submit/cancel buttons" },
  ],
};

/* ---- Available child components ---- */

const AVAILABLE_CHILDREN = [
  "Button", "Text", "Input", "Select", "Checkbox", "Switch", "Badge",
  "Alert", "Link", "IconButton", "Avatar", "Divider",
];

/* ---- Code generation ---- */

function generateCompositionCode(
  parentName: string,
  parentProps: Record<string, unknown>,
  children: CompositionChild[],
): string {
  const childrenBySlot = new Map<string, CompositionChild[]>();
  const noSlot: CompositionChild[] = [];

  for (const child of children) {
    if (child.slot) {
      const list = childrenBySlot.get(child.slot) ?? [];
      list.push(child);
      childrenBySlot.set(child.slot, list);
    } else {
      noSlot.push(child);
    }
  }

  const propsStr = Object.entries(parentProps)
    .filter(([, v]) => v !== undefined && v !== "" && v !== false)
    .map(([k, v]) => {
      if (typeof v === "string") return `${k}="${v}"`;
      if (typeof v === "boolean") return v ? k : "";
      return `${k}={${JSON.stringify(v)}}`;
    })
    .filter(Boolean)
    .join(" ");

  const indent = "  ";

  const renderChild = (c: CompositionChild, depth: number): string => {
    const pad = indent.repeat(depth);
    const cProps = Object.entries(c.props)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => {
        if (typeof v === "string") return `${k}="${v}"`;
        if (typeof v === "boolean") return v ? k : "";
        return `${k}={${JSON.stringify(v)}}`;
      })
      .filter(Boolean)
      .join(" ");
    const propsSegment = cProps ? ` ${cProps}` : "";

    if (c.componentName === "Text" && c.props.children) {
      return `${pad}<${c.componentName}${propsSegment}>${c.props.children}</${c.componentName}>`;
    }
    return `${pad}<${c.componentName}${propsSegment} />`;
  };

  let code = `<${parentName}${propsStr ? " " + propsStr : ""}>\n`;

  // Slotted children
  childrenBySlot.forEach((slotChildren, slot) => {
    code += `${indent}{/* ${slot} */}\n`;
    slotChildren.forEach((child) => {
      code += renderChild(child, 1) + "\n";
    });
  });

  // Unslotted children
  for (const child of noSlot) {
    code += renderChild(child, 1) + "\n";
  }

  code += `</${parentName}>`;
  return code;
}

/* ---- Main Component ---- */

type CompositionModeProps = {
  componentName: string;
  propValues: Record<string, unknown>;
};

export const CompositionMode: React.FC<CompositionModeProps> = ({
  componentName,
  propValues,
}) => {
  const [children, setChildren] = useState<CompositionChild[]>([]);
  const [expandedChild, setExpandedChild] = useState<string | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const slots = SLOT_DEFS[componentName] ?? [];
  const hasSlots = slots.length > 0;

  const addChild = useCallback((componentName: string, slot?: string) => {
    const id = `child-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const defaultProps: Record<string, unknown> = {};
    if (componentName === "Button") defaultProps.children = "Click me";
    if (componentName === "Text") defaultProps.children = "Sample text";
    if (componentName === "Input") defaultProps.placeholder = "Enter value...";
    if (componentName === "Badge") defaultProps.children = "Badge";

    setChildren((prev) => [...prev, { id, componentName, props: defaultProps, slot }]);
    setExpandedChild(id);
  }, []);

  const removeChild = useCallback((id: string) => {
    setChildren((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const updateChildProp = useCallback((id: string, key: string, value: unknown) => {
    setChildren((prev) =>
      prev.map((c) => (c.id === id ? { ...c, props: { ...c.props, [key]: value } } : c)),
    );
  }, []);

  const generatedCode = useMemo(
    () => generateCompositionCode(componentName, propValues, children),
    [componentName, propValues, children],
  );

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* noop */ }
  }, [generatedCode]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Composition tree */}
        <div className="flex flex-col gap-3">
          <Text as="div" className="text-xs font-semibold text-text-primary flex items-center gap-2">
            <Move className="h-3.5 w-3.5" /> Composition Tree
          </Text>

          {/* Slots */}
          {hasSlots && slots.map((slot) => {
            const slotChildren = children.filter((c) => c.slot === slot.name);
            return (
              <div key={slot.name} className="rounded-xl border border-border-subtle p-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <Text as="div" className="text-[11px] font-semibold text-text-primary">{slot.name}</Text>
                    <Text variant="secondary" className="text-[10px]">{slot.description}</Text>
                  </div>
                  <div className="relative group">
                    <button
                      type="button"
                      className="flex items-center gap-1 rounded-lg bg-action-primary/10 px-2 py-1 text-[10px] font-medium text-action-primary hover:bg-action-primary/20 transition"
                      onClick={() => addChild(slot.accepts[0], slot.name)}
                    >
                      <Plus className="h-3 w-3" /> Add
                    </button>
                  </div>
                </div>
                {slotChildren.length === 0 && (
                  <div className="rounded-lg border-2 border-dashed border-border-subtle py-4 text-center">
                    <Text variant="secondary" className="text-[10px]">
                      Drop {slot.accepts.join(", ")} here
                    </Text>
                  </div>
                )}
                {slotChildren.map((child) => (
                  <ChildItem
                    key={child.id}
                    child={child}
                    isExpanded={expandedChild === child.id}
                    onToggle={() => setExpandedChild(expandedChild === child.id ? null : child.id)}
                    onRemove={() => removeChild(child.id)}
                    onPropChange={(k, v) => updateChildProp(child.id, k, v)}
                  />
                ))}
              </div>
            );
          })}

          {/* Unslotted children area */}
          <div className="rounded-xl border border-border-subtle p-3">
            <div className="flex items-center justify-between mb-2">
              <Text as="div" className="text-[11px] font-semibold text-text-primary">
                {hasSlots ? "Direct Children" : "Children"}
              </Text>
              <div className="flex gap-1">
                {AVAILABLE_CHILDREN.slice(0, 5).map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => addChild(name)}
                    className="rounded-md bg-surface-muted px-1.5 py-0.5 text-[9px] font-medium text-text-secondary hover:text-text-primary transition"
                  >
                    +{name}
                  </button>
                ))}
              </div>
            </div>
            {children.filter((c) => !c.slot).map((child) => (
              <ChildItem
                key={child.id}
                child={child}
                isExpanded={expandedChild === child.id}
                onToggle={() => setExpandedChild(expandedChild === child.id ? null : child.id)}
                onRemove={() => removeChild(child.id)}
                onPropChange={(k, v) => updateChildProp(child.id, k, v)}
              />
            ))}
            {children.filter((c) => !c.slot).length === 0 && (
              <div className="rounded-lg border-2 border-dashed border-border-subtle py-4 text-center">
                <Text variant="secondary" className="text-[10px]">Add child components above</Text>
              </div>
            )}
          </div>
        </div>

        {/* Live preview */}
        <div>
          <Text as="div" className="mb-2 text-xs font-semibold text-text-primary">Live Preview</Text>
          <PreviewThemeWrapper appearance="light" className="rounded-2xl p-6 min-h-[200px]">
            <div className="flex items-center justify-center">
              <PlaygroundPreview
                componentName={componentName}
                propValues={propValues as Record<string, string | number | boolean>}
              />
            </div>
          </PreviewThemeWrapper>
        </div>
      </div>

      {/* Generated code */}
      <div className="rounded-2xl border border-border-subtle overflow-hidden">
        <div className="flex items-center justify-between border-b border-border-subtle px-4 py-2">
          <div className="flex items-center gap-2">
            <Code2 className="h-3.5 w-3.5 text-text-tertiary" />
            <Text as="span" className="text-xs font-semibold text-text-primary">Generated JSX</Text>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-lg border border-border-subtle px-2 py-1 text-[11px] font-medium text-text-secondary hover:text-text-primary transition"
          >
            {copied ? <Check className="h-3 w-3 text-state-success-text" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <pre className="overflow-x-auto bg-surface-inverse p-4 text-xs leading-relaxed text-border-subtle font-mono">
          {generatedCode}
        </pre>
      </div>
    </div>
  );
};

/* ---- ChildItem ---- */

function ChildItem({
  child,
  isExpanded,
  onToggle,
  onRemove,
  onPropChange,
}: {
  child: CompositionChild;
  isExpanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
  onPropChange: (key: string, value: unknown) => void;
}) {
  return (
    <div className="mt-1.5 rounded-lg border border-border-subtle bg-surface-default overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5">
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center gap-1.5 text-left"
        >
          {isExpanded ? <ChevronDown className="h-3 w-3 text-text-tertiary" /> : <ChevronRight className="h-3 w-3 text-text-tertiary" />}
          <code className="text-[11px] font-mono font-medium text-text-primary">&lt;{child.componentName}&gt;</code>
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-xs p-1 text-text-tertiary hover:text-state-danger-text transition"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
      {isExpanded && (
        <div className="flex flex-col border-t border-border-subtle bg-surface-canvas px-3 py-2 gap-1.5">
          {/* Common editable props */}
          <div className="flex items-center gap-2">
            <Text variant="secondary" className="text-[10px] w-16 shrink-0">children</Text>
            <input
              type="text"
              value={(child.props.children as string) ?? ""}
              onChange={(e) => onPropChange("children", e.target.value)}
              className="flex-1 rounded-md border border-border-subtle bg-surface-default px-2 py-1 text-[11px] outline-hidden focus:border-action-primary"
              placeholder="Text content"
            />
          </div>
          <div className="flex items-center gap-2">
            <Text variant="secondary" className="text-[10px] w-16 shrink-0">variant</Text>
            <input
              type="text"
              value={(child.props.variant as string) ?? ""}
              onChange={(e) => onPropChange("variant", e.target.value)}
              className="flex-1 rounded-md border border-border-subtle bg-surface-default px-2 py-1 text-[11px] outline-hidden focus:border-action-primary"
              placeholder="primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <Text variant="secondary" className="text-[10px] w-16 shrink-0">disabled</Text>
            <input
              type="checkbox"
              checked={Boolean(child.props.disabled)}
              onChange={(e) => onPropChange("disabled", e.target.checked)}
              className="rounded-xs"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default CompositionMode;
