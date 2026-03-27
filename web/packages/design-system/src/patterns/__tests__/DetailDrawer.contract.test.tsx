// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
// Regenerate with: node scripts/ci/generate-contract-tests.mjs --write
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { DetailDrawer } from '../detail-drawer/DetailDrawer';
import type { DetailDrawerSize, DetailDrawerSection, DetailDrawerProps } from '../detail-drawer/DetailDrawer';

describe('DetailDrawer — contract', () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    title: 'content',
  };

  it('renders without crash', () => {
    const { container } = render(<DetailDrawer {...defaultProps} />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('has displayName', () => {
    expect(DetailDrawer.displayName).toBeTruthy();
  });

  it('renders with only required props (3 required, 9 optional)', () => {
    // All 9 optional props omitted — should not crash
    const { container } = render(<DetailDrawer {...defaultProps} />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('exports expected types', () => {
    // Type-level check — if this compiles, types are exported correctly
    const _detaildrawersize: DetailDrawerSize | undefined = undefined; void _detaildrawersize;
    const _detaildrawersection: DetailDrawerSection | undefined = undefined; void _detaildrawersection;
    const _detaildrawerprops: DetailDrawerProps | undefined = undefined; void _detaildrawerprops;
    expect(true).toBe(true);
  });
});
