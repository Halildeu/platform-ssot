import { describe, bench } from 'vitest';

describe('useKanbanFilter perf', () => {
  bench('filters 1000 cards by 3 criteria', () => {
    const cards = Array.from({ length: 1000 }, (_, i) => ({
      id: `card_${i}`,
      title: `Task ${i}`,
      priority: ['low', 'medium', 'high'][i % 3],
      assignee: `user_${i % 10}`,
      tags: [`tag_${i % 5}`],
    }));
    const filtered = cards.filter(c =>
      c.priority === 'high' &&
      c.assignee === 'user_0' &&
      c.tags.includes('tag_1')
    );
    filtered.length;
  });
});

describe('useWipPolicy perf', () => {
  bench('checks WIP for 20 columns x 500 cards', () => {
    const columns = Array.from({ length: 20 }, (_, i) => ({
      id: `col_${i}`,
      wipLimit: 25,
    }));
    const cards = Array.from({ length: 500 }, (_, i) => ({
      columnId: `col_${i % 20}`,
    }));
    const violations = columns.filter(col => {
      const count = cards.filter(c => c.columnId === col.id).length;
      return count > col.wipLimit;
    });
    violations.length;
  });
});
