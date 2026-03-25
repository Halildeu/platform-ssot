import { useCallback, useRef, useState } from "react";

/**
 * Lightweight drag-drop reorder for favorites list.
 * Uses native HTML5 drag API — no external dependency.
 */
export function useDragDrop<T>(
  items: T[],
  onReorder: (from: number, to: number) => void,
) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const dragNodeRef = useRef<HTMLElement | null>(null);

  const handleDragStart = useCallback(
    (index: number) => (e: React.DragEvent) => {
      setDragIndex(index);
      dragNodeRef.current = e.currentTarget as HTMLElement;
      e.dataTransfer.effectAllowed = "move";
      // Slight delay for visual feedback
      requestAnimationFrame(() => {
        if (dragNodeRef.current) {
          dragNodeRef.current.style.opacity = "0.4";
        }
      });
    },
    [],
  );

  const handleDragOver = useCallback(
    (index: number) => (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      setOverIndex(index);
    },
    [],
  );

  const handleDragEnd = useCallback(() => {
    if (
      dragIndex !== null &&
      overIndex !== null &&
      dragIndex !== overIndex
    ) {
      onReorder(dragIndex, overIndex);
    }
    if (dragNodeRef.current) {
      dragNodeRef.current.style.opacity = "1";
    }
    setDragIndex(null);
    setOverIndex(null);
    dragNodeRef.current = null;
  }, [dragIndex, overIndex, onReorder]);

  const getDragProps = useCallback(
    (index: number) => ({
      draggable: true,
      onDragStart: handleDragStart(index),
      onDragOver: handleDragOver(index),
      onDragEnd: handleDragEnd,
      className:
        overIndex === index && dragIndex !== index
          ? "border-t-2 border-action-primary"
          : "",
    }),
    [handleDragStart, handleDragOver, handleDragEnd, overIndex, dragIndex],
  );

  return { getDragProps, isDragging: dragIndex !== null };
}
