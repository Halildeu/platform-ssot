// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
// Regenerate with: node scripts/ci/generate-contract-tests.mjs --write
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { AnimatePresence } from '../AnimatePresence';
import type { AnimatePresenceProps } from '../AnimatePresence';

describe('AnimatePresence — contract', () => {

  it('renders without crash', () => {
    const { container } = render(<AnimatePresence><div>test</div></AnimatePresence>);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('has displayName', () => {
    expect(AnimatePresence.displayName).toBeTruthy();
  });

  it('exports expected types', () => {
    // Type-level check — if this compiles, types are exported correctly
    const _animatepresenceprops: AnimatePresenceProps | undefined = undefined; void _animatepresenceprops;
    expect(true).toBe(true);
  });
});
