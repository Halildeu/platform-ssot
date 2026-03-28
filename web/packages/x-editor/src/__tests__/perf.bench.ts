import { describe, bench } from 'vitest';

describe('x-editor performance', () => {
  bench('editor state creation', () => {
    const state = { content: '', format: 'html', selection: null };
    Object.freeze(state);
  });

  bench('toolbar action dispatch', () => {
    const actions = ['bold', 'italic', 'underline', 'heading', 'list'];
    actions.forEach(a => ({ type: 'FORMAT', payload: a }));
  });
});
