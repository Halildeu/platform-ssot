import { describe, bench } from 'vitest';

describe('useRecurrence perf', () => {
  bench('expands daily recurrence for 1 year', () => {
    const start = new Date(2025, 0, 1);
    const events = [];
    let current = new Date(start);
    const end = new Date(2025, 11, 31);
    while (current <= end) {
      events.push({ id: `e_${events.length}`, start: new Date(current), end: new Date(current.getTime() + 3600000) });
      current = new Date(current.getTime() + 86400000);
    }
    events.length; // 365 events
  });

  bench('conflict detection O(n log n) for 500 events', () => {
    const events = Array.from({ length: 500 }, (_, i) => ({
      start: new Date(2025, 0, 1, i % 24, 0),
      end: new Date(2025, 0, 1, (i % 24) + 1, 30),
    }));
    // Sort by start (sweep line first step)
    events.sort((a, b) => a.start.getTime() - b.start.getTime());
    // Sweep
    let conflicts = 0;
    for (let i = 0; i < events.length - 1; i++) {
      if (events[i].end > events[i + 1].start) conflicts++;
    }
  });
});
