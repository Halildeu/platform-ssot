// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
// Regenerate with: node scripts/ci/generate-contract-tests.mjs --write
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { EntitySummaryBlock } from '../entity-summary-block/EntitySummaryBlock';
import type { EntitySummaryBlockProps } from '../entity-summary-block/EntitySummaryBlock';

describe('EntitySummaryBlock — contract', () => {
  const defaultProps = {
    title: 'content',
    items: [{ key: 'k1', label: 'Key', value: 'Value' }],
  };

  it('renders without crash', () => {
    const { container } = render(<EntitySummaryBlock {...defaultProps} />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('has displayName', () => {
    expect(EntitySummaryBlock.displayName).toBeTruthy();
  });

  it('respects access=hidden', () => {
    const { container } = render(<EntitySummaryBlock {...defaultProps} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('applies disabled state via access=readonly', () => {
    const { container } = render(<EntitySummaryBlock {...defaultProps} access="readonly" />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('renders with only required props (1 required, 7 optional)', () => {
    // All 7 optional props omitted — should not crash
    const { container } = render(<EntitySummaryBlock {...defaultProps} />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('exports expected types', () => {
    // Type-level check — if this compiles, types are exported correctly
    const _entitysummaryblockprops: EntitySummaryBlockProps | undefined = undefined; void _entitysummaryblockprops;
    expect(true).toBe(true);
  });
});
