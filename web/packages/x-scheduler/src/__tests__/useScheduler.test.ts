// @vitest-environment jsdom
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useScheduler, getVisibleRange } from '../useScheduler';

describe('useScheduler', () => {
  it('initializes with today\'s date', () => {
    const now = new Date();
    const { result } = renderHook(() => useScheduler());
    // Same calendar day
    expect(result.current.date.getFullYear()).toBe(now.getFullYear());
    expect(result.current.date.getMonth()).toBe(now.getMonth());
    expect(result.current.date.getDate()).toBe(now.getDate());
  });

  it('navigates to next day in day view', () => {
    const initialDate = new Date(2025, 5, 10); // June 10, 2025
    const { result } = renderHook(() =>
      useScheduler({ initialView: 'day', initialDate }),
    );

    act(() => {
      result.current.goNext();
    });

    expect(result.current.date.getDate()).toBe(11);
    expect(result.current.date.getMonth()).toBe(5);
  });

  it('navigates to previous day in day view', () => {
    const initialDate = new Date(2025, 5, 10);
    const { result } = renderHook(() =>
      useScheduler({ initialView: 'day', initialDate }),
    );

    act(() => {
      result.current.goPrev();
    });

    expect(result.current.date.getDate()).toBe(9);
    expect(result.current.date.getMonth()).toBe(5);
  });

  it('navigates to next week in week view', () => {
    const initialDate = new Date(2025, 5, 10); // Tuesday
    const { result } = renderHook(() =>
      useScheduler({ initialView: 'week', initialDate }),
    );

    act(() => {
      result.current.goNext();
    });

    expect(result.current.date.getDate()).toBe(17);
  });

  it('navigates to next month in month view', () => {
    const initialDate = new Date(2025, 5, 10); // June 10
    const { result } = renderHook(() =>
      useScheduler({ initialView: 'month', initialDate }),
    );

    act(() => {
      result.current.goNext();
    });

    expect(result.current.date.getMonth()).toBe(6); // July
  });

  it('getVisibleRange returns correct range for day view', () => {
    const date = new Date(2025, 5, 10, 14, 30); // June 10, 2:30 PM
    const range = getVisibleRange('day', date);

    expect(range.start.getFullYear()).toBe(2025);
    expect(range.start.getMonth()).toBe(5);
    expect(range.start.getDate()).toBe(10);
    expect(range.start.getHours()).toBe(0);
    expect(range.start.getMinutes()).toBe(0);

    expect(range.end.getDate()).toBe(10);
    expect(range.end.getHours()).toBe(23);
    expect(range.end.getMinutes()).toBe(59);
  });

  it('getVisibleRange returns correct range for week view', () => {
    // June 11, 2025 is a Wednesday, week starts Monday
    const date = new Date(2025, 5, 11);
    const range = getVisibleRange('week', date, 1);

    // Monday June 9
    expect(range.start.getDate()).toBe(9);
    expect(range.start.getMonth()).toBe(5);
    // Sunday June 15
    expect(range.end.getDate()).toBe(15);
    expect(range.end.getMonth()).toBe(5);
  });

  it('setView changes the current view', () => {
    const { result } = renderHook(() =>
      useScheduler({ initialView: 'week' }),
    );
    expect(result.current.view).toBe('week');

    act(() => {
      result.current.setView('month');
    });

    expect(result.current.view).toBe('month');
  });

  it('goToday resets to current date', () => {
    const pastDate = new Date(2020, 0, 1);
    const { result } = renderHook(() =>
      useScheduler({ initialDate: pastDate }),
    );

    expect(result.current.date.getFullYear()).toBe(2020);

    act(() => {
      result.current.goToday();
    });

    const now = new Date();
    expect(result.current.date.getFullYear()).toBe(now.getFullYear());
    expect(result.current.date.getMonth()).toBe(now.getMonth());
    expect(result.current.date.getDate()).toBe(now.getDate());
  });
});
