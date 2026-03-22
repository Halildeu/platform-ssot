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

/* ------------------------------------------------------------------ */
/*  MCP v2 Types — F5 AI-First Leapfrog                                */
/* ------------------------------------------------------------------ */

// proposeLayout
export type MCPLayoutBlock = {
  key: string;
  type: 'metric' | 'chart' | 'table' | 'list' | 'form' | 'text' | 'action' | 'custom';
  priority: 'high' | 'medium' | 'low';
  span: 1 | 2 | 3 | 4;
  title: string;
};

export type MCPLayoutProposal = {
  blocks: MCPLayoutBlock[];
  intent: 'overview' | 'detail' | 'comparison' | 'workflow' | 'monitoring';
  rationale: string;
};

// reviewAccessibility
export type MCPA11yIssue = {
  rule: string;
  severity: 'critical' | 'serious' | 'moderate';
  message: string;
  fix: string;
};

export type MCPA11yReviewResult = {
  issues: MCPA11yIssue[];
  score: number;
  suggestions: string[];
};

// suggestTestCases
export type MCPTestSuggestion = {
  category: 'render' | 'props' | 'a11y' | 'keyboard' | 'access-control' | 'state';
  description: string;
  code: string;
};

// explainComponent
export type MCPComponentExplanation = {
  component: string;
  summary: string;
  whenToUse: string[];
  whenNotToUse: string[];
  alternatives: string[];
};

// compareComponents
export type MCPComparisonResult = {
  a: string;
  b: string;
  similarities: string[];
  differences: string[];
  recommendation: string;
};

// optimizeBundle
export type MCPBundleSuggestion = {
  component: string;
  sizeKB: number;
  action: 'lazy-load' | 'tree-shake' | 'replace';
  reason: string;
};

export type MCPBundleOptimization = {
  totalKB: number;
  suggestions: MCPBundleSuggestion[];
};

// auditTokenUsage
export type MCPTokenViolation = {
  value: string;
  suggestedToken: string;
  cssVariable: string;
};

export type MCPTokenAuditResult = {
  violations: MCPTokenViolation[];
  clean: boolean;
};

// suggestPattern
export type MCPPatternSuggestion = {
  pattern: string;
  components: string[];
  description: string;
  exampleCode: string;
};

// getComponentDependencies
export type MCPDependencyNode = {
  name: string;
  children: string[];
  depth: number;
};

export type MCPDependencyTree = {
  root: string;
  nodes: MCPDependencyNode[];
  totalDependencies: number;
};

// getQualityReport
export type MCPQualityReport = {
  component: string | null;
  lifecycle: string;
  testCount: number;
  hasContract: boolean;
  hasDocs: boolean;
  hasStory: boolean;
  a11yCompliant: boolean;
};

// migrateComponent
export type MCPMigrationStep = {
  description: string;
  before: string;
  after: string;
};

export type MCPMigrationGuide = {
  component: string;
  fromVersion: string;
  toVersion: string;
  steps: MCPMigrationStep[];
  breakingChanges: string[];
};

// generateFormSchema
export type MCPFormSchemaResult = {
  zodSchema: string;
  formConfig: string;
  description: string;
};
