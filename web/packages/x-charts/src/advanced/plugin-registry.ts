/**
 * Chart Plugin Registry — Register custom chart types
 *
 * Extensible registry for adding new chart types without modifying
 * core x-charts code. Plugins define a renderer function that
 * receives data and returns ECharts options.
 *
 * @see contract P8 DoD: "Custom chart plugin API"
 * @see success metric: "<50 lines to add new chart type"
 */

import type { ChartType } from '../spec/ChartSpec';

export interface ChartPluginConfig {
  /** Unique chart type ID */
  type: string;
  /** Display name */
  displayName: string;
  /** Plugin version */
  version: string;
  /** Icon identifier for UI */
  icon?: string;
  /** ECharts modules this plugin requires (for tree-shaking hints) */
  requiredModules?: string[];
}

export interface ChartPlugin {
  config: ChartPluginConfig;
  /** Transform data + options into ECharts option object */
  toEChartsOption: (data: unknown[], encoding: Record<string, string>, options?: Record<string, unknown>) => Record<string, unknown>;
}

class PluginRegistry {
  private plugins = new Map<string, ChartPlugin>();

  register(plugin: ChartPlugin): void {
    if (this.plugins.has(plugin.config.type)) {
      console.warn(`[x-charts] Plugin "${plugin.config.type}" already registered. Overwriting.`);
    }
    this.plugins.set(plugin.config.type, plugin);
  }

  unregister(type: string): boolean {
    return this.plugins.delete(type);
  }

  get(type: string): ChartPlugin | undefined {
    return this.plugins.get(type);
  }

  has(type: string): boolean {
    return this.plugins.has(type);
  }

  list(): ChartPluginConfig[] {
    return [...this.plugins.values()].map((p) => p.config);
  }

  getTypes(): string[] {
    return [...this.plugins.keys()];
  }

  clear(): void {
    this.plugins.clear();
  }

  get size(): number {
    return this.plugins.size;
  }
}

/** Singleton plugin registry */
export const chartPluginRegistry = new PluginRegistry();

/** Convenience function for registering a plugin */
export function registerChartPlugin(plugin: ChartPlugin): void {
  chartPluginRegistry.register(plugin);
}
