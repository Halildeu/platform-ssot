// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
// Regenerate with: node scripts/ci/generate-contract-tests.mjs --write
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { ThemePreviewCard } from '../theme-preview-card/ThemePreviewCard';
import type { ThemePreviewCardProps } from '../theme-preview-card/ThemePreviewCard';

describe('ThemePreviewCard — contract', () => {
  
  it('renders without crash', () => {
    const { container } = render(<ThemePreviewCard  />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('has displayName', () => {
    expect(ThemePreviewCard.displayName).toBeTruthy();
  });

  it('renders with only required props (0 required, 7 optional)', () => {
    // All 7 optional props omitted — should not crash
    const { container } = render(<ThemePreviewCard  />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('exports expected types', () => {
    // Type-level check — if this compiles, types are exported correctly
    const _themepreviewcardprops: ThemePreviewCardProps | undefined = undefined; void _themepreviewcardprops;
    expect(true).toBe(true);
  });
});
