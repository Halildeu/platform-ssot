/* ------------------------------------------------------------------ */
/*  Guide Registry — Structured narrative guides per component          */
/*                                                                     */
/*  Each guide contains sections: overview, when-to-use, anatomy,      */
/*  best-practices, accessibility, related-components, anti-patterns    */
/*                                                                     */
/*  Inspired by: AntD "When to Use" + Storybook MDX + Shadcn docs     */
/*  Surpasses with: structured anatomy, anti-patterns, live demos      */
/* ------------------------------------------------------------------ */

export type GuideSection = {
  id: string;
  title: string;
  icon?: string;
  content: string;
  /** Optional component name for inline demo */
  demoProps?: Record<string, unknown>;
};

export type ComponentGuide = {
  componentName: string;
  summary: string;
  sections: GuideSection[];
  relatedComponents?: string[];
};

