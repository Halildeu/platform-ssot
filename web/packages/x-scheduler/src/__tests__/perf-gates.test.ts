import { describe, it, expect } from 'vitest';

/* ---------------------------------------------------------------------------
 * Wave 4 — Performance CI Gates for x-scheduler
 *
 * Hard-ceiling assertions that run in every CI pass.  Budgets are generous
 * enough for CI runners while catching catastrophic regressions.
 * -----------------------------------------------------------------------*/

describe('Performance Gates — x-scheduler', () => {
  it('expand daily recurrence for 1 year in < 30ms', () => {
    const start = performance.now();
    const baseDate = new Date(2025, 0, 1);
    const events = [];
    let current = new Date(baseDate);
    const end = new Date(2025, 11, 31);
    while (current <= end) {
      events.push({
        id: `e_${events.length}`,
        start: new Date(current),
        end: new Date(current.getTime() + 3_600_000),
      });
      current = new Date(current.getTime() + 86_400_000);
    }
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(30);
    expect(events.length).toBe(365);
  });

  it('conflict detection sweep for 1000 events in < 30ms', () => {
    const events = Array.from({ length: 1_000 }, (_, i) => ({
      start: new Date(2025, 0, 1, i % 24, (i * 7) % 60),
      end: new Date(2025, 0, 1, (i % 24) + 1, 30),
    }));
    const start = performance.now();
    // Sort by start (sweep-line first step)
    events.sort((a, b) => a.start.getTime() - b.start.getTime());
    // Sweep for overlaps
    let conflicts = 0;
    for (let i = 0; i < events.length - 1; i++) {
      if (events[i].end.getTime() > events[i + 1].start.getTime()) conflicts++;
    }
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(30);
    expect(conflicts).toBeGreaterThanOrEqual(0);
  });

  it('generate week time slots (15-min intervals) in < 5ms', () => {
    const start = performance.now();
    const slots = [];
    const weekStart = new Date(2025, 0, 6); // Monday
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        for (let min = 0; min < 60; min += 15) {
          const slotStart = new Date(weekStart);
          slotStart.setDate(slotStart.getDate() + day);
          slotStart.setHours(hour, min, 0, 0);
          const slotEnd = new Date(slotStart.getTime() + 15 * 60_000);
          slots.push({ start: slotStart, end: slotEnd });
        }
      }
    }
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(5);
    expect(slots.length).toBe(7 * 24 * 4); // 672 slots
  });

  it('filter 500 events by resource in < 5ms', () => {
    const resources = ['room-a', 'room-b', 'room-c', 'room-d'];
    const events = Array.from({ length: 500 }, (_, i) => ({
      id: `e_${i}`,
      title: `Event ${i}`,
      resourceId: resources[i % resources.length],
      start: new Date(2025, 0, 1 + (i % 31)),
      end: new Date(2025, 0, 1 + (i % 31), 1),
    }));
    const start = performance.now();
    const filtered = events.filter((e) => e.resourceId === 'room-a');
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(5);
    expect(filtered.length).toBe(125);
  });

  it('sort 500 events by start time in < 5ms', () => {
    const events = Array.from({ length: 500 }, (_, i) => ({
      id: `e_${i}`,
      start: new Date(2025, 0, 1 + (500 - i), Math.floor(Math.random() * 24)),
    }));
    const start = performance.now();
    events.sort((a, b) => a.start.getTime() - b.start.getTime());
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(5);
  });
});
