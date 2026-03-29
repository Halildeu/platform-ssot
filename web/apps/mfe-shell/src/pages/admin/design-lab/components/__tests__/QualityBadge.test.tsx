// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QualityBadge, getQualityTier, countByTier } from '../QualityBadge';

describe('QualityBadge', () => {
  it('renders without crashing', () => {
    render(<QualityBadge score={85} />);
    expect(document.body).toBeTruthy();
  });

  it('displays score percentage', () => {
    const { container } = render(<QualityBadge score={92} />);
    expect(container.textContent).toContain('92');
  });

  it('renders different sizes', () => {
    const { container } = render(<QualityBadge score={50} size="sm" />);
    expect(container.querySelector('span')).toBeTruthy();
  });

  it('renders compact mode', () => {
    const { container } = render(<QualityBadge score={95} compact />);
    expect(container.querySelector('span')).toBeTruthy();
  });
});

describe('getQualityTier', () => {
  it('returns platinum for >= 95', () => expect(getQualityTier(95)).toBe('platinum'));
  it('returns gold for >= 85', () => expect(getQualityTier(85)).toBe('gold'));
  it('returns silver for >= 70', () => expect(getQualityTier(70)).toBe('silver'));
  it('returns bronze for < 70', () => expect(getQualityTier(50)).toBe('bronze'));
});
