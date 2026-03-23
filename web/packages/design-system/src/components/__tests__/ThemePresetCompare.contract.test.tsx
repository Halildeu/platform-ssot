// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
// Regenerate with: node scripts/ci/generate-contract-tests.mjs --write
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { ThemePresetCompare } from '../theme-preset/ThemePresetCompare';
import type { ThemePresetCompareProps } from '../theme-preset/ThemePresetCompare';

describe('ThemePresetCompare — contract', () => {
  
  it('renders without crash', () => {
    const { container } = render(<ThemePresetCompare  />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('has displayName', () => {
    expect(ThemePresetCompare.displayName).toBeTruthy();
  });

  it('respects access=hidden', () => {
    const { container } = render(<ThemePresetCompare  access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('applies disabled state via access=readonly', () => {
    const { container } = render(<ThemePresetCompare  access="readonly" />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('renders with only required props (0 required, 6 optional)', () => {
    // All 6 optional props omitted — should not crash
    const { container } = render(<ThemePresetCompare  />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('exports expected types', () => {
    // Type-level check — if this compiles, types are exported correctly
    const _themepresetcompareprops: ThemePresetCompareProps | undefined = undefined; void _themepresetcompareprops;
    expect(true).toBe(true);
  });
});
