/**
 * Embedded Analytics & Collaboration Types
 */

export interface EmbedConfig {
  enabled: boolean;
  token: string;
  allowedDomains: string[];
  expiresAt?: string;
  hideToolbar?: boolean;
  hideFilters?: boolean;
  theme?: 'light' | 'dark' | 'auto';
}

export interface ParameterDef {
  key: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'enum';
  required: boolean;
  defaultValue?: unknown;
  enumValues?: string[];
}

export interface ReportComment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
  cellRef?: { row: number; column: string };
  resolved: boolean;
}

export interface ShareTarget {
  type: 'user' | 'role' | 'team';
  id: string;
  permission: 'view' | 'edit' | 'admin';
}

export interface ShareConfig {
  sharedWith: ShareTarget[];
  publicLink?: string;
  linkExpiry?: string;
}
