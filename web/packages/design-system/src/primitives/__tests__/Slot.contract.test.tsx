// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
// Regenerate with: node scripts/ci/generate-contract-tests.mjs --write
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Slot } from '../_shared/Slot';
import type { SlotProps } from '../_shared/Slot';

describe('Slot — contract', () => {

  it('renders without crash', () => {
    const { container } = render(
      <Slot><span>child</span></Slot>,
    );
    expect(container.firstElementChild).toBeTruthy();
  });

  it('has displayName', () => {
    expect(Slot.displayName).toBeTruthy();
  });

  it('exports expected types', () => {
    // Type-level check — if this compiles, types are exported correctly
    const _slotprops: SlotProps | undefined = undefined; void _slotprops;
    expect(true).toBe(true);
  });
});
