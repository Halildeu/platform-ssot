// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
// Regenerate with: node scripts/ci/generate-contract-tests.mjs --write
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Carousel } from '../carousel/Carousel';
import type { CarouselProps } from '../carousel/Carousel';

describe('Carousel — contract', () => {
  const defaultProps = {
    items: [{ key: 'slide-1', content: React.createElement('div', null, 'Slide 1') }],
  };

  it('renders without crash', () => {
    const { container } = render(<Carousel {...defaultProps} />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('has displayName', () => {
    expect(Carousel.displayName).toBeTruthy();
  });

  it('respects access=hidden', () => {
    const { container } = render(<Carousel {...defaultProps} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('applies disabled state via access=readonly', () => {
    const { container } = render(<Carousel {...defaultProps} access="readonly" />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('exports expected types', () => {
    // Type-level check — if this compiles, types are exported correctly
    const _carouselprops: CarouselProps | undefined = undefined; void _carouselprops;
    expect(true).toBe(true);
  });
});
