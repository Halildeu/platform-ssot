// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
// Regenerate with: node scripts/ci/generate-contract-tests.mjs --write
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { FormDrawer } from '../form-drawer/FormDrawer';
import type { FormDrawerSize, FormDrawerPlacement, FormDrawerProps } from '../form-drawer/FormDrawer';

describe('FormDrawer — contract', () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    title: 'content',
  };

  it('renders without crash', () => {
    const { container } = render(<FormDrawer {...defaultProps} />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('has displayName', () => {
    expect(FormDrawer.displayName).toBeTruthy();
  });

  it('renders with only required props (4 required, 8 optional)', () => {
    // All 8 optional props omitted — should not crash
    const { container } = render(<FormDrawer {...defaultProps} />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('exports expected types', () => {
    // Type-level check — if this compiles, types are exported correctly
    const _formdrawersize: FormDrawerSize | undefined = undefined; void _formdrawersize;
    const _formdrawerplacement: FormDrawerPlacement | undefined = undefined; void _formdrawerplacement;
    const _formdrawerprops: FormDrawerProps | undefined = undefined; void _formdrawerprops;
    expect(true).toBe(true);
  });
});
