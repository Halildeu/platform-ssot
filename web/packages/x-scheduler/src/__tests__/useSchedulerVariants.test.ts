// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSchedulerVariants, type ViewConfig } from '../useSchedulerVariants';

const STORAGE_KEY = 'x-scheduler-variants';

const sampleConfig: ViewConfig = {
  view: 'week',
  slotDuration: 30,
  dayStartHour: 8,
  dayEndHour: 18,
  weekStartsOn: 1,
  showWeekends: false,
  showAllDaySlot: true,
};

describe('useSchedulerVariants', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with empty variants', () => {
    const { result } = renderHook(() => useSchedulerVariants('team-cal'));
    expect(result.current.variants).toHaveLength(0);
    expect(result.current.activeVariant).toBeNull();
  });

  it('saveVariant persists and activates', () => {
    const { result } = renderHook(() => useSchedulerVariants('team-cal'));

    act(() => {
      result.current.saveVariant('Work Week', sampleConfig);
    });

    expect(result.current.variants).toHaveLength(1);
    expect(result.current.activeVariant?.name).toBe('Work Week');
    expect(result.current.activeVariant?.config).toEqual(sampleConfig);

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored['team-cal']).toHaveLength(1);
  });

  it('loadVariant activates an existing variant', () => {
    const { result } = renderHook(() => useSchedulerVariants('cal'));

    let v1Id: string;
    act(() => {
      v1Id = result.current.saveVariant('V1', sampleConfig).id;
    });
    act(() => {
      result.current.saveVariant('V2', { ...sampleConfig, view: 'month' });
    });

    act(() => result.current.loadVariant(v1Id!));
    expect(result.current.activeVariant?.name).toBe('V1');
  });

  it('deleteVariant removes and clears active', () => {
    const { result } = renderHook(() => useSchedulerVariants('cal'));

    let id: string;
    act(() => {
      id = result.current.saveVariant('Temp', sampleConfig).id;
    });
    act(() => result.current.deleteVariant(id!));

    expect(result.current.variants).toHaveLength(0);
    expect(result.current.activeVariant).toBeNull();
  });

  it('setDefault marks one variant as default', () => {
    const { result } = renderHook(() => useSchedulerVariants('cal'));

    let id: string;
    act(() => {
      id = result.current.saveVariant('Default', sampleConfig).id;
    });
    act(() => result.current.setDefault(id!));

    expect(result.current.variants[0].isDefault).toBe(true);
  });

  it('updateVariant patches config', () => {
    const { result } = renderHook(() => useSchedulerVariants('cal'));

    let id: string;
    act(() => {
      id = result.current.saveVariant('Updatable', sampleConfig).id;
    });
    act(() =>
      result.current.updateVariant(id!, { showWeekends: true, dayStartHour: 6 }),
    );

    const updated = result.current.variants.find((v) => v.id === id!);
    expect(updated?.config.showWeekends).toBe(true);
    expect(updated?.config.dayStartHour).toBe(6);
    expect(updated?.config.view).toBe('week'); // unchanged
  });

  it('loads default variant on init from localStorage', () => {
    const variant = {
      id: 'pre-1',
      name: 'Saved',
      schedulerId: 'persisted',
      config: sampleConfig,
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ persisted: [variant] }));

    const { result } = renderHook(() => useSchedulerVariants('persisted'));
    expect(result.current.activeVariant?.id).toBe('pre-1');
  });
});
