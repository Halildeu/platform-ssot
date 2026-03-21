import { useState, useCallback, useEffect } from 'react';
import type { KanbanColumn, KanbanFilter } from './types';

/* ------------------------------------------------------------------ */
/*  Kanban Variant System                                             */
/*  Save/load board configurations (columns, WIP limits, filters).    */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = 'x-kanban-variants';

export interface BoardState {
  columns: Array<{
    id: string;
    title: string;
    wipLimit?: number;
    color?: string;
    collapsed?: boolean;
  }>;
  filters?: KanbanFilter[];
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  swimlanesEnabled?: boolean;
  collapsedSwimlanes?: string[];
  customOptions?: Record<string, unknown>;
}

export interface BoardVariant {
  id: string;
  name: string;
  boardId: string;
  state: BoardState;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UseKanbanVariantsReturn {
  /** All saved variants for this board */
  variants: BoardVariant[];
  /** Currently active variant (null if none loaded) */
  activeVariant: BoardVariant | null;
  /** Save a new variant */
  saveVariant: (name: string, state: BoardState) => BoardVariant;
  /** Load and activate a variant */
  loadVariant: (variantId: string) => void;
  /** Delete a variant */
  deleteVariant: (variantId: string) => void;
  /** Set a variant as the default */
  setDefault: (variantId: string) => void;
  /** Update an existing variant's state */
  updateVariant: (variantId: string, state: Partial<BoardState>) => void;
}

function generateId(): string {
  return `kv_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function loadFromStorage(boardId: string): BoardVariant[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const all = JSON.parse(raw) as Record<string, BoardVariant[]>;
    return all[boardId] ?? [];
  } catch {
    return [];
  }
}

function saveToStorage(boardId: string, variants: BoardVariant[]): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all = raw ? (JSON.parse(raw) as Record<string, BoardVariant[]>) : {};
    all[boardId] = variants;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // Storage full or unavailable
  }
}

/**
 * Save, load, and manage kanban board configuration variants.
 *
 * ```tsx
 * const { variants, activeVariant, saveVariant, loadVariant } = useKanbanVariants('sprint-board');
 * ```
 */
export function useKanbanVariants(boardId: string): UseKanbanVariantsReturn {
  const [variants, setVariants] = useState<BoardVariant[]>(() => loadFromStorage(boardId));
  const [activeVariant, setActiveVariant] = useState<BoardVariant | null>(() => {
    const loaded = loadFromStorage(boardId);
    return loaded.find((v) => v.isDefault) ?? null;
  });

  useEffect(() => {
    saveToStorage(boardId, variants);
  }, [boardId, variants]);

  const saveVariant = useCallback(
    (name: string, state: BoardState): BoardVariant => {
      const now = new Date().toISOString();
      const variant: BoardVariant = {
        id: generateId(),
        name,
        boardId,
        state,
        isDefault: false,
        createdAt: now,
        updatedAt: now,
      };
      setVariants((prev) => [...prev, variant]);
      setActiveVariant(variant);
      return variant;
    },
    [boardId],
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

  const updateVariant = useCallback((variantId: string, state: Partial<BoardState>) => {
    setVariants((prev) =>
      prev.map((v) =>
        v.id === variantId
          ? { ...v, state: { ...v.state, ...state }, updatedAt: new Date().toISOString() }
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
