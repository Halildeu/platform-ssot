// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { DataProvenanceBadge } from '../DataProvenanceBadge';

describe('DataProvenanceBadge', () => {
  it('renders without crashing', () => {
    render(<DataProvenanceBadge level="live" />);
    expect(document.body).toBeTruthy();
  });

  it.each(['live', 'ci', 'derived', 'simulated'] as const)('renders %s level', (level) => {
    const { container } = render(<DataProvenanceBadge level={level} />);
    expect(container.querySelector('span')).toBeTruthy();
  });

  it('applies custom className', () => {
    const { container } = render(<DataProvenanceBadge level="ci" className="custom-class" />);
    expect(container.querySelector('.custom-class')).toBeTruthy();
  });
});
