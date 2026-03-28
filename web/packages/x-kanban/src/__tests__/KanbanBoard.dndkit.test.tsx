import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { KanbanBoard } from '../KanbanBoard';
import { _resetDetection, _injectModules } from '../createDndKitEngine';
import type { KanbanColumn, KanbanCard } from '../types';

/* ------------------------------------------------------------------ */
/*  Fixtures                                                           */
/* ------------------------------------------------------------------ */

const columns: KanbanColumn[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'doing', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

const cards: KanbanCard[] = [
  { id: 'c1', columnId: 'todo', title: 'Write tests' },
  { id: 'c2', columnId: 'todo', title: 'Fix bug' },
  { id: 'c3', columnId: 'doing', title: 'Review PR' },
];

/* ------------------------------------------------------------------ */
/*  HTML5 fallback tests (no @dnd-kit mocked)                         */
/* ------------------------------------------------------------------ */

describe('KanbanBoard — HTML5 fallback (forceHtml5)', () => {
  beforeEach(() => {
    _resetDetection();
    _injectModules(null, null);
  });

  afterEach(() => {
    cleanup();
    _resetDetection();
  });

  it('renders all columns and cards without @dnd-kit', () => {
    render(
      <KanbanBoard columns={columns} cards={cards} forceHtml5 />,
    );

    expect(screen.getByText('To Do')).toBeDefined();
    expect(screen.getByText('In Progress')).toBeDefined();
    expect(screen.getByText('Done')).toBeDefined();
    expect(screen.getByText('Write tests')).toBeDefined();
    expect(screen.getByText('Fix bug')).toBeDefined();
    expect(screen.getByText('Review PR')).toBeDefined();
  });

  it('renders add column button when onColumnAdd is provided', () => {
    const onColumnAdd = vi.fn();
    render(
      <KanbanBoard
        columns={columns}
        cards={cards}
        onColumnAdd={onColumnAdd}
        forceHtml5
      />,
    );

    const addButton = screen.getByLabelText('Add new column');
    expect(addButton).toBeDefined();
  });

  it('applies aria-label to board region', () => {
    render(
      <KanbanBoard columns={columns} cards={cards} forceHtml5 />,
    );

    const board = screen.getByRole('region', { name: 'Kanban board' });
    expect(board).toBeDefined();
  });

  it('cards have draggable attribute in HTML5 mode', () => {
    render(
      <KanbanBoard columns={columns} cards={cards} forceHtml5 />,
    );

    const cardEl = screen.getByLabelText('Card: Write tests');
    expect(cardEl.getAttribute('draggable')).toBe('true');
  });
});

/* ------------------------------------------------------------------ */
/*  KanbanBoard with @dnd-kit mock                                     */
/*                                                                     */
/*  We mock @dnd-kit to verify that when available, the board          */
/*  renders DndContext-wrapped content with ARIA live region.          */
/* ------------------------------------------------------------------ */

// Lightweight mock components that render children
const MockDndContext: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div data-testid="dnd-context">{children}</div>
);
const MockDragOverlay: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div data-testid="drag-overlay">{children}</div>
);
const MockSortableContext: React.FC<{
  children?: React.ReactNode;
  items: string[];
  strategy?: unknown;
}> = ({ children }) => <div data-testid="sortable-context">{children}</div>;

const mockDndKitCore = {
  useSensors: vi.fn((..._args: unknown[]) => 'mock-sensors'),
  useSensor: vi.fn((sensor: unknown) => sensor),
  PointerSensor: 'PointerSensor',
  TouchSensor: 'TouchSensor',
  KeyboardSensor: 'KeyboardSensor',
  closestCorners: vi.fn(),
  DndContext: MockDndContext,
  DragOverlay: MockDragOverlay,
  useDroppable: vi.fn(() => ({ setNodeRef: vi.fn(), isOver: false })),
} as unknown as typeof import('@dnd-kit/core');

const mockDndKitSortable = {
  useSortable: vi.fn(() => ({
    attributes: { role: 'button', tabIndex: 0, 'aria-roledescription': 'sortable card' },
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  })),
  SortableContext: MockSortableContext,
  verticalListSortingStrategy: 'vertical',
  sortableKeyboardCoordinates: vi.fn(),
} as unknown as typeof import('@dnd-kit/sortable');

describe('KanbanBoard — @dnd-kit mode', () => {
  beforeEach(() => {
    _resetDetection();
    _injectModules(mockDndKitCore, mockDndKitSortable);
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    _resetDetection();
  });

  it('renders DndContext wrapper when @dnd-kit is available', () => {
    render(
      <KanbanBoard columns={columns} cards={cards} />,
    );

    expect(screen.getByTestId('dnd-context')).toBeDefined();
  });

  it('renders ARIA live region for drag announcements', () => {
    render(
      <KanbanBoard columns={columns} cards={cards} />,
    );

    const liveRegion = screen.getByRole('status');
    expect(liveRegion).toBeDefined();
    expect(liveRegion.getAttribute('aria-live')).toBe('assertive');
  });

  it('renders SortableContext for each column', () => {
    render(
      <KanbanBoard columns={columns} cards={cards} />,
    );

    const sortableContexts = screen.getAllByTestId('sortable-context');
    expect(sortableContexts.length).toBe(3);
  });

  it('renders all cards in dnd-kit mode', () => {
    render(
      <KanbanBoard columns={columns} cards={cards} />,
    );

    expect(screen.getByText('Write tests')).toBeDefined();
    expect(screen.getByText('Fix bug')).toBeDefined();
    expect(screen.getByText('Review PR')).toBeDefined();
  });

  it('cards have aria-roledescription="sortable card"', () => {
    render(
      <KanbanBoard columns={columns} cards={cards} />,
    );

    const card = screen.getByLabelText('Card: Write tests');
    expect(card.getAttribute('aria-roledescription')).toBe('sortable card');
  });

  it('falls back to HTML5 when forceHtml5 is set even with @dnd-kit available', () => {
    render(
      <KanbanBoard columns={columns} cards={cards} forceHtml5 />,
    );

    // Should NOT have DndContext wrapper
    expect(screen.queryByTestId('dnd-context')).toBeNull();
    // Cards should have HTML5 draggable attribute
    const card = screen.getByLabelText('Card: Write tests');
    expect(card.getAttribute('draggable')).toBe('true');
  });
});
