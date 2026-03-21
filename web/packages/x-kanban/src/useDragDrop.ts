import { useState, useCallback, type DragEvent } from 'react';

export interface DragDropState {
  draggedCardId: string | null;
  dragOverColumnId: string | null;
  dragOverIndex: number;
}

export interface DragDropHandlers {
  onDragStart: (e: DragEvent<HTMLElement>, cardId: string, columnId: string) => void;
  onDragOver: (e: DragEvent<HTMLElement>, columnId: string, index: number) => void;
  onDragEnter: (e: DragEvent<HTMLElement>, columnId: string) => void;
  onDragLeave: (e: DragEvent<HTMLElement>) => void;
  onDrop: (e: DragEvent<HTMLElement>, columnId: string) => void;
  onDragEnd: (e: DragEvent<HTMLElement>) => void;
}

export interface UseDragDropReturn extends DragDropState {
  handlers: DragDropHandlers;
  sourceColumnId: string | null;
}

export function useDragDrop(): UseDragDropReturn {
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [sourceColumnId, setSourceColumnId] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number>(0);

  const onDragStart = useCallback(
    (e: DragEvent<HTMLElement>, cardId: string, columnId: string) => {
      e.dataTransfer.setData('text/plain', cardId);
      e.dataTransfer.effectAllowed = 'move';
      setDraggedCardId(cardId);
      setSourceColumnId(columnId);
    },
    [],
  );

  const onDragOver = useCallback(
    (e: DragEvent<HTMLElement>, columnId: string, index: number) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      setDragOverColumnId(columnId);
      setDragOverIndex(index);
    },
    [],
  );

  const onDragEnter = useCallback(
    (e: DragEvent<HTMLElement>, columnId: string) => {
      e.preventDefault();
      setDragOverColumnId(columnId);
    },
    [],
  );

  const onDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    const currentTarget = e.currentTarget as HTMLElement;
    if (relatedTarget && currentTarget.contains(relatedTarget)) {
      return;
    }
    setDragOverColumnId(null);
  }, []);

  const onDrop = useCallback(
    (e: DragEvent<HTMLElement>, _columnId: string) => {
      e.preventDefault();
      setDragOverColumnId(null);
    },
    [],
  );

  const onDragEnd = useCallback((_e: DragEvent<HTMLElement>) => {
    setDraggedCardId(null);
    setSourceColumnId(null);
    setDragOverColumnId(null);
    setDragOverIndex(0);
  }, []);

  return {
    draggedCardId,
    dragOverColumnId,
    dragOverIndex,
    sourceColumnId,
    handlers: {
      onDragStart,
      onDragOver,
      onDragEnter,
      onDragLeave,
      onDrop,
      onDragEnd,
    },
  };
}
