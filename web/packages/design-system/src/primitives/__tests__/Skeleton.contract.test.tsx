// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
// Regenerate with: node scripts/ci/generate-contract-tests.mjs --write
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Skeleton } from '../skeleton/Skeleton';
import type { SkeletonProps } from '../skeleton/Skeleton';

describe('Skeleton — contract', () => {
  
  it('renders without crash', () => {
    const { container } = render(<Skeleton  />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('has displayName', () => {
    expect(Skeleton.displayName).toBeTruthy();
  });

  it('renders with only required props (0 required, 5 optional)', () => {
    // All 5 optional props omitted — should not crash
    const { container } = render(<Skeleton  />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('exports expected types', () => {
    // Type-level check — if this compiles, types are exported correctly
    const _skeletonprops: SkeletonProps | undefined = undefined; void _skeletonprops;
    expect(true).toBe(true);
  });
});
