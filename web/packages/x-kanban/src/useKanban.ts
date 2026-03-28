import { useState, useCallback, useMemo } from 'react';
import type { KanbanColumn, KanbanCard, DragResult } from './types';

export interface UseKanbanReturn {
  columns: KanbanColumn[];
  cards: KanbanCard[];
  moveCard: (result: DragResult) => void;
  addCard: (card: KanbanCard) => void;
  removeCard: (cardId: string) => void;
  updateCard: (cardId: string, updates: Partial<KanbanCard>) => void;
  addColumn: (column: KanbanColumn) => void;
  removeColumn: (columnId: string) => void;
  updateColumn: (columnId: string, updates: Partial<KanbanColumn>) => void;
  getColumnCards: (columnId: string) => KanbanCard[];
}

export function useKanban(
  initialColumns: KanbanColumn[],
  initialCards: KanbanCard[],
): UseKanbanReturn {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);
  const [cards, setCards] = useState<KanbanCard[]>(initialCards);

  const cardsByColumn = useMemo(() => {
    const map = new Map<string, KanbanCard[]>();
    for (const col of columns) {
      map.set(col.id, []);
    }
    for (const card of cards) {
      const list = map.get(card.columnId);
      if (list) {
        list.push(card);
      }
    }
    return map;
  }, [columns, cards]);

  const getColumnCards = useCallback(
    (columnId: string): KanbanCard[] => {
      return cardsByColumn.get(columnId) ?? [];
    },
    [cardsByColumn],
  );

  const moveCard = useCallback((result: DragResult) => {
    setCards((prev) => {
      const updated = prev.map((c) =>
        c.id === result.cardId ? { ...c, columnId: result.toColumnId } : c,
      );
      // Reorder within target column
      const card = updated.find((c) => c.id === result.cardId);
      if (!card) return prev;

      const others = updated.filter((c) => c.id !== result.cardId);
      const colCards = others.filter((c) => c.columnId === result.toColumnId);
      const restCards = others.filter((c) => c.columnId !== result.toColumnId);

      const insertIndex = Math.min(result.toIndex, colCards.length);
      colCards.splice(insertIndex, 0, card);

      return [...restCards, ...colCards];
    });
  }, []);

  const addCard = useCallback((card: KanbanCard) => {
    setCards((prev) => [...prev, card]);
  }, []);

  const removeCard = useCallback((cardId: string) => {
    setCards((prev) => prev.filter((c) => c.id !== cardId));
  }, []);

  const updateCard = useCallback((cardId: string, updates: Partial<KanbanCard>) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, ...updates } : c)),
    );
  }, []);

  const addColumn = useCallback((column: KanbanColumn) => {
    setColumns((prev) => [...prev, column]);
  }, []);

  const removeColumn = useCallback((columnId: string) => {
    setColumns((prev) => prev.filter((c) => c.id !== columnId));
    setCards((prev) => prev.filter((c) => c.columnId !== columnId));
  }, []);

  const updateColumn = useCallback(
    (columnId: string, updates: Partial<KanbanColumn>) => {
      setColumns((prev) =>
        prev.map((c) => (c.id === columnId ? { ...c, ...updates } : c)),
      );
    },
    [],
  );

  return {
    columns,
    cards,
    moveCard,
    addCard,
    removeCard,
    updateCard,
    addColumn,
    removeColumn,
    updateColumn,
    getColumnCards,
  };
}
