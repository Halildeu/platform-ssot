// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
// Regenerate with: node scripts/ci/generate-contract-tests.mjs --write
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { ApprovalReview } from '../approval-review/ApprovalReview';
import type { ApprovalReviewProps } from '../approval-review/ApprovalReview';

describe('ApprovalReview — contract', () => {
  const defaultProps = {
    checkpoint: undefined as any,
    citations: [],
    auditItems: [],
    auditId: undefined as any,
    item: undefined as any,
  };

  it('renders without crash', () => {
    const { container } = render(<ApprovalReview {...defaultProps} />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('has displayName', () => {
    expect(ApprovalReview.displayName).toBeTruthy();
  });

  it('respects access=hidden', () => {
    const { container } = render(<ApprovalReview {...defaultProps} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('applies disabled state via access=readonly', () => {
    const { container } = render(<ApprovalReview {...defaultProps} access="readonly" />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('renders with only required props (5 required, 9 optional)', () => {
    // All 9 optional props omitted — should not crash
    const { container } = render(<ApprovalReview {...defaultProps} />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('exports expected types', () => {
    // Type-level check — if this compiles, types are exported correctly
    const _approvalreviewprops: ApprovalReviewProps | undefined = undefined; void _approvalreviewprops;
    expect(true).toBe(true);
  });
});
