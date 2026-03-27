// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
// Regenerate with: node scripts/ci/generate-contract-tests.mjs --write
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { DetailSectionTabs } from '../detail-section-tabs/DetailSectionTabs';
import type { DetailSectionTabItem, DetailSectionTabsProps } from '../detail-section-tabs/DetailSectionTabs';

describe('DetailSectionTabs — contract', () => {
  const defaultProps = {
    tabs: [{ id: 'tab-1', label: 'Tab 1' }] as DetailSectionTabItem[],
    activeTabId: 'tab-1',
    onTabChange: vi.fn(),
  };

  it('renders without crash', () => {
    const { container } = render(<DetailSectionTabs {...defaultProps} />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('has displayName', () => {
    expect(DetailSectionTabs.displayName).toBeTruthy();
  });

  it('exports expected types', () => {
    // Type-level check — if this compiles, types are exported correctly
    const _detailsectiontabitem: DetailSectionTabItem | undefined = undefined; void _detailsectiontabitem;
    const _detailsectiontabsprops: DetailSectionTabsProps | undefined = undefined; void _detailsectiontabsprops;
    expect(true).toBe(true);
  });
});
