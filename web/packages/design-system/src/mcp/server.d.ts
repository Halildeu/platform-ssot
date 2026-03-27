import type { MCPToolDefinition } from './types';
export declare class DesignSystemMCPServer {
    private catalog;
    constructor();
    /** Catalog doc entry'lerinden bilesen haritasini olusturur (lowercase key) */
    private buildCatalog;
    /** Katalogtaki toplam bilesen sayisini dondurur */
    get componentCount(): number;
    /** Tum bilesen isimlerini dondurur (orijinal case) */
    getComponentNames(): string[];
    /** MCP tool cagrisini isler ve sonucu dondurur */
    handleToolCall(toolName: string, args: Record<string, unknown>): unknown;
    /** Mevcut MCP tool listesini dondurur (MCP protokolune uygun) */
    listTools(): MCPToolDefinition[];
}
