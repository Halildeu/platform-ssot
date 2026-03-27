// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
// Regenerate with: node scripts/ci/generate-contract-tests.mjs --write
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Watermark } from '../watermark/Watermark';
import type { WatermarkProps } from '../watermark/Watermark';

describe('Watermark — contract', () => {
  
  it('renders without crash', () => {
    const { container } = render(<Watermark  />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('has displayName', () => {
    expect(Watermark.displayName).toBeTruthy();
  });

  it('renders with only required props (0 required, 11 optional)', () => {
    // All 11 optional props omitted — should not crash
    const { container } = render(<Watermark  />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('exports expected types', () => {
    // Type-level check — if this compiles, types are exported correctly
    const _watermarkprops: WatermarkProps | undefined = undefined; void _watermarkprops;
    expect(true).toBe(true);
  });
});
