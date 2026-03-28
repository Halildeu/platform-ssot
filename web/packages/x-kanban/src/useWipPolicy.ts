import { useMemo, useCallback } from 'react';
import type { KanbanColumn, KanbanCard } from './types';

export interface WipUtilization {
  current: number;
  limit: number;
  percentage: number;
}

export interface WipViolation {
  columnId: string;
  current: number;
  limit: number;
}

export interface UseWipPolicyReturn {
  isOverLimit: (columnId: string) => boolean;
  getUtilization: (columnId: string) => WipUtilization;
  canAcceptCard: (
    columnId: string,
    card: KanbanCard,
  ) => { allowed: boolean; reason?: string };
  violations: WipViolation[];
}

export function useWipPolicy(
  columns: KanbanColumn[],
  cards: KanbanCard[],
): UseWipPolicyReturn {
  /** Map of columnId -> card count */
  const columnCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const col of columns) {
      map.set(col.id, 0);
    }
    for (const card of cards) {
      map.set(card.columnId, (map.get(card.columnId) ?? 0) + 1);
    }
    return map;
  }, [columns, cards]);

  /** Map of columnId -> effective WIP limit */
  const columnLimits = useMemo(() => {
    const map = new Map<string, number | null>();
    for (const col of columns) {
      const limit = col.policy?.wipLimit ?? col.limit ?? null;
      map.set(col.id, limit);
    }
    return map;
  }, [columns]);

  /** Map of columnId -> allowed types */
  const columnAllowedTypes = useMemo(() => {
    const map = new Map<string, string[] | null>();
    for (const col of columns) {
      map.set(col.id, col.policy?.allowedCardTypes ?? null);
    }
    return map;
  }, [columns]);

  const isOverLimit = useCallback(
    (columnId: string): boolean => {
      const limit = columnLimits.get(columnId);
      if (limit == null) return false;
      const count = columnCounts.get(columnId) ?? 0;
      return count > limit;
    },
    [columnLimits, columnCounts],
  );

  const getUtilization = useCallback(
    (columnId: string): WipUtilization => {
      const current = columnCounts.get(columnId) ?? 0;
      const limit = columnLimits.get(columnId) ?? 0;
      const percentage = limit > 0 ? Math.round((current / limit) * 100) : 0;
      return { current, limit, percentage };
    },
    [columnCounts, columnLimits],
  );

  const canAcceptCard = useCallback(
    (
      columnId: string,
      card: KanbanCard,
    ): { allowed: boolean; reason?: string } => {
      // Check WIP limit (consider that this card may already be in this column)
      const limit = columnLimits.get(columnId);
      if (limit != null) {
        const currentCount = columnCounts.get(columnId) ?? 0;
        // If card is already in this column, don't count it as new
        const effective =
          card.columnId === columnId ? currentCount : currentCount + 1;
        if (effective > limit) {
          return {
            allowed: false,
            reason: `Column has reached its WIP limit of ${limit}`,
          };
        }
      }

      // Check allowed card types
      const allowedTypes = columnAllowedTypes.get(columnId);
      if (allowedTypes != null && card.type) {
        if (!allowedTypes.includes(card.type)) {
          return {
            allowed: false,
            reason: `Card type "${card.type}" is not allowed in this column. Allowed: ${allowedTypes.join(', ')}`,
          };
        }
      }

      return { allowed: true };
    },
    [columnLimits, columnCounts, columnAllowedTypes],
  );

  const violations = useMemo<WipViolation[]>(() => {
    const result: WipViolation[] = [];
    for (const col of columns) {
      const limit = columnLimits.get(col.id);
      if (limit == null) continue;
      const current = columnCounts.get(col.id) ?? 0;
      if (current > limit) {
        result.push({ columnId: col.id, current, limit });
      }
    }
    return result;
  }, [columns, columnLimits, columnCounts]);

  return {
    isOverLimit,
    getUtilization,
    canAcceptCard,
    violations,
  };
}
