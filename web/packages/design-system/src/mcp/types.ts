/* ------------------------------------------------------------------ */
/*  MCP Types — Design System Model Context Protocol                   */
/*                                                                     */
/*  AI agent'larin tasarim sistemini kesfetmesi ve kullanmasi icin     */
/*  tip tanimlari.                                                     */
/* ------------------------------------------------------------------ */

export type MCPComponentInfo = {
  name: string;
  description: string;
  category: string;
  lifecycle: 'stable' | 'beta';
  props: MCPPropInfo[];
  importStatement: string;
  examples: MCPExampleInfo[];
  relatedComponents: string[];
  accessibilityNotes: string[];
};

export type MCPPropInfo = {
  name: string;
  type: string;
  required: boolean;
  default: string;
  description: string;
};

export type MCPExampleInfo = {
  title: string;
  description: string;
  code: string;
  category: string;
};

export type MCPTokenInfo = {
  name: string;
  cssVariable: string;
  lightValue: string;
  darkValue: string;
  category: 'color' | 'spacing' | 'typography' | 'border' | 'shadow' | 'motion' | 'sizing';
};

export type MCPSearchResult = {
  component: string;
  relevance: number;
  matchReason: string;
};

export type MCPSuggestion = {
  component: string;
  confidence: number;
  rationale: string;
  exampleCode: string;
};

export type MCPToolDefinition = {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, { type: string; description: string; enum?: string[] }>;
    required: string[];
  };
};

export type MCPValidationResult = {
  valid: boolean;
  errors: MCPValidationError[];
  suggestions: string[];
};

export type MCPValidationError = {
  prop: string;
  message: string;
  severity: 'error' | 'warning';
};

export type MCPGeneratedCode = {
  code: string;
  imports: string[];
  description: string;
};
