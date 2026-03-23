// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
// Regenerate with: node scripts/ci/generate-contract-tests.mjs --write
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { FilterBar } from '../filter-bar/FilterBar';
import type { FilterBarProps } from '../filter-bar/FilterBar';

describe('FilterBar — contract', () => {
  
  it('renders without crash', () => {
    const { container } = render(<FilterBar  />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('has displayName', () => {
    expect(FilterBar.displayName).toBeTruthy();
  });

  it('renders with only required props (1 required, 7 optional)', () => {
    // All 7 optional props omitted — should not crash
    const { container } = render(<FilterBar  />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('exports expected types', () => {
    // Type-level check — if this compiles, types are exported correctly
    const _filterbarprops: FilterBarProps | undefined = undefined; void _filterbarprops;
    expect(true).toBe(true);
  });
});
