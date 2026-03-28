import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import {
  hasDndKit,
  getDndKitCore,
  getDndKitSortable,
  useSortableCard,
  useDroppableColumn,
  useDndKitKanban,
  _resetDetection,
  _injectModules,
} from '../createDndKitEngine';

/* ------------------------------------------------------------------ */
/*  Mock @dnd-kit modules                                              */
/*                                                                     */
/*  The tests exercise the engine's logic and graceful degradation     */
/*  without needing real @dnd-kit packages installed.                  */
/* ------------------------------------------------------------------ */

const mockUseSensors = vi.fn((..._args: unknown[]) => 'mock-sensors');
const mockUseSensor = vi.fn((sensor: unknown, _opts?: unknown) => sensor);
const mockUseDroppable = vi.fn(() => ({
  setNodeRef: vi.fn(),
  isOver: false,
}));

const mockUseSortable = vi.fn(() => ({
  attributes: { role: 'button' },
  listeners: { onPointerDown: vi.fn() },
  setNodeRef: vi.fn(),
  transform: null,
  transition: null,
  isDragging: false,
}));

const mockDndKitCore = {
  useSensors: mockUseSensors,
  useSensor: mockUseSensor,
  PointerSensor: 'PointerSensor',
  TouchSensor: 'TouchSensor',
  KeyboardSensor: 'KeyboardSensor',
  closestCorners: 'closestCorners',
  DndContext: 'DndContext',
  DragOverlay: 'DragOverlay',
  useDroppable: mockUseDroppable,
} as unknown as typeof import('@dnd-kit/core');

const mockDndKitSortable = {
  useSortable: mockUseSortable,
  SortableContext: 'SortableContext',
  verticalListSortingStrategy: 'vertical',
  sortableKeyboardCoordinates: vi.fn(),
} as unknown as typeof import('@dnd-kit/sortable');

describe('createDndKitEngine', () => {
  beforeEach(() => {
    _resetDetection();
  });

  afterEach(() => {
    _resetDetection();
    vi.restoreAllMocks();
  });

  describe('hasDndKit() — feature detection', () => {
    it('returns false when @dnd-kit is not installed', () => {
      _injectModules(null, null);
      expect(hasDndKit()).toBe(false);
    });

    it('returns true when @dnd-kit is installed', () => {
      _injectModules(mockDndKitCore, mockDndKitSortable);
      expect(hasDndKit()).toBe(true);
    });
  });

  describe('getDndKitCore / getDndKitSortable', () => {
    it('returns null when @dnd-kit is not installed', () => {
      _injectModules(null, null);
      expect(getDndKitCore()).toBeNull();
      expect(getDndKitSortable()).toBeNull();
    });

    it('returns modules when @dnd-kit is installed', () => {
      _injectModules(mockDndKitCore, mockDndKitSortable);
      expect(getDndKitCore()).not.toBeNull();
      expect(getDndKitSortable()).not.toBeNull();
    });
  });

  describe('useSortableCard — fallback behavior', () => {
    it('returns no-op values when @dnd-kit is not available', () => {
      _injectModules(null, null);
      const result = useSortableCard('card-1');
      expect(result.isDragging).toBe(false);
      expect(result.style).toEqual({});
      expect(typeof result.ref).toBe('function');
      // ref should be callable without error
      result.ref(null);
    });
  });

  describe('useDroppableColumn — fallback behavior', () => {
    it('returns empty sortable items when @dnd-kit is not available', () => {
      _injectModules(null, null);
      const result = useDroppableColumn('col-1', []);
      expect(result.sortableItems).toEqual([]);
    });

    it('returns card ids as sortable items', () => {
      _injectModules(null, null);
      const cards = [
        { id: 'c1', columnId: 'col-1', title: 'Card 1' },
        { id: 'c2', columnId: 'col-1', title: 'Card 2' },
      ];
      const result = useDroppableColumn('col-1', cards);
      expect(result.sortableItems).toEqual(['c1', 'c2']);
    });
  });

  describe('useDndKitKanban — fallback behavior', () => {
    it('returns null contextProps when @dnd-kit is not available', () => {
      _injectModules(null, null);
      const { result } = renderHook(() =>
        useDndKitKanban({
          columns: [{ id: 'todo', title: 'To Do' }],
          cards: [{ id: 'c1', columnId: 'todo', title: 'Card 1' }],
        }),
      );
      expect(result.current.contextProps).toBeNull();
      expect(result.current.activeCard).toBeNull();
      expect(result.current.isDragging).toBe(false);
      expect(result.current.DragOverlayComponent).toBeNull();
      expect(result.current.announcement).toBe('');
    });
  });
});
