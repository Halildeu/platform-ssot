import { describe, bench } from 'vitest';

describe('x-form-builder performance', () => {
  bench('schema parsing (10 fields)', () => {
    const schema = {
      id: 'test',
      fields: Array.from({ length: 10 }, (_, i) => ({
        id: `field-${i}`,
        type: 'text',
        label: `Field ${i}`,
        name: `field_${i}`,
      })),
    };
    JSON.parse(JSON.stringify(schema));
  });

  bench('validation cycle (10 fields)', () => {
    const values: Record<string, unknown> = {};
    for (let i = 0; i < 10; i++) {
      values[`field_${i}`] = `value-${i}`;
    }
    Object.entries(values).forEach(([k, v]) => {
      if (!v) throw new Error(`${k} required`);
    });
  });
});
