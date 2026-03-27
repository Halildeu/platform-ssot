/* ------------------------------------------------------------------ */
/*  @mfe/design-system/mcp — Model Context Protocol entry point        */
/*                                                                     */
/*  AI agent'larin tasarim sistemini kesfetmesi ve kullanmasi icin     */
/*  MCP sunucu ve tool fonksiyonlari.                                 */
/* ------------------------------------------------------------------ */

export { DesignSystemMCPServer } from './server';

export {
  getComponentCatalog,
  getComponentDoc,
  getComponentTokens,
  getComponentExamples,
  searchComponents,
  getDesignTokens,
  suggestComponent,
  validateUsage,
  generateCode,
} from './tools';

export type {
  MCPComponentInfo,
  MCPPropInfo,
  MCPExampleInfo,
  MCPTokenInfo,
  MCPSearchResult,
  MCPSuggestion,
  MCPToolDefinition,
  MCPValidationResult,
  MCPValidationError,
  MCPGeneratedCode,
} from './types';
