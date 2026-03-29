/* ------------------------------------------------------------------ */
/*  Example Registry — Curated code examples for Design Lab             */
/*                                                                     */
/*  Each entry: title, description, category, code, and optional       */
/*  prop overrides for live preview.                                   */
/*  Categories: Basic, Form, Layout, Advanced, Patterns                */
/* ------------------------------------------------------------------ */


export type ExampleCategory = "basic" | "form" | "layout" | "advanced" | "patterns";

export type ExampleEntry = {
  id: string;
  title: string;
  description: string;
  category: ExampleCategory;
  code: string;
  /** prop values to render a live preview */
  previewProps?: Record<string, unknown>;
  /** if true, show multi-variant preview using a specific axis */
  multiVariantAxis?: string;
  /** tags for search/filter */
  tags?: string[];
};

export const EXAMPLE_CATEGORY_META: Record<ExampleCategory, { label: string; emoji: string; color: string }> = {
  basic: { label: "Basic", emoji: "🟢", color: "bg-state-success-bg text-state-success-text" },
  form: { label: "Form", emoji: "📝", color: "bg-state-info-bg text-state-info-text" },
  layout: { label: "Layout", emoji: "📐", color: "bg-state-warning-bg text-state-warning-text" },
  advanced: { label: "Advanced", emoji: "⚡", color: "bg-action-primary/10 text-action-primary" },
  patterns: { label: "Patterns", emoji: "🧩", color: "bg-state-danger-bg text-state-danger-text" },
};
