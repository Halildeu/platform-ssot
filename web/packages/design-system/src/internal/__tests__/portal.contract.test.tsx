// @vitest-environment jsdom
// Auto-generated contract test
import { describe, it, expect } from 'vitest';
import * as mod from '../overlay-engine/portal';

describe('portal — contract', () => {
  it('exports a module', () => {
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });

  it('has default or named export', () => {
    const keys = Object.keys(mod);
    expect(keys.length).toBeGreaterThan(0);
  });

  it('exports are functions or objects', () => {
    for (const [key, value] of Object.entries(mod)) {
      expect(['function', 'object'].includes(typeof value)).toBe(true);
    }
  });
});
