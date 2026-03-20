import React from 'react';

export type DemoSurfaceKind = 'live' | 'reference' | 'recipe';
export type DesignLabPreviewPanelId = DemoSurfaceKind;

export type ComponentShowcaseSection = {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  badges?: string[];
  kind?: DemoSurfaceKind;
  content: React.ReactNode;
};

export type DesignLabTranslate = (key: string, params?: Record<string, unknown>) => string;

/**
 * Accepts any component whose props are a superset of the base preview-panel
 * contract.  `children` is typed loosely so that components compiled against
 * different `@types/react` major versions (18 vs 19) remain assignable —
 * React 19 adds `bigint` to `ReactNode`, which makes the two definitions
 * structurally incompatible under strict variance checks.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PreviewPanelComponent = React.ComponentType<{
  title: string;
  children: any; // eslint-disable-line @typescript-eslint/no-explicit-any -- cross-package ReactNode compat
  className?: string;
  kind?: DemoSurfaceKind;
}>;
