// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEventDrag } from '../useEventDrag';
import type { SchedulerEvent } from '../types';

const makeEvent = (overrides: Partial<SchedulerEvent> = {}): SchedulerEvent => ({
  id: 'evt-1',
  title: 'Meeting',
  start: new Date('2025-06-15T10:00:00'),
  end: new Date('2025-06-15T11:00:00'),
  editable: true,
  ...overrides,
});

describe('useEventDrag', () => {
  it('initial state is idle', () => {
    const { result } = renderHook(() =>
      useEventDrag({ events: [makeEvent()] }),
    );

    expect(result.current.state.isDragging).toBe(false);
    expect(result.current.state.draggedEvent).toBeNull();
    expect(result.current.state.dragPreview).toBeNull();
    expect(result.current.state.isResizing).toBe(false);
    expect(result.current.state.resizeEdge).toBeNull();
  });

  it('getEventDragProps returns draggable props for editable events', () => {
    const { result } = renderHook(() =>
      useEventDrag({ events: [makeEvent()] }),
    );

    const props = result.current.getEventDragProps('evt-1');
    expect(props.draggable).toBe(true);
    expect(typeof props.onDragStart).toBe('function');
    expect(typeof props.onDragEnd).toBe('function');
  });

  it('getEventDragProps returns empty object for non-editable events', () => {
    const { result } = renderHook(() =>
      useEventDrag({ events: [makeEvent({ editable: false })] }),
    );

    const props = result.current.getEventDragProps('evt-1');
    expect(props.draggable).toBeUndefined();
  });

  it('getEventDragProps returns empty object for unknown event IDs', () => {
    const { result } = renderHook(() =>
      useEventDrag({ events: [makeEvent()] }),
    );

    const props = result.current.getEventDragProps('nonexistent');
    expect(props.draggable).toBeUndefined();
  });

  it('getSlotDropProps returns drag-over and drop handlers', () => {
    const { result } = renderHook(() =>
      useEventDrag({ events: [makeEvent()] }),
    );

    const slotDate = new Date('2025-06-15T14:00:00');
    const props = result.current.getSlotDropProps(slotDate);
    expect(typeof props.onDragOver).toBe('function');
    expect(typeof props.onDrop).toBe('function');
  });

  it('getResizeHandleProps returns mousedown handler for editable events', () => {
    const { result } = renderHook(() =>
      useEventDrag({ events: [makeEvent()] }),
    );

    const topProps = result.current.getResizeHandleProps('evt-1', 'top');
    expect(typeof topProps.onMouseDown).toBe('function');
    expect(topProps.style).toBeDefined();

    const bottomProps = result.current.getResizeHandleProps('evt-1', 'bottom');
    expect(typeof bottomProps.onMouseDown).toBe('function');
  });

  it('getResizeHandleProps returns empty for non-editable events', () => {
    const { result } = renderHook(() =>
      useEventDrag({ events: [makeEvent({ editable: false })] }),
    );

    const props = result.current.getResizeHandleProps('evt-1', 'top');
    expect(props.onMouseDown).toBeUndefined();
  });

  it('onDragStart sets isDragging state', () => {
    const { result } = renderHook(() =>
      useEventDrag({ events: [makeEvent()] }),
    );

    const props = result.current.getEventDragProps('evt-1');

    // Simulate dragStart
    const mockDataTransfer = {
      effectAllowed: '',
      setData: vi.fn(),
    };

    act(() => {
      props.onDragStart?.({
        dataTransfer: mockDataTransfer,
      } as unknown as React.DragEvent<HTMLElement>);
    });

    expect(result.current.state.isDragging).toBe(true);
    expect(result.current.state.draggedEvent?.id).toBe('evt-1');
  });

  it('onDragEnd resets state', () => {
    const { result } = renderHook(() =>
      useEventDrag({ events: [makeEvent()] }),
    );

    const props = result.current.getEventDragProps('evt-1');

    // Start drag
    act(() => {
      props.onDragStart?.({
        dataTransfer: { effectAllowed: '', setData: vi.fn() },
      } as unknown as React.DragEvent<HTMLElement>);
    });

    expect(result.current.state.isDragging).toBe(true);

    // End drag
    act(() => {
      props.onDragEnd?.({} as React.DragEvent<HTMLElement>);
    });

    expect(result.current.state.isDragging).toBe(false);
    expect(result.current.state.draggedEvent).toBeNull();
  });

  it('drop calls onEventMove with snapped times', () => {
    const onEventMove = vi.fn();
    const { result } = renderHook(() =>
      useEventDrag({ events: [makeEvent()], onEventMove, snapMinutes: 15 }),
    );

    const slotDate = new Date('2025-06-15T14:00:00');
    const slotProps = result.current.getSlotDropProps(slotDate);

    const mockEvent = {
      preventDefault: vi.fn(),
      dataTransfer: {
        getData: vi.fn().mockReturnValue('evt-1'),
        dropEffect: '',
      },
    };

    act(() => {
      slotProps.onDrop?.(mockEvent as unknown as React.DragEvent<HTMLElement>);
    });

    expect(onEventMove).toHaveBeenCalledTimes(1);
    expect(onEventMove).toHaveBeenCalledWith(
      'evt-1',
      expect.any(Date),
      expect.any(Date),
    );

    // Duration should be preserved (1 hour)
    const [, newStart, newEnd] = onEventMove.mock.calls[0];
    expect(newEnd.getTime() - newStart.getTime()).toBe(3_600_000);
  });

  it('respects custom snapMinutes', () => {
    const onEventMove = vi.fn();
    const { result } = renderHook(() =>
      useEventDrag({ events: [makeEvent()], onEventMove, snapMinutes: 30 }),
    );

    // Slot at 14:07 should snap to 14:00 with 30-minute snapping
    const slotDate = new Date('2025-06-15T14:07:00');
    const slotProps = result.current.getSlotDropProps(slotDate);

    act(() => {
      slotProps.onDrop?.({
        preventDefault: vi.fn(),
        dataTransfer: { getData: vi.fn().mockReturnValue('evt-1') },
      } as unknown as React.DragEvent<HTMLElement>);
    });

    expect(onEventMove).toHaveBeenCalledTimes(1);
    const [, newStart] = onEventMove.mock.calls[0];
    expect(newStart.getMinutes()).toBe(0); // Snapped to :00
  });
});
