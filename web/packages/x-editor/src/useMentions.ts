import { useState, useCallback, useRef } from 'react';
import type { MentionItem } from './types';

export interface UseMentionsReturn {
  isOpen: boolean;
  position: { top: number; left: number };
  items: MentionItem[];
  selectedIndex: number;
  loading: boolean;
  open: (position: { top: number; left: number }) => void;
  close: () => void;
  search: (query: string) => void;
  selectNext: () => void;
  selectPrevious: () => void;
  getSelected: () => MentionItem | null;
}

export function useMentions(
  fetchItems: (query: string) => Promise<MentionItem[]> | MentionItem[],
): UseMentionsReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [items, setItems] = useState<MentionItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef(0);

  const open = useCallback((pos: { top: number; left: number }) => {
    setPosition(pos);
    setIsOpen(true);
    setSelectedIndex(0);
    setItems([]);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setItems([]);
    setSelectedIndex(0);
    setLoading(false);
    abortRef.current += 1;
  }, []);

  const search = useCallback(
    (query: string) => {
      const id = ++abortRef.current;
      setLoading(true);

      const result = fetchItems(query);

      if (result instanceof Promise) {
        result
          .then((data) => {
            if (abortRef.current !== id) return;
            setItems(data);
            setSelectedIndex(0);
          })
          .catch(() => {
            if (abortRef.current !== id) return;
            setItems([]);
          })
          .finally(() => {
            if (abortRef.current !== id) return;
            setLoading(false);
          });
      } else {
        setItems(result);
        setSelectedIndex(0);
        setLoading(false);
      }
    },
    [fetchItems],
  );

  const selectNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % (items.length || 1));
  }, [items.length]);

  const selectPrevious = useCallback(() => {
    setSelectedIndex((prev) =>
      prev <= 0 ? Math.max(items.length - 1, 0) : prev - 1,
    );
  }, [items.length]);

  const getSelected = useCallback((): MentionItem | null => {
    return items[selectedIndex] ?? null;
  }, [items, selectedIndex]);

  return {
    isOpen,
    position,
    items,
    selectedIndex,
    loading,
    open,
    close,
    search,
    selectNext,
    selectPrevious,
    getSelected,
  };
}
