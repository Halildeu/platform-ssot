// @vitest-environment jsdom
// Auto-generated contract test
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { LazyComponent } from '../LazyComponent';

describe('LazyComponent — contract', () => {
  it('renders without crash', () => {
    const { container } = render(<LazyComponent><div>child</div></LazyComponent>);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('exports a named component', () => {
    expect(typeof LazyComponent).toBe('function');
  });

  it('renders children', () => {
    const { container } = render(<LazyComponent><span data-testid="inner">inner</span></LazyComponent>);
    expect(container.querySelector('[data-testid="inner"]')).toBeTruthy();
  });
});
