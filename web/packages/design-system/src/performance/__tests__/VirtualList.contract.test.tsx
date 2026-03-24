// @vitest-environment jsdom
// Auto-generated contract test
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { VirtualList } from '../VirtualList';

describe('VirtualList — contract', () => {
  it('renders without crash', () => {
    const { container } = render(<VirtualList><div>child</div></VirtualList>);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('exports a named component', () => {
    expect(typeof VirtualList).toBe('function');
  });

  it('renders children', () => {
    const { container } = render(<VirtualList><span data-testid="inner">inner</span></VirtualList>);
    expect(container.querySelector('[data-testid="inner"]')).toBeTruthy();
  });
});
