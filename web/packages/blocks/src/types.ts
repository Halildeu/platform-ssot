import type { ComponentType, ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/*  Block definition                                                   */
/* ------------------------------------------------------------------ */

export interface BlockDefinition {
  id: string;
  name: string;
  category: BlockCategory;
  description: string;
  thumbnail?: string;
  tags: string[];
  component: ComponentType<any>;
  defaultProps?: Record<string, unknown>;
  schema?: Record<string, unknown>; // JSON schema for props
}

export type BlockCategory =
  | 'dashboard'
  | 'crud'
  | 'admin'
  | 'detail'
  | 'analytics'
  | 'onboarding';

/* ------------------------------------------------------------------ */
/*  Block registry                                                     */
/* ------------------------------------------------------------------ */

export interface BlockRegistry {
  blocks: Map<string, BlockDefinition>;
  register: (block: BlockDefinition) => void;
  get: (id: string) => BlockDefinition | undefined;
  getByCategory: (category: BlockCategory) => BlockDefinition[];
  search: (query: string) => BlockDefinition[];
}

/* ------------------------------------------------------------------ */
/*  Page composition                                                   */
/* ------------------------------------------------------------------ */

export interface PageComposition {
  id: string;
  title: string;
  layout: 'single' | 'sidebar' | 'split' | 'grid';
  blocks: Array<{
    blockId: string;
    props?: Record<string, unknown>;
    span?: number;
    order?: number;
  }>;
}
