import { useState, useCallback, useEffect } from 'react';
import type { SchedulerView } from './types';

/* ------------------------------------------------------------------ */
/*  Scheduler Variant System                                          */
/*  Save/load scheduler view preferences.                             */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = 'x-scheduler-variants';

export interface ViewConfig {
  view: SchedulerView;
  slotDuration?: number;
  dayStartHour?: number;
  dayEndHour?: number;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  showWeekends?: boolean;
  showAllDaySlot?: boolean;
  resourceGrouping?: boolean;
  timeZone?: string;
  colorScheme?: string;
  customOptions?: Record<string, unknown>;
}

export interface ViewVariant {
  id: string;
  name: string;
  schedulerId: string;
  config: ViewConfig;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UseSchedulerVariantsReturn {
  /** All saved variants for this scheduler */
  variants: ViewVariant[];
  /** Currently active variant (null if none loaded) */
  activeVariant: ViewVariant | null;
  /** Save a new variant */
  saveVariant: (name: string, config: ViewConfig) => ViewVariant;
  /** Load and activate a variant */
  loadVariant: (variantId: string) => void;
  /** Delete a variant */
  deleteVariant: (variantId: string) => void;
  /** Set a variant as the default */
  setDefault: (variantId: string) => void;
  /** Update an existing variant's config */
  updateVariant: (variantId: string, config: Partial<ViewConfig>) => void;
}

function generateId(): string {
  return `sv_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function loadFromStorage(schedulerId: string): ViewVariant[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const all = JSON.parse(raw) as Record<string, ViewVariant[]>;
    return all[schedulerId] ?? [];
  } catch {
    return [];
  }
}

function saveToStorage(schedulerId: string, variants: ViewVariant[]): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all = raw ? (JSON.parse(raw) as Record<string, ViewVariant[]>) : {};
    all[schedulerId] = variants;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // Storage full or unavailable
  }
}

/**
 * Save, load, and manage scheduler view configuration variants.
 *
 * ```tsx
 * const { variants, activeVariant, saveVariant, loadVariant } = useSchedulerVariants('team-calendar');
 * ```
 */
export function useSchedulerVariants(schedulerId: string): UseSchedulerVariantsReturn {
  const [variants, setVariants] = useState<ViewVariant[]>(() =>
    loadFromStorage(schedulerId),
  );
  const [activeVariant, setActiveVariant] = useState<ViewVariant | null>(() => {
    const loaded = loadFromStorage(schedulerId);
    return loaded.find((v) => v.isDefault) ?? null;
  });

  useEffect(() => {
    saveToStorage(schedulerId, variants);
  }, [schedulerId, variants]);

  const saveVariant = useCallback(
    (name: string, config: ViewConfig): ViewVariant => {
      const now = new Date().toISOString();
      const variant: ViewVariant = {
        id: generateId(),
        name,
        schedulerId,
        config,
        isDefault: false,
        createdAt: now,
        updatedAt: now,
      };
      setVariants((prev) => [...prev, variant]);
      setActiveVariant(variant);
      return variant;
    },
    [schedulerId],
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

  const updateVariant = useCallback((variantId: string, config: Partial<ViewConfig>) => {
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
