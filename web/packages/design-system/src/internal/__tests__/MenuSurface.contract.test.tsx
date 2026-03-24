// @vitest-environment jsdom
// Auto-generated contract test
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { MenuSurface } from '../MenuSurface';

describe('MenuSurface — contract', () => {
  it('renders without crash', () => {
    const { container } = render(<MenuSurface><div>child</div></MenuSurface>);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('exports a named component', () => {
    expect(typeof MenuSurface).toBe('function');
  });

  it('renders children', () => {
    const { container } = render(<MenuSurface><span data-testid="inner">inner</span></MenuSurface>);
    expect(container.querySelector('[data-testid="inner"]')).toBeTruthy();
  });
});
