import { describe, it, expect } from 'vitest';
import { decrement } from './mfe-shell';

describe('mfe-shell mock', () => {
  it('decrement returns an action with type counter/decrement', () => {
    const action = decrement();
    expect(action).toEqual({ type: 'counter/decrement' });
  });

  it('decrement returns a new object each time', () => {
    const action1 = decrement();
    const action2 = decrement();
    expect(action1).not.toBe(action2);
    expect(action1).toEqual(action2);
  });

  it('decrement action has no payload', () => {
    const action = decrement();
    expect(action).not.toHaveProperty('payload');
  });
});
