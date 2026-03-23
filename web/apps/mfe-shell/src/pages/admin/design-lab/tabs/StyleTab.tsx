import React, { useState, useMemo, useCallback } from "react";
import { Eye, EyeOff, Copy, Check, Palette, Code2, Search } from "lucide-react";
import { Text } from "@mfe/design-system";

/* ------------------------------------------------------------------ */
/*  StyleTab — Interactive CSS class documentation per component        */
/*                                                                     */
/*  Features:                                                          */
/*  - Lists all CSS classes by element part (root, header, body, etc.) */
/*  - Click to toggle class on/off in preview                          */
/*  - Style API table with override instructions                       */
/*  - Computed style inspection                                        */
/*                                                                     */
/*  Surpasses: MUI CSS class docs + live toggle capability             */
/* ------------------------------------------------------------------ */

type StylePart = {
  part: string;
  selector: string;
  description: string;
  classes: StyleClass[];
};

type StyleClass = {
  className: string;
  property: string;
  value: string;
  category: "layout" | "spacing" | "typography" | "color" | "border" | "effect" | "interaction";
};

/* ---- Mock style data per component ---- */

const COMPONENT_STYLES: Record<string, StylePart[]> = {
  Button: [
    {
      part: "root",
      selector: ".btn",
      description: "The root button element",
      classes: [
        { className: "inline-flex", property: "display", value: "inline-flex", category: "layout" },
        { className: "items-center", property: "align-items", value: "center", category: "layout" },
        { className: "justify-center", property: "justify-content", value: "center", category: "layout" },
        { className: "font-medium", property: "font-weight", value: "500", category: "typography" },
        { className: "rounded-lg", property: "border-radius", value: "0.5rem", category: "border" },
        { className: "transition-all", property: "transition", value: "all 150ms", category: "effect" },
        { className: "focus-visible:ring-2", property: "box-shadow", value: "0 0 0 2px var(--ring)", category: "interaction" },
        { className: "disabled:opacity-50", property: "opacity", value: "0.5", category: "interaction" },
      ],
    },
    {
      part: "icon",
      selector: ".btn-icon",
      description: "Icon wrapper inside button",
      classes: [
        { className: "mr-2", property: "margin-right", value: "0.5rem", category: "spacing" },
        { className: "h-4 w-4", property: "width/height", value: "1rem", category: "layout" },
        { className: "shrink-0", property: "flex-shrink", value: "0", category: "layout" },
      ],
    },
    {
      part: "spinner",
      selector: ".btn-spinner",
      description: "Loading spinner element",
      classes: [
        { className: "animate-spin", property: "animation", value: "spin 1s linear infinite", category: "effect" },
        { className: "mr-2", property: "margin-right", value: "0.5rem", category: "spacing" },
        { className: "h-4 w-4", property: "width/height", value: "1rem", category: "layout" },
      ],
    },
  ],
  Input: [
    {
      part: "root",
      selector: ".input-wrapper",
      description: "The input wrapper element",
      classes: [
        { className: "relative", property: "position", value: "relative", category: "layout" },
        { className: "flex", property: "display", value: "flex", category: "layout" },
        { className: "items-center", property: "align-items", value: "center", category: "layout" },
      ],
    },
    {
      part: "input",
      selector: ".input",
      description: "The native input element",
      classes: [
        { className: "w-full", property: "width", value: "100%", category: "layout" },
        { className: "rounded-lg", property: "border-radius", value: "0.5rem", category: "border" },
        { className: "border", property: "border-width", value: "1px", category: "border" },
        { className: "px-3 py-2", property: "padding", value: "0.75rem / 0.5rem", category: "spacing" },
        { className: "text-sm", property: "font-size", value: "0.875rem", category: "typography" },
        { className: "outline-hidden", property: "outline", value: "none", category: "interaction" },
        { className: "focus:border-action-primary", property: "border-color", value: "var(--action-primary)", category: "interaction" },
        { className: "placeholder:text-text-tertiary", property: "color", value: "var(--text-tertiary)", category: "color" },
      ],
    },
    {
      part: "label",
      selector: ".input-label",
      description: "Label text above the input",
      classes: [
        { className: "text-sm", property: "font-size", value: "0.875rem", category: "typography" },
        { className: "font-medium", property: "font-weight", value: "500", category: "typography" },
        { className: "mb-1.5", property: "margin-bottom", value: "0.375rem", category: "spacing" },
        { className: "text-text-primary", property: "color", value: "var(--text-primary)", category: "color" },
      ],
    },
    {
      part: "helperText",
      selector: ".input-helper",
      description: "Helper or error text below input",
      classes: [
        { className: "text-xs", property: "font-size", value: "0.75rem", category: "typography" },
        { className: "mt-1", property: "margin-top", value: "0.25rem", category: "spacing" },
        { className: "text-text-secondary", property: "color", value: "var(--text-secondary)", category: "color" },
      ],
    },
  ],
  Select: [
    {
      part: "root",
      selector: ".select-root",
      description: "The select container",
      classes: [
        { className: "relative", property: "position", value: "relative", category: "layout" },
        { className: "inline-flex", property: "display", value: "inline-flex", category: "layout" },
      ],
    },
    {
      part: "trigger",
      selector: ".select-trigger",
      description: "The clickable trigger button",
      classes: [
        { className: "w-full", property: "width", value: "100%", category: "layout" },
        { className: "rounded-lg", property: "border-radius", value: "0.5rem", category: "border" },
        { className: "border", property: "border-width", value: "1px", category: "border" },
        { className: "px-3 py-2", property: "padding", value: "0.75rem / 0.5rem", category: "spacing" },
        { className: "text-sm", property: "font-size", value: "0.875rem", category: "typography" },
      ],
    },
    {
      part: "dropdown",
      selector: ".select-dropdown",
      description: "The floating dropdown panel",
      classes: [
        { className: "rounded-xl", property: "border-radius", value: "0.75rem", category: "border" },
        { className: "shadow-lg", property: "box-shadow", value: "0 10px 15px rgba(0,0,0,0.1)", category: "effect" },
        { className: "border", property: "border-width", value: "1px", category: "border" },
        { className: "bg-surface-default", property: "background", value: "var(--surface-default)", category: "color" },
        { className: "max-h-60", property: "max-height", value: "15rem", category: "layout" },
        { className: "overflow-auto", property: "overflow", value: "auto", category: "layout" },
      ],
    },
    {
      part: "option",
      selector: ".select-option",
      description: "Each selectable option",
      classes: [
        { className: "px-3 py-2", property: "padding", value: "0.75rem / 0.5rem", category: "spacing" },
        { className: "text-sm", property: "font-size", value: "0.875rem", category: "typography" },
        { className: "cursor-pointer", property: "cursor", value: "pointer", category: "interaction" },
        { className: "hover:bg-surface-muted", property: "background", value: "var(--surface-muted)", category: "interaction" },
      ],
    },
  ],
};

// Fallback for components not in the map
function getDefaultStyles(componentName: string): StylePart[] {
  return [{
    part: "root",
    selector: `.${componentName.toLowerCase()}-root`,
    description: `The root ${componentName} element`,
    classes: [
      { className: "relative", property: "position", value: "relative", category: "layout" },
      { className: "inline-flex", property: "display", value: "inline-flex", category: "layout" },
      { className: "rounded-lg", property: "border-radius", value: "0.5rem", category: "border" },
      { className: "transition", property: "transition", value: "all 150ms", category: "effect" },
    ],
  }];
}

const CATEGORY_COLORS: Record<string, string> = {
  layout: "bg-blue-100 text-blue-700",
  spacing: "bg-emerald-100 text-emerald-700",
  typography: "bg-violet-100 text-violet-700",
  color: "bg-amber-100 text-amber-700",
  border: "bg-[var(--surface-muted)] text-[var(--text-secondary)]",
  effect: "bg-pink-100 text-pink-700",
  interaction: "bg-indigo-100 text-indigo-700",
};

type StyleTabProps = {
  componentName: string;
};

export const StyleTab: React.FC<StyleTabProps> = ({ componentName }) => {
  const [disabledClasses, setDisabledClasses] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedClass, setCopiedClass] = useState<string | null>(null);
  const [expandedPart, setExpandedPart] = useState<string | null>(null);

  const parts = useMemo(
    () => COMPONENT_STYLES[componentName] ?? getDefaultStyles(componentName),
    [componentName],
  );

  const toggleClass = useCallback((className: string) => {
    setDisabledClasses((prev) => {
      const next = new Set(prev);
      if (next.has(className)) {
        next.delete(className);
      } else {
        next.add(className);
      }
      return next;
    });
  }, []);

  const copyClassName = useCallback(async (className: string) => {
    try {
      await navigator.clipboard.writeText(className);
      setCopiedClass(className);
      setTimeout(() => setCopiedClass(null), 1500);
    } catch { /* noop */ }
  }, []);

  const filteredParts = useMemo(() => {
    if (!searchQuery) return parts;
    const q = searchQuery.toLowerCase();
    return parts
      .map((part) => ({
        ...part,
        classes: part.classes.filter(
          (c) =>
            c.className.toLowerCase().includes(q) ||
            c.property.toLowerCase().includes(q) ||
            c.category.toLowerCase().includes(q),
        ),
      }))
      .filter((p) => p.classes.length > 0);
  }, [parts, searchQuery]);

  // Generate override code
  const overrideCode = useMemo(() => {
    const activeOverrides = Array.from(disabledClasses);
    if (activeOverrides.length === 0) return null;
    return `// CSS override for ${componentName}
.my-custom-${componentName.toLowerCase()} {
  /* Disabled classes: ${activeOverrides.join(", ")} */
  /* Add your custom overrides here: */
${activeOverrides
  .map((c) => {
    const cls = parts.flatMap((p) => p.classes).find((sc) => sc.className === c);
    return cls ? `  /* Override ${c}: ${cls.property} */` : `  /* Override ${c} */`;
  })
  .join("\n")}
}`;
  }, [disabledClasses, componentName, parts]);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-pink-500" />
          <Text as="h3" className="text-sm font-semibold text-text-primary">
            Style API
          </Text>
          <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-bold text-pink-700">
            {parts.reduce((sum, p) => sum + p.classes.length, 0)} classes
          </span>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter classes..."
            className="rounded-lg border border-border-subtle bg-surface-default pl-7 pr-3 py-1.5 text-xs outline-hidden focus:border-action-primary"
          />
        </div>
      </div>

      {/* Parts */}
      {filteredParts.map((part) => (
        <div key={part.part} className="rounded-2xl border border-border-subtle overflow-hidden">
          {/* Part header */}
          <div className="flex items-center justify-between bg-surface-canvas px-4 py-2.5">
            <div>
              <div className="flex items-center gap-2">
                <code className="text-xs font-mono font-bold text-text-primary">{part.part}</code>
                <code className="text-[10px] font-mono text-text-tertiary">{part.selector}</code>
              </div>
              <Text variant="secondary" className="text-[10px]">{part.description}</Text>
            </div>
            <Text variant="secondary" className="text-[10px]">{part.classes.length} classes</Text>
          </div>

          {/* Class table */}
          <div className="divide-y divide-border-subtle">
            {part.classes.map((cls) => {
              const isDisabled = disabledClasses.has(cls.className);
              const isCopied = copiedClass === cls.className;
              return (
                <div
                  key={cls.className}
                  className={`flex items-center gap-3 px-4 py-2 transition ${isDisabled ? "bg-red-50/50 opacity-60" : "hover:bg-surface-muted/30"}`}
                >
                  {/* Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleClass(cls.className)}
                    className={`rounded-sm p-1 transition ${isDisabled ? "text-red-400 hover:text-red-500" : "text-emerald-500 hover:text-emerald-600"}`}
                    title={isDisabled ? "Enable class" : "Disable class"}
                  >
                    {isDisabled ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </button>

                  {/* Class name */}
                  <code className={`text-[11px] font-mono font-medium ${isDisabled ? "line-through text-text-tertiary" : "text-text-primary"}`}>
                    {cls.className}
                  </code>

                  {/* Category */}
                  <span className={`rounded-sm px-1 py-0.5 text-[8px] font-bold uppercase ${CATEGORY_COLORS[cls.category]}`}>
                    {cls.category}
                  </span>

                  {/* Property → value */}
                  <div className="flex-1 text-right">
                    <Text variant="secondary" className="text-[10px]">
                      <span className="font-medium">{cls.property}:</span> {cls.value}
                    </Text>
                  </div>

                  {/* Copy */}
                  <button
                    type="button"
                    onClick={() => copyClassName(cls.className)}
                    className="rounded-sm p-1 text-text-tertiary hover:text-text-primary transition"
                  >
                    {isCopied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Override code */}
      {overrideCode && (
        <div className="rounded-2xl border border-border-subtle overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border-subtle bg-surface-canvas px-4 py-2">
            <Code2 className="h-3.5 w-3.5 text-text-tertiary" />
            <Text as="span" className="text-xs font-semibold text-text-primary">
              Generated Override ({disabledClasses.size} classes disabled)
            </Text>
          </div>
          <pre className="overflow-x-auto bg-gray-900 p-4 text-[11px] leading-relaxed text-gray-200 font-mono">
            {overrideCode}
          </pre>
        </div>
      )}
    </div>
  );
};

export default StyleTab;
