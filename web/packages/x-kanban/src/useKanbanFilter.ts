import { useState, useCallback, useMemo } from 'react';
import type { KanbanCard, KanbanFilter } from './types';

export interface UseKanbanFilterReturn {
  filters: KanbanFilter[];
  addFilter: (filter: KanbanFilter) => void;
  removeFilter: (field: string) => void;
  clearFilters: () => void;
  filteredCards: KanbanCard[];
  matchCount: number;
}

function matchesFilter(card: KanbanCard, filter: KanbanFilter): boolean {
  const value = (card as Record<string, unknown>)[filter.field];

  switch (filter.operator) {
    case 'equals':
      return value === filter.value;

    case 'contains': {
      if (typeof value === 'string' && typeof filter.value === 'string') {
        return value.toLowerCase().includes(filter.value.toLowerCase());
      }
      if (Array.isArray(value) && typeof filter.value === 'string') {
        return value.some(
          (v) =>
            typeof v === 'string' &&
            v.toLowerCase().includes((filter.value as string).toLowerCase()),
        );
      }
      return false;
    }

    case 'in': {
      if (Array.isArray(filter.value)) {
        return (filter.value as unknown[]).includes(value);
      }
      return false;
    }

    default:
      return true;
  }
}

export function useKanbanFilter(cards: KanbanCard[]): UseKanbanFilterReturn {
  const [filters, setFilters] = useState<KanbanFilter[]>([]);

  const addFilter = useCallback((filter: KanbanFilter) => {
    setFilters((prev) => {
      // Replace existing filter for the same field, or add new
      const idx = prev.findIndex((f) => f.field === filter.field);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = filter;
        return next;
      }
      return [...prev, filter];
    });
  }, []);

  const removeFilter = useCallback((field: string) => {
    setFilters((prev) => prev.filter((f) => f.field !== field));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters([]);
  }, []);

  const filteredCards = useMemo(() => {
    if (filters.length === 0) return cards;
    return cards.filter((card) => filters.every((f) => matchesFilter(card, f)));
  }, [cards, filters]);

  return {
    filters,
    addFilter,
    removeFilter,
    clearFilters,
    filteredCards,
    matchCount: filteredCards.length,
  };
}
