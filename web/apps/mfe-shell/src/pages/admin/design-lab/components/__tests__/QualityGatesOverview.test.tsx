import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { QualityGatesOverview } from '../QualityGatesOverview';

describe('QualityGatesOverview', () => {
  it('renders without crashing', () => {
    render(<QualityGatesOverview items={[{ qualityGates: ['design_tokens', 'test_coverage'] }]} />);
    expect(document.body).toBeTruthy();
  });

  it('renders with empty items', () => {
    render(<QualityGatesOverview items={[]} />);
    expect(document.body).toBeTruthy();
  });
});
