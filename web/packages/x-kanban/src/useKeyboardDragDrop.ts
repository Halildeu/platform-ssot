import { useState, useCallback, useEffect, useRef } from 'react';

/* ------------------------------------------------------------------ */
/*  Keyboard-driven drag-drop for accessibility                        */
/*                                                                     */
/*  Supports:                                                          */
/*  - Arrow keys to select card                                        */
/*  - Space to grab/release                                            */
/*  - Arrow keys to move while grabbed                                 */
/*  - Escape to cancel                                                 */
/*  - Tab to navigate between columns                                  */
/* ------------------------------------------------------------------ */

export interface KeyboardDragDropOptions {
  onMove: (cardId: string, fromColumn: string, toColumn: string, position: number) => void;
  columns: string[];
}

export interface KeyboardDragDropState {
  /** Currently focused card (keyboard cursor) */
  selectedCardId: string | null;
  /** Card currently being moved (after Space press) */
  grabbedCardId: string | null;
  /** Target column while card is grabbed */
  targetColumn: string | null;
  /** Target position within the column */
  targetPosition: number;
  /** ARIA live announcement text */
  announcement: string;
}

export interface UseKeyboardDragDropReturn extends KeyboardDragDropState {
  /** Attach to the board container element */
  boardKeyDownHandler: (e: React.KeyboardEvent) => void;
  /** Select a card programmatically (e.g., on focus) */
  selectCard: (cardId: string, columnId: string) => void;
  /** Clear selection */
  clearSelection: () => void;
  /** Whether a card is currently grabbed */
  isGrabbing: boolean;
}

export function useKeyboardDragDrop(
  options: KeyboardDragDropOptions,
): UseKeyboardDragDropReturn {
  const { onMove, columns } = options;

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [grabbedCardId, setGrabbedCardId] = useState<string | null>(null);
  const [targetColumn, setTargetColumn] = useState<string | null>(null);
  const [targetPosition, setTargetPosition] = useState(0);
  const [announcement, setAnnouncement] = useState('');

  const grabSourceColumn = useRef<string | null>(null);

  const selectCard = useCallback((cardId: string, columnId: string) => {
    setSelectedCardId(cardId);
    setSelectedColumn(columnId);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedCardId(null);
    setSelectedColumn(null);
    setGrabbedCardId(null);
    setTargetColumn(null);
    setTargetPosition(0);
    grabSourceColumn.current = null;
  }, []);

  const grab = useCallback(() => {
    if (!selectedCardId || !selectedColumn) return;
    setGrabbedCardId(selectedCardId);
    setTargetColumn(selectedColumn);
    grabSourceColumn.current = selectedColumn;
    setTargetPosition(0);
    setAnnouncement(`Grabbed card. Use arrow keys to move, Space to drop, Escape to cancel.`);
  }, [selectedCardId, selectedColumn]);

  const drop = useCallback(() => {
    if (!grabbedCardId || !targetColumn || !grabSourceColumn.current) return;
    onMove(grabbedCardId, grabSourceColumn.current, targetColumn, targetPosition);
    setAnnouncement(`Dropped card in column ${targetColumn} at position ${targetPosition + 1}.`);
    setGrabbedCardId(null);
    setTargetColumn(null);
    setTargetPosition(0);
    grabSourceColumn.current = null;
  }, [grabbedCardId, targetColumn, targetPosition, onMove]);

  const cancel = useCallback(() => {
    if (grabbedCardId) {
      setAnnouncement('Move cancelled.');
    }
    setGrabbedCardId(null);
    setTargetColumn(null);
    setTargetPosition(0);
    grabSourceColumn.current = null;
  }, [grabbedCardId]);

  const boardKeyDownHandler = useCallback(
    (e: React.KeyboardEvent) => {
      if (!selectedCardId) return;

      switch (e.key) {
        case ' ':
        case 'Space': {
          e.preventDefault();
          if (grabbedCardId) {
            drop();
          } else {
            grab();
          }
          break;
        }

        case 'Escape': {
          e.preventDefault();
          cancel();
          break;
        }

        case 'ArrowLeft': {
          e.preventDefault();
          if (grabbedCardId && targetColumn) {
            const idx = columns.indexOf(targetColumn);
            if (idx > 0) {
              const newCol = columns[idx - 1];
              setTargetColumn(newCol);
              setTargetPosition(0);
              setAnnouncement(`Over column ${newCol}.`);
            }
          }
          break;
        }

        case 'ArrowRight': {
          e.preventDefault();
          if (grabbedCardId && targetColumn) {
            const idx = columns.indexOf(targetColumn);
            if (idx < columns.length - 1) {
              const newCol = columns[idx + 1];
              setTargetColumn(newCol);
              setTargetPosition(0);
              setAnnouncement(`Over column ${newCol}.`);
            }
          }
          break;
        }

        case 'ArrowUp': {
          e.preventDefault();
          if (grabbedCardId) {
            setTargetPosition((p) => Math.max(0, p - 1));
            setAnnouncement(`Position ${Math.max(0, targetPosition - 1) + 1}.`);
          }
          break;
        }

        case 'ArrowDown': {
          e.preventDefault();
          if (grabbedCardId) {
            setTargetPosition((p) => p + 1);
            setAnnouncement(`Position ${targetPosition + 2}.`);
          }
          break;
        }

        default:
          break;
      }
    },
    [selectedCardId, grabbedCardId, targetColumn, targetPosition, columns, grab, drop, cancel],
  );

  // Clear announcement after a short delay so it can be re-announced
  useEffect(() => {
    if (!announcement) return;
    const timer = setTimeout(() => setAnnouncement(''), 1000);
    return () => clearTimeout(timer);
  }, [announcement]);

  return {
    selectedCardId,
    grabbedCardId,
    targetColumn,
    targetPosition,
    announcement,
    boardKeyDownHandler,
    selectCard,
    clearSelection,
    isGrabbing: grabbedCardId !== null,
  };
}
