import { useState, useCallback, useEffect } from 'react';

/* ------------------------------------------------------------------ */
/*  Chart Variant System                                              */
/*  Save/load chart configurations (axis settings, colors, type).     */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = 'x-chart-variants';

export interface ChartConfig {
  type: 'bar' | 'line' | 'area' | 'pie' | 'scatter' | 'radar' | 'treemap' | 'heatmap' | 'gauge' | 'waterfall';
  colors?: string[];
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  stacked?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  animationDuration?: number;
  customOptions?: Record<string, unknown>;
}

export interface ChartVariant {
  id: string;
  name: string;
  chartId: string;
  config: ChartConfig;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UseChartVariantsReturn {
  /** All saved variants for this chart */
  variants: ChartVariant[];
  /** Currently active variant (null if none loaded) */
  activeVariant: ChartVariant | null;
  /** Save a new variant */
  saveVariant: (name: string, config: ChartConfig) => ChartVariant;
  /** Load and activate a variant */
  loadVariant: (variantId: string) => void;
  /** Delete a variant */
  deleteVariant: (variantId: string) => void;
  /** Set a variant as the default */
  setDefault: (variantId: string) => void;
  /** Update an existing variant's config */
  updateVariant: (variantId: string, config: Partial<ChartConfig>) => void;
}

function generateId(): string {
  return `cv_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function loadFromStorage(chartId: string): ChartVariant[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const all = JSON.parse(raw) as Record<string, ChartVariant[]>;
    return all[chartId] ?? [];
  } catch {
    return [];
  }
}

function saveToStorage(chartId: string, variants: ChartVariant[]): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all = raw ? (JSON.parse(raw) as Record<string, ChartVariant[]>) : {};
    all[chartId] = variants;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // Storage full or unavailable
  }
}

/**
 * Save, load, and manage chart configuration variants.
 *
 * ```tsx
 * const { variants, activeVariant, saveVariant, loadVariant } = useChartVariants('sales-chart');
 * ```
 */
export function useChartVariants(chartId: string): UseChartVariantsReturn {
  const [variants, setVariants] = useState<ChartVariant[]>(() => loadFromStorage(chartId));
  const [activeVariant, setActiveVariant] = useState<ChartVariant | null>(() => {
    const loaded = loadFromStorage(chartId);
    return loaded.find((v) => v.isDefault) ?? null;
  });

  // Persist on change
  useEffect(() => {
    saveToStorage(chartId, variants);
  }, [chartId, variants]);

  const saveVariant = useCallback(
    (name: string, config: ChartConfig): ChartVariant => {
      const now = new Date().toISOString();
      const variant: ChartVariant = {
        id: generateId(),
        name,
        chartId,
        config,
        isDefault: false,
        createdAt: now,
        updatedAt: now,
      };
      setVariants((prev) => [...prev, variant]);
      setActiveVariant(variant);
      return variant;
    },
    [chartId],
  );

  const loadVariant = useCallback(
    (variantId: string) => {
      const variant = variants.find((v) => v.id === variantId);
      if (variant) {
        setActiveVariant(variant);
      }
    },
    [variants],
  );

  const deleteVariant = useCallback(
    (variantId: string) => {
      setVariants((prev) => prev.filter((v) => v.id !== variantId));
      if (activeVariant?.id === variantId) {
        setActiveVariant(null);
      }
    },
    [activeVariant],
  );

  const setDefault = useCallback((variantId: string) => {
    setVariants((prev) =>
      prev.map((v) => ({
        ...v,
        isDefault: v.id === variantId,
        updatedAt: v.id === variantId ? new Date().toISOString() : v.updatedAt,
      })),
    );
  }, []);

  const updateVariant = useCallback((variantId: string, config: Partial<ChartConfig>) => {
    setVariants((prev) =>
      prev.map((v) =>
        v.id === variantId
          ? { ...v, config: { ...v.config, ...config }, updatedAt: new Date().toISOString() }
          : v,
      ),
    );
  }, []);

  return {
    variants,
    activeVariant,
    saveVariant,
    loadVariant,
    deleteVariant,
    setDefault,
    updateVariant,
  };
}
