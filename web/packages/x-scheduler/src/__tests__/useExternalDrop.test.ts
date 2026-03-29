// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useExternalDrop } from '../useExternalDrop';

describe('useExternalDrop', () => {
  it('initial state has isExternalDragActive as false', () => {
    const onDrop = vi.fn();
    const { result } = renderHook(() => useExternalDrop({ onDrop }));

    expect(result.current.isExternalDragActive).toBe(false);
  });

  it('getExternalDragProps returns draggable props', () => {
    const onDrop = vi.fn();
    const { result } = renderHook(() => useExternalDrop({ onDrop }));

    const props = result.current.getExternalDragProps({ title: 'New Event' });
    expect(props.draggable).toBe(true);
    expect(typeof props.onDragStart).toBe('function');
    expect(typeof props.onDragEnd).toBe('function');
  });

  it('getCalendarDropProps returns drop handlers', () => {
    const onDrop = vi.fn();
    const { result } = renderHook(() => useExternalDrop({ onDrop }));

    const slotDate = new Date('2025-06-15T10:00:00');
    const props = result.current.getCalendarDropProps(slotDate);
    expect(typeof props.onDragOver).toBe('function');
    expect(typeof props.onDragEnter).toBe('function');
    expect(typeof props.onDrop).toBe('function');
  });

  it('dragStart sets isExternalDragActive to true', () => {
    const onDrop = vi.fn();
    const { result } = renderHook(() => useExternalDrop({ onDrop }));

    const props = result.current.getExternalDragProps({ title: 'New Event' });

    act(() => {
      props.onDragStart?.({
        dataTransfer: {
          effectAllowed: '',
          setData: vi.fn(),
        },
      } as unknown as React.DragEvent<HTMLElement>);
    });

    expect(result.current.isExternalDragActive).toBe(true);
  });

  it('dragEnd sets isExternalDragActive to false', () => {
    const onDrop = vi.fn();
    const { result } = renderHook(() => useExternalDrop({ onDrop }));

    const props = result.current.getExternalDragProps({ title: 'New Event' });

    // Start
    act(() => {
      props.onDragStart?.({
        dataTransfer: { effectAllowed: '', setData: vi.fn() },
      } as unknown as React.DragEvent<HTMLElement>);
    });

    expect(result.current.isExternalDragActive).toBe(true);

    // End
    act(() => {
      props.onDragEnd?.({} as React.DragEvent<HTMLElement>);
    });

    expect(result.current.isExternalDragActive).toBe(false);
  });

  it('drop on calendar calls onDrop with event data and slot date', () => {
    const onDrop = vi.fn();
    const { result } = renderHook(() => useExternalDrop({ onDrop }));

    const eventData = { title: 'New Event', color: 'var(--state-danger-text)' };
    const slotDate = new Date('2025-06-15T14:00:00');

    const calendarProps = result.current.getCalendarDropProps(slotDate);

    act(() => {
      calendarProps.onDrop?.({
        preventDefault: vi.fn(),
        dataTransfer: {
          getData: vi.fn().mockReturnValue(JSON.stringify(eventData)),
        },
      } as unknown as React.DragEvent<HTMLElement>);
    });

    expect(onDrop).toHaveBeenCalledTimes(1);
    expect(onDrop).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'New Event', color: 'var(--state-danger-text)' }),
      slotDate,
    );
  });

  it('drop with malformed data does not throw or call onDrop', () => {
    const onDrop = vi.fn();
    const { result } = renderHook(() => useExternalDrop({ onDrop }));

    const slotDate = new Date('2025-06-15T14:00:00');
    const calendarProps = result.current.getCalendarDropProps(slotDate);

    // Empty data — getData returns ''
    act(() => {
      calendarProps.onDrop?.({
        preventDefault: vi.fn(),
        dataTransfer: {
          getData: vi.fn().mockReturnValue(''),
        },
      } as unknown as React.DragEvent<HTMLElement>);
    });

    expect(onDrop).not.toHaveBeenCalled();
  });

  it('drop with invalid JSON does not throw', () => {
    const onDrop = vi.fn();
    const { result } = renderHook(() => useExternalDrop({ onDrop }));

    const slotDate = new Date('2025-06-15T14:00:00');
    const calendarProps = result.current.getCalendarDropProps(slotDate);

    expect(() => {
      act(() => {
        calendarProps.onDrop?.({
          preventDefault: vi.fn(),
          dataTransfer: {
            getData: vi.fn().mockReturnValue('not-json{{{'),
          },
        } as unknown as React.DragEvent<HTMLElement>);
      });
    }).not.toThrow();

    expect(onDrop).not.toHaveBeenCalled();
  });

  it('dragOver only accepts external MIME type', () => {
    const onDrop = vi.fn();
    const { result } = renderHook(() => useExternalDrop({ onDrop }));

    const slotDate = new Date('2025-06-15T14:00:00');
    const calendarProps = result.current.getCalendarDropProps(slotDate);

    // Without the external MIME type, preventDefault should NOT be called
    const preventDefaultFn = vi.fn();
    act(() => {
      calendarProps.onDragOver?.({
        preventDefault: preventDefaultFn,
        dataTransfer: {
          types: ['text/plain'],
          dropEffect: '',
        },
      } as unknown as React.DragEvent<HTMLElement>);
    });

    expect(preventDefaultFn).not.toHaveBeenCalled();

    // With the external MIME type, preventDefault SHOULD be called
    const preventDefaultFn2 = vi.fn();
    act(() => {
      calendarProps.onDragOver?.({
        preventDefault: preventDefaultFn2,
        dataTransfer: {
          types: ['application/x-scheduler-external'],
          dropEffect: '',
        },
      } as unknown as React.DragEvent<HTMLElement>);
    });

    expect(preventDefaultFn2).toHaveBeenCalled();
  });
});
